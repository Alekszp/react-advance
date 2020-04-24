const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {randomBytes} = require('crypto')
const {promisify} = require('util')
const {transport, makeANiceEmail} = require('../mail')
const {hasPermission} = require('../utils')

const Mutations = {

    async createItem(parent, args, ctx, info){
      if(!ctx.request.userId){
        throw new Error('You must be logged in to do that')
      }
      const item = await ctx.db.mutation.createItem({
        data: {
          // this is how to create relationship between Item and User
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          ...args
          }
      }, info)
      return item
    },
    async updateItem(parent, args, ctx, info){
        //copy of updates
        const updates = {...args}
        //delete id from the updates
        delete updates.id
        //run the update method
        const upds = await ctx.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
        return upds
    },
    async deleteItem(parent, args, ctx, info){
      throw new Error('You aren\'t allowed!!')
      const where = {id: args.id}
    //   find the item
      const item = await ctx.db.query.item({where}, `{id title user { id }}`)

    //  check if that own that item, or have the permission
      const isOwnItem = item.user.id === ctx.request.userId
      const hasPermission = ctx.request.user.permissions.some((permission)=> ['ADMIN', 'ITEMDELETE'].includes(permission))
      if(isOwnItem || hasPermission) {
        return ctx.db.mutation.deleteItem({where}, info)
      } else {throw new Error('You don\'t have the permissions to do that!')}
    
    },
    async signUp(parent, args, ctx, info){
       args.email = args.email.toLowerCase()
       //hash password
       const password = await bcrypt.hash(args.password, 10) //10 - is the salt for unique hash
       
       const user = await ctx.db.mutation.createUser(
        {
          data: {
            ...args,
            password,
            permissions: { set: ["USER"] }
          },
        },
        info
      );
      
        //create jwt token
        const token = jwt.sign({userId: user.id}, process.env.APP_SECRET)
        //set jwt as a cookie on the response
        ctx.response.cookie('token', token, {httpOnly: true, maxAge: 1000*60*60*24*10 }) //10 days

        return user

    },
    async signIn(parent, {email, password }, ctx, info){
      // check if there is a user with that email

      const user = await ctx.db.query.user({where: {email: email}}, `{id email name password permissions}`)
      if(!user) {
        throw new Error(`No such user found for email ${email}`)
      }
      // check if their password is correct 
      const valid = await bcrypt.compare(password, user.password)
      
      if(!valid) {
        throw new Error('Invalid password')
      }
      // generate the jwt token
      const token = jwt.sign({userId: user.id}, process.env.APP_SECRET)
      // set the cookie with the token
      ctx.response.cookie('token', token, {httpOnly: true, maxAge: 1000*60*60*24*10}) //10 days
      //return the user

      return user
    },
    signOut(parent, args, ctx, info){
      ctx.response.clearCookie('token')
      return {message: 'Good buy!'}
    },
    async requestReset(parent, {email}, ctx, info){

      const user = await ctx.db.query.user({where: {email: email}})
      if(!user) {
        throw new Error(`No such user found for email ${email}`)
      }
      const resetToken = (await promisify(randomBytes)(20)).toString('hex')
      const resetTokenExpiry = Date.now() + 3600 * 1000 // 1 hour from now
      const res = await ctx.db.mutation.updateUser({where: {email: email}, data: {
        resetToken: resetToken, 
        resetTokenExpiry: resetTokenExpiry
      }})
      const mailResponse = await transport.sendMail({
        from: "nvworkalex@gmail.com",
        to: "ownlocalstorage@gmamil.com",
        subject: "Your password reset token",
        html: makeANiceEmail(`Your password reset token is here!
        \n\n
         <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to reset</a>`)
      })
      return {message: 'Thanks!'}
    }, 
    async resetPassword(parent, {resetToken, password, confirmPassword}, ctx, info){
      // 1. check if the passwords match
      if(password !== confirmPassword){
        throw new Error("Your passwords don't match!")
      }
      // 2. check if its a legit reset token
      // 3. check if its expired
      const [user] = await ctx.db.query.users({
        where: {
          resetToken: resetToken,
          resetTokenExpiry_gte: Date.now() - 3600000
        }
      })

      console.log(user)
      if(!user){
        throw new Error('This token is either invalid or expired!')
      }
      // 4. hash their new password
      const newPassword = await bcrypt.hash(password, 10)
      // 5. save the new password to the user and remove old resetToken fields
      const updatedUser = ctx.db.mutation.updateUser({
        where: {
          email: user.email
        },
        data: {
          password: newPassword,
          resetToken: null,
          resetTokenExpiry: null
        }
      })
      // 6. generate JWT
      const token = jwt.sign({userId: updatedUser.id}, process.env.APP_SECRET)
      // 7. set JWT cookie
      ctx.response.cookie('token', token, {httpOnly: true, maxAge: 1000*60*60*24*10}) // 10 days
      // 8. return new user
      return updatedUser

    },
    async updatePermissions(parent, args, ctx, info){
      // 1. check if user logged in
      if(!ctx.request.userId){
        throw new Error('You must be logged in')
      }
      const user = await ctx.db.query.user({where: {id: ctx.request.userId}}, info)
      hasPermission(user, ['ADMIN', 'PERMISSIONUPDATE'])

      const upds = await ctx.db.mutation.updateUser({
        data: {
          permissions: {
            set: args.permissions
          }
        },
        where: {
          id: args.userId
        }
      }, info)

      return upds

    },
    async addToCart(parent, args, ctx, info){
      // 1. Make sure they are signed in
      const { userId } = ctx.request
      // 2. Query the users current cart
      console.log('userId+++', userId)
      console.log('args.id+++', args.id)
      const [existingCartItem] = await ctx.db.query.cartItems({
        where: {
          user: { id: userId },
          item: { id: args.id },
        },
      });

      console.log(existingCartItem)
      return
      // 3. Check if that item is already in their cart abd increment by 1 if it is
      if(existingCartItem) {
        console.log('This item is already in their cart')
        return ctx.db.mutation.updateCartItem({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1}
        }, info)
      }
      // 4. If it's not, create a fresh cartItem for that user
      return ctx.db.mutation.createCartItem({
        data: {
          user: {
            connect: {id: userId}
          },
          item: {
            connect: {
              connect: { id: args.id }
            }
          }
        }
      }, info)

    }

};

module.exports = Mutations;

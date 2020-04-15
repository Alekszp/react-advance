const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Mutations = {

    async createItem(parent, args, ctx, info){
        const item = await ctx.db.mutation.createItem({
            data: {
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
      const where = {id: args.id}
    //   find the item
      const item = await ctx.db.query.item({where}, `{id title}`)

    //  check if that own that item, or have the permission
    // TODO

    // delete
    return ctx.db.mutation.deleteItem({where}, info)
    },
    async signUp(parent, args, ctx, info){
       args.email = args.email.toLowerCase()
       //hash password
       const password = await bcrypt.hash(args.password, 10) //10 - is the salt for unique hash
       console.log('args', args)
       console.log('password', password)
       const user = await ctx.db.mutation.createUser(
        {
          data: {
            ...args,
            password,
            permissions: { set: ['USER'] }
          },
        },
        info
      );
      
        //create jwt token
        const token = jwt.sign({userId: user.id}, process.env.APP_SECRET)
        //set jwt as a cookie on the response
        ctx.response.cookie('token', token, {httpOnly: true, maxAge: 1000*60*60*24*10 }) //10 days

        console.log('create-user', user)
        return user

    },
    async signIn(parent, {email, password }, ctx, info){
      // check if there is a user with that email
     
      const user = await ctx.db.query.user({where: {email: email}})
      console.log('user', user)
      if(!user) {
        throw new Error(`No such user found for email ${email}`)
      }
      // check if their password is correct
      const valid = await bcrypt.compare(password, user.password)
      if(!valid) {
        throw new Error('Invalid password')
      }
      // generate the jwt token
      const token = jwt.sign({user: user.id}, process.env.APP_SECRET)
      // set the cookie with the token
      ctx.response.cookie('token', token, {httpOnly: true, maxAge: 1000*60*60*24*10}) //10 days
      //return the user

      return user
    }

};

module.exports = Mutations;

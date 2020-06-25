const {forwardTo} = require('prisma-binding')
const {hasPermission} = require('../utils')


const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    me(parent, args, ctx, info){
        if(!ctx.request.userId){
            return null
        }
        return ctx.db.query.user({ where: { id: ctx.request.userId }}, info)
    },
    async users(parent, args, ctx, info){
        // 1. check if user logged in
        if(!ctx.request.userId){
            throw new Error('You must be logged in')
        }

        // 2. check if user get a permissions to query all the users
        hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'] )
        // 3. if he does, query all the users
        return ctx.db.query.users({}, `{id email name password permissions}`)
    },
    async order(parent, {id}, ctx, info){
        // 1. make sure they are logged in
        const {userId} = ctx.request
        if(!userId) throw new Error('You should be logged in')
        // 2. Query the current order
        const order = await ctx.db.query.order({
            where: {id: id}
        }, `{id total charge createdAt items {id title image description quantity price} user {id name email}}`)
        console.log('order++++', order)

        // 3. check if the have permission to see this order

        console.log('user++++', ctx.request.user)
        if(order.user.id !== userId || !ctx.request.user.permissions.includes('ADMIN')) throw new Error('You have not permissions to get this order' )

        // 4. return order

        return order
    },
    async orders(parent, args, ctx, info){
        const {userId} = ctx.request
        if(!userId || !ctx.request.user.permissions.includes('ADMIN')) throw new Error('You have not permissions to see this info')
        const orders = await ctx.db.query.orders({where: {user: {id: userId}}}, `{ id total createdAt items { id title price quantity description image} }`)
        console.log(orders)
        return orders
    }
    
};

module.exports = Query;

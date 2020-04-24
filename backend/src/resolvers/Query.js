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
    }
    
};

module.exports = Query;

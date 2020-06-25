import React, {Component} from 'react'
import StripeCheckout from 'react-stripe-checkout'
import {Mutation} from 'react-apollo'
import Router from 'next/router'
import NProgress from 'nprogress'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import calcTotalPrice from '../lib/calcTotalPrice'
import Error from './ErrorMessage'
import User, {CURRENT_USER_QUERY} from './User'

function totalItems(cart){
    return cart.reduce((tally, cartItem)=>{
        return tally + cartItem.quantity
    }, 0)
}

const CREATE_ORDER_MUTATION = gql`
    mutation CREATE_ORDER_MUTATION($token: String!){
        createOrder(token: $token){
            id
            charge
            total
            items {
                id
                title
            }
        }
    }
`

class TakeMyMoney extends Component {
    onToken = async (res, createOrder) => {
        console.log(res)
        NProgress.start();
        await createOrder({
            variables: {token: res.id}
        }).then((response)=>{
            Router.push({
                pathname: '/order',
                query: {id: response.data.createOrder.id}
            })
        })
        .catch((e)=>{
            console.error(e.message)
        })
    }
    render(){
        return (
            <User>
                {({data: {me}})=>(
                    <Mutation mutation={CREATE_ORDER_MUTATION} refetchQueries={[{query: CURRENT_USER_QUERY}]}>
                        {(createOrder)=>(
                            <StripeCheckout 
                            amount={calcTotalPrice(me.cart)}
                            name='test-market'
                            description={`Order of ${totalItems(me.cart)} item${totalItems(me.cart) === 1 ? '' : 's'}`}
                            image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
                            stripeKey="pk_test_1quIsAO4GxewaTPIO07w1qoj00qQDrr8SU"
                            currency='USD'
                            email={me.email}
                            token={ res => this.onToken(res, createOrder)}
                        >{this.props.children}</StripeCheckout>
                        )}
                        
                    </Mutation>
                )}
            </User>
        )
    }
}

export default TakeMyMoney
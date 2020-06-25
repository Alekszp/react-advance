import React, { Component } from 'react';
import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import { formatDistance } from 'date-fns'
import Link from 'next/link'
import styled from 'styled-components'
import formatMoney from '../lib/formatMoney'
import OrderItemStyles from './styles/OrderItemStyles'
import Error from './ErrorMessage'

const ORDER_LIST_QUERY = gql`

    query ORDER_LIST_QUERY {
        orders(orderBy: createdAt_DESC) {
            id
            total
            createdAt
            items {
                id
                title
                price
                description
                quantity
                image
            }
    }   }
`
const OrderUI = styled.ul`
    display: grid;
    grid-gap: 4rem;
    grid-template-columns: repeat()(auto-fit, min-max-content(40%, 1fr));
`

class OrderList extends Component {
    render() {
        return (
            <Query query={ORDER_LIST_QUERY}>
                {({data: {orders}, error, loading})=>{
                    if(loading) return <p>Loading...</p>
                    if(error) return <Error error={error} />
                    return (
                        <div>
                            <h2>You have {orders.length} orders</h2>
                            <OrderUI>
                                {orders.map((order)=>{
                                    return (
                                        <OrderItemStyles key={order.id}>
                                            <Link href={{pathname: '/order', query: {id: order.id}}}>
                                                <a>
                                                    <div className='order-meta'>
                                                        <p>
                                                            {order.items.reduce((tally, orderItem)=>{
                                                                return tally + orderItem.quantity
                                                            }, 0)} Items
                                                        </p>
                                                        <p>{order.items.length} Products</p>
                                                        <p>{formatDistance(order.createdAt, new Date())}</p>
                                                        <p>{formatMoney(order.total)} Products</p>
                                                    </div>
                                                    <div className='images'>
                                                            {order.items.map((item)=>{
                                                                return (
                                                                    <img src={item.image} key={item.id}/>
                                                                )
                                                            })}
                                                    </div>
                                                </a>
                                            </Link>
                                        </OrderItemStyles>
                                    )
                                })}
                            </OrderUI>
                        </div>
                        
                    )
                }}
            </Query>
        );
    }
}

export default OrderList;
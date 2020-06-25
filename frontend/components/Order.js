import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import {format} from 'date-fns'
import Head from 'next/head'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'
import OrderStyles from './styles/OrderStyles'

const ORDER_QUERY = gql`
    query ORDER_QUERY($id: String!){
        order(id: $id){
            id
            charge
            total
            createdAt
            user {
                id
            }
            items {
                id
                title
                description
                price
                image
                quantity
            }
        }
    }
`

class Order extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired
    }
    render() {
        const {id} = this.props
        return (
            <Query query={ORDER_QUERY} variables={{id: id}}>
                {({data, error, loading})=>{
                    if(error) return <Error error={error} />
                    if(loading) return <p>Loading...</p>
                    const {order} = data
                    console.log(order)
                   return (
                        <OrderStyles>
                            <Head>
                                <title>Order number: {id}</title>
                            </Head>  
                            <p>
                                <span>Order ID:</span>
                                <span>{id}</span>
                            </p>
                            <p>
                                <span>Charge:</span>
                                <span>{order.charge}</span>
                            </p>
                            <p>
                                <span>Date:</span>
                                <span>{format(order.createdAt, 'd MMMM, YYYY HH:mm')} at {format(order.createdAt, 'HH:mm')}</span>
                            </p>
                            <p>
                                <span>Order total:</span>
                                <span>{formatMoney(order.total)}</span>
                            </p>
                            <p>
                                <span>Item count:</span>
                                <span>{order.items.length}</span>
                            </p>
                            <div className='items'>
                                {order.items.map((item)=>(
                                    <div className='order-item' key={item.id}>
                                        <img src={item.image} alt={item.title}/>
                                        <div className='item-details'>
                                            <h2>{item.title}</h2>
                                            <p>Qty: {item.quantity}</p>
                                            <p>Each: {formatMoney(item.price)}</p>
                                            <p>Subtotal: {formatMoney(item.price * item.quantity)}</p>
                                            <p>{item.description}</p>
                                        </div>
                                        
                                    </div>
                                ))}
                               
                            </div>
                        </OrderStyles>
                    )
                }}
                
            </Query>
        );
    }
}

export default Order;
import React, { Component } from 'react';
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Error from './ErrorMessage'
import {CURRENT_USER_QUERY} from './User'

const BigButton = styled.button`
    font-size: 3rem;
    background: none;
    border: 0;
    &:hover {
        color: ${props=>props.theme.red};
        cursor: pointer;
    }
`

const REMOVE_CART_ITEM_MUTATION = gql`
    mutation REMOVE_CART_ITEM_MUTATION($id: ID!){
        removeFromCart(id: $id){
            id
        }
    }
`

class RemoveFromCart extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired
    }
    update = (cache, payload) =>{
        console.log('running update')
        const data = cache.readQuery({query: CURRENT_USER_QUERY})
        const cartItemId = payload.data.removeFromCart.id
        data.me.cart = data.me.cart.filter((i)=>{
            return i.id !== cartItemId
        })
        cache.writeQuery({query: CURRENT_USER_QUERY, data: data})


    }
    render() {
        const {id} = this.props
        return (
            <Mutation mutation={REMOVE_CART_ITEM_MUTATION} variables={{id: id}} update={this.update} optimisticResponse={{
                __typename: 'Mutation',
                removeFromCart: {
                    __typename: 'CartItem',
                    id: id
                }
            }}>
                {(removeFromCart, {error, loading})=>(
                    <BigButton title='Delete button' disabled={loading} onClick={()=>{
                        removeFromCart().catch((e=>alert(e.message)))}}>&times;</BigButton>
                )}
            </Mutation>
            
        );
    }
}

export default RemoveFromCart;
import React, { Component } from 'react';
import {Mutation, Query} from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'
import Router from 'next/router'

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!){
        item(where: {id: $id}){
            id
            title
            description
            price
        }
    }
`
const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id: ID!
        $title: String,
        $description: String,
        $price: Int,
        
    ){
        updateItem(
            id: $id,
            title: $title,
            description: $description,
            price: $price){
            id
            title
            description
            price
        }
    }
`  

class UpdateItem extends Component {
    state = {}
    handleChange = (e)=>{
        const {name, type, value} = e.target
        const val = type === 'number' ? parseInt(value) : value
        this.setState({[name]: val})
    }
    updateItem = async (e, updateItemMutation)=> {
        e.preventDefault()
        const res = await updateItemMutation({
            variables: {
                id: this.props.id,
                ...this.state
            }
        });
    }

   
    render() {
        return (
            <Query query={SINGLE_ITEM_QUERY} variables={{id: this.props.id}}>
                {({data, loading})=>{
                    if(loading){return <p>Loading...</p>}
                    if(!data.item){return <p>Not item found for id</p>}
                    return (
                    <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
                        {(updateItem, {loading, error})=>(
                        <Form onSubmit={async e=>{this.updateItem(e, updateItem)}}>
                            <h2>Sell an item</h2>
                            <fieldset disabled={loading} aria-busy={loading}>
                                <label htmlFor="title">
                                    Title
                                    <input type="text" id="title" name="title" placeholder="title" defaultValue={data.item.title} onChange={this.handleChange} required />
                                </label>
                                <label htmlFor="title">
                                    Description
                                    <textarea type="text" id="description" name="description" placeholder="description" defaultValue={data.item.description} onChange={this.handleChange} required />
                                </label>
                                <label htmlFor="title">
                                    Price
                                    <input type="number" id="price" name="price" placeholder="title" defaultValue={data.item.price} onChange={this.handleChange} required />
                                </label>
                                <button type="submit">Save changes</button>
                                <Error error={error} />
                            </fieldset>
                        </Form>
                        )}
                    </Mutation>
                )}}
            </Query>
        );
    }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION }
import React, { Component } from 'react';
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'
import Router from 'next/router'

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!,
        $description: String!,
        $price: Int!,
        $image: String,
        $largeImage: String
    ){
        createItem(
            title: $title,
            description: $description,
            price: $price,
            image: $image,
            largeImage: $largeImage){
            id
        }
    }
`  

class CreateItem extends Component {
    state = {
        title: '',
        description: '',
        image: '',
        largeImage: '',
        price: 0,
    }
    handleChange = (e)=>{
        const {name, type, value} = e.target
        const val = type === 'number' ? parseInt(value) : value
        this.setState({[name]: val})
    }

    uploadFile = async e=> {
        const files = e.target.files
        const data = new FormData()
        data.append('file', files[0])
        data.append('upload_preset', 'sickfits')
        console.log(data)
        const res = await fetch('https://api.cloudinary.com/v1_1/do1nblggm/image/upload', {
            method: 'POST',
            body: data
        })

        const file = await res.json()
        console.log(file)
        this.setState({
            image: file.secure_url,
            largeImage: file.eager[0].secure_url
        })
    }

    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                {(createItem, {loading, error})=>(
                <Form data-test="form"
                    onSubmit={async e=>{
                    e.preventDefault()
                    const res = await createItem();
                   
                    Router.push({
                        pathname: '/shop',
                        query: {id: res.data.createItem.id}
                    })
                    }}>
                    <h2>Sell an item</h2>
                    <fieldset disabled={loading} aria-busy={loading}>
                        <label htmlFor="file">
                            Image
                            <input type="file" id="file" name="file" placeholder="Upload an image" onChange={this.uploadFile} required />
                            {this.state.image && <img width='200' src={this.state.image} alt='Upload preview...'/>}
                        </label>
                        <label htmlFor="title">
                            Title
                            <input type="text" id="title" name="title" placeholder="title" value={this.state.title} onChange={this.handleChange} required />
                        </label>
                        <label htmlFor="title">
                            Description
                            <textarea type="text" id="description" name="description" placeholder="description" value={this.state.description} onChange={this.handleChange} required />
                        </label>
                        <label htmlFor="title">
                            Price
                            <input type="number" id="price" name="price" placeholder="title" value={this.state.price} onChange={this.handleChange} required />
                        </label>
                        <button type="submit">Submit</button>
                        <Error error={error} />
                    </fieldset>
                </Form>
                )}
            </Mutation>
        );
    }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION }
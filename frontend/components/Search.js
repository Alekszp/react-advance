import React, { Component } from 'react';
import Downshift, {resetIdCounter} from 'downshift'
import Router from 'next/router'
import {ApolloConsumer} from 'react-apollo' 
import gql from 'graphql-tag'
import debounce from 'lodash.debounce'
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown'

const SEARCH_ITEMS_QUERY = gql`
    query SEARCH_ITEMS_QUERY($searchText: String!){
        items(where: { OR: [{ title_contains: $searchText, description_contains: $searchText}] }) {
            id
            image
            title
        }
    }
`
function routeToItem(i) {
    Router.push({
        pathname: '/item',
        query: {id: i.id} 
    })
}

class AutoComplete extends Component {
    state = {
        items: [],
        loading: false
    }
    onChange = debounce(async (e, client) => {
        this.setState({loading: true})
        await client.query({
            query: SEARCH_ITEMS_QUERY,
            variables: {searchText: e.target.value}
        })
        .then((response)=>{
            this.setState({items: response.data.items})
        })
        .finally(()=>{
            this.setState({loading: false})
        })
        
    }, 350)

    render() {
        resetIdCounter()
        return (
            <SearchStyles>
                <Downshift onChange={routeToItem} itemToString={item=>(item === null ? '' : item.title)}>
                    {({getInputProps, getItemProps, isOpen, inputValue, highlightedIndex})=>(
                        <div>
                            <ApolloConsumer>
                                {(client)=>(
                                    <input 
                                         
                                         {...getInputProps({
                                            type: 'search',
                                            placeholder: 'Search an item',
                                            id: 'search',
                                            className: this.state.loading ? 'loading' : '',
                                            onChange: (e)=>{
                                                e.persist()
                                                this.onChange(e, client)
                                            }
                                         })}
                                         />
                                )}
                                
                            </ApolloConsumer>
                            {isOpen && (
                                <DropDown>
                                    {this.state.items.map((i, index)=>(
                                        <DropDownItem {...getItemProps({item: i})} highlighted={index === highlightedIndex} key={i.id}>
                                            <img width='50' src={i.image} alt={i.title} />
                                            {i.title}
                                        </DropDownItem>
                                    ))}
                                    {!this.state.items.length && !this.state.loading && (
                                        <DropDownItem>Nothing found for `"{inputValue}"`</DropDownItem>
                                    )}
                                </DropDown>
                            )}
                            
                        </div>
                    )}
                </Downshift>
                
            </SearchStyles>
        );
    }
}

export default AutoComplete;
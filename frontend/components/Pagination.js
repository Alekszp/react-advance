import React from 'react'
import PaginationStyle from './styles/PaginationStyles'
import gql from 'graphql-tag'
import {Query} from 'react-apollo'
import Error from './ErrorMessage'
import { perPage } from "../config";
import Head from 'next/head'
import Link from 'next/link'

const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY{
        itemsConnection{
            aggregate {
                count
            }
        }
    }
`

const Pagination = props => (
            <Query query={PAGINATION_QUERY}>
                {({data, loading, error})=> {
                    if(error) return <Error error={error}/>
                    if(loading) return <p>Loading...</p>
                    const count = data.itemsConnection.aggregate.count
                    const pages = Math.ceil(count / perPage)
                    return (<PaginationStyle data-test="pagination">
                                <Head>
                                    <title>Sick Fits! - Page {props.page} of {pages}</title>
                                </Head>
                                <Link href={{pathname: 'shop', query: { page: props.page - 1}}}>
                                    <a className='prev' aria-disabled={props.page <= 1}>⬅ Prev</a>
                                </Link>
                                <p>Page {props.page} of <span className='totalPages'>{pages}</span> </p>
                                <p>{count} Items total </p>
                                <Link href={{pathname: 'shop', query: { page: props.page + 1}}}>
                                    <a className='next' aria-disabled={props.page >= pages}>Next ➡</a>
                                </Link>
                         </PaginationStyle>)
                }}
            </Query>
        
    
)
    

export default Pagination
export {PAGINATION_QUERY}
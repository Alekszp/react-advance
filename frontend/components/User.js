import {Query} from 'react-apollo'
import gql from "graphql-tag";
import PropTypes from 'prop-types'

const CURRENT_USER_QUERY = gql`
    query {
        me {
            id
            email
            name
            permissions
            orders {
                id
            }
            cart {
                id
                quantity
                item {
                    id
                    title
                    description
                    image
                    price
                }
            }
        }
    }
    
`

const User = props => (
    <Query {...props} query={CURRENT_USER_QUERY}>
        {payload => props.children(payload)}
    </Query>
)

User.propTypes = {
    children: PropTypes.func.isRequired
}

export default User
export {CURRENT_USER_QUERY} 
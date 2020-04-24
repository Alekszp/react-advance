import {Query, Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import Error from './ErrorMessage'
import Table from './styles/Table'
import SickButton from './styles/SickButton'
import PropTypes from 'prop-types'

const ALL_USERS_QUERY = gql`
    query ALL_USERS_QUERY {
        users {
            id
            name
            email
            permissions
        }
    }
`

const UPDATE_PERMISSIONS_MITATION = gql`
    mutation UPDATE_PERMISSIONS_MITATION($permissions: [Permission], $userId: ID!){
        updatePermissions(permissions: $permissions, userId: $userId){
            id
            name
            permissions
            email
        }
    }
`

const possiblePermission = ['ADMIN', 'USER', 'ITEMCREATE', 'ITEMUPDATE', 'ITEMDELETE', 'PERMISSIONUPDATE' ]

const Permissions = props => (
    <Query query={ALL_USERS_QUERY}>
        {({data, loading, error})=> (
            <div>
                <Error error={error} />
                <div>
                    <h2>Manage permissions</h2>
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                {possiblePermission.map(permission=> <th key={permission}>{permission}</th> )}
                                <th>👇</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.users.map(user=><UserPermissions user={user} key={user.id} />)}
                            
                        </tbody>
                    </Table>
                </div>

            </div>
        )}
    </Query>
)

class UserPermissions extends React.Component {
    static propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            id: PropTypes.string,
            permissions: PropTypes.array,
        }).isRequired
    }
    state = {
        permissions: this.props.user.permissions
    }
    handlePermissionChange = e => {
        
        let updatedPermissions = [...this.state.permissions]
        if(e.target.checked){
            updatedPermissions.push(e.target.value)
        } else {
            updatedPermissions = updatedPermissions.filter(permission => permission !== e.target.value)
        }

        this.setState({permissions: updatedPermissions})
    }
    render(){
        const user = this.props.user
        return (
            <Mutation mutation={UPDATE_PERMISSIONS_MITATION} variables={{permissions: this.state.permissions, userId: user.id}}>
                {(updatePermissions, {loading, error})=>(
                    <>
                        {error && <tr><td colspan='8'><Error error={error} /></td></tr>}
                        <tr>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            {possiblePermission.map(permission=> (
                                <td key={permission}>
                                    <label htmlFor={`${user.id}-permission-${permission}`}>
                                        <input id={`${user.id}-permission-${permission}`} type='checkbox' checked={this.state.permissions.includes(permission)} value={permission} onChange={this.handlePermissionChange}/>
                                    </label>
                                </td>
                            ))}
                            <td>
                            <SickButton disabled={loading} onClick={updatePermissions}>Updat{loading ? 'ing' : 'e'}</SickButton>
                            </td>
                        </tr>
                    </>
                )}
            </Mutation>
        )
    }
}

export default Permissions
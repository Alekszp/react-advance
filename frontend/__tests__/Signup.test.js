import {mount} from 'enzyme'
import wait from 'waait'
import Signup, {SIGNUP_MUTATION} from '../components/Signup'
import {CURRENT_USER_QUERY} from '../components/User'
import {MockedProvider} from 'react-apollo/test-utils'
import toJSON from 'enzyme-to-json'
import {fakeUser} from '../lib/testUtils'
import { ApolloConsumer } from 'react-apollo'

function type(wrapper, name, value){
    wrapper.find(`input[name="${name}"]`).simulate('change', {target: {name, value}})
}

const me = fakeUser()
// sign up mock mutation
const mocks = [
    {
        request: {
            query: SIGNUP_MUTATION,
            variables: {
                email: me.email,
                name: me.name,
                password: 'password123'
                
            }
        },
        result: {
            data: {
                signUp: {
                    __typename: 'User',
                    id: 'abc123',
                    email: me.email,
                    name: me.name
                }
            }
        }    
    },
    {
        request: {
            query: CURRENT_USER_QUERY
        },
        result: { data: { me } }
    }
]
// current user query mock


describe('<Signup />', ()=>{
    it('renders and matches snapshot', async()=>{
        const wrapper = mount(
            <MockedProvider><Signup/></MockedProvider>
        )
        expect(toJSON(wrapper.find('form'))).toMatchSnapshot()
    })
    it('calls the mutation properly', async ()=>{
        let apolloClient;
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <ApolloConsumer>
                    {
                        client=>{
                            apolloClient = client
                            return <Signup/>
                        }            
                    }
                </ApolloConsumer>
            </MockedProvider>
        )
        await wait()
        wrapper.update()
        type(wrapper, 'name', me.name )
        type(wrapper, 'email', me.email )
        type(wrapper, 'password', 'password123' )
        wrapper.update()
        wrapper.find('form').simulate('submit')
        await wait()
        // query the user out of the apollo client
        const user = await apolloClient.query({query: CURRENT_USER_QUERY})
        expect(user.data.me).toMatchObject(me)
    })
})
import {mount} from 'enzyme'
import wait from 'waait'
import RequestReset, {REQUEST_RESET_MUTATION} from '../components/RequestReset'
import {MockedProvider} from 'react-apollo/test-utils'
import toJSON from 'enzyme-to-json'

const mocks = [
    {
        request: {
            query: REQUEST_RESET_MUTATION,
            variables: {email: 'qwerty@mailkk.com'}
        },
        result: {
            data: {
                requestReset: { message: 'success', __typename: 'Message' }
            }
        }
    }
]

describe('<RequestReset/>', ()=>{
    it('renders and matches snapshot', async()=>{
        const wrapper = mount(<MockedProvider><RequestReset /></MockedProvider>)
        const form = wrapper.find('form[data-test="form"]')
        expect(toJSON(form)).toMatchSnapshot()
        //console.log(form.debug())
    })
    it('calls the mutation', async()=>{
        const wrapper = mount(<MockedProvider mocks={mocks}><RequestReset /></MockedProvider>)
        //simulate typing an email
        wrapper.find('input').simulate('change', {target: {name: 'email', value: 'qwerty@mailkk.com'}})
        // submit form
        wrapper.find('form').simulate('submit')
        await wait()
        wrapper.update()
        expect(wrapper.find('p').text()).toContain('Success! Check your mail box for a reset link!')
        
        
    })
})
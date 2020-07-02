import {mount} from 'enzyme'
import wait from 'waait'
import {MockedProvider} from 'react-apollo/test-utils'
import toJSON from 'enzyme-to-json'
import Order, {ORDER_QUERY} from '../components/Order'
import {fakeOrder} from '../lib/testUtils'

const mocks = [
    {
        request: {
            query: ORDER_QUERY,
            variables: {id: 'ord123'}
        },
        result: {
            data: {order: fakeOrder()}
        }
    }

]
describe('<Order />', ()=>{
    it('renders the order', async ()=>{
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <Order id='ord123' />
            </MockedProvider>
        )
        await wait()
        wrapper.update()
        expect(toJSON(wrapper.find('div[data-test="order"]'))).toMatchSnapshot()
    })
})
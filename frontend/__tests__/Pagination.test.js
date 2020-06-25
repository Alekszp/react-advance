import {mount} from 'enzyme'
import wait from 'waait'
import Pagination, {PAGINATION_QUERY} from '../components/Pagination'
import {MockedProvider} from 'react-apollo/test-utils'
import toJSON from 'enzyme-to-json'

function makeMocksFor(length){
    return [
        {
            request: {
                // query: PAGINATION_QUERY, variables: {skip: 0, first: 4}
                query: PAGINATION_QUERY
            },
            result: {
                data: {
                    itemsConnection: {
                        __typename: 'aggregate',
                        aggregate: {
                            __typename: 'count',
                            count: length
                        }
                    }
                }
            }
        }
    ]
}

describe('<Pagination/>', ()=>{
    it('displays a loading message', ()=>{
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(1)}>
                <Pagination page={1} />
            </MockedProvider>
        )
        
        expect(wrapper.text()).toContain('Loading...') 
    })
    it('renders pagination for 18 items', async ()=>{
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={1} />
            </MockedProvider>
        )

        await wait()
        wrapper.update()
        const count = wrapper.find('span.totalPages')
        expect(count.text()).toContain(5)
        const pagination = wrapper.find('div[data-test="pagination"]')
        expect(toJSON(pagination)).toMatchSnapshot()
        
    })
    it('disables prev button on first page', async()=>{
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={1} />
            </MockedProvider>
        )

        await wait()
        wrapper.update()
        expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(true);
        expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false);
    })
    it('disables next button on last page', async()=>{
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={5} />
            </MockedProvider>
        )

        await wait()
        wrapper.update()
        expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false);
        expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(true);
    })
    it('enable all buttons on middle page', async()=>{
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={3} />
            </MockedProvider>
        )

        await wait()
        wrapper.update()
        expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false);
        expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false);
    })

    
})
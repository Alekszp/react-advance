import {mount} from 'enzyme'
import wait from 'waait'
import Router from 'next/router'
import CreateItem, {CREATE_ITEM_MUTATION} from '../components/CreateItem'
import {MockedProvider} from 'react-apollo/test-utils'
import toJSON from 'enzyme-to-json'
import {fakeItem} from '../lib/testUtils'

const dogImage = 'https://dog.com/dog.jpg'
global.fetch = jest.fn().mockResolvedValue({
    json: ()=> ({
        secure_url: dogImage,
        eager:[{secure_url: dogImage}]
    })
})

describe('<CreateItem/>', ()=>{
    it('renders and matches snapshot', ()=>{
        const wrapper = mount(
            <MockedProvider><CreateItem/></MockedProvider>
        )
        const form = wrapper.find('form[data-test="form"]')
        expect(toJSON(form)).toMatchSnapshot()
        
    })
    it('uploads a file when changed', async ()=>{
        const wrapper = mount(
            <MockedProvider><CreateItem/></MockedProvider>
        )
        const input = wrapper.find('input[type="file"]')
        input.simulate('change', {target: {files: ['fakedog.jpg']}})
        await wait()
        wrapper.update()
        const component = wrapper.find('CreateItem').instance()
        expect(component.state.image).toEqual(dogImage)
        expect(component.state.largeImage).toEqual(dogImage)
        expect(global.fetch).toHaveBeenCalled()
        global.fetch.mockReset()
    })
    it('handles state updating', async ()=>{
        const wrapper = mount(
            <MockedProvider><CreateItem/></MockedProvider>
        )
        wrapper.find('#title').simulate('change', {target: {name: 'title', value: 'test title val'}})
        wrapper.find('#description').simulate('change', {target: {name: 'description', value: 'test title val description'}})
        wrapper.find('#price').simulate('change', {target: {name: 'price', value: 5000}})
        
        const component = wrapper.find('CreateItem').instance()
        expect(component.state.title).toEqual('test title val')
        expect(component.state.description).toEqual('test title val description')
        expect(component.state.price).toEqual(5000)
        // OR
        expect(wrapper.find('CreateItem').instance().state).toMatchObject({
            title: 'test title val',
            description: 'test title val description',
            price: 5000
        })
    })
    it('creates an item when the form is submitted', async()=>{
        const item = fakeItem()
        const mocks = [{
            request:{
                query: CREATE_ITEM_MUTATION,
                variables: {
                    title: item.title,
                    description: item.description,
                    image: '',
                    largeImage: '',
                    price: item.price
                }
            },
            result: {
                data: {
                    createItem: {
                        ...item,
                        id: 'abc123',
                        __typename: 'Item'
                    }
                }
            }
        }]
        const wrapper = mount(
            <MockedProvider mocks={mocks}><CreateItem/></MockedProvider>
        )
        // simulate someone filling out the form
        wrapper.find('#title').simulate('change', {target: {name: 'title', value: item.title}})
        wrapper.find('#description').simulate('change', {target: {name: 'description', value: item.description}})
        wrapper.find('#price').simulate('change', {target: {name: 'price', value: item.price}})
        // mock the router
        Router.router = {push: jest.fn() }
        wrapper.find('form').simulate('submit')
        await wait(50)
        expect(Router.router.push).toHaveBeenCalled()
        expect(Router.router.push).toHaveBeenCalledWith({"pathname": "/shop", "query": {"id": "abc123"}})
    })
})
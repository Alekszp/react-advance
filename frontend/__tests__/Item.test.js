import ItemComponent from '../components/Item'
import {shallow} from 'enzyme'
import toJSON from 'enzyme-to-json'

const fakeItem = {
    id: 'abcd123',
    title: 'some title',
    price: 2121,
    description: "very good descriptionnn",
    image: 'dog.jpeg',
    largeImage: 'big_dog.jpeg'
}

describe('<Item />', ()=>{
    it('renders and matches the snapshot',()=>{
        const wrapper = shallow(<ItemComponent item={fakeItem} />)
        expect(toJSON(wrapper)).toMatchSnapshot()
    })


    // it('renders and displays properly', ()=>{
    //     const wrapper = shallow(<ItemComponent item={ fakeItem } />)
    //     const PriceTag = wrapper.find('PriceTag')
    //     // console.log(PriceTag.debug())
    //     // console.log(PriceTag.text())
    //     // console.log(PriceTag.dive().text() )
    //     // console.log(PriceTag.children().text())
    //     expect(PriceTag.children().text()).toBe('$21.21')
    //     expect(wrapper.find('Title a').text()).toBe(fakeItem.title)
        

    // })
    // it('renders the image properly', ()=>{
    //     const wrapper = shallow(<ItemComponent item={ fakeItem } />)
    //     const img = wrapper.find('img')
    //     expect(img.props().src).toBe(fakeItem.image)
    //     expect(img.props().alt).toBe(fakeItem.title)

    // })
    // it('renders out the buttons properly', ()=>{
    //     const wrapper = shallow(<ItemComponent item={fakeItem} />)
        
    //     const buttonList = wrapper.find('.buttonList')
    //     expect(buttonList.children()).toHaveLength(3)
    //     expect(buttonList.find('Link')).toHaveLength(1) 
    //     //OR
    //     expect(buttonList.find('Link').exists()).toBe(true)
    //     //OR
    //     expect(buttonList.find('Link')).toBeTruthy()
    //     expect(buttonList.find('AddToCart')).toBeTruthy()
    //     expect(buttonList.find('DeleteFromCart')).toBeTruthy()
    // })
})
import Link from 'next/link'
import { Mutation } from 'react-apollo'
import { TOGGLE_CART_MUTATION } from './Cart'
import NavStyles from './styles/NavStyles'
import User from './User'
import SignOut from './Signout'
import CartCount from './CartCount'

const Nav = () => (
   
       <User>
           {({data: { me }})=>(
               <NavStyles data-test="nav">
                    <Link href="/shop">
                        <a>Shop</a>
                    </Link>
                    {me && (
                    <>
                        <Link href="/sell">
                            <a>Sell</a>
                        </Link>
                        <Link href="/orders">
                            <a>Orders</a>
                        </Link>
                        <Link href="/account">
                            <a>Account</a>
                        </Link>
                        <SignOut />
                        <Mutation mutation={TOGGLE_CART_MUTATION}>
                            {(toggleCart)=>(
                                <button onClick={toggleCart}>
                                    My cart
                                    <CartCount count={
                                        
                                        me.cart.reduce((tally, cartItem) => {
                                            return tally + cartItem.quantity
                                        }, 0)
                                    }></CartCount>
                                </button>
                            )}
                            
                        </Mutation>
                    </>)}
                    {!me && (<Link href="/signup">
                        <a>Sign In</a>
                    </Link>
                    )}
                </NavStyles>
           )}  
        </User>
)

export default Nav
import React, { Component } from 'react';
import {Mutation} from 'react-apollo'
import gql from "graphql-tag";
import Form from './styles/Form'
import Error from "./ErrorMessage";

const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION($email: String!, $password: String!){
        signIn(email: $email, password: $password){
            id
            email
            name
        }
    }
`

class Signin extends Component {

    state = {
        email: '',
        password: '',
        name: ''
    }

    saveToState = (e) => {
        const {name, type, value} = e.target
        this.setState({[name]: value})
    }
    render() {
        return (
            <Mutation mutation={SIGNIN_MUTATION} variables={this.state}>
                {(signUp, {error, loading})=>(
                    <Form method="post" onSubmit={async e=>{
                        e.preventDefault()
                        const res = await signUp()
                        console.log(res)
                        this.setState({name: '', email: '', password: ''})
                    }}>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <Error error={error} />

                            <h2>Sign into your account</h2>
                            <label htmlFor='email'/>
                            Email
                            <input type='email' name='email' placeholder='email' value={this.state.email} onChange={this.saveToState} />
                            
                            <label htmlFor='password'/>
                            Password
                            <input type='password' name='password' placeholder='password' value={this.state.password} onChange={this.saveToState} />

                            <button type='submit'>Sign in</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}

export default Signin;
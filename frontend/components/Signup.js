import React, { Component } from 'react';
import {Mutation} from 'react-apollo'
import gql from "graphql-tag";
import Form from './styles/Form'
import Error from "./ErrorMessage";

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!){
        signUp(email: $email, name: $name, password: $password){
            id
            email
            name
        }
    }
`

class Signup extends Component {

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
            <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
                {(signUp, {error, loading})=>(
                    <Form method="post" onSubmit={async e=>{
                        e.preventDefault()
                        await signUp()
                        this.setState({name: '', email: '', password: ''})
                    }}>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <Error error={error} />

                            <h2>Sign up for an account</h2>
                            <label htmlFor='email'/>
                            Email
                            <input type='email' name='email' placeholder='email' value={this.state.email} onChange={this.saveToState} />

                            <label htmlFor='name' >
                                Name
                                <input type='text' name='name' placeholder='name' value={this.state.name} onChange={this.saveToState} />
                            </label>
                            <label htmlFor='password' >
                                Password
                                <input type='password' name='password' placeholder='password' value={this.state.password} onChange={this.saveToState} />
                            </label>
                            <button type='submit'>Sign up</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}

export default Signup;
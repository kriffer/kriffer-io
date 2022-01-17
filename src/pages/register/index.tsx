import React, {Fragment, useState, useEffect} from 'react';

import {
    GridRow,
    GridColumn,
    FormGroup,
    Label,
    Input,
    Card, Message, Button, Container, FormInput,

} from 'semantic-ui-react';


import axios from "axios";

export default function Register() {
    const URL = process.env.REACT_APP_API_ENDPOINT;

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertState, setAlertState] = useState(false);


    return (
        <Container>


            <GridRow>
                <GridColumn>


                    <div>


                        <div className="  text-center mb-3">
                            <h3>Create account</h3>
                        </div>


                        <form onSubmit={submitHandler}>
                            <FormGroup>
                                <label className="font-size-md"
                                >First Name</label>
                                <FormInput
                                    type="name"
                                    name="firstName"
                                    id="firstName"
                                    placeholder="placeholder" value={firstName}
                                    onChange={onFirstNameChanged}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label className="font-size-md"
                                >Last Name</label>
                                <FormInput
                                    type="name"
                                    name="lastName"
                                    id="lastName"
                                    placeholder="placeholder" value={lastName}
                                    onChange={onLastNameChanged}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label className="font-size-md"
                                >Email</label>
                                <FormInput
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="placeholder" value={email}
                                    onChange={onEmailChanged}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label className="font-size-md"
                                >Password</label>
                                <FormInput
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="password" value={password}
                                    onChange={onPasswordChanged}
                                />
                            </FormGroup>


                            <Button type="submit" className="ui primary"
                            >Sign up</Button>
                        </form>
                    </div>


                </GridColumn>

            </GridRow>


        </Container>
    );

    function submitHandler(event: any) {
        event.preventDefault();
        if (!email || !password || !firstName || !lastName) {
            setAlertState(true)
            setError('Name, Email, Password mandatory');
            return;
        }

        axios.post(`${URL}/api/v1/register`, {
            firstName,  lastName, email, password
        }).then(response => {

            setSuccess(true);


        }).catch(error => {
            setAlertState(true)

            setError(error.response.data.error);

        })


    }

    function onFirstNameChanged(e: any) {
        setFirstName(e.target.value)
    }

    function onLastNameChanged(e: any) {
        setLastName(e.target.value)
    }

    function onEmailChanged(e: any) {
        setEmail(e.target.value)
    }

    function onPasswordChanged(e: any) {
        setPassword(e.target.value)
    }


}



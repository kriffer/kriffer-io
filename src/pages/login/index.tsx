import React, {useState} from 'react'
import {Button, Form, Grid, Header, Image, Message, Segment} from 'semantic-ui-react'
import axios from "axios";

const LoginForm = () => {


    const URL = process.env.REACT_APP_API_ENDPOINT;

    const [success, setSuccess] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [alertState, setAlertState] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (error) {
        setTimeout(() => {
            setAlertState(false)
        }, 3000)

    }


    return (
        <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
            <Grid.Column style={{maxWidth: 450}}>
                <Header as='h2' color='black' textAlign='center'>
                    Login
                </Header>
                <Form size='large' onSubmit={submitHandler}>
                    <Segment stacked>
                        <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' value={email}
                                    onChange={onEmailChanged}/>
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                            value={password}
                            onChange={onPasswordChanged}
                        />

                        <Button color='black' fluid size='large'>
                            Login
                        </Button>
                    </Segment>
                </Form>

            </Grid.Column>
        </Grid>
    )


    function submitHandler(event: any) {
        event.preventDefault();
        if (isLoading) return;
        if (!email || !password) {
            setAlertState(true)
            setError('Email and Password mandatory');
            return;
        }

        setIsLoading(true);
        axios.post(`${URL}/api/v1/login`, {
            email, password
        }).then(response => {

            localStorage.setItem('token', response.data.token);

            axios.get(`${URL}/api/v1/me`, {
                headers: {
                    'Authorization': `Bearer ${response.data.token}`,
                }
            }).then(res => {
                localStorage.setItem('userId', res.data.userId);
                localStorage.setItem('firstName', res.data.firstName);
                localStorage.setItem('lastName', res.data.lastName);
                localStorage.setItem('email', res.data.email);

                setSuccess(true);
                setIsLoading(false);
                window.location.href = "/admin"
            }).catch(error => {
                if (error.response.status === 401) {
                    localStorage.removeItem('token');
                    setAlertState(true)
                    setError('No token, please authenticate to get the token');
                    setIsLoading(false);
                    return;
                }

                setAlertState(true)
                setIsLoading(false);
                setError(error.response.data.error);

            });

        }).catch(error => {
            setAlertState(true)
            setIsLoading(false);
            setError(error.response.data.error);

        })


    }


    function onEmailChanged(e: any) {
        setEmail(e.target.value)
    }

    function onPasswordChanged(e: any) {
        setPassword(e.target.value)
    }
}

export default LoginForm
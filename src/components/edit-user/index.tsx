import React, {useState} from "react";
import {
    Button,
    Container,
    Divider,
    Form, Input,
} from "semantic-ui-react";


import {UserProp} from "../admin-user/types";

type EditUserProp = {
    user: UserProp
}

const URL = process.env.REACT_APP_API_ENDPOINT;

const EditUser: React.FC<EditUserProp> = ({user}) => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function saveUser() {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.token}`},
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                password: password,
                email: email,
            })
        };
        fetch(`${URL}/api/v1/users/${user.userId}`, requestOptions)
            .then(() => {
            })
    }


    function handleFirstNameChange(event: any) {
        setFirstName(event.target.value);
    }


    const handleLastNameChange = (e: any, {value}: any) => {
        setLastName(value);
    }

    const handleEmailChange = (e: any, {value}: any) => {
        setEmail(value);
    }
    const handlePasswordChange = (e: any, {value}: any) => {
        setPassword(value);
    }


    return (


        <Container style={{marginTop: '5em'}}>


            <Form>
                <Form.Field>
                    <label>First name</label>
                    <Input value={user.firstName} onChange={handleFirstNameChange}/>
                </Form.Field>
                <Form.Field>
                    <label>Last name</label>
                    <Input value={user.lastName} onChange={handleLastNameChange}/>
                </Form.Field>
                <Form.Field>
                    <label>Email</label>
                    <Input value={user.email} onChange={handleEmailChange}/>
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <Input type="password" value={user.password} onChange={handlePasswordChange}/>
                </Form.Field>

            </Form>


            <Divider/>
            <Button secondary onClick={saveUser}>Save</Button>
        </Container>


    )
}

export default EditUser;
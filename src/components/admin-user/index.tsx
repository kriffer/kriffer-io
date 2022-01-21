import React, {useEffect, useState} from "react";
import {
    Breadcrumb,
    Button,
    Container
} from "semantic-ui-react";
import {UserProp} from "./types";
import TableUsers from "../table-users";
import AddUser from "../add-user";
import EditUser from "../edit-user";


const URL = process.env.REACT_APP_API_ENDPOINT;

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<UserProp[]>([]);
    const [user, setUser] = useState<UserProp>({} as UserProp);
    const [state, setState] = useState('table-users');


    async function loadUsers() {
        await fetch(`${URL}/api/v1/users`, {
            headers: {
                'Authorization': `Bearer ${localStorage.token}`,
            }
        })
            .then(response => response.json())
            .then((res) => {
                    setUsers(res);

                },
                (error) => {
                    console.error(error)
                }
            )
    }


    useEffect(() => {
        loadUsers();

    }, []);

    const handlePostSelection = (e: any, data: any) => {

        setUser(data);
        setState('edit-user')

    }

    function deleteUser(e: any, user: UserProp) {
        e.stopPropagation();


        fetch(`${URL}/api/v1/users/${user.userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.token}`,
            }, method: 'DELETE'
        })
            .then(() => {
                    loadUsers()
                },
                (error) => {
                    console.error(error)
                }
            )


    }

    function renderSwitch() {
        switch (state) {
            case 'table-users':
                return <div>
                    <Button primary onClick={() => setState('add-user')}>Add user</Button>
                    <TableUsers onRowClick={handlePostSelection} onButtonClick={deleteUser} users={users}/></div>
            case 'edit-user':
                return <div><Breadcrumb>
                    <Breadcrumb.Section link onClick={() => setState('table-users')} size={'large'}>All
                        users</Breadcrumb.Section>
                    <Breadcrumb.Divider/>
                </Breadcrumb><EditUser user={user}/></div>
            case 'add-user':
                return <div><Breadcrumb>
                    <Breadcrumb.Section link onClick={() => setState('table-users')} size={'large'}>All
                        users</Breadcrumb.Section>
                    <Breadcrumb.Divider/>
                </Breadcrumb><AddUser/></div>
        }
    }

    return (
        <Container style={{marginTop: '5em'}}>
            {renderSwitch()}
        </Container>
    )
}

export default AdminUsers;
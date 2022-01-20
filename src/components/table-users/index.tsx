import {Button, Icon, Table} from "semantic-ui-react";
import React, {useState} from "react";
import {UserProp} from "../admin-user/types";


type UserListProps = {
    users: UserProp[];
    onRowClick: (e: React.MouseEvent, data: any) => void;
    onButtonClick: (e: React.MouseEvent, data: any) => void;
}
const TableUsers: React.FC<UserListProps> = ({users, onRowClick, onButtonClick}) => {

    function handleClick(e: any, user: UserProp) {
        onRowClick(e, user);
    }

    function deletePost(e: any, user: UserProp){
        onButtonClick(e, user);
    }



    return <Table selectable stackable>
        <Table.Body>
            {users.map(user => <Table.Row key={user.userId} onClick={(e: any) => handleClick(e, user)}>
                <Table.Cell>{user.userId}</Table.Cell>
                <Table.Cell>{user.firstName} {user.lastName}</Table.Cell>

                <Table.Cell>{user.verificationTocken}</Table.Cell>
                <Table.Cell>{new Date(user.created).toISOString().slice(0, 19).replace('T', ' ')}</Table.Cell>
                <Table.Cell><Button  id="delete" className="ui button tiny red" onClick={ (event, data)=> deletePost(event,user) }>Delete</Button></Table.Cell>
            </Table.Row>)}
        </Table.Body>
    </Table>
}

export default TableUsers
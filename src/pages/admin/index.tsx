import React, {useState} from "react";
import {
    Button,

    Container,
    Grid,
    GridColumn, Icon,

} from "semantic-ui-react";


import AdminMenu from "../../components/admin-menu";
import AdminPosts from "../../components/admin-posts";
import AdminUsers from "../../components/admin-user";


const AdminPage: React.FC = () => {

    const [activeItem, setActiveItem] = useState<any>('posts');


    const clickMenu = (e: any, data: any) => {
        setActiveItem(data.name);
    }

    function renderSwitch(param: string) {
        switch (param) {
            case 'posts':
                return <AdminPosts/>;
            case 'images':
                return 'images';
            case 'user':
                return <AdminUsers/>;
        }
    }

    function logout() {

        localStorage.removeItem('token');
        window.location.href = "/"
    }

    return (

        <Grid stackable reversed={'mobile'} columns={3}>
            <GridColumn width={3}>
                <Container style={{marginTop: '5em'}}>
                    <AdminMenu onClick={clickMenu} activeItem={activeItem}/>
                </Container>

            </GridColumn>
            <GridColumn width={13}>
                <Container textAlign={"right"}> <Button className="ui button" onClick={logout}><Icon name="log out"/>Logout</Button></Container>

                {renderSwitch(activeItem)}

            </GridColumn>

        </Grid>


    )
}

export default AdminPage;
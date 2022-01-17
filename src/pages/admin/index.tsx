import React, {useState} from "react";
import {

    Container,
    Grid,
    GridColumn,

} from "semantic-ui-react";


import AdminMenu from "../../components/admin-menu";
import AdminPosts from "../../components/admin-posts";


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
                return 'user';
        }
    }

    return (

        <Grid stackable reversed={'mobile'} columns={3}>
            <GridColumn width={3}>
                <Container style={{marginTop: '5em'}}>
                    <AdminMenu onClick={clickMenu} activeItem={activeItem}/>
                </Container>

            </GridColumn>
            <GridColumn width={13}>
                {renderSwitch(activeItem)}

            </GridColumn>

        </Grid>


    )
}

export default AdminPage;
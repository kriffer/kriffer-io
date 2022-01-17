import React from 'react'
import {
    Container,
    Grid,
    Icon,
    List,
    Menu,
    Segment, Sidebar,
} from 'semantic-ui-react'


import TopHeader from '../components/header'


import About from "../components/about";
import {Route, Routes} from "react-router-dom";
import Post from "../components/post";
import AdminPage from "../pages/admin";
import Projects from "../pages/projects";
import PostsPage from "../pages/articles";
import LoginForm from "../pages/login";
import Register from "../pages/register";


const Main: React.FC = () => {

    const [visible, setVisible] = React.useState(false)


    const setVisibility = (e: any, data: any) => {
        setVisible(!data.visible)
    };


    return (
        <div>
            <Grid columns={1}>
                <Grid.Column>
                    <Sidebar.Pushable as={Segment}>
                        <Sidebar
                            as={Menu}
                            animation='overlay'
                            icon='labeled'
                            inverted
                            onHide={() => setVisible(false)}
                            vertical
                            visible={visible}
                            width='thin'
                        >
                            <Menu.Item href='/posts' as='a'>
                                <Icon name='newspaper'/>
                                Articles
                            </Menu.Item>
                            <Menu.Item href='/projects' as='a'>
                                <Icon name='code'/>
                                Projects
                            </Menu.Item>
                            <Menu.Item href='/about' as='a'>
                                <Icon name='info'/>
                                About
                            </Menu.Item>
                        </Sidebar>
                        <Sidebar.Pusher dimmed={visible}>

                            <Segment basic>

                                <TopHeader setVisibility={setVisibility} active={visible}/>
                                <Routes>
                                    <Route path="/login" element={<LoginForm/>}/>
                                    <Route path="/register" element={<Register/>}/>
                                    <Route path="/" element={<PostsPage/>}/>
                                    <Route path="/posts" element={<PostsPage/>}/>
                                    <Route path="/posts/:slug" element={<Post/>}/>
                                    <Route path="/about" element={<About/>}/>
                                    <Route path="/projects" element={<Projects/>}/>

                                    <Route path="/admin" element={<AdminPage/>}/>

                                    <Route path="/error" element={<p>Error Page!</p>}/>
                                    <Route path="*" element={<p>404 - Not Found :(</p>}/>
                                </Routes>

                                <Segment inverted vertical style={{margin: '5em 0em 0em', padding: '5em 0em'}}>
                                    <Container textAlign='center'>

                                        <List horizontal inverted divided link size='small'>

                                            <List.Item as='a' href='/about'>
                                                © {new Date().getFullYear()} kriffer.io
                                            </List.Item>
                                        </List>
                                    </Container>
                                </Segment>
                            </Segment>

                        </Sidebar.Pusher>
                    </Sidebar.Pushable>
                </Grid.Column>
            </Grid>
        </div>
    )
}

export default Main
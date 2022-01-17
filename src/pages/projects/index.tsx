import React from "react";
import {Button, Container, Divider, Header, Icon, Item, List} from "semantic-ui-react";


const Projects: React.FC = () => {

    return (<div>
        <Container text style={{marginTop: '5em'}}>
            <Header size={'small'}>Projects</Header>
            <Divider/>
            <p>
                <Item.Group divided>
                    <Item>
                        <Item.Content>
                            <Item.Header>
                                Foresail PMS
                            </Item.Header>
                            <Item.Meta>Property management system</Item.Meta>
                            <Item.Description>
                                <p> The open source pet project that is based on Spring Boot, backend REST API and
                                    React/Redux/Typescript on frontend.</p>
                            </Item.Description>
                            <Item.Extra> <Button circular color='black' icon='github'
                                                 href={'https://github.com/kriffer/foresail-pms'}/></Item.Extra>
                             </Item.Content>
                    </Item>
                    <Item>
                        <Item.Content>
                            <Item.Header>
                                Customer Portal
                            </Item.Header>
                            <Item.Meta>Content and product management system</Item.Meta>
                            <Item.Description>
                                <p> The open source project is crafted with Koa.js
                                    backend and React + Typescript in frontend. The styles and UI components -
                                    awesome and my favourite
                                    <a href="https://react.semantic-ui.com/"> Semantic-UI</a></p>
                            </Item.Description>
                            <Item.Extra> <Button circular color='black' icon='github'
                                                 href={'https://github.com/kriffer/customer-portal'}/></Item.Extra>
                        </Item.Content>
                    </Item>
                    <Item>
                        <Item.Content>
                            <Item.Header>
                                kriffer.io
                            </Item.Header>
                            <Item.Meta>Tech blog</Item.Meta>
                            <Item.Description>
                                <p>This is the current website/blog. The open source project is crafted with Koa.js
                                backend and React + Typescript in frontend. The styles and UI components -
                                    awesome and my favourite
                                <a href="https://react.semantic-ui.com/"> Semantic-UI</a></p>
                            </Item.Description>
                            <Item.Extra> <Button circular color='black' icon='github'
                                                 href={'https://github.com/kriffer/kriffer-io'}/></Item.Extra>
                        </Item.Content>
                    </Item>

                </Item.Group>

            </p>

        </Container>


    </div>)
}

export default Projects;
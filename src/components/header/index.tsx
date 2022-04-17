import React from "react";
import {Container, Grid, GridColumn, Header, Icon, Menu} from "semantic-ui-react";
import './header.css';
import SearchField from "../search";
import {Link, NavLink} from "react-router-dom";

type HeaderProps = {
    setVisibility: (e: React.MouseEvent, data: any) => void;
    active: boolean
}


const TopHeader: React.FC<HeaderProps> = ({setVisibility, active}) => {

    return (
        <Header fixed='top' style={{background: 'white'}} textAlign='center'>
            <Container>
                <Grid columns={3} stackable textAlign={"center"} verticalAlign={"middle"}>
                    <GridColumn width={5}>

                        <Icon.Group size='big' className={active ? 'rotated' : ''}>
                            <Icon name='sidebar' link onClick={setVisibility}/>
                        </Icon.Group>

                    </GridColumn>
                    <GridColumn width={6} textAlign={"center"} verticalAlign={"middle"}>

                        <Menu secondary vertical fluid>
                            <Menu.Item>
                                <NavLink to="/">

                                    <h1>~
                                        <Icon id="triangle-icon" name='dollar'/>
                                        <Header.Content> kriffer.io_</Header.Content>
                                    </h1>
                                    <Header.Subheader>
                                        software and systems engineering related stuff
                                    </Header.Subheader>

                                </NavLink>
                            </Menu.Item>
                        </Menu>
                    </GridColumn>
                    <GridColumn width={5}>
                        <SearchField/>
                    </GridColumn>
                </Grid>
            </Container>

        </Header>

    );

}

export default TopHeader;

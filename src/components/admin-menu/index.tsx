import {Menu} from "semantic-ui-react";
import React  from "react";

import {AdminMenuProps} from "./types";

const AdminMenu:React.FC<AdminMenuProps> = ({onClick, activeItem}) => {

    return (

        <Menu pointing secondary vertical>
            <Menu.Item
                name='posts'
                active={activeItem === 'posts'}
                onClick={onClick}
            />
            <Menu.Item
                name='images'
                active={activeItem === 'images'}
                onClick={onClick}
            />
            <Menu.Item
                name='user'
                active={activeItem === 'user'}
                onClick={onClick}
            />
        </Menu>

    )


}


export default AdminMenu;
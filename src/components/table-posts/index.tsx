import {Button, Icon, Table} from "semantic-ui-react";
import React, {useState} from "react";
import {PostProp} from "../post/types";


type PostListProps = {
    posts: PostProp[];
    onRowClick: (e: React.MouseEvent, data: any) => void;
    onButtonClick: (e: React.MouseEvent, data: any) => void;
}
const TablePosts: React.FC<PostListProps> = ({posts, onRowClick, onButtonClick}) => {

    function handleClick(e: any, post: PostProp) {
        onRowClick(e, post);
    }

    function deletePost(e: any, post: PostProp){
        onButtonClick(e, post);
    }



    return <Table selectable stackable>
        <Table.Body>
            {posts.map(post => <Table.Row key={post.postId} onClick={(e: any) => handleClick(e, post)}>
                <Table.Cell>{post.postId}</Table.Cell>
                <Table.Cell>{post.summary}</Table.Cell>
                <Table.Cell>{post.slug}</Table.Cell>
                <Table.Cell>{new Date(post.createdAt).toISOString().slice(0, 19).replace('T', ' ')}</Table.Cell>
                <Table.Cell><Button  id="delete" className="ui button tiny red" onClick={ (event, data)=> deletePost(event,post) }>Delete</Button></Table.Cell>
            </Table.Row>)}
        </Table.Body>
    </Table>
}

export default TablePosts
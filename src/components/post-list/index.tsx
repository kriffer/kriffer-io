import React, {useState} from "react";
import {Header, Menu} from "semantic-ui-react";

import {PostProp} from "../post/types";
import {Link} from "react-router-dom";


export type PostListProps = {
    posts: PostProp[];
}

const PostList: React.FC<PostListProps> = ({posts}) => {


    return (
        <div>
            <Menu secondary vertical fluid>
                {posts.sort((a, b) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                }).map(post => (
                    <Menu.Item key={post.postId} as='a'>
                        <Link to={`/posts/${post.slug}`} key={post.slug}>
                            <Header size={'large'}>{post.summary} </Header>
                            <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                        </Link>
                    </Menu.Item>
                ))}
            </Menu>

        </div>


    )
}

export default PostList;
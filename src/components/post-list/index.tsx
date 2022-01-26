import React, { useState} from "react";
import {Header, Menu} from "semantic-ui-react";

import {PostProp} from "../post/types";


export type PostListProps = {
    posts: PostProp[];
}

const PostList: React.FC<PostListProps> = ({posts}) => {



    function handleClick(slug: string) {
        window.location.href = `/posts/${slug}`;
    }


    return (
        <div>
            <Menu secondary vertical fluid>
                {posts.sort((a, b) => {return  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()}).map(post => (
                    <Menu.Item key={post.postId} onClick={() => handleClick(post.slug)}>
                        <Header size={'large'}>{post.summary} </Header>
                        <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                    </Menu.Item>
                ))}
            </Menu>

        </div>


    )
}

export default PostList;
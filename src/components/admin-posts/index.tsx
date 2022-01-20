import React, {useEffect, useState} from "react";
import {
    Breadcrumb,
    Button,
    Container
} from "semantic-ui-react";

import {PostProp} from "../post/types";
import EditPost from "../edit-post";
import TablePosts from "../table-posts";
import AddPost from "../add-post";

const URL = process.env.REACT_APP_API_ENDPOINT;

const AdminPosts: React.FC = () => {
    const [posts, setPosts] = useState<PostProp[]>([]);
    const [p, setP] = useState<PostProp>({} as PostProp);
    const [state, setState] = useState('table-posts');


    async function loadPosts() {
        await fetch(`${URL}/api/v1/posts`, {
            headers: {
                'Authorization': `Bearer ${localStorage.token}`,
            }
        })
            .then(response => response.json())
            .then((res) => {
                    setPosts(res);

                },
                (error) => {
                    console.error(error)
                }
            )
    }


    useEffect(() => {
        loadPosts();

    }, []);

    const handlePostSelection = (e: any, data: any) => {
        console.log(data);
        setP(data);
        setState('edit-post')

    }

    function deletePost(e: any, post: PostProp) {
        e.stopPropagation();

        fetch(`${URL}/api/v1/tagsposts/post/${post.postId}`, {method: 'DELETE'})
            .then(() => {
                    fetch(`${URL}/api/v1/categoriesposts/post/${post.postId}`, {method: 'DELETE'})
                        .then(() => {
                            fetch(`${URL}/api/v1/posts/${post.postId}`, {method: 'DELETE'})
                                .then(() => {
                                        loadPosts()
                                    },
                                    (error) => {
                                        console.error(error)
                                    }
                                )
                        })
                },
                (error) => {
                    console.error(error)
                }
            )


    }

    function renderSwitch() {
        switch (state) {
            case 'table-posts':
                return <div>
                    <Button primary onClick={() => setState('add-post')}>Add post</Button>
                    <TablePosts onRowClick={handlePostSelection} onButtonClick={deletePost} posts={posts}/></div>
            case 'edit-post':
                return <div><Breadcrumb>
                    <Breadcrumb.Section link onClick={() => setState('table-posts')} size={'large'}>All
                        posts</Breadcrumb.Section>
                    <Breadcrumb.Divider/>
                </Breadcrumb><EditPost post={p}/></div>
            case 'add-post':
                return <div><Breadcrumb>
                    <Breadcrumb.Section link onClick={() => setState('table-posts')} size={'large'}>All
                        posts</Breadcrumb.Section>
                    <Breadcrumb.Divider/>
                </Breadcrumb><AddPost/></div>
        }
    }

    return (
        <Container style={{marginTop: '5em'}}>
            {renderSwitch()}
        </Container>
    )
}

export default AdminPosts;
import React from "react";

import {Container, Divider, Grid, Header, Icon, Menu} from "semantic-ui-react";
import {Link} from "react-router-dom";
import Comments from "../comments";
import {PostProp} from "../post/types";

type PropsFromPost = {

    p: PostProp,
    posts: PostProp[],
    prevPost: PostProp,
    nextPost: PostProp

}


const PostFooter: React.FC<PropsFromPost> = (props) => {

    return (
        <Container text>

            <Grid stackable columns={2}>
                <Grid.Column textAlign={"left"}>

                    {props.prevPost ?
                        <Link to={`/posts/${props.prevPost.slug}`} id="heighbour-posts"> <Icon
                            name='backward'/>{props.prevPost.summary ? props.prevPost.summary.substring(0, 40).concat('...') : ''}
                        </Link> : ''}

                </Grid.Column>
                <Grid.Column textAlign={"right"}>

                    {props.nextPost ?
                        <Link to={`/posts/${props.nextPost.slug}`}
                              id="heighbour-posts"> {props.nextPost.summary ? props.nextPost.summary.substring(0, 40).concat('...') : ''}
                            <Icon name='forward'/></Link> : ''}

                </Grid.Column>
            </Grid>
            <Container text style={{marginTop: '2em'}}>
                <Comments post={props.p}/>
            </Container>
            {props.posts.length > 0 ?
                <Container text style={{marginTop: '2em'}}>
                    <Divider/>
                    <Header textAlign={"center"} style={{fontWeight: '200'}}>
                        Other articles of this category:
                    </Header>
                    <Menu secondary vertical fluid>
                        {props.posts.map(post => (post.postId !== props.p.postId ?

                                <Menu.Item key={post.postId}>
                                    <Link to={`/posts/${post.slug}`}>
                                        <Header><span>{new Date(props.p.createdAt).toLocaleDateString()} - </span> {post.summary}
                                        </Header>
                                    </Link>
                                </Menu.Item>
                                : ''
                        ))}
                    </Menu>
                </Container> : ''}


        </Container>

    );


}

export default PostFooter;
import React, {useEffect, useState} from "react";
import {
    Container,
    Divider,
    Header,
    Label,
    Icon,
    Breadcrumb,
    Grid, GridColumn, Menu
} from "semantic-ui-react";

import {useParams} from "react-router";
import {PostProp} from "./types";
import MDEditor from '@uiw/react-md-editor';
import './post.css';
import {Category, Tag} from "../../layout/types";
import Comments from "../comments";


export type PostPropObj = {
    post?: PostProp;

}

const URL = process.env.REACT_APP_API_ENDPOINT;

const Post: React.FC<PostPropObj> = () => {
    const [posts, setPosts] = useState<PostProp[]>([]);

    const [p, setP] = useState<PostProp>({} as PostProp);
    const [nextPost, setNextPost] = useState<PostProp>({} as PostProp);
    const [prevPost, setPrevPost] = useState<PostProp>({} as PostProp);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);

    let {slug} = useParams()


    async function loadPostBySlug() {
        await fetch(`${URL}/api/v1/posts/slug/${slug}`)
            .then(response => response.json())
            .then((res) => {
                    setP(res[0]);
                    loadCategories(res[0].postId);
                    loadTags(res[0].postId)

                    getNextPost(+res[0].postId + 1)

                    if ((+res[0].postId - 1) >= 0) {
                        getPrevPost(+res[0].postId - 1)

                    }
                },
                (error) => {
                    console.error(error)
                }
            )
    }

    async function loadPostById(id: number) {
        const res = await fetch(`${URL}/api/v1/posts/${id}`).then(response => response.json());
        return res[0];

    }

    async function loadCategories(id: number) {
        await fetch(`${URL}/api/v1/categories`)
            .then(response => response.json())
            .then((res) => {

                    let categoriesOfPost = res.filter((cat: Category) => cat.postId === id);

                  console.log(categoriesOfPost)
                    categoriesOfPost.map((c: Category) => getByCategory(c.categoryId));
                    setCategories(categoriesOfPost);

                },
                (error) => {
                    console.error(error)
                }
            )
    }

    async function loadTags(id: number) {
        await fetch(`${URL}/api/v1/tags/post/${id}`)
            .then(response => response.json())
            .then((res) => {
                    setTags(res);
                },
                (error) => {
                    console.error(error)
                }
            )
    }

    function getByCategory(id: number) {
        fetch(`${URL}/api/v1/posts/category/${id}`)
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
        loadPostBySlug();

    }, []);


    async function getNextPost(val: number) {

        setNextPost(await loadPostById(val));
    }

    async function getPrevPost(val: number) {

        setPrevPost(await loadPostById(val));
    }

    function handleClick(slug: string) {
        window.location.href = `/posts/${slug}`;
    }


    return (
        <Grid stackable reversed={'mobile'} columns={3}>
            <GridColumn width={3}/>
            <GridColumn width={10}>

                <Container text style={{marginTop: '5em'}}>
                    <Breadcrumb>
                        <Breadcrumb.Section href='/posts' size={'large'}>All posts</Breadcrumb.Section>
                        <Breadcrumb.Divider/>
                    </Breadcrumb>

                    <Header as='h1'>{p ? p.summary : ''}</Header>

                    <p id="author-date">  {p.firstName + ' ' + p.lastName + ',  '}
                        {p ? new Date(p.createdAt).toLocaleDateString() : ''}
                        <div>
                            {[...tags].sort().map(tag =>
                                <Label
                                    size={'tiny'} key={tag.tagId}><a href={'/posts'}>{tag.tagTitle}</a></Label>
                            )}
                        </div>
                    </p>


                    <Container id="text-container"> <Divider/> <MDEditor.Markdown source={p ? p.content : ''}
                    /> </Container>

                    <Container style={{marginTop: '1em'}} textAlign={"right"}>
                        <Menu text>
                            <Menu.Item
                                href={`https://twitter.com/share?text=${p.summary}&url=${window.location.href}?utm_content=${p.slug}&utm_source=twshare`}>
                                <Icon circular inverted name='twitter' link/>
                            </Menu.Item>
                            <Menu.Item
                                href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${p.summary}&source='kriffer.io'`}>
                                <Icon circular inverted name='linkedin'/>
                            </Menu.Item>
                            <Menu.Item
                                href={`https://news.ycombinator.com/submitlink?u==${window.location.href}&t=${p.summary}`}>
                                <Icon circular inverted name='y combinator'/>
                            </Menu.Item>
                        </Menu>
                    </Container>

                    <Divider/>
                    <Grid stackable columns={2}>
                        <Grid.Column textAlign={"left"}>

                            {prevPost ?
                                <a href={`/posts/${prevPost.slug}`} id="heighbour-posts"> <Icon
                                    name='backward'/>{prevPost.summary ? prevPost.summary.substring(0, 40).concat('...') : ''}
                                </a> : ''}

                        </Grid.Column>
                        <Grid.Column textAlign={"right"}>

                            {nextPost ?
                                <a href={`/posts/${nextPost.slug}`}
                                   id="heighbour-posts"> {nextPost.summary ? nextPost.summary.substring(0, 40).concat('...') : ''}
                                    <Icon name='forward'/></a> : ''}

                        </Grid.Column>
                    </Grid>


                </Container>

                <Container text style={{marginTop: '2em'}}>
                    <Comments post={p}/>
                </Container>

                {posts.length > 0 ?
                    <Container text style={{marginTop: '2em'}}>
                        <Divider/>
                        <Header textAlign={"center"} style={{fontWeight: '200'}}>
                            Other articles of this category:
                        </Header>
                        <Menu secondary vertical fluid>
                            {posts.map(post => (post.postId !== p.postId ?
                                    <Menu.Item key={post.postId} onClick={() => handleClick(post.slug)}>
                                        <Header><span>{new Date(p.createdAt).toLocaleDateString()} - </span> {post.summary}
                                        </Header>
                                    </Menu.Item> : ''
                            ))}
                        </Menu>
                    </Container> : ''}
            </GridColumn>
            <GridColumn width={3}>


            </GridColumn>

        </Grid>


    )
}

export default Post;
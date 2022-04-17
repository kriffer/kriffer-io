import React, {useEffect, useState} from "react";
import {Breadcrumb, Container, Divider, Grid, GridColumn, Header, Label, Menu} from "semantic-ui-react";
import PostList from "../../components/post-list";
import {Category, Tag} from '../../layout/types'
import './post-list.css';
import {PostProp} from "../../components/post/types";
import {Link, useLocation} from "react-router-dom";


const URL = process.env.REACT_APP_API_ENDPOINT;

const PostsPage: React.FC = () => {
    const [p, setP] = useState<PostProp[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [isAllPosts, setIsAllPosts] = useState<boolean>(true);


    let location = useLocation();

    async function loadPosts() {
        await fetch(`${URL}/api/v1/posts`)
            .then(response => response.json())
            .then((res) => {
                    setP(res);
                    setIsAllPosts(true);
                },
                (error) => {
                    console.error(error)
                }
            )
    }


    async function loadCategories() {
        await fetch(`${URL}/api/v1/categories`)
            .then(response => response.json())
            .then((res) => {
                    setCategories(res);
                },
                (error) => {
                    console.error(error)
                }
            )
    }

    async function loadTags() {
        await fetch(`${URL}/api/v1/tags`)
            .then(response => response.json())
            .then((res) => {
                    setTags(res);
                },
                (error) => {
                    console.error(error)
                }
            )
    }

    useEffect(() => {
        loadPosts();
        loadCategories();
        loadTags();


    }, [location]);

    function getByCategory(id: number) {
        fetch(`${URL}/api/v1/posts/category/${id}`)
            .then(response => response.json())
            .then((res) => {
                    setP(res);
                    setIsAllPosts(false);
                },
                (error) => {
                    console.error(error)
                }
            )
    }

    function getByTag(id: number) {
        fetch(`${URL}/api/v1/posts/tag/${id}`)
            .then(response => response.json())
            .then((res) => {
                    setP(res);
                    setIsAllPosts(false);
                },
                (error) => {
                    console.error(error)
                }
            )
    }

    function getNewCategories(): Category[] {

        return categories.filter(
            (cat, i, arr) => {
                return arr.findIndex(c => {
                    return c.categoryId === cat.categoryId
                }) === i;
            });
    }

    return (
        <Grid stackable  columns={3}>
            <GridColumn width={3}/>
            <GridColumn width={10}>

                <Container text style={{marginTop: '4em'}}>
                    {!isAllPosts ?
                        <Breadcrumb id="all-posts-bread">
                            <Breadcrumb.Section><Link to='/posts' >All posts</Link></Breadcrumb.Section>
                            <Breadcrumb.Divider/>
                        </Breadcrumb> : ''}
                    <PostList posts={p}/>
                </Container>
            </GridColumn>
            <GridColumn textAlign={"left"} width={3}>
                <Container fluid text style={{marginTop: '5em'}}>

                    <Header>Categories</Header>
                    <Menu secondary vertical fluid>
                        {getNewCategories().map((cat: any) => <Menu.Item key={cat.categoryId}
                                                                         onClick={() => getByCategory(cat.categoryId)}>
                            {cat.categoryTitle}
                        </Menu.Item>)}
                    </Menu>
                    <Divider/>
                    <Header>Tags</Header>
                    <div>
                        {[...tags].sort().map(tag =>
                            <Label
                                size={'tiny'} key={tag.tagId} onClick={() => getByTag(tag.tagId)}><a
                                href={'#'}>{tag.tagTitle}</a></Label>
                        )}
                    </div>
                </Container>

            </GridColumn>
        </Grid>
    )
}

export default PostsPage;
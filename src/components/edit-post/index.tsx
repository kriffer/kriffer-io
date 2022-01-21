import React, {useEffect, useState} from "react";
import {
    Button,
    Container,
    Divider, Dropdown,
    Form, Input,
} from "semantic-ui-react";


import {PostProp} from "../post/types";
import MDEditor from '@uiw/react-md-editor';

type EditPostProp = {
    post: PostProp
}

const URL = process.env.REACT_APP_API_ENDPOINT;

const EditPost: React.FC<EditPostProp> = ({post}) => {

    const [value, setValue] = useState<any>(post.content);
    const [summary, setSummary] = useState<any>(post.summary);

    const [categories, setCategories] = useState([]);
    const [currentTagValues, setCurrentTagValues] = useState<any>([]);
    const [currentCategoryValues, setCurrentCategoryValues] = useState<any>([]);
    const [tagOptions, setTagOptions] = useState<any[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<any[]>([]);

    async function loadTags() {
        await fetch(`${URL}/api/v1/tags`)
            .then(response => response.json())
            .then((res) => {
                    const opt: any = []
                    res.map((r: any) => opt.push({'key': r.tagTitle, 'text': r.tagTitle, 'value': r.tagTitle}))
                    setTagOptions(opt)
                    loadTagsByPost(post.postId)
                    loadCategoriesByPost(post.postId)
                },
                (error) => {
                    console.error(error)
                }
            )
    }


    async function loadTagsByPost(id: number) {
        await fetch(`${URL}/api/v1/tags/post/${id}`)
            .then(response => response.json())
            .then((res) => {
                    let curTagValues: any = []
                    res.map((r: any) => curTagValues.push(r.tagTitle))
                    setCurrentTagValues(curTagValues)
                },
                (error) => {
                    console.error(error)
                }
            )
    }


    async function loadCategoriesByPost(id: number) {
        await fetch(`${URL}/api/v1/categories/post/${id}`)
            .then(response => response.json())
            .then((res) => {
                    let curCatValues: any = []
                    res.map((r: any) => curCatValues.push(r.categoryTitle))
                    setCurrentCategoryValues(curCatValues)
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
                    const opt: any = []
                    res.map((r: any) => opt.push({'key': r.categoryId, 'text': r.categoryTitle, 'value': r.categoryTitle}))

                    let catOpt = opt.filter((element: any, index: number, arr: any[]) => {
                        return arr.findIndex(function (el: any) {
                            return el.key === element.key;
                        }) === index;
                    })
                    setCategoryOptions(catOpt);
                    setCategories(res);
                },
                (error) => {
                    console.error(error)
                }
            )
    }


    useEffect(() => {
        loadTags();
        loadCategories();

    }, [post]);


    function savePost() {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                summary: summary,
                slug: summary.toLowerCase().replaceAll(' ', '-'),
                content: value,
                updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
            })
        };
        fetch(`${URL}/api/v1/posts/${post.postId}`, requestOptions)
            .then(assignTagsToPost).then(assignCategoriesToPost)
    }

    function assignTagsToPost() {
        let arr: any = []
        fetch(`${URL}/api/v1/tags`)
            .then(response => response.json()).then((res) => {


                res.map((tag: any) => arr.push(tag.tagTitle));
                let diff = currentTagValues.filter((x: any) => !arr.includes(x));
                diff.map((d: any) => createTag(d));


                res.forEach((t: any) => {

                    if (currentTagValues.includes(t.tagTitle)) {
                        const requestOptions = {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({

                                postId: post.postId,
                                tagId: t.tagId

                            })
                        };

                        return fetch(`${URL}/api/v1/tagsposts`, requestOptions)

                    } else {
                        return fetch(`${URL}/api/v1/tagsposts/post/${post.postId}/tag/${t.tagId}`, {method: 'DELETE'})
                    }

                })
            }
        )

    }

    function assignCategoriesToPost() {
        let arr: any = []
        fetch(`${URL}/api/v1/categories`)
            .then(response => response.json()).then((res) => {


                res.map((cat: any) => arr.push(cat.categoryTitle));
                let diff = currentCategoryValues.filter((x: any) => !arr.includes(x));
                diff.map((d: any) => createCategory(d));


                res.forEach((t: any) => {
                    if (currentCategoryValues.includes(t.categoryTitle)) {

                        const requestOptions = {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({

                                postId: post.postId,
                                categoryId: t.categoryId

                            })
                        };

                        return fetch(`${URL}/api/v1/categoriesposts`, requestOptions)

                    } else {
                        return fetch(`${URL}/api/v1/categoriesposts/post/${post.postId}/category/${t.categoryId}`, {method: 'DELETE'})
                    }

                })
            }
        )

    }


    function createTag(title: any) {

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({

                title: title,

            })
        };
        fetch(`${URL}/api/v1/tags`, requestOptions)
            .then(response => response.json())
            .then(data => {


                },
                (error) => {
                    console.error(error)
                });
    }

    function createCategory(title: any) {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({

                title: title,

            })
        };
        fetch(`${URL}/api/v1/categories`, requestOptions)
            .then(response => response.json())
            .then(data => {

                },
                (error) => {
                    console.error(error)
                });
    }

    function handleChange(event: any) {
        setSummary(event.target.value);
    }


    const handleTagsChange = (e: any, {value}: any) => {
        setCurrentTagValues(value);
    }

    const handleCategoryChange = (e: any, {value}: any) => {
        setCurrentCategoryValues(value);
    }


    const handleTagAddition = (e: any, {value}: any) => {
        const opt = [{key: value, text: value, value}, ...tagOptions];
        setTagOptions(opt);
    }

    const handleCategoryAddition = (e: any, {value}: any) => {
        const opt = [{text: value, value}, ...categoryOptions];
        setCategoryOptions(opt);
    }


    return (
        <Container style={{marginTop: '5em'}}>
            <Form>
                <Form.Field>
                    <label>Summary</label>
                    <Input value={post.summary} onChange={handleChange}/>
                </Form.Field>
                <Form.Field>
                    <label>Category</label>
                    <Dropdown placeholder='Categories'
                              options={categoryOptions}
                              search
                              selection
                              multiple
                              fluid
                              allowAdditions
                              value={currentCategoryValues}
                              onAddItem={handleCategoryAddition}
                              onChange={handleCategoryChange}/>
                </Form.Field>
                <Form.Group widths='equal'>
                    <Form.Field width={4}>
                        <label>Tags</label>
                        <Dropdown placeholder='Tags'
                                  options={tagOptions}
                                  search
                                  selection
                                  multiple
                                  fluid
                                  allowAdditions
                                  value={currentTagValues}
                                  onAddItem={handleTagAddition}
                                  onChange={handleTagsChange}/></Form.Field>

                </Form.Group>

            </Form>

            <MDEditor
                height={600}
                value={value}
                onChange={setValue}
            />
            {/*<MDEditor.Markdown source={value}/>*/}

            <Divider/>
            <Button secondary onClick={savePost}>Save</Button>
        </Container>


    )
}

export default EditPost;
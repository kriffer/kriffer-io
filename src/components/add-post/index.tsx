import React, {useEffect, useState} from "react";
import {
    Button,
    Container,
    Dropdown,
    Form, Input,
} from "semantic-ui-react";


import MDEditor from '@uiw/react-md-editor';


const URL = process.env.REACT_APP_API_ENDPOINT;

const AddPost: React.FC = () => {

    const [value, setValue] = useState<any>('');
    const [summary, setSummary] = useState<string>('');
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

    }, []);


    function addPost() {

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                authorId: 1,
                summary: summary,
                slug: summary.toLowerCase().replaceAll(' ', '-'),
                content: value,
                createdAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
            })
        };
        fetch('${URL}/api/v1/posts', requestOptions)
            .then(response => response.json()).then((res) => {
            assignTagsToPost(res.id);
            assignCategoriesToPost(res.id)
        })
    }

    function assignTagsToPost(postId: number) {
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

                                postId: postId,
                                tagId: t.tagId

                            })
                        };

                        return fetch(`${URL}/api/v1/tagsposts`, requestOptions)

                    }

                })
            }
        )

    }

    function assignCategoriesToPost(postId: number) {
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

                                postId: postId,
                                categoryId: t.categoryId

                            })
                        };

                        return fetch(`${URL}/api/v1/categoriesposts`, requestOptions)

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

                    console.log('created: ' + data)


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

                    console.log('created: ' + data)


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
                    <Input value={summary} onChange={handleChange}/>
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
            <MDEditor.Markdown source={value}/>
            <Button secondary onClick={addPost}>Save</Button>
        </Container>
    )
}

export default AddPost;
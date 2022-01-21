import React, {useEffect, useState} from 'react'
import {Button, Checkbox, Comment, Divider, Form, Header, Input, TextArea} from 'semantic-ui-react'
import  './comments.css'

import {CommentProp, PostProps} from "./types";


const URL = process.env.REACT_APP_API_ENDPOINT;


const Comments: React.FC<PostProps> = ({post}) => {
    // const buttonRef:any = createRef();

    const [comments, setComments] = useState<CommentProp[]>([]);
    const [commentContent, setCommentContent] = useState('');
    const [commentName, setCommentName] = useState<any>('');
    const [checked, setChecked] = useState(false);
    const [commentEmail, setCommentEmail] = useState('');
    const [repliedComment, setRepliedComment] = useState(0);
    const [reply, setReply] = useState(false);

    async function getComments() {
        await fetch(`${URL}/api/v1/comments/post/${post.postId}`)
            .then(response => response.json())
            .then((res) => {
                    setComments(res);
                },
                (error) => {
                    console.error(error)
                }
            )
    }

    useEffect(() => {
        getComments();
        setCommentName(localStorage.getItem('kriffer.io-name'))
    }, [post]);


    function addComment() {

        let requestBody: any = {

            postId: post.postId,
            name: commentName,
            email: commentEmail,
            content: commentContent,
            createdAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
        }

        if (repliedComment !== 0) {
            requestBody = {
                ...requestBody,
                parentId: repliedComment
            }
        }

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestBody)
        };


        fetch(`${URL}/api/v1/comments`, requestOptions)
            .then(response => response.json())
            .then(data => {
                getComments();
                setCommentContent('');

                setChecked(false)
            });
    }

    function handleChange(event: any) {
        setCommentContent(event.target.value);
        // buttonRef.current.focus();
    }

    function handleClick(event: any) {
        event.preventDefault();
        if (checked) {
            localStorage.setItem('kriffer.io-name', commentName)
            localStorage.setItem('kriffer.io-email', commentEmail)
        }

        const name: any = localStorage.getItem('kriffer.io-name')

        setCommentName(name)

        addComment();


    }


    function cancelReply() {
        setReply(false)
        setCommentContent('');
        setRepliedComment(0);
        setChecked(false)
        setReply(false);
    }

    function addReply() {
        addComment();
        setCommentContent('');
        setRepliedComment(0);
        setChecked(false)
        setReply(false);
    }

    function getSubcomments(id: number) {
        return comments.filter(comment => comment.parentId === id);
    }

    function renderData(comment: CommentProp, subComments: CommentProp[]) {

        return <Comment>

            <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/joe.jpg'/>
            <Comment.Content>
                <Comment.Author as='a'>{comment.name}</Comment.Author>
                <Comment.Metadata>
                    <span>{new Date(comment.createdAt).toLocaleString()}</span>
                </Comment.Metadata>
                <Comment.Text>{comment.content}</Comment.Text>
                <Comment.Actions>
                    <Comment.Action onClick={() => {
                        setReply(true);
                        setRepliedComment(comment.commentId)
                    }}> Reply </Comment.Action>
                </Comment.Actions>
            </Comment.Content>
            {reply && repliedComment === comment.commentId ? <Form reply>
                {!localStorage.getItem('kriffer.io-name') &&
                !localStorage.getItem('kriffer.io-email') ? <Form.Group widths='equal' inline>
                    <Form.Field>
                        <label>Name</label>
                        <Input fluid value={commentName} onChange={handleNameChange} required/>
                    </Form.Field>

                    <Form.Field>
                        <label>Email</label>
                        <Input fluid type="email" value={commentEmail} onChange={handleEmailChange} required/>
                    </Form.Field>
                </Form.Group> : ''}

                <Form.TextArea value={commentContent} onChange={handleChange} required/>
                {!localStorage.getItem('kriffer.io-name') &&
                !localStorage.getItem('kriffer.io-email') ? <Form.Field>
                    <Checkbox label='
Save my name, email, and website in this browser for the next time I comment'
                              onChange={toggle}
                              checked={checked}/>
                </Form.Field> : ''}
                <Button content='Reply' labelPosition='left' icon='edit' onClick={addReply} secondary/>
                <Button content='Cancel' labelPosition='left' icon='cancel' onClick={cancelReply}
                        basic/>
            </Form> : ''}
            {subComments.length > 0 ?
                <Comment.Group>
                    {subComments.map(sc => renderData(sc, getSubcomments(sc.commentId)))}
                </Comment.Group> : ''}
        </Comment>


    }


    function handleNameChange(event: any) {
        setCommentName(event.target.value);
    }

    function handleEmailChange(event: any) {
        setCommentEmail(event.target.value);
    }

    function toggle(event: any) {
        setChecked(!checked);
    }


    return (
        <Comment.Group>
            <Header as='h3' dividing>
                Comments ({comments.length})
            </Header>


            {comments.filter(c => c.parentId === null).map(comment =>
                getSubcomments(comment.commentId).length > 0 ?
                    renderData(comment, getSubcomments(comment.commentId))
                    :
                    renderData(comment, [])
            )}

            {!reply ?

                <Form reply onSubmit={handleClick}>
                    <Divider/>
                    {!localStorage.getItem('kriffer.io-name') &&
                    !localStorage.getItem('kriffer.io-email') ? <Form.Group widths='equal' inline>
                        <Form.Field>
                            <label>Name</label>
                            <Input fluid value={commentName} onChange={handleNameChange} required/>
                        </Form.Field>

                        <Form.Field>
                            <label>Email</label>
                            <Input fluid type="email" value={commentEmail} onChange={handleEmailChange} required/>
                        </Form.Field>
                    </Form.Group> : ''}
                    <Form.Field>
                        <TextArea value={commentContent} onChange={handleChange} rows={2} required/>
                    </Form.Field>
                    {!localStorage.getItem('kriffer.io-name') &&
                    !localStorage.getItem('kriffer.io-email') ? <Form.Field>
                        <Checkbox label='
Save my name, email, and website in this browser for the next time I comment'
                                  onChange={toggle}
                                  checked={checked}/>
                    </Form.Field> : ''}
                    <Button content='Add comment' labelPosition='left' icon='edit' secondary/>
                </Form> : ''}
        </Comment.Group>

    )
}

export default Comments;





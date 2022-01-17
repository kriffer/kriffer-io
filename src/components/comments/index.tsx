import React, {useEffect, useState} from 'react'
import {Button, Comment, Form, Header} from 'semantic-ui-react'


import {CommentProp, PostProps} from "./types";


const URL = process.env.REACT_APP_API_ENDPOINT;

const Comments: React.FC<PostProps> = ({post}) => {
    // const buttonRef:any = createRef();


    const [comments, setComments] = useState<CommentProp[]>([]);
    const [commentContent, setCommentContent] = useState('');

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
    }, [post]);


    function addComment() {
        let requestBody: any = {
            userId: post.authorId,
            postId: post.postId,
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
            });
    }

    function handleChange(event: any) {
        setCommentContent(event.target.value);
        // buttonRef.current.focus();
    }

    function handleClick(event: any) {
        event.preventDefault();
        addComment();
        setCommentContent('');

    }


    function cancelReply() {
        setReply(false)
        setCommentContent('');
        setRepliedComment(0);
        setReply(false);
    }

    function addReply() {
        addComment();
        setCommentContent('');
        setRepliedComment(0);
        setReply(false);
    }

    function getSubcomments(id: number) {
        return comments.filter(comment => comment.parentId === id);
    }

    function renderData(comment: CommentProp, subComments: CommentProp[]) {

        return <Comment>

            <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/joe.jpg'/>
            <Comment.Content>
                <Comment.Author as='a'>{comment.firstName} {comment.lastName}</Comment.Author>
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
                <Form.TextArea value={commentContent} onChange={handleChange} required/>
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


    return (
        <Comment.Group>
            <Header as='h3' dividing>
                Comments
            </Header>


            {comments.filter(c=> c.parentId===null).map(comment =>
                getSubcomments(comment.commentId).length > 0 ?
                    renderData(comment, getSubcomments(comment.commentId))
                    :
                    renderData(comment, [])
            )}

            {!reply ?
                <Form reply onSubmit={handleClick}>
                    <Form.TextArea value={commentContent} onChange={handleChange} required/>
                    <Button content='Add comment' labelPosition='left' icon='edit' secondary/>
                </Form> : ''}
        </Comment.Group>

    )
}

export default Comments;





import {PostProp} from "../post/types";

export type CommentProp = {
    commentId: number,
    postId: number,
    createdAt: any,
    name: string,
    email:string,
    content: string,
    parentId?: number
}


export type PostProps = {
    post: PostProp
}

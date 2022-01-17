import {PostProp} from "../post/types";

export type CommentProp = {
    commentId: number,
    postId: number,
    createdAt: any,
    firstName: string,
    lastName: string,
    content: string,
    userId: number,
    parentId?: number
}


export type PostProps = {
    post: PostProp
}

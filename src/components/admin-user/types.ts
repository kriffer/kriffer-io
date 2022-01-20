export type UserProp = {
    userId: number;
    firstName: string;
    lastName: string;
    email:string;
    created:string;
    password?: string;
    salt?: string;
    active: number;
    verificationTocken?:string
}

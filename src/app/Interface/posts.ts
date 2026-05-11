export interface Posts {
    postId: number,
    name: string,
    title: string,
    description: string,
    filePath?: string,
    status: string,
    is_deleted?: boolean,
    deleted_Reason?: string
}

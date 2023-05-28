export interface File {
    _id: string,
    title: string,
    content?: Buffer,
    createdAt: string,
    updatedAt: string,
    parentId: string,
    fileType: string,
}

export interface Folder {
    _id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    parentId: string,
}


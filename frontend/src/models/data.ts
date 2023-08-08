export interface BufferType {
    buffer:{
        data: Buffer,
        type: string,
    }
}

export interface FF {
    _id: string,
    title: string,
    fileContent: string,
    createdAt?: string,
    updatedAt?: string,
    parentId: string,
    objectType?: string,
    __type: string,
    mimeType: string
}



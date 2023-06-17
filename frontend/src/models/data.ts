export interface BufferType {
    buffer:{
        data: Buffer,
        type: String,
    }
}

export interface FF {
    _id: string,
    title: string,
    fileContent: BufferType,
    createdAt?: string,
    updatedAt?: string,
    parentId: string,
    objectType?: string,
    __type: string
}



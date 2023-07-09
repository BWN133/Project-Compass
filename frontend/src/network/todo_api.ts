import {FF as FFModel} from "../models/data";
import { ConflictError, UnauthorizedError } from "../errors/http_errors";


async function fetchDataWrapper(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        if (response.status === 401) {
            throw new UnauthorizedError(errorMessage);
        } else if (response.status === 409) {
            throw new ConflictError(errorMessage);
        } else {
            throw Error("Request failed with status: " + response.status + " message: " + errorMessage);
        }
    }
}

export interface FolderInput{
    title: string,
    fileContent?: string,
    parentId: string 
}

export async function fetchFolder(): Promise<FFModel[]> {
    const response = await fetchDataWrapper("http://localhost:5000/api/FF", { method: "GET" });
    return response.json();
}

export async function fecthFolderFromParentId(parentId: string): Promise<FFModel[]> {
    const response = await fetchDataWrapper("http://localhost:5000/api/FF/Folder/" + parentId , { method: "GET" });
    return response.json();
}

export async function fecthFileWithId(id: string): Promise<FFModel> {
    const response = await fetchDataWrapper("http://localhost:5000/api/FF/File/" + id , { method: "GET" });
    //console.log("In data api response.json look like:Te", response.json());
    return response.json();
}


export async function fecthGrandparentFolderFromParentId(parentId: string): Promise<FFModel[]> {
    const response = await fetchDataWrapper("http://localhost:5000/api/FF/FolderG/" + parentId , { method: "GET" });
    return response.json();
}

export async function deleteDataFromId(targetId: string): Promise<number>{
    console.log("In Frontend TODO Api we recieved ID for delete: ",targetId);
    const DeleteFolderBody = {objectId: targetId}
    const response = await fetchDataWrapper("http://localhost:5000/api/FF/folder",
    {
        method:"DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(DeleteFolderBody),
    });
    console.log("In Frontend TODO Api successfully delete: ",targetId);
    return response.status;
}


export async function uploadData(inputTitle: string, inputParentId: string, inputFileType: string, inputContent?: string): Promise<FFModel>{
    const inputData = {
        title: inputTitle,
        parentId: inputParentId,
    }
    let response = null;
    if(inputFileType === 'folder')
    {
        response = await fetchDataWrapper("http://localhost:5000/api/FF/" + inputFileType, 
        {method: "POST", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(inputData),
        });
    }else{
        const image = inputContent? inputContent: "None \n";
        const formData = new FormData();
        formData.append('fileContent', image); 
        formData.append('parentId', inputParentId);
        response = await fetchDataWrapper("http://localhost:5000/api/FF/" + inputFileType, 
        {method: "POST", 
        body: formData,
        });
    }
    return response.json();
}


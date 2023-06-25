import {FF as FFModel} from "../models/data";
import { ConflictError, UnauthorizedError } from "../errors/http_errors";


async function fetchDataWrapper(input: RequestInfo, init?: RequestInit) {
    console.log(input);
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
    fileContent?: Buffer,
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


export async function uploadData(inputTitle: string, inputParentId: string, inputFileType: string, inputContent?: Buffer): Promise<FFModel>{
    const inputData = {
        title: inputTitle,
        fileContent: inputContent,
        parentId: inputParentId,
    }
    const response = await fetchDataWrapper("http://localhost:5000/api/FF/" + inputFileType, 
        {method: "POST", 
        mode: "no-cors",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(inputData),
        });
        console.log(response.json());
    return response.json();
}

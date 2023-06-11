import {FF as FFModel} from "../models/data";
import { ConflictError, UnauthorizedError } from "../errors/http_errors";
async function fetchData(input: RequestInfo, init?: RequestInit) {
    console.log("input: " + input);
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


export async function fetchFolder(): Promise<FFModel[]> {
    const response = await fetchData("http://localhost:8000/api/FF", { method: "GET" });
    return response.json();
}

export async function fecthFolderFromParentId(parentId: string): Promise<FFModel[]> {
    const response = await fetchData("http://localhost:8000/api/FF/Folder/" + parentId , { method: "GET"});
    return response.json();
}

export async function fecthGrandparentFolderFromParentId(parentId: string): Promise<FFModel[]> {
    const response = await fetchData("http://localhost:8000/api/FF/FolderG/" + parentId , { method: "GET"});
    return response.json();
}



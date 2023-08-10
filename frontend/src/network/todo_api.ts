import { FF as FFModel } from "../models/data";
import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { User } from "../models/user";

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

export interface FolderInput {
    title: string,
    description?: string,
    fileContent?: string,
    parentId: string
}
export async function deleteAll(): Promise<FFModel[]> {
    const response = await fetchDataWrapper("/api/FF", { method: "DELETE" });
    return response.json();
}
export async function fetchFolder(): Promise<FFModel[]> {
    const response = await fetchDataWrapper("/api/FF", { method: "GET" });
    return response.json();
}

export async function fetchFolderByParentId(parentId: string): Promise<FFModel[]> {
    const response = await fetchDataWrapper("/api/FF/Folder/" + parentId, { method: "GET" });
    return response.json();
}

export async function fetchFileById(id: string): Promise<FFModel> {
    const response = await fetchDataWrapper("/api/FF/file/" + id, { method: "GET" });
    //console.log("In data api response.json look like:Te", response.json());
    return response.json();
}

export async function fetchGrandparentFolderFromParentId(parentId: string): Promise<FFModel[]> {
    const response = await fetchDataWrapper("/api/FF/FolderG/" + parentId, { method: "GET" });
    return response.json();
}

export async function deleteItemById(targetId: string): Promise<number> {
    console.log("In Frontend TODO Api we recieved ID for delete: ", targetId);
    const DeleteItemBody = { objectId: targetId }
    const response = await fetchDataWrapper("/api/FF/folder",
        {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(DeleteItemBody),
        });
    console.log("In Frontend TODO Api successfully delete: ", targetId);
    return response.status;
}

export async function renameItemById(targetId: string, title: string): Promise<FFModel> {
    console.log("In Frontend TODO Api we recieved ID for update: ", targetId);
    const renameItemBody = {
        objectId: targetId,
        title: title
    }
    const response = await fetchDataWrapper("/api/FF/folder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(renameItemBody),
    });
    console.log("In Frontend TODO Api successfully updated: ", targetId)
    return response.json()
}

export async function uploadItem(title: string, parentId: string, fileType: string, inputContent?: string): Promise<FFModel> {
    const inputData = {
        title: title,
        parentId: parentId,
    }
    let response = null;
    if (fileType === 'folder') {
        response = await fetchDataWrapper("/api/FF/" + fileType, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(inputData),
        });
    } else {
        const image = inputContent ? inputContent : "None \n";
        const formData = new FormData();
        formData.append('fileContent', image);
        formData.append('parentId', parentId);
        response = await fetchDataWrapper("/api/FF/" + fileType, {
            method: "POST",
            body: formData,
        });
    }
    return response.json();
}

async function createTxt(name: string, content: string, parentId: string): Promise<FFModel> {
    const encoder = new TextEncoder(); // built-in in most modern browsers and Node.js
    const uint8Array = encoder.encode(content);
    const blob = new Blob([uint8Array.buffer], { type: 'text/plain' });

    // Create a form with the file
    const form = new FormData();
    form.append('fileContent', blob, name);
    form.append('parentId', parentId);
    const response = await fetchDataWrapper("/api/FF/file", {
        method: "POST",
        body: form,
    });
    return response.json();
}

interface TaskInfo {
    name: string,
    description: string,
    challenges: string,
    resources: string,
    tools: string
}

async function createTask(taskInfo: TaskInfo, parentId: string): Promise<FFModel> {
    const { name, description } = taskInfo
    let { challenges, resources, tools } = taskInfo
    const newTask = await uploadItem(name, parentId, "folder");
    const currentId = newTask._id
    challenges = challenges !== "None" ? `Possible challenges:\n${challenges}\n` : ""
    resources = resources !== "None" ? `The following resources might be helpful:${resources}` : ""
    tools = tools !== "None" ? `Some possibly helpful tools:\n${tools}` : ""

    const overviewPromise = createTxt('Overview', `Task Description: ${description}\n\n${challenges}`, currentId)
    const arsenalPromise = createTxt('Arsenal', `${resources}\n\n${tools}`, currentId)

    await Promise.all([overviewPromise, arsenalPromise])

    return newTask;
}

export async function createProject(title: string, description: any) {
    const responsePromise = fetchDataWrapper("/api/FF/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title, description: description }),
    })
    const newProjectPromise = uploadItem(title, "6348acd2e1a47ca32e79f46f", "folder")
    const [response, newProject] = await Promise.all([responsePromise, newProjectPromise])
    const message = await response.json();
    console.log(`In Frontend TODO Api successfully requested OpenAI API with the following response message:\n${message}`)
    // return response.json();
}

export async function getLoggedInUser(): Promise<User> {
    console.log("get LoggedInUser 1");
    const response = await fetchDataWrapper("http://localhost:8888/api/users/", { method: "GET" });
    console.log("get LoggedInUser 2");
    return response.json();
}

export interface SignUpCredentials {
    username: string,
    email: string,
    password: string
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
   
    const response = await fetchDataWrapper("/api/users/signup",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
    return response.json();
}

export interface LoginCredentials {
    username: string,
    password: string,
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const response = await fetchDataWrapper("/api/users/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
    return response.json();
}

export async function logout() {
    await fetchDataWrapper("/api/users/logout", { method: "POST" });
}

import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as todoApi from "../network/todo_api";
import { FF as FFModel } from "../models/data";
import TextInputField from "./form/TextInputField";
import styles from "../style/NotesPage.module.css";
import { timeLog } from "console";

interface InputDialogProps {
    onDismiss: () => void,
    onSubmit: (inputModel: FFModel) => void,
    inputSetProgressBar?: (input: number) => void,
    mode: string,
    Id: string, // parent id or current id depending on mode
}

// another name might make more sense
export default function InputDialog({ onDismiss, onSubmit, mode, Id, inputSetProgressBar}: InputDialogProps) {
    const boxTitleDictByMode: { [mode: string]: string } = {
        "newProject": "Create Project",
        "newFolder": "Create Folder",
        "newFile": "Upload File",
        "rename": "Rename"
    }
    let defaultTitle = "";

    // to be inplemented
    /* async function setDefaultTitle() {
        if (mode === "rename") {
            const item = await todoApi.fetchItemById(Id);
            return item.title;
        }
        return "";
    }
    setDefaultTitle() */

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<todoApi.FolderInput>({
        defaultValues: {
            title: defaultTitle,
        }
    });

    async function onFormSubmit(input: todoApi.FolderInput) {
        const { title: title, description: description } = input;
        console.log("onFormSubmit title: " + title);
        console.log("onFormSubmit description: " + description);
        try {
            let resFF = null;
            if (mode === "newFolder") {
                resFF = await todoApi.uploadItem(title, Id, "folder");
            } else if (mode === "newProject" && inputSetProgressBar) {
                inputSetProgressBar(100);
                resFF = await todoApi.createProject(title, description);
            } else if (mode === "newFile") {
                if (!input.fileContent) throw console.error();
                resFF = await todoApi.uploadItem(title, Id, "file", input.fileContent[0]);
            } else {
                resFF = await todoApi.renameItemById(Id, title);
            }
            onSubmit(resFF);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const fileInputField = <TextInputField
        name="fileContent"
        label="File"
        type="file"
        placeholder="File"
        register={register}
        registerOptions={{ required: "Required" }}
        error={errors.title}
    />
    const nameInputField = 
    <TextInputField
        name="title"
        label="Title"
        type="text"
        placeholder="Title"
        register={register}
        registerOptions={{ required: "Required" }}
        error={errors.title}
    />
    const descriptionInputField = 
    <TextInputField
    // <textarea
        name="description"
        label="Description"
        type="text"
        placeholder="Please be as detailed as possible"
        register={register}
        registerOptions={{ required: "Required" }}
        error={errors.title}
        className={`${styles.inputText}`} 
        
    />

//     <textarea
//     name="description"
//     // label="Description"
//     // type="text"
//     placeholder="Please be as detailed as possible"
//     // register={register}
//     // registerOptions={{ required: "Required" }}
//     // error={errors.title}
//     className={`${styles.inputText}`} 
    
// />
    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {boxTitleDictByMode[mode]}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id="addEditNoteForm" onSubmit={handleSubmit(onFormSubmit)}>
                    {(mode === "newFile") ? fileInputField : nameInputField}
                    {/* TODO: create a new component with larger text area */}
                    {(mode === "newProject") && descriptionInputField}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type="submit"
                    form="addEditNoteForm"
                    disabled={isSubmitting}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
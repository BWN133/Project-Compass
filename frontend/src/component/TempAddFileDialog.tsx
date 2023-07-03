import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as todoApi from '../network/todo_api';
import {FF as FFModel} from '../models/data';
import TextInputField from './form/TextInputField';


interface AddEditFFDialogProps {
    FFToEdit?: FFModel,
    onDismiss: () => void,
    onFFSaved: (inputModel: FFModel) => void,
    mode: string,
    parentId: string,
}



const TempAddEditFileDialog = ({ FFToEdit, onDismiss, onFFSaved, mode, parentId}: AddEditFFDialogProps) => {

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<todoApi.FolderInput>({
        defaultValues: {
            title: FFToEdit?.title || "",
        }
    });

    async function onSubmit(input: todoApi.FolderInput) {
        try {
            if(mode === 'folder')
            {
                const responseFF = await todoApi.uploadData(input.title, parentId, 'folder');
                onFFSaved(responseFF);
            }else
            {
                console.log(input.fileContent, "Recieved file content in addeidtfiledialog in onSubmit !!!!!!!!!!!!!");
                if(!input.fileContent){
                    throw console.error();
                }
                const responseFF = await todoApi.uploadData(input.title, parentId,'file', input.fileContent[0]);
                onFFSaved(responseFF);
            }
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const fileInputField = <div> successfully </ div>
    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {FFToEdit ? "Edit note" : "Add note"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="title"
                        label="Title"
                        type="text"
                        placeholder="Title"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.title}
                    />
                    <TextInputField
                        name="fileContent"
                        label="File"
                        type="file"
                        placeholder="File"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.title}
                    />
                    {
                        mode == 'FILE' && fileInputField
                    }
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
}

export default TempAddEditFileDialog;
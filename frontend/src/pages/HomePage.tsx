import { useEffect, useState, useRef } from 'react';
import { Container, Button, Col, Row, Spinner } from 'react-bootstrap';
// import { Link, useNavigate, useRouteMatch} from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import * as dataApi from '../network/todo_api';
import styles from "../style/NotesPage.module.css";
import FFCard from '../component/FFCard';
import { FF as FFModel } from "../models/data";
import ShowImgPage from './ShowImgPage';
import {useNavigation} from '../network/Navigate';
import AddEditNoteDialog from '../component/AddEditFFDialogBox';
import TempAddEditFileDialog from '../component/TempAddFileDialog';

interface DataModelOrImage{
    FFDataModel: FFModel[],
    displayImage: boolean,
}

const HomePage = () => {
    const { navigate} = useNavigation();
    const [DataModel, setDataModel] = useState<DataModelOrImage>({
        FFDataModel: [],
        displayImage: false,
    });
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showAddFileDialog, setShowAddFileDialog] = useState(false);
    const [showDeleteFF, setShowDeleteFF] = useState(false);
    const currentParentId = useRef("6348acd2e1a47ca32e79f46f");
    const foldersAndFilesToDelete = useRef<{[FFID:string]: boolean}>({});

    useEffect(() => {
        async function loadNotes() {
            
            const currentPath = window.location.pathname;
            const segments = currentPath.split('/');
            const parentId = segments.length === 2 ? "6348acd2e1a47ca32e79f46f" : segments[segments.length - 1];
            currentParentId.current = parentId;
            foldersAndFilesToDelete.current = {};
            console.log("current segment length:", segments.length);
            try {
                if(segments.length === 2 || segments[segments.length - 2] === 'folder')
                {
                    const Folders = await dataApi.fecthFolderFromParentId(parentId);
                    
                    setDataModel({
                        FFDataModel: Folders,
                        displayImage: false,
                    });
                }else
                {
                    setDataModel({
                        FFDataModel: [],
                        displayImage: true,
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }
        loadNotes();
    }, [navigate]);

    async function onDeleteClicked(){
        let newDataModel:FFModel[] = [];
        for(let index = 0; index < DataModel.FFDataModel.length; index++){
            const currentFFDataModel = DataModel.FFDataModel[index];
            const currentId:string = currentFFDataModel._id;
            
            if(foldersAndFilesToDelete.current[currentId])
            {
                await dataApi.deleteDataFromId(currentId);
            }else
            {
                newDataModel.push(currentFFDataModel);
            }
        }
        setDataModel({
            FFDataModel: newDataModel,
            displayImage: DataModel.displayImage,
        });
        foldersAndFilesToDelete.current = {};
        setShowDeleteFF(false);
    }
    const folderGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`} style={{ marginTop: "20px" }}>
            {DataModel.FFDataModel.map(FF => (
                <Col key={FF._id}>
                    <FFCard
                        FFContent={FF}
                        onclicked={(updatedParentId: string, objectType: string) => {
                            console.log("Objecttype recieved is: ", objectType);
                            if(objectType === 'FOLDER') navigate(`/folder/${updatedParentId}`);
                            else navigate(`/imgShow/${updatedParentId}`);  
                        }}
                        showCheckMark={showDeleteFF}
                        handleCheckboxClick = {(deletefile: string, isChecked: boolean) => {
                            foldersAndFilesToDelete.current[deletefile] = isChecked;
                        }}
                        handleDownloadClick={(downloadFileId:string) => {
                            for(let index = 0; index < DataModel.FFDataModel.length; index++)
                            {
                                const currentModel = DataModel.FFDataModel[index];
                                if(currentModel._id === downloadFileId)
                                {
                                    const arrayBuffer = new Uint8Array(currentModel.fileContent.buffer.data).buffer;
                                    const mimeType = currentModel.fileContent.buffer.type;
                                    const blob = new Blob([arrayBuffer], {type: mimeType }); 
                                    const fileDownloadUrl = URL.createObjectURL(blob);
                                    let a = document.createElement('a');
                                    a.href = fileDownloadUrl;
                                    a.download = currentModel.title;
                                    a.click();
                                    break;
                                }
                            }
                        }}
                    />
                </Col>
            ))}
        </Row>
    return (
        <>
            <div>
                
               {/* <Button onClick={() => {navigate(-1);}}> Go Back </Button> */}
                {/* <Button onClick={() => {navigate(1);}}> Go Forward </Button> */}
            </div>
            <Button onClick={() => setShowAddDialog(true)}> Add Folder </Button>
            <Button onClick={() => setShowAddFileDialog(true)}> Add File </Button>
            <Button onClick={() => setShowDeleteFF(!showDeleteFF)}> SelectFile </ Button>
            <Button onClick={() => {onDeleteClicked()}}> Delete </ Button>
            {showAddDialog && <AddEditNoteDialog
            onDismiss={() => setShowAddDialog(false)}
            onFFSaved = {(newFFModel) => {
                setDataModel({
                    FFDataModel: [...DataModel.FFDataModel, newFFModel],
                    displayImage: DataModel.displayImage
                })
                setShowAddDialog(false)
            }}
            mode='FOLDER'
            parentId={currentParentId.current}
            />}
            {showAddFileDialog && <AddEditNoteDialog
            onDismiss={() => setShowAddFileDialog(false)}
            onFFSaved = {(newFFModel) => {
                setDataModel({
                    FFDataModel: [...DataModel.FFDataModel, newFFModel],
                    displayImage: DataModel.displayImage
                })
                setShowAddFileDialog(false)
            }}
            mode='FILE'
            parentId={currentParentId.current}
            />}
            {!DataModel.displayImage && DataModel.FFDataModel && folderGrid}  
            {DataModel.displayImage && <ShowImgPage/>}     
        </>);
}

export default HomePage;
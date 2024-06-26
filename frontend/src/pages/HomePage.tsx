import { useEffect, useState, useRef } from "react";
import { Container, Button, Col, Row, Spinner, Offcanvas } from "react-bootstrap";
// import { Link, useNavigate, useRouteMatch} from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import * as dataApi from "../network/todo_api";
import styles from "../style/NotesPage.module.css";
import stylesS from "../style/App.module.css";
import FFCard from "../component/FFCard";
import { FF as FFModel } from "../models/data";
import ShowImgPage from "./ShowImgPage";
import { useNavigation } from "../network/Navigate";
import InputDialog from "../component/DialogBox";
import SideNav from "../component/SideNav";
import ProgressBar from 'react-bootstrap/ProgressBar';
import * as TodoApi from "../network/todo_api";
import { User } from "../models/user";
import env from "../utils/validateEnv";

interface DataModelOrImage {
    FFDataModel: FFModel[],
    displayImage: boolean,
}
interface ButtonStates {
    delete: boolean,
    rename: boolean
}

const HomePage = () => {
    const defaultParentId = env.REACT_APP_DEFAULT_PARENT_ID
    const { navigate } = useNavigation();
    const currentParentId = useRef(defaultParentId);
    const selectedItemIds = useRef<Set<string>>(new Set());
    const [DataModel, setDataModel] = useState<DataModelOrImage>({
        FFDataModel: [],
        displayImage: false,
    });
    const [progressBarPercent, setProgressBar] = useState(0);
    const [showButtons, setShowButtons] = useState<ButtonStates>({
        delete: false,
        rename: false
    });
    const [dialogMode, setDialogMode] = useState<string | null>(null);
    const [showCheckbox, setShowCheckbox] = useState(false);

    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    useEffect(() => {
        async function fetchLoggedInUser() {
            try {
                console.log("enter homepage. ")
                const user = await TodoApi.getLoggedInUser();
                setLoggedInUser(user);
            } catch (error) {
                console.error(error);
            }
        }
        fetchLoggedInUser();
    }, []);

    useEffect(() => {
        async function loadNotes() {
            const currentPath = window.location.pathname;
            const segments = currentPath.split("/");
            const parentId = (segments.length === 2) ? defaultParentId : segments[segments.length - 1];
            currentParentId.current = parentId;
            console.log("current segment length:", segments.length);
            try {
                if (segments.length === 2 || segments[segments.length - 2] === "folder") {
                    const Folders = await dataApi.fetchFolderByParentId(parentId);

                    setDataModel({
                        FFDataModel: Folders,
                        displayImage: false,
                    });
                } else {
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

    useEffect(() => {
        console.log("current Progress bar percent!!!!!!!!!!!:", progressBarPercent)
    }, [progressBarPercent]);
    function updateShowButtons() {
        const selectionCount = selectedItemIds.current.size;
        const newShowButtons = { ...showButtons };
        newShowButtons.delete = selectionCount > 0;
        newShowButtons.rename = selectionCount === 1;
        if (JSON.stringify(newShowButtons) !== JSON.stringify(showButtons))
            setShowButtons(newShowButtons);
    }

    function handleCheckboxClick(itemId: string, isChecked: boolean) {
        if (isChecked) {
            selectedItemIds.current.add(itemId);
        } else {
            selectedItemIds.current.delete(itemId);
        }
        updateShowButtons();
    }
    function base64ToUint8Array(base64: string) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }
    function onInputDialogSubmit(newFFModel: FFModel) {
        selectedItemIds.current = new Set();
        updateShowButtons();
        let newFFDataModel = [...DataModel.FFDataModel]

        if (dialogMode === "rename") {
            for (let i = 0; i < newFFDataModel.length; i++) {
                if (newFFDataModel[i]._id === newFFModel._id) {
                    newFFDataModel[i] = newFFModel;
                    break;
                }
            }
        } else {
            newFFDataModel.push(newFFModel);
        }
        setDialogMode(null);
        setDataModel({
            FFDataModel: newFFDataModel,
            displayImage: DataModel.displayImage
        });
        setProgressBar(0);
    }

    async function onDeleteClicked() {
        /* for (let i = 0; i < selectedItemIds.length; i++) {
            const currentId: string = selectedItemIds[i];
            await dataApi.deleteItemById(currentId);
        } */
        selectedItemIds.current.forEach(async (currentId: string) => {
            await dataApi.deleteItemById(currentId);
        })
        setDataModel({
            FFDataModel: DataModel.FFDataModel.filter(
                item => !selectedItemIds.current.has(item._id)
            ),
            displayImage: DataModel.displayImage,
        });
        selectedItemIds.current = new Set();
        updateShowButtons();
        setShowCheckbox(false);
    }

    async function deleteAllClicked() {
        await dataApi.deleteAll();
    }

    async function showFile(path: String) {
        try {
            // const currentPath = window.location.pathname;
            const currentPath = path;
            const segments = currentPath.split('/');
            const fileId = segments[segments.length - 1];
            if (fileId === 'imgShow') throw new ReferenceError('fileId not Found');
            // TODO: This data can be acquired from homePage DataModel as it should already been acquired
            const file = await dataApi.fetchFileById(fileId);
            // console.log("file type: " + file.mimeType);
            // setImg(Buffer.from(file.fileContent.buffer.data).toString('base64'));
            console.log("successfully setted file");
            const mimeType = file.mimeType;
            const inputUnit8 = base64ToUint8Array(file.fileContent);
            const blob = new Blob([inputUnit8], { type: mimeType });
            const fileUrl = URL.createObjectURL(blob);
            window.open(fileUrl);
        } catch (error) {
            console.error(error);
        }
    }


    const folderGrid =
        <Row xs={1} md={1} xl={2} className={`g-4 ${styles.notesGrid} ${stylesS.ContentWrapper}`} style={{ marginTop: "20px" }}>
            {DataModel.FFDataModel.map(FF => (
                <Col key={FF._id}>
                    <FFCard
                        FFContent={FF}
                        onclicked={(updatedParentId: string, objectType: string) => {
                            console.log("Objectype recieved is: ", objectType);
                            if (objectType === "FOLDER") navigate(`/folder/${updatedParentId}`);
                            // else navigate(`/imgShow/${updatedParentId}`);
                            else {
                                const path = "/imgShow/" + updatedParentId;
                                showFile(path);
                            }
                        }}
                        showCheckBox={showCheckbox}
                        handleCheckboxClick={(itemId: string, isChecked: boolean) => {
                            handleCheckboxClick(itemId, isChecked);
                        }}
                        handleDownloadClick={(downloadFileId: string) => {
                            for (let index = 0; index < DataModel.FFDataModel.length; index++) {
                                const currentModel = DataModel.FFDataModel[index];
                                if (currentModel._id === downloadFileId) {
                                    const mimeType = currentModel.mimeType;
                                    const inputUnit8 = base64ToUint8Array(currentModel.fileContent);
                                    const blob = new Blob([inputUnit8], { type: mimeType });
                                    const fileDownloadUrl = URL.createObjectURL(blob);
                                    let a = document.createElement("a");
                                    a.href = fileDownloadUrl;
                                    a.download = currentModel.title;
                                    a.click();
                                    break;
                                }
                            }
                        }}
                        subject="CS"
                    />
                </Col>
            ))}
        </Row>
    return (
        <>
            <Row>
                <Col xs={3} className="p-0">
                    {/* This section is approximately 20% of the screen width */}
                    <div className={`${stylesS.sidebarWrapper}`}>
                        {progressBarPercent === 0 && <SideNav
                            loggedInUser={loggedInUser}
                            CreateFolderOnclicked={() => setDialogMode(
                                (currentParentId.current === defaultParentId) ?
                                    "newProject" : "newFolder"
                            )}
                            CreateFileOnclicked={() => setDialogMode("newFile")}
                            SeleteItemOnclicked={() => {
                                if (showCheckbox) {
                                    selectedItemIds.current = new Set();
                                    updateShowButtons();
                                }
                                setShowCheckbox(!showCheckbox);
                            }}
                            DeleteAllOnclicked={() => deleteAllClicked()}
                        />}
                    </div>
                </Col>
                <Col xs={9}>
                    {showButtons.delete && <Button onClick={() => onDeleteClicked()}> Delete </ Button>}
                    {showButtons.rename && <Button onClick={() => setDialogMode("rename")}> Rename </ Button>}
                    {/* This section is approximately 80% of the screen width */}
                    {dialogMode && progressBarPercent === 0 && <InputDialog
                        onDismiss={() => setDialogMode(null)}
                        onSubmit={onInputDialogSubmit}
                        mode={dialogMode}
                        // if rename, use the only selected item id
                        Id={
                            (dialogMode === "rename") ?
                                selectedItemIds.current.values().next().value :
                                currentParentId.current
                        }
                        inputSetProgressBar={(input: number) => {
                            console.log("updating current:!!!!!!!!!!", progressBarPercent);
                            setProgressBar(input);
                        }
                        }
                    />}
                    {!DataModel.displayImage && DataModel.FFDataModel && folderGrid}
                    {DataModel.displayImage && <ShowImgPage />}
                    {progressBarPercent !== 0 && <ProgressBar
                        style={{
                            width: '80%',
                            position: 'absolute',
                            left: '150px'
                        }}
                        animated now={progressBarPercent} label="We are preparing your project guide!!!" />}
                </Col>
            </Row>
        </>);
}

export default HomePage;
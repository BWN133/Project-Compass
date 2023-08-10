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
interface DataModelOrImage {
    FFDataModel: FFModel[],
    displayImage: boolean,
}
interface ButtonStates {
    delete: boolean,
    rename: boolean
}

const HomePage = () => {
    const { navigate } = useNavigation();
    const currentParentId = useRef("6348acd2e1a47ca32e79f46f");
    const selectedItemIds = useRef<Set<string>>(new Set());
    const [DataModel, setDataModel] = useState<DataModelOrImage>({
        FFDataModel: [],
        displayImage: false,
    });
    const [showButtons, setShowButtons] = useState<ButtonStates>({
        delete: false,
        rename: false
    });
    const [dialogMode, setDialogMode] = useState<string | null>(null);
    const [showCheckbox, setShowCheckbox] = useState(false);

    useEffect(() => {
        async function loadNotes() {
            const currentPath = window.location.pathname;
            const segments = currentPath.split("/");
            const parentId = (segments.length === 2) ? "6348acd2e1a47ca32e79f46f" : segments[segments.length - 1];
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
        setDialogMode(null);
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

        setDataModel({
            FFDataModel: newFFDataModel,
            displayImage: DataModel.displayImage
        });
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

    const folderGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid} ${stylesS.ContentWrapper}`} style={{ marginTop: "20px" }}>
            {DataModel.FFDataModel.map(FF => (
                <Col key={FF._id}>
                    <FFCard
                        FFContent={FF}
                        onclicked={(updatedParentId: string, objectType: string) => {
                            console.log("Objectype recieved is: ", objectType);
                            if (objectType === "FOLDER") navigate(`/folder/${updatedParentId}`);
                            else navigate(`/imgShow/${updatedParentId}`);
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
                        <SideNav
                            CreateFolderOnclicked={() => setDialogMode(
                                (currentParentId.current === "6348acd2e1a47ca32e79f46f") ?
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
                        />
                    </div>
                </Col>
                <Col xs={9}>
                    {showButtons.delete && <Button onClick={() => onDeleteClicked()}> Delete </ Button>}
                    {showButtons.rename && <Button onClick={() => setDialogMode("rename")}> Rename </ Button>}
                    {/* This section is approximately 80% of the screen width */}
                    {dialogMode && <InputDialog
                        onDismiss={() => setDialogMode(null)}
                        onSubmit={onInputDialogSubmit}
                        mode={dialogMode}
                        // if rename, use the only selected item id
                        Id={
                            (dialogMode === "rename") ?
                                selectedItemIds.current.values().next().value :
                                currentParentId.current
                        }
                    />}
                    {!DataModel.displayImage && DataModel.FFDataModel && folderGrid}
                    {DataModel.displayImage && <ShowImgPage />}
                </Col>
            </Row>
        </>);
}

export default HomePage;
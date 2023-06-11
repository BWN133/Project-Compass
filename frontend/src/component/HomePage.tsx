import { useEffect, useState } from 'react';
import { Container, Button, Col, Row, Spinner } from 'react-bootstrap';
// import { Link, useNavigate, useRouteMatch} from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import * as dataApi from '../network/todo_api';
import styles from "../style/NotesPage.module.css";
import FFCard from './FFCard';
import stylesUtil from "../style/utils.module.css";
import { Card } from "react-bootstrap";
import { FF as FFModel } from "../models/data";
// import NavBar from "../component/NavBar";
import { HashRouter, BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import TestPage1 from '../pages/TestPage1';
// import TestPage2 from '../pages/TestPage2';
import NotFoundPage from '../pages/NotFoundPage';
import TestPage2 from '../pages/TestPage2';




interface pageProps {
    inputParentId: string
}


const HomePage = ({ inputParentId }: pageProps) => {
    const [parentId, stateParentId] = useState<string>(inputParentId);
    // const [parentId, stateParentId] = useState<string>("6348acd2e1a47ca32e79f46f");
    const navigate = useNavigate();
    const [FFDataModel, setDataModel] = useState<FFModel[]>([]);
    const urlParams = new URLSearchParams(window.location.search);

    useEffect(() => {
        async function loadNotes() {
            const id = urlParams.get('id');
            console.log("id: " + id);
            console.log("inputParentId " + inputParentId);
            var newId = parentId;
            try {
                if (inputParentId === "toFolder" && id != null) {
                   newId = id
                }
                const Folders = await dataApi.fecthFolderFromParentId(newId)
                console.log("newId: " + newId);
                setDataModel(Folders);
            } catch (error) {
                console.error(error);
            }
        }
        loadNotes();
    }, []);

    console.log("break point 00");
    const folderGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
            {FFDataModel.map(FF => (
                <Col key={FF._id}>
                    <FFCard
                        FFContent={FF}
                        onclicked={(updatedParentId: string) => {
                            window.location.href = '/folder/?id=' + updatedParentId;
                            console.log("break point 01");
                        }}
                    />
                </Col>
            ))}
        </Row>

    return (
        <>
            <div>
                <Button onClick={() => navigate(-1)}> Go Back </Button>
                <Button onClick={() => navigate(1)}> Go Forward </Button>
            </div>
            {FFDataModel && folderGrid}                               

        </>);
}

export default HomePage;
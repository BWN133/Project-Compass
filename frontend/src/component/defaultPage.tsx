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


const DefaultPage = ({ inputParentId }: pageProps) => {
    //'6348acd2e1a47ca32e79f46f'
    const [parentId, stateParentId] = useState<string>(inputParentId);
    // const [parentId, stateParentId] = useState<string>("6348acd2e1a47ca32e79f46f");
    const navigate = useNavigate();
    const [FFDataModel, setDataModel] = useState<FFModel[]>([]);

    //home
    const [preParentId, savePreParentId] = useState<string>("");

    useEffect(() => {
        async function loadNotes() {
            try {
                const Folders = await dataApi.fecthFolderFromParentId(parentId)
                console.log("parentId: " + parentId);
                setDataModel(Folders);
                console.log("preParentId: " + preParentId);
            } catch (error) {
                console.error(error);
            }
        }
        loadNotes();
    }, [parentId]);

    console.log("break point 00");
    const folderGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
            {FFDataModel.map(FF => (
                <Col key={FF._id}>
                    <FFCard
                        FFContent={FF}
                        onclicked={(updatedParentId: string) => {
                            stateParentId(updatedParentId);
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
            <Link to="/page1">page1</Link>
 

           

        </>);
}

export default DefaultPage;
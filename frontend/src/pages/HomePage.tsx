import { useEffect, useState, useRef } from 'react';
import { Container, Button, Col, Row, Spinner } from 'react-bootstrap';
// import { Link, useNavigate, useRouteMatch} from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import * as dataApi from '../network/todo_api';
import styles from "../style/NotesPage.module.css";
import FFCard from '../component/FFCard';
import stylesUtil from "../style/utils.module.css";
import { Card } from "react-bootstrap";
import { FF as FFModel } from "../models/data";
// import NavBar from "../component/NavBar";
import { HashRouter, BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import TestPage1 from './TestPage1';
// import TestPage2 from '../pages/TestPage2';
import NotFoundPage from './NotFoundPage';
import TestPage2 from './TestPage2';

const HomePage = () => {
    const navigate = useNavigate();
    const [FFDataModel, setDataModel] = useState<FFModel[]>([]);
    useEffect(() => {
        async function loadNotes() {
            const currentPath = window.location.pathname;
            const segments = currentPath.split('/');
            const parentId = segments.length == 2 ? "6348acd2e1a47ca32e79f46f":  segments[segments.length - 1];
            console.log("current segment length:", segments.length);
            try {
                const Folders = await dataApi.fecthFolderFromParentId(parentId);
                console.log("We tried to give value \n");
                setDataModel(Folders);
            } catch (error) {
                console.error(error);
            }
        }
        loadNotes();
    }, [navigate]);

    console.log("break point 00");
    const folderGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
            {FFDataModel.map(FF => (
                <Col key={FF._id}>
                    <FFCard
                        FFContent={FF}
                        onclicked={(updatedParentId: string, objecType: string) => {
                            const url = `/folder/${updatedParentId}`;
                            navigate(url);
                        }}
                    />
                </Col>
            ))}
        </Row>

    return (
        <>
            <div>
                <Button onClick={() => {
                    window.location.href = '/imgShow';
                }}></Button>
                <Button onClick={() => {navigate(-1);}}> Go Back </Button>
                <Button onClick={() => {navigate(1);}}> Go Forward </Button>
            </div>
            {FFDataModel && folderGrid}                               

        </>);
}

export default HomePage;
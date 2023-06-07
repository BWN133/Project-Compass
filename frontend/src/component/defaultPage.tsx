import { useEffect, useState } from 'react';
import { Container, Button, Col, Row, Spinner} from 'react-bootstrap';
import { Link, useNavigate, useRouteMatch} from 'react-router-dom';
import * as dataApi from '../network/todo_api';
import styles from "../style/NotesPage.module.css";
import FFCard from './FFCard';
import stylesUtil from "../style/utils.module.css";
import {Card}from "react-bootstrap";
import {FF as FFModel} from "../models/data";





interface pageProps {
    inputParentId: string
}


const DefaultPage = ({inputParentId}: pageProps) => {
    //'6348acd2e1a47ca32e79f46f'
    const [parentId, stateParentId] = useState<string>(inputParentId);
    const navigate = useNavigate();
    const [FFDataModel, setDataModel] = useState<FFModel[]>([]);
    useEffect(() => {
        async function loadNotes() {
            try {
                const Folders = await dataApi.fecthFolderFromParentId(parentId);
                setDataModel(Folders);
            } catch (error) {
                console.error(error);
            }
        }
        loadNotes();
      },[parentId]);
      console.log("break point 00");
      const folderGrid =
      <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
          {FFDataModel.map(FF => (
              <Col key={FF._id}>
                  <FFCard
                  FFContent={FF}
                  onclicked = {(updatedParentId: string) => {
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
    </>);
}

export default DefaultPage;
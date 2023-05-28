import { useEffect, useState } from 'react';
import { Container, Button, Col, Row, Spinner} from 'react-bootstrap';
import * as dataApi from '../network/todo_api';
import styles from "../style/NotesPage.module.css";
import FFCard from './FFCard';
import stylesUtil from "../style/utils.module.css";
import {Card}from "react-bootstrap";
import {FF as FFModel} from "../models/data";
interface pageProps{
    parentId: string
}
const DefaultPage = ({parentId}: pageProps) => {
    const [FFData, setData] = useState<FFModel[]>([]);
    useEffect(() => {
        async function loadNotes() {
            try {
                const Folders = await dataApi.fecthFolderFromParentId(parentId);
                setData(Folders);
            } catch (error) {
                console.error(error);
            }
        }
        loadNotes();
      }, []);
      const folderGrid =
      <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
          {FFData.map(FF => (
              <Col key={FF._id}>
                  <FFCard
                  FFContent={FF}
                  />
              </Col>
          ))}
      </Row>
    
    return (    
    <>  
        {FFData && folderGrid}
    </>);
}

export default DefaultPage;
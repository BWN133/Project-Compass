import { useEffect, useState } from 'react';
import {File as FileModel, Folder as FolderModel} from './models/data';
import * as dataApi from './network/todo_api';
import { Container, Button, Col, Row, Spinner} from 'react-bootstrap';
import FFCard from './component/FFCard';
import styles from "./style/NotesPage.module.css";
import stylesUtil from "./style/utils.module.css";


function App() {
  const [data_Points, setData] = useState<FolderModel[]>([]);

  useEffect(() => {
    async function loadNotes() {
        try {
            const Folders = await dataApi.fetchFolder();
            setData(Folders);
        } catch (error) {
            console.error(error);
        }
    }
    loadNotes();
  }, []);

  const folderGrid =
  <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
      {data_Points.map(FF => (
          <Col key={FF._id}>
              <FFCard
              FFContent={FF}
              />
          </Col>
      ))}
  </Row>


  console.log(":break point 1", data_Points);
  console.log(data_Points);
  return (
    <Container>  
      {/* <div>
      {JSON.stringify(data_Points)}
      </div>  */}
      {data_Points && folderGrid
      }
    
  </Container>

  );
}

export default App;

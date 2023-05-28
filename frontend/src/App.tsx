import { useEffect, useState } from 'react';
import {File as FileModel, Folder as FolderModel} from './models/data';
import * as dataApi from './network/todo_api';
import { Container } from 'react-bootstrap';

function App() {
  const [data_Points, setData] = useState<FolderModel[]>([]);
  
  useEffect(() => {
    async function loadNotes() {
        try {
            // const Folders = await dataApi.fetchFolder();
            const FolderRes  = await fetch("http://localhost:5000/api/FF", {method: "GET"});
            console.log("break point 3");
            const Folders = await FolderRes.json();
            setData(Folders);
        } catch (error) {
            console.error(error);
        }
    }
    loadNotes();
  }, []);
  console.log(":break point 1", data_Points);
  console.log(data_Points);
  return (
    <Container>    
    <div>
      {JSON.stringify(data_Points)}
    </div> 
  </Container>

  );
}

export default App;

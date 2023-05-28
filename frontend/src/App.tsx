import { useEffect, useState } from 'react';
import {FF as FFModel} from './models/data';
import * as dataApi from './network/todo_api';
import { Container, Button, Col, Row, Spinner} from 'react-bootstrap';
import DefaultPage from './component/DefaultPage';
import styles from "./style/NotesPage.module.css";
import stylesUtil from "./style/utils.module.css";



function App() {
  const [notHome, setIsHome] = useState<number>(0);
  
  return (
  <Container>  
    <DefaultPage
    setDepth={setIsHome}
    notHome={notHome}
    />
  </Container>

  );
}

export default App;

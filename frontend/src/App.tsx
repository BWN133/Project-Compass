import { useEffect, useState } from 'react';
import {FF as FFModel} from './models/data';
import * as dataApi from './network/todo_api';
import { Container, Button, Col, Row, Spinner, Nav} from 'react-bootstrap';
import DefaultPage from './component/DefaultPage';
import NavBar from "./component/NavBar";
import styles from "./style/NotesPage.module.css";
import stylesUtil from "./style/utils.module.css";



function App() {
  const [depth, setDepth] = useState<number>(0);
  console.log(depth);
  return (
  <Container>  
    <NavBar 
    setDepth={setDepth}
    depth={depth}
    />
    <DefaultPage
    setDepth={setDepth}
    depth={depth}
    />
  </Container>

  );
}

export default App;

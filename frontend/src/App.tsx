import { useEffect, useState } from 'react';
import {FF as FFModel} from './models/data';
import * as dataApi from './network/todo_api';
import { Container, Button, Col, Row, Spinner} from 'react-bootstrap';
import DefaultPage from './component/DefaultPage';
import styles from "./style/NotesPage.module.css";
import stylesUtil from "./style/utils.module.css";



function App() {



  return (
  <Container>  
    <DefaultPage 
    parentId='6348acd2e1a47ca32e79f46f'
    />
  </Container>

  );
}

export default App;

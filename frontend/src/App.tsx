import { useEffect, useState } from 'react';
import {FF as FFModel} from './models/data';
import * as dataApi from './network/todo_api';
import { Container, Button, Col, Row, Spinner, Nav} from 'react-bootstrap';
import DefaultPage from './component/DefaultPage';
import NavBar from "./component/NavBar";
import styles from "./style/NotesPage.module.css";
import stylesUtil from "./style/utils.module.css";
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';


function App() {
  const [parentId, parentIdSetter] = useState('6348acd2e1a47ca32e79f46f');
  return (
  <BrowserRouter>  
    <NavBar 
    
    />
    <Routes>
      <Route 
        path='/'
        element={ <DefaultPage />}
      />


    </Routes>

    
  </BrowserRouter>

  );
}

export default App;

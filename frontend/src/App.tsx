import { useEffect, useState } from 'react';
import { FF as FFModel } from './models/data';
import * as dataApi from './network/todo_api';
import FFCard from './component/FFCard';
import { Container, Button, Col, Row, Spinner, Nav } from 'react-bootstrap';
import NavBar from "./component/NavBar";
import styles from "./style/NotesPage.module.css";
import stylesUtil from "./style/utils.module.css";
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import TestPage1 from './pages/TestPage1';
import NotFoundPage from './pages/NotFoundPage';
import TestPage2 from './pages/TestPage2';
import HomePage from './pages/HomePage';
import ShowImgPage from './pages/ShowImgPage';



function App() {
  console.log("HHHHHH");
  return (

    <BrowserRouter>
      <NavBar />
      <Container className={styles.pageContainer}>
        <Routes>
          <Route
            path='/page1'
            element={<TestPage1 />}
          />
          <Route
            path='/page2'
            element={<TestPage2 />}
          />
          <Route
            path='/*'
            element={<NotFoundPage />}
          />

          <Route
            path='/'
            element={<HomePage/>}
          />

          <Route
            path='/folder/*'
            element={<HomePage/>
          }
          />

          <Route
          path='/imgShow'
          element={<ShowImgPage 
            imgId= '648544595881f1dde0969306'
          />}
          >


          </Route>

        </Routes>
      </Container>


    </BrowserRouter>

  );
}

export default App;

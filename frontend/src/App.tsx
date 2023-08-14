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
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { User } from './models/user';

import SignUpModal from './component/SignUpModal';
import LoginModal from './component/Auth';
import * as TodoApi from "./network/todo_api";

function App() {
  console.log("HHHHHH");
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        console.log("11111111111");
        const user = await TodoApi.getLoggedInUser();
        
        console.log("2222222222222222");
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLoggedInUser();
  }, []);

  return (

    <BrowserRouter>

    <NavBar
        loggedInUser={loggedInUser}
        onLoginClicked={() => setShowLoginModal(true)}
        onSignUpClicked={() => setShowSignUpModal(true)}
        onLogoutSuccessful={() => {
          setLoggedInUser(null)
          window.location.href = "http://localhost:3000/";
        }

        }    
          />
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
            element={<LoginPage />}
          />

          <Route
            path='/home'
            element={<HomePage />}
          />

          <Route
            path='/signup'
            element={<SignUpPage />}
          />

          <Route
            path='/folder/*'
            element={<HomePage />
            }
          />

          <Route
            path='/imgShow/*'
            element={<ShowImgPage />}
          />

        </Routes>
      </Container>
      {/* {showSignUpModal &&
          <SignUpModal
            onSignUpSuccessful={(user) => {
              setLoggedInUser(user);
              setShowSignUpModal(false);
            }}
          />
        }
        {showLoginModal &&
          <LoginModal
            onDismiss={() => setShowLoginModal(false)}
            onLoginSuccessful={(user) => {
              setLoggedInUser(user);
              setShowLoginModal(false);
              window.location.href = "http://localhost:3000/home";
            }}
          />
        } */}
    </BrowserRouter>

  );
}

export default App;

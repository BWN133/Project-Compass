import { Container, Nav, Navbar } from "react-bootstrap";
import {IoArrowBackSharp} from "react-icons/io5";



const NavBar = () => {
    return (
        <Navbar bg="primary" variant="dark" expand="sm" sticky="top" style={{position: "fixed", width: "100%"}}>
            <Container>
                <Navbar.Brand onClick={()=>{window.location.href = "http://localhost:3000/"}}>
                    Cloud TODO
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;
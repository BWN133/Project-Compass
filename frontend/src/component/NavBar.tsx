import { Container, Nav, Navbar } from "react-bootstrap";
import {IoArrowBackSharp} from "react-icons/io5";



const NavBar = () => {
    return (
        <Navbar bg="primary" variant="dark" expand="sm" sticky="top">
            <Container>
                <Navbar.Brand>
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
import { Container, Nav, Navbar } from "react-bootstrap";
import {IoArrowBackSharp} from "react-icons/io5";

interface navBarProps{
    setDepth: (depthInput: number) => void,
    depth: number
}

const NavBar = ({setDepth, depth}: navBarProps) => {
    return (
        <Navbar bg="primary" variant="dark" expand="sm" sticky="top">
            <Container>
                {depth && <IoArrowBackSharp onClick={() => {
                    setDepth(depth - 1);
                }}/>}
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
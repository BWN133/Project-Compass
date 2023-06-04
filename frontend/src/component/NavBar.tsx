import { Container, Nav, Navbar } from "react-bootstrap";
import {IoArrowBackSharp} from "react-icons/io5";

interface navBarProps{
    parentId: string,
    parentIdSetter: (newParentId:string) => void,
}

const NavBar = ({parentId, parentIdSetter}: navBarProps) => {
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
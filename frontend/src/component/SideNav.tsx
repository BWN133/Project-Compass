import React from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import stylesU from '../style/App.module.css';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { FaGem, FaHeart } from 'react-icons/fa';
import logo from '../staticSrc/logo512.png';
import * as TodoApi from "../network/todo_api";
import { User } from "../models/user";

interface SideNavProps {
  loggedInUser: User | null,
  CreateFolderOnclicked: () => void,
  CreateFileOnclicked: () => void,
  SeleteItemOnclicked: () => void,
  DeleteAllOnclicked: () => void,
}


  

const SideNav = ({
  loggedInUser,
  CreateFolderOnclicked,
  CreateFileOnclicked,
  SeleteItemOnclicked,
  DeleteAllOnclicked }: SideNavProps) => {
  return (
    <Sidebar className={`${stylesU.sidebarWrapper}`}>
      <Menu >
        <div className={`${stylesU.userProfile}`}>
          <img src={logo} alt="User" className={`${stylesU.profilePic}`} />
          <h3>{loggedInUser?.username}</h3>
        </div>
        <MenuItem onClick={() => CreateFolderOnclicked()}> Create New</MenuItem>
        <MenuItem onClick={() => CreateFileOnclicked()}> Upload File</MenuItem>
        <MenuItem onClick={() => SeleteItemOnclicked()}> Manage Tasks</MenuItem>
        <MenuItem onClick={() => DeleteAllOnclicked()}> Clean Up Tasks</MenuItem>
      </Menu>
    </Sidebar>
  );
}

export default SideNav;
import {AiFillFolder}from "react-icons/ai";
import { useEffect, useState, useRef } from 'react';
import styleUtils from "../style/utils.module.css";
import styles from "../style/FFCard.module.css";
import {Card, Form, Button}from "react-bootstrap";
import {FF as FFModel} from "../models/data";

interface FFCardProps {
    FFContent: FFModel,
    onclicked: (ffInput: string, objectType: string) => void,
    showCheckMark: boolean,
    className?: string,
    handleCheckboxClick: (deletefile: string, isChecked: boolean) => void,
}

const FFCard = ({FFContent, onclicked,className,showCheckMark, handleCheckboxClick}:FFCardProps) => {
    const {
      _id,
      title,
      fileContent,
      createdAt,
      updatedAt,
      parentId,
      objectType,
      __type,
    } = FFContent;
    const currentCheckStatus = useRef(false);
    const strObjecType:string = objectType ? objectType: "FOLDER";
    const checkForm =  <Form>
    <Form.Check
      type="checkbox"
      label="Check me"
      onClick={(e) => {
        currentCheckStatus.current = !currentCheckStatus.current;
        handleCheckboxClick(FFContent._id, currentCheckStatus.current);
        e.stopPropagation();
      }
      }
    />
  </Form> 
   // console.log("FFCard recieved constant with data: title: ", title, " \n objectType", objectType, "fileContent: ", fileContent, "\n updated at: ", updatedAt);
    return (
    <Card
        className={`${styles.noteCard}`}
        onClick={() => onclicked(FFContent._id, strObjecType)}
        >
          <Card.Body className={styles.cardBody}>
          <AiFillFolder size={40} className={`text-muted ${styleUtils.flexCenter} `}></AiFillFolder>
          <Card.Title className={styleUtils.flexCenter}>
            {FFContent.title}
          </Card.Title>
          {showCheckMark && checkForm}
          </Card.Body>
        </Card>)
}

export default FFCard;
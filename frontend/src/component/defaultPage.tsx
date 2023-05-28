import { useEffect, useState } from 'react';
import { Container, Button, Col, Row, Spinner} from 'react-bootstrap';
import * as dataApi from '../network/todo_api';
import styles from "../style/NotesPage.module.css";
import FFCard from './FFCard';
import stylesUtil from "../style/utils.module.css";
import {Card}from "react-bootstrap";
import {FF as FFModel} from "../models/data";

interface pageProps {
    setDepth: (input:number) => void,
    depth: number,
}
export interface stateProps{
    parentId: string,
    grandParentId: string,
}

export interface FFDataProps{
    FFData: FFModel[],
    previousDepthBeforeUpdating: number,
}

const DefaultPage = ({setDepth, depth}: pageProps) => {
    console.log("page depth", depth);
    const [state, stateSetter] = useState<stateProps>({
        parentId: '6348acd2e1a47ca32e79f46f',
        grandParentId: '',
    });
    // const [parentId, parentIdSetter] = useState('6348acd2e1a47ca32e79f46f');
    // const [previousDepth, previousDepthSetter] = useState(depth);
    // const [grandParentId, grandParentIdSetter] = useState('');
    const [FFDataModel, setDataModel] = useState<FFDataProps>({
        FFData: [],
        previousDepthBeforeUpdating: depth,
    });
    console.log("before useEffect ParentId", state.parentId, "and grandparentid", state.grandParentId);
    useEffect(() => {
        async function loadNotes() {
            try {
                const inputParentId = FFDataModel.previousDepthBeforeUpdating <= depth ? state.parentId : state.grandParentId;
                console.log("page inputParentId", inputParentId, "with previousDepth",FFDataModel.previousDepthBeforeUpdating, "and current depth", depth);
                const Folders = await dataApi.fecthFolderFromParentId(inputParentId);
                setDataModel({
                    FFData: Folders,
                    previousDepthBeforeUpdating: depth,
                })
            } catch (error) {
                console.error(error);
            }
        }
        loadNotes();
      },[depth]);
      console.log("break point 00");
      const folderGrid =
      <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
          {FFDataModel.FFData.map(FF => (
              <Col key={FF._id}>
                  <FFCard
                  FFContent={FF}
                  onclicked = {(updatedParentId: string) => {
                    console.log("break point 02");
                    stateSetter({
                        grandParentId: state.parentId,
                        parentId: updatedParentId,
                    });
                    console.log("break point 01");
                    setDepth(depth + 1);
                }}
                  />
              </Col>
          ))}
      </Row>
    
    return (    
    <>  
    
        {FFDataModel.FFData && folderGrid}
    </>);
}

export default DefaultPage;
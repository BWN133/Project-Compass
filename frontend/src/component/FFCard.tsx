import {AiFillFolder}from "react-icons/ai";
import styles from "../style/Note.module.css";
import notesStyle from "../style/NotesPage.module.css";
import styleUtils from "../style/utils.module.css";
import {Card}from "react-bootstrap";
import {FF as FFModel} from "../models/data";

interface FFCardProps {
    FFContent: FFModel,
    onclicked: (ffInput: string, objectType: string) => void,
    className?: string,
}

const FFCard = ({FFContent, onclicked,className}:FFCardProps) => {
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
    const strObjecType:string = objectType ? objectType: "FOLDER";
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
          </Card.Body>
        </Card>)
}

export default FFCard;
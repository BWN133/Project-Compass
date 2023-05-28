import {AiFillFolder}from "react-icons/ai";
import styles from "../style/Note.module.css";
import notesStyle from "../style/NotesPage.module.css";
import styleUtils from "../style/utils.module.css";
import {Card}from "react-bootstrap";
import {FF as FFModel} from "../models/data";

interface FFCardProps {
    FFContent: FFModel,
    onclicked: (ffInput: string) => void,
    className?: string,
}

const FFCard = ({FFContent, onclicked,className}:FFCardProps) => {
    const {
        title,
        parentId,
        createdAt,
        updatedAt,
    } = FFContent;
    return (
    <Card
        className={`${styles.noteCard}`}
        onClick={() => onclicked(FFContent._id)}
        >
          <Card.Body className={styles.cardBody}>
          <AiFillFolder size={40} className={`text-muted ${styleUtils.flexCenter} `}></AiFillFolder>
          <Card.Title className={styleUtils.flexCenter}>
            {title}
          </Card.Title>
          </Card.Body>
        </Card>)
}

export default FFCard;
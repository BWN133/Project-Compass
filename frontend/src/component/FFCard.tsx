import { AiFillFolder } from "react-icons/ai";
import styleUtils from "../style/utils.module.css";
import styles from "../style/FFCard.module.css";
import { Card, Form, Button } from "react-bootstrap";
import { FF as FFModel } from "../models/data";
import logo from '../staticSrc/logo512.png';

interface FFCardProps {
    FFContent: FFModel,
    onclicked: (ffInput: string, objectType: string) => void,
    showCheckBox: boolean,
    className?: string,
    handleCheckboxClick: (deletefile: string, isChecked: boolean) => void,
    handleDownloadClick: (downloadFileID: string) => void,
}

const FFCard = ({
    FFContent,
    onclicked,
    className,
    showCheckBox,
    handleCheckboxClick,
    handleDownloadClick
}: FFCardProps) => {
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
    const strObjecType: string = objectType ? objectType : "FOLDER";
    const checkForm = <Form>
        <Form.Check
            type="checkbox"
            defaultChecked={false}
            onClick={(e) => {
                const target = e.target as HTMLInputElement;
                handleCheckboxClick(FFContent._id, target.checked);
                e.stopPropagation();
            }}
        />
    </Form>

    const previewButton = <Button variant="primary" onClick={(e) => {
        onclicked(FFContent._id, strObjecType);
        e.stopPropagation();

    }}>preview</Button>;
    // console.log("FFCard recieved constant with data: title: ", title, " \n objectType", objectType, "fileContent: ", fileContent, "\n updated at: ", updatedAt);
    return (
        <Card
            className={`${styles.noteCard}` }
            style={{ width: '20rem' }}
            onClick={(e) => {
                if (strObjecType === "FOLDER") {
                    onclicked(FFContent._id, strObjecType);
                    e.stopPropagation();
                } else {
                    handleDownloadClick(FFContent._id);
                    e.stopPropagation();
                }
            }}
        >
            <Card.Img variant="top" src={logo} style={{height:'70px',objectFit: 'cover'}}/>
            {/* <Card.Body className={styles.cardBody}> */}
            <Card.Body>
                <div className={styles.cardBody}>
                <AiFillFolder size={40} className={`text-muted ${styleUtils.flexCenter} `}></AiFillFolder>
                <Card.Title className={`${styleUtils.flexCenter} ${styles.cardTitle}`} >
                    {FFContent.title}
                </Card.Title>
                {showCheckBox && checkForm}
                </div>
                {/* <Button onClick={() => onclicked(FFContent._id, strObjecType)}>preview</Button> */}
                {(strObjecType !== "FOLDER") && previewButton}
            </Card.Body>
        </Card>)
}


{/* <Card style={{ width: '18rem' }}>
<Card.Img variant="top" src="holder.js/100px180" />
<Card.Body>
  <Card.Title>Card Title</Card.Title>
  <Card.Text>
    Some quick example text to build on the card title and make up the
    bulk of the card's content.
  </Card.Text>
  <Button variant="primary">Go somewhere</Button>
</Card.Body>
</Card> */}
export default FFCard;
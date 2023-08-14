import { AiFillFile, AiFillFileImage, AiFillFilePdf, AiFillFileText, AiFillFileWord, AiFillFolder, AiFillFolderOpen, AiFillGithub, AiFillGolden, AiFillProject, AiFillRobot, AiFillVideoCamera, AiOutlineFileText } from "react-icons/ai";
import styleUtils from "../style/utils.module.css";
import styles from "../style/FFCard.module.css";
import { Card, Form, Button } from "react-bootstrap";
import { FF as FFModel } from "../models/data";
import logo from '../staticSrc/logo512.png';
import hisLogo from '../staticSrc/History.jpeg';
import econLogo from '../staticSrc/economics.jpeg';
import csLogo from '../staticSrc/CS.jpeg';
interface FFCardProps {
    FFContent: FFModel,
    onclicked: (ffInput: string, objectType: string) => void,
    showCheckBox: boolean,
    className?: string,
    handleCheckboxClick: (deletefile: string, isChecked: boolean) => void,
    handleDownloadClick: (downloadFileID: string) => void,
    subject?: string
}

const FFCard = ({
    FFContent,
    onclicked,
    className,
    showCheckBox,
    handleCheckboxClick,
    handleDownloadClick,
    subject
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
    const checkForm = <div>

        <Form >
            <Form.Check
                style={{
                    position: 'absolute',
                    left: '445px',
                    backgroundColor: 'blue'
                }}
                type="checkbox"
                defaultChecked={false}
                onClick={(e) => {
                    const target = e.target as HTMLInputElement;
                    handleCheckboxClick(FFContent._id, target.checked);
                    e.stopPropagation();
                }}
            />
        </Form>
    </div>
    
    const previewButton = <Button
        style={{ float: 'right' }}
        variant="primary"
        onClick={(e) => {
            onclicked(FFContent._id, strObjecType);
            e.stopPropagation();

        }}>preview</Button>;
    let cardImg = logo;
    if (subject === "ECON") {
        cardImg = econLogo;
    }
    if (subject === "HIS") {
        cardImg = hisLogo;
    }
    if (subject === "CS") {
        cardImg = csLogo;
    }
    const description = <Card.Text>
        Some quick example text to build on the card title and make up the
        bulk of the card's content.
    </Card.Text>
    let newTitle;
    if (FFContent.title.length >= 20) {
        newTitle = FFContent.title.substring(0, 20) + "...";
    } else {
        newTitle = FFContent.title;
    }
    console.log("file type: " + FFContent.mimeType);
    console.log("FFCard parentId: " + parentId);
    let fileType;
    if (FFContent.mimeType === "image/jpeg" || FFContent.mimeType === "image/png") {
        fileType = "image";
    } else if (FFContent.mimeType === "text/plain") {
        fileType = "text";
    } else if (FFContent.mimeType === "application/pdf") {
        fileType = "pdf";
    } else if (FFContent.mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        fileType = "word";
    } else if (FFContent.mimeType === "video/mp4") {
        fileType = "video"
    }
    else {
        fileType = "file";
    }
    // console.log("FFCard recieved constant with data: title: ", title, " \n objectType", objectType, "fileContent: ", fileContent, "\n updated at: ", updatedAt);
    return (
        <Card
            className={`${styles.noteCard}`}
            style={{ width: '30rem' }}
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
            <Card.Img variant="top" src={cardImg} style={{ height: '70px', objectFit: 'cover' }} />
            {/* <Card.Body className={styles.cardBody}> */}
            <Card.Body>
                <div className={styles.cardBody}>
                    {parentId === "6348acd2e1a47ca32e79f46f" && <AiFillRobot size={40} className={`text-muted ${styleUtils.flexCenter} `}></AiFillRobot>}
                    {parentId !== "6348acd2e1a47ca32e79f46f" && fileType === "pdf" && <AiFillFilePdf size={40} className={`text-muted ${styleUtils.flexCenter} `}></AiFillFilePdf>}
                    {parentId !== "6348acd2e1a47ca32e79f46f" && fileType === "text" && < AiFillFileText size={40} className={`text-muted ${styleUtils.flexCenter} `}></ AiFillFileText>}
                    {parentId !== "6348acd2e1a47ca32e79f46f" && fileType === "image" && <AiFillFileImage size={40} className={`text-muted ${styleUtils.flexCenter} `}></AiFillFileImage>}
                    {parentId !== "6348acd2e1a47ca32e79f46f" && fileType === "video" && <AiFillVideoCamera size={40} className={`text-muted ${styleUtils.flexCenter} `}></AiFillVideoCamera>}
                    {parentId !== "6348acd2e1a47ca32e79f46f" && fileType === "word" && <AiFillFileWord size={40} className={`text-muted ${styleUtils.flexCenter} `}></AiFillFileWord>}
                    {parentId !== "6348acd2e1a47ca32e79f46f" && fileType === "file" && <AiFillFile size={40} className={`text-muted ${styleUtils.flexCenter} `}></AiFillFile>}
                    <Card.Title className={`${styleUtils.flexCenter} ${styles.cardTitle}`} >
                        {newTitle}
                    </Card.Title>
                    {showCheckBox && checkForm}
                    {(strObjecType !== "FOLDER") &&
                        <div style={{
                            position: 'absolute', right: '40px',

                        }}>
                            <Button
                                variant="primary"
                                onClick={(e) => {
                                    onclicked(FFContent._id, strObjecType);
                                    e.stopPropagation();
                                }}>preview</Button></div>
                    }
                </div>
                {(strObjecType === "FOLDER") && description}
                {/* <Button onClick={() => onclicked(FFContent._id, strObjecType)}>preview</Button> */}

            </Card.Body>
        </Card>)
}


export default FFCard;
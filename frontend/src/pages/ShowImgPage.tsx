import * as dataApi from '../network/todo_api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Button, Col, Row, Spinner } from 'react-bootstrap';
import styles from '../style/FFCard.module.css';
import { exit } from 'process';
import { Buffer } from 'buffer';
import { useNavigation } from '../network/Navigate';


const ShowImgPage = () => {
    const [image, setImg] = useState<string>();
    useEffect(() => {
        async function loadFile() {
            try {
                const currentPath = window.location.pathname;
                const segments = currentPath.split('/');
                const imgId = segments[segments.length - 1];
                if (imgId === 'imgShow') throw new ReferenceError('imgId not Found');
                // TODO: This data can be acquired from homePage DataModel as it should already been acquired
                const file = await dataApi.fetchFileById(imgId);
                setImg(Buffer.from(file.fileContent.buffer.data).toString('base64'));
                console.log("successfully setted image");
            } catch (error) {
                console.error(error);
            }
        }
        loadFile();
    }, []);
    return (
        <div>
            {image && <img className={`${styles.img_display} ${styles.boarder_img}`} src={`data:image/jpeg;base64,${image}`} />}
            {/* {imageElem.} */}
        </div>
    );
}

export default ShowImgPage;
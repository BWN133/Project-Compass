import * as dataApi from '../network/todo_api';
import { useEffect, useState } from 'react';
import { exit } from 'process';
import {Buffer} from 'buffer';
interface imgShowProps{
    imgId: string
}

const ShowImgPage = ({imgId}: imgShowProps) => 
{
    const [image, setImg] = useState<string>();
    console.log("current Image ID: ", imgId);
    useEffect(() => {
        async function loadFile() {
            try {
                const file = await dataApi.fecthFileWithId(imgId);
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
            {image && <img src={`data:image/jpeg;base64,${image}`}/>}
            {/* {imageElem.} */}
        </div>
    );
}

export default ShowImgPage;
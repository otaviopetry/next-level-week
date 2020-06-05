import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
    onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {


    const [selectedFileUrl, setSelectedFileUrl] = useState('');    

    const onDrop = useCallback(acceptedFiles => {

        const file = acceptedFiles[0];

        const fileUrl = URL.createObjectURL(file);

        setSelectedFileUrl(fileUrl);
        onFileUploaded(file);

    }, [onFileUploaded])
    const {getRootProps, getInputProps} = useDropzone({
      onDrop,
      accept: 'image/*'
    })

    return (

        <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} accept="image/*" />

            {
                selectedFileUrl
                    ?  <img src={selectedFileUrl} alt="Imagem selecionada" />
                    : (
                        <div className="container">
                            <FiUpload className="icon" />
                            <p>            
                                Arraste uma imagem para o negócio aqui <br />ou clique para procurar <span role="img" aria-label="Emoji com monóculo"> 🧐 </span>
                            </p>
                        </div>
                    )
            }

        </div>
    )
}

export default Dropzone;
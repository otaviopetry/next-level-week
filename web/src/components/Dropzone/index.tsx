import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

import './styles.css';

const Dropzone = () => {
  const onDrop = useCallback(acceptedFiles => {
    console.log(acceptedFiles);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Imagem</p> :
          <p>Arraste a imagem do negócio aqui 🧐</p>
      }
    </div>
  )
}

export default Dropzone;
import React from 'react'
import Dropzone from 'react-dropzone'
import XLSX from 'xlsx'

function ExcelDropzone (props) {
  const { label } = props

  function handleFile (acceptedFiles) {
    const file = acceptedFiles[0]
    const reader = new window.FileReader()
    reader.onload = function (e) {
      const data = e.target.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      props.onSheetDrop(XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]))
    }
    reader.readAsBinaryString(file)
    // console.log('file', file)
  }
  
  return (
    <div className="podium-right">
      <h1>3</h1>
      <Dropzone
        multiple={ false }
        onDrop={ handleFile }
        className="drop-zone-custom-style"
      >
        <p className="excel-dropzone__label">{ label }</p>
      </Dropzone>
    </div>
  )
}

export default ExcelDropzone

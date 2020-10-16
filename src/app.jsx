import React, { useContext } from 'react'
// import { MTRow, MTColumn } from 'mt-ui'
import ExcelDropzone from './excel-dropzone.jsx'

import { Context } from './Context'

import RankingList from './components/RankingList/RankingList'
import IndividualUserScoreList from './components/IndividualUserScoreList/IndividualUserScoreList'
import RankingForm from './components/RankingForm/RankingForm'
import Stars from './components/Stars/Stars'
import Title from './components/Title/Title.js'

export default function Main() {
  const { setParsedDataArr } = useContext(Context)

  const handleSheetData = (data) => {
    //saved the data in parsedDataArr
    setParsedDataArr(data)
  }

  return (
    <div className="root-grid">
          <Stars/>
          <Title/>
          <div className="app-content-column-1">
            <ExcelDropzone
              onSheetDrop={handleSheetData}
              label="Drop your file here"
            />
            <RankingList/>
          </div>
          <div className="app-content-column-2">
            <RankingForm/>
            <IndividualUserScoreList/>
          </div>
    </div>
  )
  
}

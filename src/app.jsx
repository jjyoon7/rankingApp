import React, { useContext } from 'react'
// import { MTRow, MTColumn } from 'mt-ui'
import ExcelDropzone from './excel-dropzone.jsx'

import { Context } from './Context'

import RankingList from './components/RankingList/RankingList'
import IndividualUserScoreList from './components/IndividualUserScoreList/IndividualUserScoreList'
import RankingForm from './components/RankingForm/RankingForm'

export default function Main() {
  const { setParsedDataArr } = useContext(Context)

  const handleSheetData = (data) => {
    //saved the data in parsedDataArr
    setParsedDataArr(data)
  }

  return (
    <div className="root-grid">
          <div className="app-title-div">
            <h3 className="app-title">The Ranking App</h3>
          </div>
          <ExcelDropzone
            onSheetDrop={handleSheetData}
            label="Drop your file here"
          />
          <div className="podium-center">
            <RankingList/>
            {/* <IndividualUserScoreList/> */}
          </div>
          <RankingForm/>   
    </div>
  )
  
}

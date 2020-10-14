import React, { useContext } from 'react'
import { MTRow, MTColumn } from 'mt-ui'
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
        <div id="space">
          <div className="stars"></div>
          <div className="stars"></div>
          <div className="stars"></div>
          <div className="stars"></div>
        </div>
          <div className="app-title-div">
            <h1 className="app-title title-ran">Ran-</h1>
            <h1 className="app-title title-king">King<i className="ri-vip-crown-line"></i></h1>
            <h1 className="app-title title-app">App</h1>
          </div>
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

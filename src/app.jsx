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
            <h3 className="app-title">The podium</h3>
          </div>
          <div className="column-left-input">
            <ExcelDropzone
              onSheetDrop={handleSheetData}
              label="Drop your file here"
            />
            <RankingForm/>   
          </div>
          <div className="podium">
              <div className="podium-div-style podium-left">
                <h1 className='number-typeface'>2</h1>
              </div>
              <div className="podium-div-style podium-center">
                <h1 className='number-typeface'>1</h1>
              </div>
              <div className="podium-div-style podium-right">
                <h1 className='number-typeface'>3</h1>
              </div>
          </div>
          <div className="column-right-list">
            <RankingList/>
            <IndividualUserScoreList/>
          </div>
    </div>
  )
  
}

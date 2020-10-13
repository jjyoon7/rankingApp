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
    // console.log('data from sheet',data)
  }

  return (
    <div className="container container--centered">
      <MTRow>
        <MTColumn offset={ 20 } width={ 60 }>
          <h1 className="m-t">Ranking app</h1>
        </MTColumn>
      </MTRow>
      <MTRow>
        <MTColumn offset={ 20 } width={ 60 }>
          <div className="user-input-area">
            <ExcelDropzone
              onSheetDrop={handleSheetData}
              label="Drop your file here"
              className="file-drop-area"
            />
            <h2 className="or-text">or</h2>
            <RankingForm/>
          </div>
        </MTColumn>
      </MTRow>
      <MTRow>
        <MTColumn offset={ 20 } width={ 60 } className="list-area">
          <div className="list-area">
            <IndividualUserScoreList/>
            <RankingList/>
          </div>
        </MTColumn>
      </MTRow>
    </div>
  )
  
}

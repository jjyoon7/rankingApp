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
      <h1 className="m-t">Ranking app</h1>
      <MTRow>
        <MTColumn width={ 50 }>
          <ExcelDropzone
            onSheetDrop={handleSheetData}
            label="Drop your file here"
          />
        </MTColumn>
        <MTColumn width={ 50 } offset={ 5 }>
          <RankingForm/>
        </MTColumn>
      </MTRow>
      <MTRow>
        <MTColumn>
        <RankingList/>
        </MTColumn>
        <MTColumn>
          <IndividualUserScoreList/>
        </MTColumn>
      </MTRow>
    </div>
  )
  
}

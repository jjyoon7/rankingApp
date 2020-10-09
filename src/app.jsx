import React, { useState, useContext, useEffect } from 'react'
import { MTRow, MTColumn } from 'mt-ui'
import ExcelDropzone from './excel-dropzone.jsx'

import { Context } from './Context'

import RankingList from './components/RankingList/RankingList'
import UserScoreList from './components/UserScoreList/UserScoreList'
import UserInputForm from './components/UserInputForm/UserInputForm'

export default function Main() {
  const { setParsedDataArr } = useContext(Context)

  const handleSheetData = (data) => {
    setParsedDataArr(data)
    // replace this log with actual handling of the data
    console.log(data)
  }

  return (
    <div className="container container--centered">
      <h1 className="m-t">Ranking app</h1>
      <MTRow>
        <MTColumn width={ 20 }>
          <ExcelDropzone
            onSheetDrop={handleSheetData}
            label="Drop your file here"
          />
        </MTColumn>
        <MTColumn width={ 75 } offset={ 5 }>
          <RankingList/>
        </MTColumn>
        <MTColumn>
          <UserInputForm/>
        </MTColumn>
      </MTRow>
      <MTRow>
        <UserScoreList/>
      </MTRow>
    </div>
  )
  
}

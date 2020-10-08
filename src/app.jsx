import React, { } from 'react'
import { MTRow, MTColumn } from 'mt-ui'
import ExcelDropzone from './excel-dropzone.jsx'

import { Switch, Route } from 'react-router-dom'

import RankingList from './components/RankingList/RankingList'

export default class Main extends React.Component {
  handleSheetData (data) {
    // replace this log with actual handling of the data
    console.log(data)
  }

  render () {
    return (
      <div className="container container--centered">
        <h1 className="m-t">Ranking app</h1>
        <MTRow>
          <MTColumn width={ 20 }>
            <ExcelDropzone
              onSheetDrop={ this.handleSheetData }
              label="Drop your file here"
            />
          </MTColumn>
          <MTColumn width={ 75 } offset={ 5 }>
            <RankingList/>
          </MTColumn>
        </MTRow>
      </div>
    )
  }
}

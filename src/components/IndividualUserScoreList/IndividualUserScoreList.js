import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../Context'

export default function IndividualUserScoreList() {
    const { usersArr, 
            userScoreArr, 
            userName } = useContext(Context)

    const [ IndividualUserScoreList, setIndividualUserScoreList ] = useState(null)
    const hasIndividualSocre = userScoreArr.length > 0
    const hasUserName  = userName !== ''

    useEffect(() => {
        const mappedScoreList = userScoreArr.map(score => {
            return <li key={score} className='score-li'>
                        {score}
                  </li>
        })
        
        setIndividualUserScoreList(mappedScoreList)
    }, [ userScoreArr, usersArr ])

    return (
        <div className='user-score-list-div'>
            {hasUserName ? <h2>{userName}</h2> : ''}
            <ul className='user-score-list-ul'>
                {hasIndividualSocre ? IndividualUserScoreList : 
                                      <h2>Click on user name to check individual score list</h2>
                }
            </ul>
        </div>
    )
}

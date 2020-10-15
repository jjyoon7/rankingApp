import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../Context'

import './IndividualUserScoreList.css'

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
        <div className='user-score-list-div podium-center-individual-list div-border-style'>
            {hasUserName ? <h2 className="user-score-list-h2">{userName}</h2> : 
                           <h3 className="user-score-list-h3">Click on user name to check user's individual score list</h3>
            }
            <ul className='user-score-list-ul'>
                {hasIndividualSocre ? IndividualUserScoreList : ''}                  
            </ul>
        </div>
    )
}

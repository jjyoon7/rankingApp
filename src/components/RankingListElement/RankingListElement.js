import React, { useContext } from 'react'
import { Context } from '../../Context'

import './RankingListElement.css'

export default function RankingListElement({ id, name, score }) {
    const { usersArr, 
            setUserScoreArr, 
            setUserName } = useContext(Context)

    const onClickUserName = () => {
        const scoresArrayWithMatchingId = usersArr.find(({_id}) => _id === id)
        const scoreArrayOfSelectedUser = scoresArrayWithMatchingId.scoreArray
        setUserScoreArr(scoreArrayOfSelectedUser) 
        setUserName(name)
    }

    return (
        <li className='user-li'>
            <h4 className='user-name-h3' onClick={onClickUserName}>{name}</h4>
            <h4 className="user-score-h3">{score}</h4>
        </li>
    )
}
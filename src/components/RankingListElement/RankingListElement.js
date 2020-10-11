import React, { useContext } from 'react'
import { Context } from '../../Context'
import './RankingListElement.css'

export default function RankingListElement({ id, name, score }) {
    const { usersArr, setUserScoreArr } = useContext(Context)

    const onClickUserName = () => {
        const scoresArrayWithMatchingId = usersArr.find(({_id}) => _id === id)
        const scoreArrayOfSelectedUser = scoresArrayWithMatchingId.scoreArray
        setUserScoreArr(scoreArrayOfSelectedUser) 
    }

    return (
        <li className='user-li'>
            <h2 className='user-name-h2' onClick={onClickUserName}>{name}</h2>
            <h2>{score}</h2>
        </li>
    )
}
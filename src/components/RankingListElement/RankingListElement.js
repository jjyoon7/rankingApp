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
            <h2 className='user-name-h2' onClick={onClickUserName}>{name}</h2>
            <h2>{score}</h2>
        </li>
    )
}
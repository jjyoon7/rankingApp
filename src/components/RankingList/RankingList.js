import React, { useState, useContext, useEffect } from 'react'
import { Context } from '../../Context'
import RankingListElement from '../RankingListElement/RankingListElement'

import './RankingList.css'

export default function RankingList() {
    const { usersArr } = useContext(Context)
    const [ rankingList, setRankingList ] = useState(null)

    useEffect(() => {
        console.log('render ranking list')
        const mappedUsersList = usersArr.map(user => {
            console.log('user', user)
            return <RankingListElement key={user._id} id={user._id} name={user.name} score={user.scoreArray[0]}/>
        })

        setRankingList(mappedUsersList)
    }, [ usersArr ])

    return (
        <div className='ranking-list'>
            <ul className='ranking-list-ul'>
                {rankingList}
            </ul>
        </div>
    )
}
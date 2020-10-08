import React, { useContext, useEffect } from 'react'
import { Context } from '../../Context'
import RankingElement from '../RankingElement/RankingElement'

export default function RankingList() {
    const { usersArr } = useContext(Context)

    useEffect(() => {

    }, [])

    return (
        <div className='ranking-list'>
            <ul className='ranking-list-ul'>
                list
            </ul>
        </div>
    )
}
import React from 'react'
import './RankingElement.css'

export default function RankingElement({ id, name, score }) {
    return (
        <li className='user-li'>
            <h2>{name}</h2>
            <h2>{score}</h2>
        </li>
    )
}
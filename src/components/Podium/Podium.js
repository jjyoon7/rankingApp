import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../Context'

import './Podium.css'

export default function Podium() {
    const { usersArr } = useContext(Context)
    const [ firstPlace, setFirstPlace ] = useState('')
    const [ secondPlace, setSecondPlace ] = useState('')
    const [ thirdPlace, setThirdPlace ] = useState('')
    const hasUsers = usersArr.length > 0
    useEffect(() => {
        if(hasUsers) {
            setFirstPlace(usersArr[0].name)
            setSecondPlace(usersArr[1].name)
            setThirdPlace(usersArr[2].name)
        }
    }, [ usersArr ])

    return  (
        <div className="podium">
            <h2 className="podium-left podium-name">{secondPlace}</h2>
            <div className="podium-div-style podium-left">
              <h1 className='number-typeface'>2</h1>
            </div>

            <div className="podium-center podium-name podium-medal"><i className="ri-medal-line podium-medal"></i></div>
            <h2 className="podium-center podium-name">{firstPlace}</h2>
            <div className="podium-div-style podium-center">
              <h1 className='number-typeface'>1</h1>
            </div>

            <h2 className="podium-right podium-name">{thirdPlace}</h2>
            <div className="podium-div-style podium-right">
              <h1 className='number-typeface'>3</h1>
            </div>
        </div>
    )
}
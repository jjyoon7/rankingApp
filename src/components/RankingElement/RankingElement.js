import React, { useState, useContext } from 'react'
import { Context } from '../../Context'
import './RankingElement.css'

export default function RankingElement({ id, name, score }) {
    const { usersArr, toggleModal, setUserScoreArr } = useContext(Context)

    const getSelectedUsersScoreArray = (id) => {

        let chosenUsersScoreArry = []

        //array is filtered, this filtered array is not being used.
        //maybe there is a better way to do this?
        const chosenUser = usersArr.filter(user => {
            if(user._id === id) {
                //to access the values inside of user object
                const userValues = Object.values(user)

                //userValues[2] because 3rd element in user object is the score array.
                chosenUsersScoreArry = userValues[2]
            }
        })
        return chosenUsersScoreArry
    }

    const onClickUserName = () => {
        // console.log('click on user', id)
        const userScores = getSelectedUsersScoreArray(id)
        setUserScoreArr(userScores)
        console.log('userScores', userScores)

    }

    return (
        <li className='user-li'>
            <h2 className='user-name-h2' onClick={onClickUserName}>{name}</h2>
            <h2>{score}</h2>
        </li>
    )
}
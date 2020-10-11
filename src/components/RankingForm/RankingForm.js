import React, { useState, useContext } from 'react'
import { Context } from '../../Context'

export default function RankingForm() {
    const { usersArr, updateUserScoreArray, addNewUser, objectKeyAlreadyExists } = useContext(Context)
    const [ userName, setUserName ] = useState('')
    const [ userScore, setUserScore ] = useState('')

    //enter a name and a score. If the user name does not already exist, that name should be added to the list of users. If the user does exist, 
    //the score should be added to them and the ranking list updated if needed.
    const onSubmitRankingForm = (e) => {
        e.preventDefault()

        // objectKeyAlreadyExists(data.name, usersArr, 'name')
        const userAlreadyExists = objectKeyAlreadyExists(userName, usersArr, 'name')
        console.log('userAlreadyExists', userAlreadyExists)
        if(userAlreadyExists) {
            updateUserScoreArray(userName, userScore, 'number')

        } else if(!userAlreadyExists) {
            addNewUser(userName, userScore)   
        }

        setUserName('')
        setUserScore ('')
    }

    const onChangeName = (e) => setUserName(e.target.value)
    const onChangeScore = (e) => {
        // console.log(typeof e.target.value, 'typeof e.target.value')
        const parsedIntValue = parseInt(e.target.value)
        setUserScore(parsedIntValue)
    }

    return (
        <div className=''>
            <form className='' onSubmit={onSubmitRankingForm}>
                <label htmlFor='name'>Name</label>
                <input id='name' type='text' value={userName} onChange={onChangeName}/>

                <label htmlFor='score'>Score</label>
                <input id='score' type='text' value={userScore} onChange={onChangeScore}/>
                
                <input type="submit" value="Add"/>
            </form>
        </div>
    )
}
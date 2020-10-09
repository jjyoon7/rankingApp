import React, { useState, useContext } from 'react'
import { Context } from '../../Context'

export default function UserInputForm() {
    const { userAlreadyExists, updateUserScoreArray, addNewUser } = useContext(Context)
    const [ userName, setUserName ] = useState('')
    const [ userScore, setUserScore ] = useState(0)

    //enter a name and a score. If the user name does not already exist, that name should be added to the list of users. If the user does exist, 
    //the score should be added to them and the ranking list updated if needed.
    const onSubmitUserInputForm = (e) => {
        e.preventDefault()

        if(userAlreadyExists(userName)) {
            updateUserScoreArray(userName, userScore)

        } else if(!userAlreadyExists(userName)) {
            addNewUser(userName, userScore)   
        }

    }

    const onChangeName = (e) => setUserName(e.target.value)
    const onChangeScore = (e) => {
        // console.log(typeof e.target.value, 'typeof e.target.value')
        const parsedIntValue = parseInt(e.target.value)
        setUserScore(parsedIntValue)
    }

    return (
        <div className=''>
            <form className='' onSubmit={onSubmitUserInputForm}>
                <label htmlFor='name'>
                    <input id='name' type='text' value={userName} onChange={onChangeName}/>
                </label>
                <label htmlFor='score'>
                    <input id='score' type='text' onChange={onChangeScore}/>
                </label>
                <input type="submit" value="Add"/>
            </form>
        </div>
    )
}
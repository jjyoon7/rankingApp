import React, { useState, useContext } from 'react'
import { Context } from '../../Context'

export default function RankingForm() {
    const { usersArr, 
            setUsersArr, 
            updateScoreArray, 
            sortArrDescending, 
            createNewUserObjWithScore, 
            objectKeyAlreadyExists } = useContext(Context)

    const [ name, setName ] = useState('')
    const [ score, setScore ] = useState('')

    //enter a name and a score. If the user name does not already exist, that name should be added to the list of users. If the user does exist, 
    //the score should be added to them and the ranking list updated if needed.
    const onSubmitRankingForm = (e) => {
        e.preventDefault()

        const userAlreadyExists = objectKeyAlreadyExists(name, usersArr, 'name')
        
        if(userAlreadyExists) {
            const updatedArrayWithObjWithNewScore = updateScoreArray(name, score, usersArr, 'name')

            sortArrDescending(updatedArrayWithObjWithNewScore)
            setUsersArr(updatedArrayWithObjWithNewScore)

        } else if(!userAlreadyExists) {
            const clonedUsersArr = [...usersArr]
            const newUserObj = createNewUserObjWithScore(name, score)

            clonedUsersArr.push(newUserObj)

            const newlyAddedUsers = sortArrDescending(clonedUsersArr)
            setUsersArr(newlyAddedUsers)
        }

        setName('')
        setScore ('')
    }

    const onChangeName = (e) => setName(e.target.value)
    const onChangeScore = (e) => {
        //parseInt is throwing an NaN error, prevent the issue, return userScore
        setScore(parseInt(e.target.value) || score)
    }

    return (
        <div className='ranking-form-div'>
            <form className='ranking-form' onSubmit={onSubmitRankingForm}>
                <div>
                    <label htmlFor='name'>Name</label>
                    <input id='name' type='text' value={name} onChange={onChangeName}/>
                </div>

                <div>
                    <label htmlFor='score'>Score</label>
                    <input id='score' type='text' value={score} onChange={onChangeScore}/>
                </div>

                <input type="submit" value="Add"/>
            </form>
        </div>
    )
}
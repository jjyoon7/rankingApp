import React, { useState, useContext } from 'react'
import { Context } from '../../Context'

export default function RankingForm() {
    const { usersArr, 
            setUsersArr, 
            updateScoreArray, 
            sortArrDescending, 
            createNewUserObjWithScore, 
            objectKeyAlreadyExists } = useContext(Context)

    const [ userName, setUserName ] = useState('')
    const [ userScore, setUserScore ] = useState('')

    //enter a name and a score. If the user name does not already exist, that name should be added to the list of users. If the user does exist, 
    //the score should be added to them and the ranking list updated if needed.
    const onSubmitRankingForm = (e) => {
        e.preventDefault()

        const userAlreadyExists = objectKeyAlreadyExists(userName, usersArr, 'name')
        
        if(userAlreadyExists) {
            const updatedArrayWithObjWithNewScore = updateScoreArray(userName, userScore, usersArr, 'name')
            console.log('updatedArrayWithObjWithNewScore in form', updatedArrayWithObjWithNewScore)
            sortArrDescending(updatedArrayWithObjWithNewScore)
            setUsersArr(updatedArrayWithObjWithNewScore)

        } else if(!userAlreadyExists) {
            const clonedUsersArr = [...usersArr]
            const newUserObj = createNewUserObjWithScore(userName, userScore)

            clonedUsersArr.push(newUserObj)

            const newlyAddedUsers = sortArrDescending(clonedUsersArr)
            setUsersArr(newlyAddedUsers)
        }

        setUserName('')
        setUserScore ('')
    }

    const onChangeName = (e) => setUserName(e.target.value)
    const onChangeScore = (e) => {
        //parseInt is throwing an NaN error, prevent the issue, return userScore
        setUserScore(parseInt(e.target.value) || userScore)
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
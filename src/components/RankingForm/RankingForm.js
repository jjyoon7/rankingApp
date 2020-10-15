import React, { useState, useContext } from 'react'
import { Context } from '../../Context'

import './RankingForm.css'

export default function RankingForm() {
    const { usersArr, 
            setUsersArr, 
            updateScoreArray, 
            sortArrDescending, 
            createNewUserObj, 
            objectKeyAlreadyExists } = useContext(Context)

    const [ name, setName ] = useState('')
    const [ score, setScore ] = useState('')
    const [ error, setError ] = useState('')

    //enter a name and a score. If the user name does not already exist, that name should be added to the list of users. If the user does exist, 
    //the score should be added to them and the ranking list updated if needed.
    const onSubmitRankingForm = (e) => {
        e.preventDefault()
        const hasNoUserInput = !name || !score
        if(hasNoUserInput) {
            setError('Cannot submit empty')
        } else {
            const userAlreadyExists = objectKeyAlreadyExists(name, usersArr, 'name')
        
            if(userAlreadyExists) {
                const updatedArrayWithObjWithNewScore = updateScoreArray(name, score, usersArr, 'name')
    
                sortArrDescending(updatedArrayWithObjWithNewScore)
                setUsersArr(updatedArrayWithObjWithNewScore)
    
            } else if(!userAlreadyExists) {
                const clonedUsersArr = [...usersArr]
                const newUserObj = createNewUserObj(name, score)
    
                clonedUsersArr.push(newUserObj)
    
                const newlyAddedUsers = sortArrDescending(clonedUsersArr)
                setUsersArr(newlyAddedUsers)
            }
            setError('')
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
        <div className="ranking-form-div">
           <form className="ranking-form" onSubmit={onSubmitRankingForm}>
                <label htmlFor="name">Name</label>
                <input className="ranking-form-input" id="name" type="text" value={name} onChange={onChangeName}/>

                <label htmlFor="score">Score</label>
                <input className="ranking-form-input" id="score" type="text" value={score} onChange={onChangeScore}/>

                <input className="ranking-form-button" type="submit" value="Add"/>
                <p className="form-sumbit-error-p">{error}</p>
            </form>
        </div>
    )
}
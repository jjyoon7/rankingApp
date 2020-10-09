import React, { useState, useContext, useEffect } from 'react'
import { Context } from '../../Context'
import users from '../../users'

export default function UserInputForm() {
    const { usersArr, setUsersArr } = useContext(Context)
    const [ userName, setUserName ] = useState('')
    const [ userScore, setUserScore ] = useState(0)
    const [ userObj, setUserObj ] = useState({})

    //enter a name and a score. If the user name does not already exist, that name should be added to the list of users. If the user does exist, 
    //the score should be added to them and the ranking list updated if needed.
    const onSubmitUserInputForm = (e) => {
        e.preventDefault()

        const updatedUsersArr = usersArr.map(user => {
            if(user.name === userName) {
                console.log('user.scoreArray',user.scoreArray)
                return user.scoreArray.push(userScore)
            } else {
                console.log('userScore',userScore)
                const newUserObj = {
                    _id: '',
                    name: userName,
                    scoreArray: [...userScore]
                }
                return usersArr.push(newUserObj)
            }
        })
        setUsersArr(updatedUsersArr)
        console.log('updatedUsersArr',updatedUsersArr)
    }

    const onChangeName = (e) => setUserName(e.target.value)
    const onChangeScore = (e) => {
        // console.log(typeof e.target.value, 'typeof e.target.value')
        const parsedIntValue = parseInt(e.target.value)
        setUserScore(parsedIntValue)
    }

    useEffect(() => {
        console.log('userName', userName)
        console.log('userScore', userScore)
    }, [ userName, userScore ])

    return (
        <div className=''>
            <form className='' onSubmit={onSubmitUserInputForm}>
                <label htmlFor='name'>
                    <input id='name' type='text' value={userName} onChange={onChangeName}/>
                </label>
                <label htmlFor='score'>
                    <input id='score' type='text' value={userScore} onChange={onChangeScore}/>
                </label>
                <input type="submit" value="Add"/>
            </form>
        </div>
    )
}
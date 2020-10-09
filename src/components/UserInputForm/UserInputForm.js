import React, { useState, useContext, useEffect } from 'react'
import { Context } from '../../Context'
import users from '../../users'

export default function UserInputForm() {
    const { usersArr, setUsersArr, sortArrDescending } = useContext(Context)
    const [ userName, setUserName ] = useState('')
    const [ userScore, setUserScore ] = useState(0)
    const [ userObj, setUserObj ] = useState({})

    const userAlreadyExists = usersArr.some(user => {
        return user.name === userName
    })

    //enter a name and a score. If the user name does not already exist, that name should be added to the list of users. If the user does exist, 
    //the score should be added to them and the ranking list updated if needed.
    const onSubmitUserInputForm = (e) => {
        e.preventDefault()
        console.log('userAlreadyExists',userAlreadyExists)
        if(userAlreadyExists) {
            //but this will render as usersArr.length
            //thus else statement where creating new userObj will run
            const updatedUsersArr = usersArr.map(user => {
                    if(user.name === userName) {
                        user.scoreArray.push(userScore)
                        //order the list
                        return user
                        // sortArrDescending(updatedUserArr)
                    } else return user
            })

            setUsersArr(updatedUsersArr)

            console.log('updatedUsersArr',updatedUsersArr)
        } else if(!userAlreadyExists) {
                // console.log('userScore', userScore)
                const newUserObj = {
                    _id: usersArr.length + 1,
                    name: userName,
                    scoreArray: [userScore]
                }
                return usersArr.push(newUserObj)
            
        }
    }

    const onChangeName = (e) => setUserName(e.target.value)
    const onChangeScore = (e) => {
        // console.log(typeof e.target.value, 'typeof e.target.value')
        const parsedIntValue = parseInt(e.target.value)
        setUserScore(parsedIntValue)
    }

    // useEffect(() => {
    //     console.log('userName', userName)
    //     console.log('userScore', userScore)
    // }, [ userName, userScore ])

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
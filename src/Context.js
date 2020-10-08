import React, { useState, useEffect } from 'react'
import users from './users'
import scores from './scores'
const Context = React.createContext()


function ContextProvider(props) {
    const [ usersArr, setUsersArr ] = useState([])
    const [ scoresArr, setScoresArr ] = useState([])
    const [ parsedDataArr, setParsedDataArr ] = useState([])

    const hasUsers = users.length > 0
    const hasScores = scores.length > 0

    //sort array
    const sortArrDescending = array => array.sort((prevValue, currentValue) => {
        // console.log('prev', prevValue)
        // console.log('currentValue', currentValue)

        //if the array which contains user objecst,
        //needs to be sorted, based on user's highest score
        if(prevValue.scoreArray !== undefined) {
            return currentValue.scoreArray[0] - prevValue.scoreArray[0]
        }
        return currentValue - prevValue
    })

    //add score to the user
    const addScoreToUser = (scoreArray, usersArray) => {
        const userWithScoreArray = usersArray.map(user => {
            user.scoreArray = []
            for (var i = 0; i < scoreArray.length; i++) {
                if(scoreArray[i].userId === user._id) {
                    user.scoreArray.push(scoreArray[i].score)
                }
            }
            //sort the score array of user in descending order
            const array = user.scoreArray
            sortArrDescending(array)
            return user
        })
        return userWithScoreArray
    }

    //when app is first initially loaded
    //save users and scores in state
    useEffect(() => {
        if(hasUsers && hasScores) {
            const userWithScores = addScoreToUser(scores, users)
            const sortedUsers = sortArrDescending(userWithScores)
            setUsersArr(sortedUsers)
        } else {
            //show error
        }
    }, [])

    //to check if usersArr is updated with correct order
    useEffect(() => {
        console.log('usersArr', usersArr)
    }, [ usersArr ])


    return (
        <Context.Provider value={{
                                    usersArr,
                                    setUsersArr,
                                    scoresArr, 
                                    setScoresArr,
                                    parsedDataArr,
                                    setParsedDataArr,
                                    sortArrDescending,
        }}>
            {props.children}
        </Context.Provider>
    )
}

export { Context, ContextProvider }
import React, { useState, useEffect } from 'react'
import users from './users'
import scores from './scores'
const Context = React.createContext()


function ContextProvider(props) {
    //users array
    const [ usersArr, setUsersArr ] = useState([])

    //individual user's score array
    const [ userScoreArr, setUserScoreArr] = useState([])

    const [ parsedDataArr, setParsedDataArr ] = useState([])

    const hasUsers = users.length > 0
    const hasScores = scores.length > 0

    const userAlreadyExists = (userName) => usersArr.some(user => {
        return user.name.toLowerCase() === userName.toLowerCase()
    })

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
            //sort the scores in score array of user 
            //in descending order
            const array = user.scoreArray
            sortArrDescending(array)
            return user
        })
        return userWithScoreArray
    }

    const updateUserScoreArray = (name, score) => {
        const updatedUsersArr = usersArr.map(user => {
            if(user.name.toLowerCase() === name.toLowerCase()) {
                        user.scoreArray.push(score)

                        //order the list by highest score
                        sortArrDescending(user.scoreArray)
                        return user
                    } else return user
            })
        
            const orderedUpdatedList = sortArrDescending(updatedUsersArr)
            setUsersArr(orderedUpdatedList)
    }

    const addNewUser = (userName, userScore) => {
        const clonedUsersArr = [...usersArr]

        const newUserObj = {
            _id: usersArr.length + 1,
            name: userName,
            scoreArray: [userScore]
        }

        console.log('newUserObj',newUserObj)

        clonedUsersArr.push(newUserObj)
        
        //order the list by highest score
        sortArrDescending(clonedUsersArr)
        setUsersArr(clonedUsersArr)    
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

    //if user sheet data been saved to arr, 
    useEffect(() => {
        parsedDataArr.map(user => {
            console.log('user from parsedDataArr', user)
        })
    //check if there is a user exists in usersArr
    
    //if not, just add it as a new user


    // replace this log with actual handling of the data
    }, [ parsedDataArr ])


    return (
        <Context.Provider value={{
                                    usersArr,
                                    setUsersArr,
                                    userScoreArr,
                                    setUserScoreArr,
                                    parsedDataArr,
                                    setParsedDataArr,
                                    sortArrDescending,
                                    userAlreadyExists,
                                    updateUserScoreArray,
                                    addNewUser,

        }}>
            {props.children}
        </Context.Provider>
    )
}

export { Context, ContextProvider }
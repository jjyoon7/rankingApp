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
    const addScoreArrayToUsersArray = (scoreArray, usersArray) => {
        const userWithScoreArray = usersArray.map(user => {
            user.scoreArray = []

            const scoreArrayKey = Object.keys(scoreArray[0])[0]
            
            // console.log('Object.keys(scoreArray[0])', Object.keys(scoreArray[0])[0])
            // if(scoreArray)
            if(scoreArrayKey === 'userId') {
                for (var i = 0; i < scoreArray.length; i++) {
                    if(scoreArray[i].userId === user._id) {
                        user.scoreArray.push(scoreArray[i].score)
                    }
                }
            }

            if(scoreArrayKey === 'name') {
                for (var i = 0; i < scoreArray.length; i++) {
                    console.log('scoreArray[i].name === user.name', scoreArray[i].name === user.name)
                    if(scoreArray[i].name === user.name) {
                        user.scoreArray.push(scoreArray[i].score)
                    } else {
                        addNewUser(scoreArray[i].name, scoreArray[i].score)
                    }
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
        // return usersArr
    }

    const addNewUser = (userName, userScore) => {
        const clonedUsersArr = [...usersArr]
        // const usersArrWithNewUsers = usersArr.map(user => {
        //     if(!user.name.toLowerCase() === userName.toLowerCase()) {
        //         const newUserObj = {
        //             _id: usersArr.length + 1,
        //             name: userName,
        //             scoreArray: [userScore]
        //         }

        //         clonedUsersArr.push(newUserObj)
        //         sortArrDescending(clonedUsersArr)
        //         return user
        //     } else return user
        // })

        // setUsersArr(usersArrWithNewUsers)

        const newUserObj = {
            _id: usersArr.length + 1,
            name: userName,
            scoreArray: [userScore]
        }

        clonedUsersArr.push(newUserObj)
        
        const orderedArray = sortArrDescending(clonedUsersArr)
        setUsersArr(orderedArray)
   
    }

    //when app is first initially loaded
    //save users and scores in state
    useEffect(() => {
        if(hasUsers && hasScores) {
            const userWithScores = addScoreArrayToUsersArray(scores, users)
            const sortedUsers = sortArrDescending(userWithScores)
            setUsersArr(sortedUsers)
        } else {
            //show error
        }
    }, [])

    //to check if usersArr is updated with correct order
    useEffect(() => {
        console.log('usersArr updated', usersArr)
    }, [ usersArr ])

    const parsedScoreToUser = (parsedArray, usersArray) => {
        const userWithScoreArray = usersArray.map(user => {
            // user.scoreArray = []
            console.log('parsedArray.length',parsedArray.length)
            for (var i = 0; i < parsedArray.length; i++) {
                if(parsedArray[i].name === user.name) {
                    user.scoreArray.push(parsedArray[i].score)
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

    //if user sheet data been saved to arr 
    useEffect(() => {
        // const userWithParsedScores = addScoreArrayToUsersArray(parsedDataArr, usersArr)


        // const sortedUsersWithParsedScores = sortArrDescending(userWithParsedScores)
        // console.log('sortedUsersWithParsedScores', sortedUsersWithParsedScores)
        // setUsersArr(sortedUsersWithParsedScores)
        
        
        
        // const updateVer = parsedScoreToUser(parsedDataArr, usersArr)
        // console.log('parsedDataArr.length',parsedDataArr.length)
        const updatedUserArrWithParsedData = parsedDataArr.map(data => {
            // console.log('user from parsedDataArr', user)
            if(userAlreadyExists(data.name)) {
                // console.log('user exists')
                updateUserScoreArray(data.name, data.score)
                // return data
            } else if(!userAlreadyExists(data.name)) {
                // console.log('user dont exists')
                addNewUser(data.name, data.score)
                // console.log('result', result)
                // return data
            }
            // return data
        })
        console.log('updatedUserArrWithParsedData', updatedUserArrWithParsedData)
        // setUsersArr(updateData)
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
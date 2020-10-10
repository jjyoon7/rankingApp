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
    const hasParsedFromSheetSucceeded = parsedDataArr.length > 0

    const userAlreadyExists = (userName) => usersArr.some(user => {
        return user.name.toLowerCase() === userName.toLowerCase()
    })

    //sort array
    const sortArrDescending = array => array.sort((prevValue, currentValue) => {
        //if the array which contains user objecst,
        //needs to be sorted, based on user's highest score
        if(prevValue.scoreArray !== undefined) {
            return currentValue.scoreArray[0] - prevValue.scoreArray[0]
        }
        //if it is comparing between scores in the user's scoreArray
        return currentValue - prevValue
    })

    //add score to the user
    const addInitialScoresToInitialUsers = (scoreArray, usersArray) => {
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
        // return usersArr
    }

    const addNewUser = (userName, userScore) => {

        const clonedUsersArr = [...usersArr]

        const newUserObj = {
            _id: usersArr.length + 1,
            name: userName,
            scoreArray: [userScore]
        }

        clonedUsersArr.push(newUserObj)

        const newlyAddedUsers = sortArrDescending(clonedUsersArr)
        setUsersArr(newlyAddedUsers)
        // return user
    }

    //when app is first initially loaded
    //save users and scores in state
    useEffect(() => {
        if(hasUsers && hasScores) {
            //prepare the scores and users before setting the usersArray
            const initialUsersArr = users
            const initialScoresArr = scores

            const usersWithScores = addInitialScoresToInitialUsers(initialScoresArr, initialUsersArr)
            const sortedUsers = sortArrDescending(usersWithScores)

            // console.log('sortedUsers', sortedUsers)
            setUsersArr(sortedUsers)
        } else {
            //show error
        }
    }, [])

    //to check if usersArr is updated with correct order
    useEffect(() => {
        console.log('usersArr updated', usersArr)
    }, [ usersArr ])

    //if user sheet data been saved to arr 
    useEffect(() => {
        if(hasParsedFromSheetSucceeded) {
            // const parsedDataNamesArr = parsedDataArr.map(data => data.name)
            
            // const nameReduced = parsedDataNamesArr.reduce((acc, cur) => {
            //     // console.log('acc',acc)
            //     const nameAlreadyExists = acc.includes(cur)
            //     console.log('nameAlreadyExists', nameAlreadyExists)
            //     if (nameAlreadyExists) {
            //         return acc
            //     } else if (!nameAlreadyExists) {
            //         acc.push(cur)
            //         return acc
            //     }
            // }, [])

            //1. reduce the parsed data, if the name exists, add the score to that name
            //other wise create a new user object and save that to the base array
            const dataReduced = parsedDataArr.reduce((acc, cur) => {

                const nameAlreadyExists = (userName) => acc.some(data => {
                    console.log('data', data.name)
                    return data.name.toLowerCase() === userName.toLowerCase()
                })
                
                if (nameAlreadyExists(cur.name)) {
                    // console.log('name exists')

                    //userObject.score is single score
                    //at one point, need to create an empty array and store it there
                    const updatedArrayWithNewScore = acc.map(userObject => {
                        console.log('userObject', userObject)
                        if(userObject.name === cur.name) {
                            userObject.scoreArray.push(cur.score)
                            sortArrDescending(userObject.scoreArray)
                            return userObject
                        } else return userObject
                    })

                    console.log('updatedArrayWithNewScore', updatedArrayWithNewScore)
                    return updatedArrayWithNewScore

                } else if (!nameAlreadyExists(cur.name)) {
                    // console.log('///name does not exists')
                    cur.scoreArray = []
                    cur.scoreArray.push(cur.score)
                    delete cur.score
                    console.log('cur when user does not exists', cur)
                    // cur.pop(cur.score)
                    acc.push(cur)
                    return acc
                }
            }, [])

            console.log('dataReduced', dataReduced)

            // const nameAlreadyExists = usersArr.includes(nameReduced)

            //2. after parsed data is reduced,
            //compare that reducedParsedArry with usersArr
            //if the name exists, add the parsedArr's socres to user's scoreArray
            //otherwise add as new user object with its scores.

            //loop over each data
            //and either add to existing user's scoreArray
            //or create a new user object.
            //but this will have an issue
            // const updatedUserArrWithParsedData = parsedDataArr.map(data => {
            //     // console.log('user from parsedDataArr', user)
            //     if(userAlreadyExists(data.name)) {
            //         // console.log('user exists')
            //         updateUserScoreArray(data.name, data.score)
            //         // return data
            //     } else if(!userAlreadyExists(data.name)) {
            //         // console.log('user dont exists')
            //         addNewUser(data.name, data.score)
            //         // return data
            //     }
            //     //what to return here?
            //     //return usersArr
            // })
            // console.log('updatedUserArrWithParsedData', updatedUserArrWithParsedData)
            // setUsersArr(updateData)
        } else {
            //show parse error
        }
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
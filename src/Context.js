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

    const userAlreadyExists = (userName, arrayToCompare) => arrayToCompare.some(element => {
        return element.name.toLowerCase() === userName.toLowerCase()
    })

    const objectKeyAlreadyExists = (keyInput, arrayToCompare, compareValueType) => arrayToCompare.some(element => {
        if(compareValueType === 'name') return element.name.toLowerCase() === keyInput.toLowerCase()
        else if(compareValueType === 'userId') return element.userId === keyInput.userId
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
    //maybe this could be done same as how parsedData array is sorted.
    //1. sort the scoreArray and reduce to 3 objects with scoreArray
    //2. then add those array to matching user
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

    // const updateUserScoreArray = (name, score) => {
    //     const updatedUsersArr = usersArr.map(user => {
    //         if(user.name.toLowerCase() === name.toLowerCase()) {
    //             user.scoreArray.push(score)

    //             //order the list by highest score
    //             sortArrDescending(user.scoreArray)
    //             return user
    //         } else return user
    //     })
        
    //     const orderedUpdatedList = sortArrDescending(updatedUsersArr)
    //     setUsersArr(orderedUpdatedList)
    //     // return usersArr
    // }

    const updateUserScoreArray = (name, score, scoreType) => {        
        const updatedUsersArr = usersArr.map(user => {
            if(user.name.toLowerCase() === name.toLowerCase()) {
                
                if(scoreType === 'array') user.scoreArray.push(...score)

                if(scoreType === 'number') user.scoreArray.push(score)

                //order the list by highest score
                sortArrDescending(user.scoreArray)
                return user
            } else return user
        })
        
        sortArrDescending(updatedUsersArr)
        return updatedUsersArr
        // setUsersArr(orderedUpdatedList)
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

            const reducedScoresArr = initialScoresArr.reduce((acc, cur) => {

                const hasId = acc.some(accObject => accObject.userId === cur.userId)
                if(hasId) {
                    const updatedArrayWithNewScore = acc.map(scoreObject => {
                        if(scoreObject.userId === cur.userId) {
                            scoreObject.scoreArray.push(cur.score)
                            sortArrDescending(scoreObject.scoreArray)
                            return scoreObject
                        } else return scoreObject
                    })
                    return updatedArrayWithNewScore

                } else if(!hasId) {
                    cur.scoreArray = []
                    cur.scoreArray.push(cur.score)
                    delete cur.score
                    acc.push(cur)
                    return acc
                }
            }, [])

            console.log('reducedScoresArr', reducedScoresArr)

            const initialUsersArrWithInitialScores = reducedScoresArr.map(scoreObj => {
                console.log('scoreObj',scoreObj)
                if(userAlreadyExists(scoreObj.userId, usersArr)) {
                    const initialUsersWithInitialScores = initialUsersArr.map(user => {
                        if(user._id === scoreObj.userId) {
                            user.scoreArray.push(...scoreObj.score)
                            sortArrDescending(user.scoreArray)
                            return user
                        }
                    })
                    return initialUsersWithInitialScores
                } else if(!userAlreadyExists(scoreObj.userId, usersArr)) {
                    addNewUser(scoreObj.userId, scoreObj.scoreArray)
                    return scoreObj
                }
            })

            console.log('initialUsersArrWithInitialScores', initialUsersArrWithInitialScores)
            // console.log('sortedUsers', sortedUsers)
            // setUsersArr(sortedUsers)
        } else {
            //show error
        }
    }, [])

    //to check if usersArr is updated with correct order
    // useEffect(() => {
    //     console.log('usersArr updated', usersArr)
    // }, [ usersArr ])

    // const reduceDuplicatedValuesInArr = (arrayInput) => arrayInput.reduce((acc, cur) => {                
    //     if (userAlreadyExists(cur.userId, acc)) {
    //         const updatedArrayWithNewScore = acc.map(userObject => {
    //             // console.log('userObject', userObject)
    //             if(userObject.na === cur.name) {
    //                 userObject.scoreArray.push(cur.score)
    //                 sortArrDescending(userObject.scoreArray)
    //                 return userObject
    //             } else return userObject
    //         })

    //         // console.log('updatedArrayWithNewScore', updatedArrayWithNewScore)
    //         return updatedArrayWithNewScore

    //     } else if (!userAlreadyExists(cur.name, acc)) {
    //         //userObject.score is single score
    //         //at one point, need to create an empty array and store it there
    //         cur.scoreArray = []
    //         cur.scoreArray.push(cur.score)
    //         delete cur.score
    //         // console.log('cur when user does not exists', cur)
    //         // cur.pop(cur.score)
    //         acc.push(cur)
    //         return acc
    //     }
    // }, [])

    //if user sheet data been saved to arr 
    useEffect(() => {
        if(hasParsedFromSheetSucceeded) {
            //1. reduce the parsed data, if the name exists, add the score to that name
            //other wise create a new user object and save that to the base array
            const reducedParsedDataArr = parsedDataArr.reduce((acc, cur) => {                
                if (userAlreadyExists(cur.name, acc)) {
                    const updatedArrayWithNewScore = acc.map(userObject => {
                        // console.log('userObject', userObject)
                        if(userObject.name === cur.name) {
                            userObject.scoreArray.push(cur.score)
                            sortArrDescending(userObject.scoreArray)
                            return userObject
                        } else return userObject
                    })

                    // console.log('updatedArrayWithNewScore', updatedArrayWithNewScore)
                    return updatedArrayWithNewScore

                } else if (!userAlreadyExists(cur.name, acc)) {
                    //userObject.score is single score
                    //at one point, need to create an empty array and store it there
                    cur.scoreArray = []
                    cur.scoreArray.push(cur.score)
                    delete cur.score
                    // console.log('cur when user does not exists', cur)
                    // cur.pop(cur.score)
                    acc.push(cur)
                    return acc
                }
            }, [])

            // console.log('reducedParsedDataArr', reducedParsedDataArr)

            //2. after parsed data is reduced,
            //compare that reducedParsedArry with usersArr
            //if the name exists, add the parsedArr's socres to user's scoreArray
            //otherwise add as new user object with its scores.

            const updatedUserArrWithParsedData = reducedParsedDataArr.map(data => {
                // console.log('data from parsedDataArr', data)
                if(userAlreadyExists(data.name, usersArr)) {

                    const usersArrWithNewScores = updateUserScoreArray(data.name, data.scoreArray, 'array')
                    // const usersArrUpdateWithParsedScores = usersArr.map(user => {
                    //     //this is similar to 'updateUserScoreArray', maybe update 'updateUserScoreArray' so it could be used here as well
                    //     if(user.name === data.name) {
                    //         //maybe need to check if there is a duplicate score?
                    //         // console.log('after pushing to user array before', user.scoreArray)
                    //         user.scoreArray.push(...data.scoreArray)
                    //         sortArrDescending(user.scoreArray)
                    //         // console.log('after pushing to user array after and sorting', user.scoreArray)
                    //         return user
                    //     } else return user
                    // })

                    // return usersArrUpdateWithParsedScores
                    return usersArrWithNewScores

                } else if(!userAlreadyExists(data.name, usersArr)) {
                    // console.log('user dont exists')
                    addNewUser(data.name, data.score)
                    return data
                }
                //what to return here?
                //return usersArr
            })
            // const orderedUsersArr = sortArrDescending(updatedUserArrWithParsedData)
            console.log('updatedUserArrWithParsedData', updatedUserArrWithParsedData)
            // setUsersArr(orderedUsersArr)
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
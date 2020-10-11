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

    //check if given keyInput already exists in arrayToCompare. 
    //'compareValueType' is added, so it could be used for both
    //comparing using 'name' and 'userId'
    const objectKeyAlreadyExists = (keyInput, arrayToCompare, compareValueType) => arrayToCompare.some(element => {
        // console.log('compareValueType',compareValueType)
        // console.log('keyInput',keyInput)
        // console.log()
        if(compareValueType === 'name') return element.name.toLowerCase() === keyInput.toLowerCase()
        else if(compareValueType === 'userId') return element.userId === keyInput
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

            //reduce the scores, according to its userId
            const reducedScoresArr = initialScoresArr.reduce((acc, cur) => {

                const doesIdAlreadyExists = objectKeyAlreadyExists(cur.userId, acc, 'userId')

                if(doesIdAlreadyExists) {
                    const updatedArrayWithNewScore = acc.map(scoreObject => {
                        if(scoreObject.userId === cur.userId) {
                            scoreObject.scoreArray.push(cur.score)
                            sortArrDescending(scoreObject.scoreArray)
                            return scoreObject
                        } else return scoreObject
                    })

                    return updatedArrayWithNewScore

                } else if(!doesIdAlreadyExists) {
                    cur.scoreArray = []
                    cur.scoreArray.push(cur.score)
                    delete cur.score
                    acc.push(cur)
                    return acc
                }
            }, [])

            const initialScoresAddedToInitialUsers = initialUsersArr.map(userObj => {

                //check if user with given id exists in reducedScoresArr
                const doesUserIdExists = objectKeyAlreadyExists(userObj._id, reducedScoresArr, 'userId')

                if(doesUserIdExists) {
                    //if there is a matching id,
                    //create an scoreArray and store the scores 
                    //and return the user.
                    const scoresArrayWithMatchingId = reducedScoresArr.find(({userId}) => userId === userObj._id)
                    userObj.scoreArray = []
                    userObj.scoreArray.push(...scoresArrayWithMatchingId.scoreArray)
                    return userObj
                } else return userObj
            })

            const orderedInitialUsers = sortArrDescending(initialScoresAddedToInitialUsers)
            // console.log('orderedInitialUsers', orderedInitialUsers)
            setUsersArr(orderedInitialUsers)

        } else {
            //show error
        }
    }, [])

    //to check if usersArr is updated with correct order
    // useEffect(() => {
    //     console.log('usersArr updated', usersArr)
    // }, [ usersArr ])

    //if user sheet data been saved to arr 
    useEffect(() => {
        if(hasParsedFromSheetSucceeded) {
            //1. reduce the parsed data, if the name exists, add the score to that name
            //other wise create a new user object and save that to the base array
            const reducedParsedDataArr = parsedDataArr.reduce((acc, cur) => {  

                const doesUserAlreadyExits = objectKeyAlreadyExists(cur.name, acc, 'name')   
                // console.log('doesUserAlreadyExits', doesUserAlreadyExits)
                
                if (doesUserAlreadyExits) {
                    
                    const updatedArrayWithNewScore = acc.map(scoreObject => {
                        // console.log('userObject', userObject)
                        if(scoreObject.name === cur.name) {
                            scoreObject.scoreArray.push(cur.score)
                            sortArrDescending(scoreObject.scoreArray)
                            return scoreObject
                        } else return scoreObject
                    })

                    // console.log('updatedArrayWithNewScore', updatedArrayWithNewScore)
                    return updatedArrayWithNewScore

                } else if (!doesUserAlreadyExits) {
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

            const updatedUserArrWithParsedScores = reducedParsedDataArr.map(data => {

                const doesUserAlreadyExits = objectKeyAlreadyExists(data.name, usersArr, 'name')  
                // console.log('doesUserAlreadyExits', doesUserAlreadyExits)
                
                if(doesUserAlreadyExits) {
                    const userWithMatchingName = usersArr.find(({name}) => name === data.name)
                    console.log('userWithMatchingName', userWithMatchingName)
                 
                    userWithMatchingName.scoreArray.push(...data.scoreArray)
                    sortArrDescending(userWithMatchingName.scoreArray)
                    //should update usersArr here?
                    // setUsersArr(userWithMatchingName)
                    return userWithMatchingName

                } else if(!doesUserAlreadyExits) {
                    //create new user id
                    //and add its name and score and return that new user

                    const newUserObj = {
                        _id: data.__rowNum__,
                        name: data.name,
                        scoreArray: [...data.scoreArray]
                    }
                    return newUserObj
                    // return data
                }
            })

            console.log('updatedUserArrWithParsedScores', updatedUserArrWithParsedScores)
            const orderedUsersArrWithParsedScores = sortArrDescending(updatedUserArrWithParsedScores)
            console.log('orderedUsersArrWithParsedScores', orderedUsersArrWithParsedScores)
            setUsersArr(updatedUserArrWithParsedScores)
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
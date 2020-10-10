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

    //if user sheet data been saved to arr 
    useEffect(() => {
        if(hasParsedFromSheetSucceeded) {
            const parsedDataNamesArr = parsedDataArr.map(data => data.name)
            const nameReduced = parsedDataNamesArr.reduce((acc, cur) => {
                // console.log('acc',acc)
                const nameAlreadyExists = acc.includes(cur)
                console.log('nameAlreadyExists', nameAlreadyExists)
                if (nameAlreadyExists) {
                    return acc
                } else if (!nameAlreadyExists) {
                    acc.push(cur)
                    return acc
                }
            }, [])

            console.log('nameReduced', nameReduced)

            // const userDataReduced = parsedDataArr.reduce((acc, cur) => {
            //     // console.log('acc',acc)
            //     const parsedDataNamesArr = parsedDataArr.map(data => data.name)
            //     const nameAlreadyExists = parsedDataNamesArr.includes(cur.name)
            //     console.log('nameAlreadyExists', nameAlreadyExists)
            //     // console.log('cur',cur)
            //     // cur.scoreArray = []
            //     if (nameAlreadyExists) {
                    
            //         cur.scoreArray.push(cur.score)
            //         // acc.push(cur)
            //         return acc
            //     } else if (!nameAlreadyExists) {
            //         acc.push(cur)
            //         return acc
            //     }
            // }, [])
            
            // console.log(parsedDataNamesArr)
            
            // console.log('userDataReduced', userDataReduced)

            //per each reduced name,
            // const userWithParsedData = nameReduced.map(name => {
            //     if(name === usersArr.name) {
            //         updateUserScoreArray(name)
            //     }
            // })
            // const updatedUserArrWithParsedData = parsedDataArr.map(data => {
            //     // console.log('user from parsedDataArr', user)
            //     if(userAlreadyExists(data.name)) {
            //         // console.log('user exists')
            //         updateUserScoreArray(data.name, data.score)
            //         // return data
            //     } else if(!userAlreadyExists(data.name)) {
            //         // console.log('user dont exists')
            //         addNewUser(data.name, data.score)
            //         //maybe need use .reduce() here to narrow down the duplicate user name objects?
            //         // console.log('result', result)
            //         // return data
            //     }
            //     // return data
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
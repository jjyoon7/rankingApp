import React, { useState, useEffect } from 'react'
import users from './users'
import scores from './scores'

const Context = React.createContext()

function ContextProvider(props) {
    //users array
    const [ usersArr, setUsersArr ] = useState([])

    //individual user's score array
    const [ userScoreArr, setUserScoreArr] = useState([])

    //parsed excel data
    const [ parsedDataArr, setParsedDataArr ] = useState([])

    const hasUsers = users.length > 0
    const hasScores = scores.length > 0
    const hasParsedFromSheetSucceeded = parsedDataArr.length > 0

    //check if given keyInput already exists in arrayToCompare. 
    //'compareValueType' is added, so it could be used for both
    //comparing using 'name' and 'userId'
    const objectKeyAlreadyExists = (keyInput, arrayToCompare, compareValueType) => arrayToCompare.some(element => {
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

    const generateRandomId = () => {
        const value = new Uint32Array(10)
        const idsArray = window.crypto.getRandomValues(value)
        const generateRandomArrayIndex = (min, max) => {
            min = Math.ceil(min)
            max = Math.floor(max)
            return Math.floor(Math.random() * (max - min) + min)
        }
        const randomArrayIndex = generateRandomArrayIndex(0, 10)
        const randomId = idsArray[randomArrayIndex]
        return randomId
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
        
    //     sortArrDescending(updatedUsersArr)
    //     setUsersArr(updatedUsersArr)
    //     return usersArr
    // }

    const updateUserScoreArray = (keyValueToCompare, score, arrayToAdd, conditionToCompare) => {  
        const updatedUsersArr = arrayToAdd.map(arrayObj => {
            let arrayObjToCompare
        
            if(conditionToCompare === 'userId') {
                arrayObjToCompare = arrayObj.userId
            } else if(conditionToCompare === 'name') {
                arrayObjToCompare = arrayObj.name
            }

            if(arrayObjToCompare === keyValueToCompare) {
                arrayObj.scoreArray.push(score)
                //order the list by highest score
                sortArrDescending(arrayObj.scoreArray)
                return arrayObj
            } else return arrayObj
        })

        sortArrDescending(updatedUsersArr)
        return updatedUsersArr
    }

    const addNewUser = (userName, userScore) => {
        const clonedUsersArr = [...usersArr]
        const id = generateRandomId()

        const newUserObj = {
            _id: id,
            name: userName,
            scoreArray: [userScore]
        }

        clonedUsersArr.push(newUserObj)

        const newlyAddedUsers = sortArrDescending(clonedUsersArr)
        setUsersArr(newlyAddedUsers)
        return usersArr
    }

    //when app is first initially loaded
    //store users and scores in state
    useEffect(() => {
        if(hasUsers && hasScores) {
            //prepare the scores and users before setting the usersArray
            const initialUsersArr = users
            const initialScoresArr = scores

            //reduce the scores, according to its userId
            const reducedScoresArr = initialScoresArr.reduce((acc, cur) => {
                const doesIdAlreadyExists = objectKeyAlreadyExists(cur.userId, acc, 'userId')

                if(doesIdAlreadyExists) {
                    const updatedArrayWithNewScore = updateUserScoreArray(cur.userId, cur.score, acc, 'userId')
                    // console.log('acc after update score array', acc)
                    console.log('updatedArrayWithNewScore', updatedArrayWithNewScore)
                    return updatedArrayWithNewScore

                } else if(!doesIdAlreadyExists) {
                    cur.scoreArray = []
                    cur.scoreArray.push(cur.score)
                    delete cur.score
                    acc.push(cur)
                    return acc
                }
            }, [])

            // console.log('reducedScoresArr', reducedScoresArr)

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
            setUsersArr(orderedInitialUsers)

        } else {
            //show error
        }
    }, [])

    //if user sheet data been saved to arr 
    useEffect(() => {
        if(hasParsedFromSheetSucceeded) {
            //1. reduce the parsed data, if the name exists, add the score to that name
            //other wise create a new user object and save that to the base array
            const reducedParsedDataArr = parsedDataArr.reduce((acc, cur) => {  
                const doesUserAlreadyExits = objectKeyAlreadyExists(cur.name, acc, 'name')   

                if (doesUserAlreadyExits) {
                    const updatedArrayWithNewScore = updateUserScoreArray(cur.name, cur.score, acc, 'name')
                    return updatedArrayWithNewScore

                } else if (!doesUserAlreadyExits) {
                    //cur.score is single score
                    //so need to create an scoreArray
                    //and push its score inside of an array
                    //then delete the individual score value
                    cur.scoreArray = []
                    cur.scoreArray.push(cur.score)
                    delete cur.score
                    acc.push(cur)
                    return acc
                }
            }, [])


            //2. after parsed data is reduced,
            //compare that reducedParsedArry with usersArr
            //if the name exists, add the parsedArr's socres to user's scoreArray
            //otherwise add as new user object with its scores.

            const updatedUserArrWithParsedScores = reducedParsedDataArr.map(data => {
                const doesUserAlreadyExits = objectKeyAlreadyExists(data.name, usersArr, 'name')  
                if(doesUserAlreadyExits) {
                    const userWithMatchingName = usersArr.find(({name}) => name.toLowerCase() === data.name.toLowerCase())                    
                    const reducedDuplicatedScores = data.scoreArray.filter(score => {
                        const hasSameScore = userWithMatchingName.scoreArray.includes(score)
                        // console.log('hasSameScore', hasSameScore)
                        if(hasSameScore) return
                        else if(!hasSameScore) return score
                    })
                    
                    userWithMatchingName.scoreArray.push(...reducedDuplicatedScores)
                    sortArrDescending(userWithMatchingName.scoreArray)
                    return userWithMatchingName

                } else if(!doesUserAlreadyExits) {
                    //create new user id
                    //and add its name and score and return that new user
  
                    //generate the random id number
                    //cannot use __rawNum__ because
                    //it will cause issue when user add new score or user before 
                    //the sheet is parsed
                    //then _id: 4 is taken etc.
                    const id = generateRandomId()
                       
                    const newUserObj = {
                        _id: id,
                        name: data.name,
                        scoreArray: [...data.scoreArray]
                    }                    
                    return newUserObj
                }
                
            })

            //if there is a users, which does not match with parsed data name
            //need to add those, and not leave them out when re-render the usersArr with updated Parsed data.

            const userObjNotMatchingWithParsedDatasName = usersArr.filter(data => {
                const doesUserNameExits = objectKeyAlreadyExists(data.name, reducedParsedDataArr, 'name')  
                // console.log('doesUserNameExits', doesUserNameExits)
                if(!doesUserNameExits) return data
                else return
            })


            const orderedUsersArrWithParsedScores = sortArrDescending(updatedUserArrWithParsedScores)
            const newUsersArr = [...userObjNotMatchingWithParsedDatasName, ...orderedUsersArrWithParsedScores]
            sortArrDescending(newUsersArr)
            
            // console.log('newUsersArr', newUsersArr)

            setUsersArr(newUsersArr)

        } else {
            //show parse error
        }
    }, [ parsedDataArr ])

    // useEffect(() => {
    //     console.log('usersArr updated',usersArr)
    // }, [ usersArr ])

    return (
        <Context.Provider value={{
                                    usersArr,
                                    setUsersArr,
                                    userScoreArr,
                                    setUserScoreArr,
                                    parsedDataArr,
                                    setParsedDataArr,
                                    sortArrDescending,
                                    updateUserScoreArray,
                                    objectKeyAlreadyExists,
                                    addNewUser,
        }}>
            {props.children}
        </Context.Provider>
    )
}

export { Context, ContextProvider }
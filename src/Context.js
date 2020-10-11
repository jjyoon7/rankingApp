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
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
        }
        const randomArrayIndex = generateRandomArrayIndex(0, 10)
        const randomId = idsArray[randomArrayIndex]
        return randomId
    }


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
        setUsersArr(updatedUsersArr)
        return usersArr
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
        return usersArr
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
                    
                    const updatedArrayWithNewScore = acc.map(scoreObject => {
                        if(scoreObject.name === cur.name) {
                            scoreObject.scoreArray.push(cur.score)
                            sortArrDescending(scoreObject.scoreArray)
                            return scoreObject
                        } else return scoreObject
                    })

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

            const updatedUserArrWithParsedScores = usersArr.map(user => {

                const doesUserAlreadyExits = objectKeyAlreadyExists(user.name, reducedParsedDataArr, 'name')  
                // console.log('usersArr in parsed data',usersArr)
                console.log('doesUserAlreadyExits', doesUserAlreadyExits)
                if(doesUserAlreadyExits) {
                    const parsedDataWithMatchingName = reducedParsedDataArr.find(({name}) => name === user.name)

                    user.scoreArray.push(...parsedDataWithMatchingName.scoreArray)
                    sortArrDescending(user.scoreArray)

                    return user

                } else if(!doesUserAlreadyExits) {
                    const newUsers = reducedParsedDataArr.filter(data => {
                        if(data.name !== user.name) {
                            const id = generateRandomId()
                       
                            const newUserObj = {
                                _id: id,
                                name: data.name,
                                scoreArray: [...data.scoreArray]
                            }
                            return newUserObj
                        } else return
                    })
                    console.log('newUsers',newUsers)
                    const returnData = [user, newUsers]
                    return returnData
                    // return user

                }
            })

            // const updatedUserArrWithParsedScores = reducedParsedDataArr.map(data => {

            //     const doesUserAlreadyExits = objectKeyAlreadyExists(data.name, usersArr, 'name')  
            //     // console.log('usersArr in parsed data',usersArr)
            //     console.log('doesUserAlreadyExits', doesUserAlreadyExits)
            //     if(doesUserAlreadyExits) {
            //         const userWithMatchingName = usersArr.find(({name}) => name === data.name)

            //         userWithMatchingName.scoreArray.push(...data.scoreArray)
            //         sortArrDescending(userWithMatchingName.scoreArray)

            //         return userWithMatchingName

            //     } else if(!doesUserAlreadyExits) {
            //         //create new user id
            //         //and add its name and score and return that new user
  
            //         //generate the random id number
            //         const id = generateRandomId()
                       
            //         const newUserObj = {
            //             _id: id,
            //             name: data.name,
            //             scoreArray: [...data.scoreArray]
            //         }
            //         return newUserObj

            //     }
            // })
            console.log('updatedUserArrWithParsedScores', updatedUserArrWithParsedScores)
            const orderedUsersArrWithParsedScores = sortArrDescending(updatedUserArrWithParsedScores)
            setUsersArr(orderedUsersArrWithParsedScores)
        } else {
            //show parse error
        }
    }, [ parsedDataArr ])

    useEffect(() => {
        console.log('usersArr updated',usersArr)
    }, [ usersArr ])

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
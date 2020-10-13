import React, { useState, useEffect } from 'react'
import users from './users'
import scores from './scores'

const Context = React.createContext()

function ContextProvider(props) {
    //users array
    const [ usersArr, setUsersArr ] = useState([])

    //individual user's score array
    const [ userScoreArr, setUserScoreArr] = useState([])
    //
    const [ userName, setUserName ] = useState('')

    //parsed excel data
    const [ parsedDataArr, setParsedDataArr ] = useState([])

    const hasUsers = users.length > 0
    const hasScores = scores.length > 0
    const hasParsedFromSheetSucceeded = parsedDataArr.length > 0

    //check if given 'keyInput' already exists inside of the 'arrayToCompare'. 
    //'compareValueType' is added, 
    //so it could be used for both situation where comparing 'name' and 'userId'
    const objectKeyAlreadyExists = (keyInput, arrayToCompare, compareValueType) => arrayToCompare.some(element => {
        if(compareValueType === 'name') return element.name.toLowerCase() === keyInput.toLowerCase()
        else if(compareValueType === 'userId') return element.userId === keyInput
    })

    //sort array
    const sortArrDescending = array => array.sort((prevValue, currentValue) => {
        //if the array which contains user objects,
        //it needs to be sorted, based on user's highest score
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

    const updateScoreArray = (keyValueToCompare, score, arrayToAdd, conditionToCompare) => {  
        const arrayUpdatedNewScore = arrayToAdd.map(arrayObj => {
            
            // cannot use 'objectKeyAlreadyExists' because it uses .some()
            // and in this case, 'keyValueToCompare' and 'arrayObj' needs to be exactly the same,
            //in order to update the score to the correct user's scoreArray

            let isItSameKey

            if(conditionToCompare === 'userId') {
                isItSameKey = arrayObj.userId === keyValueToCompare
            } else if(conditionToCompare === 'name') {
                isItSameKey = arrayObj.name.toLowerCase() === keyValueToCompare.toLowerCase()
            }

            //with current data type, it is not needed
            //could check for duplicated score here?
            const hasSameScore = arrayObj.scoreArray.includes(score)
            
            if(isItSameKey && !hasSameScore) {
                arrayObj.scoreArray.push(score)

                //order the scores in obj's scoreArray by highest score
                sortArrDescending(arrayObj.scoreArray)
                return arrayObj
            } else return arrayObj
        })
        return arrayUpdatedNewScore
    }

    const createNewUserObjWithScore = (userName, userScore) => {
        const id = generateRandomId()

        let newlyAddedScore
        if(typeof userScore === 'number') newlyAddedScore = [userScore]
        else if(Array.isArray(userScore)) newlyAddedScore = [...userScore]

        const newUserObj = {
            _id: id,
            name: userName,
            scoreArray: newlyAddedScore
        }

        return newUserObj
    }

    const createNewScoreArrayAndAddScore = (passedObj, scoreToAdd) => {
        if(typeof scoreToAdd === 'number') {
            //if 'scoreToAdd' is single score
            //so need to create an scoreArray
            //and push the score inside of an scoreArray
            //then delete the individual score value
            passedObj.scoreArray = []
            passedObj.scoreArray.push(scoreToAdd)
            delete passedObj.score
            return passedObj
        } else if(Array.isArray(scoreToAdd)) {
            //if 'scoreToAdd' is an array
            //use spread operator to add scores to the existing scoreArray.
            passedObj.scoreArray = []
            passedObj.scoreArray.push(...scoreToAdd)
            return passedObj
        }
    }

    //when app initially loads
    useEffect(() => {
        if(hasUsers && hasScores) {
            //prepare the scores and users before setting the usersArray
            const initialUsersArr = users
            const initialScoresArr = scores

            //1. reduce the scores, according to its userId
            const reducedScoresArr = initialScoresArr.reduce((acc, cur) => {
                const doesIdAlreadyExists = objectKeyAlreadyExists(cur.userId, acc, 'userId')

                if(doesIdAlreadyExists) {
                    const arrayWithObjWithUpdatedScore = updateScoreArray(cur.userId, cur.score, acc, 'userId')
                    return arrayWithObjWithUpdatedScore
                } else {
                    //create new empty array and store the score
                    const newScoreObj = createNewScoreArrayAndAddScore(cur, cur.score)
                    acc.push(newScoreObj)
                    return acc
                }
            }, [])

            //2. add scores to the matching user obj
            const initialScoresAddedToInitialUsers = initialUsersArr.map(userObj => {

                //check if user with given id exists in reducedScoresArr
                const doesUserIdExists = objectKeyAlreadyExists(userObj._id, reducedScoresArr, 'userId')
      
                if(doesUserIdExists) {
                    //if there is a matching id,
                    //create an scoreArray to userObj and store the scores 
                    //and return the user.
                    const scoresObjWithMatchingId = reducedScoresArr.find(({userId}) => userId === userObj._id)

                    const userObjWithScoresAdded = createNewScoreArrayAndAddScore(userObj, scoresObjWithMatchingId.scoreArray)
                    return userObjWithScoresAdded
                } else {
                    //with current initial user data, this state will never run
                    //but just in case if different initial user data is loaded
                    //and has extra users that does not match with reducedScoresArr
                    //create a new user object
                    const newUserObj = createNewUserObjWithScore(userObj.name, userObj.score)
                    return newUserObj
                }
            })

            //3. update usersArr
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
                    const arrayWithObjWithUpdatedScore = updateScoreArray(cur.name, cur.score, acc, 'name')
                    return arrayWithObjWithUpdatedScore

                } else {
                    const newScoreObj = createNewScoreArrayAndAddScore(cur, cur.score)
                    acc.push(newScoreObj)
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
                        if(hasSameScore) return
                        else if(!hasSameScore) return score
                    })
                    
                    userWithMatchingName.scoreArray.push(...reducedDuplicatedScores)
                    sortArrDescending(userWithMatchingName.scoreArray)
                    return userWithMatchingName

                } else {
                    //create new user id
                    //and add its name and score and return that new user
                    const newUserObj = createNewUserObjWithScore(data.name, data.scoreArray)                  
                    return newUserObj
                }
                
            })

            //3. if there are users, which does not match with parsed data name
            //need to add those, and not leave them out when re-render the usersArr with updated Parsed data.
            //Q.is it better to create separate function for this part? 
            const userObjNotMatchingWithParsedDatasName = usersArr.filter(data => {
                const doesUserNameExits = objectKeyAlreadyExists(data.name, reducedParsedDataArr, 'name')  
                if(!doesUserNameExits) return data
                else return
            })

            const orderedUsersArrWithParsedScores = sortArrDescending(updatedUserArrWithParsedScores)
            
            let newUsersArrWithParsedData
            
            const hasUsersWithNoMatchingNameFromParsedData = userObjNotMatchingWithParsedDatasName.length > 0
            
            if(hasUsersWithNoMatchingNameFromParsedData) {
                newUsersArrWithParsedData = [...userObjNotMatchingWithParsedDatasName, ...orderedUsersArrWithParsedScores]
            } else {
                newUsersArrWithParsedData = [...orderedUsersArrWithParsedScores]
            }

            //4. update usersArr
            sortArrDescending(newUsersArrWithParsedData)
            setUsersArr(newUsersArrWithParsedData)

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
                                    userName,
                                    setUserName,
                                    parsedDataArr,
                                    setParsedDataArr,
                                    sortArrDescending,
                                    updateScoreArray,
                                    objectKeyAlreadyExists,
                                    createNewUserObjWithScore,
        }}>
            {props.children}
        </Context.Provider>
    )
}

export { Context, ContextProvider }
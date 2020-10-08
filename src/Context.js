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


    const highestScorePerUser = array => array.reduce((accumulator, current) => {
        if (checkIfIdExists(current)) {  
        //   console.log('accumulator',accumulator)
          return accumulator
        } else {
          return [...accumulator, current]
        }
      
        function checkIfIdExists(currentVal) {
            return accumulator.some((item) => {
                // console.log('item',item)
                // console.log('currentVal',currentVal)
              if(item.userId === currentVal.userId) {
                   const result = Math.max(currentVal.score, item.score)
                   item.score = result
                   return item.userId === currentVal.userId
              }
            })
        }
    }, [])

    //collect all the scores of the user
    // const userScoresArray = array => array.reduce((accumulator, current) => {
    //     for(var i = 0; i < array.length; i++) {
    //         if (checkIfIdExists(current)) {  
    //             //   console.log('accumulator',accumulator)
    //               return accumulator
    //             } else {
    //               return [...accumulator, current]
    //             }
              
    //             function checkIfIdExists(currentVal) {
    //                 return accumulator.some((item) => {
    //                     // console.log('item',item)
    //                     // console.log('currentVal',currentVal)
    //                   if(item.userId === currentVal.userId) {
    //                        item.scoreArray = []
    //                     //    const result = Math.max(currentVal.score, item.score)
    //                        item.scoreArray.push(currentVal.score)
    //                        return item.userId === currentVal.userId
    //                   }
    //                 })
    //             }
    //     }
    // }, [])

    // const userScoresArray = array => array.map(el => {
    //     console.log('array', array)
    //     console.log('el', el)
    //     for(var i = 0; i < array.length; i++) {
    //         if(array[i].userId === el.userId) {
    //             el.scoreArray = []
    //             el.scoreArray.push(array[i].score)
    //             return el
    //         }
    //     }
    // }, [])

    const userScoresArray = (scoreArray, userArray) => {
        // console.log('scoreArray',scoreArray)
        // console.log('userArray',userArray)
        // console.log('scoreArray.length', scoreArray.length)
        for (var i = 0; i < scoreArray.length; i++) {
            console.log('scoreArray[i].userId === userArray[i]._id', scoreArray[i].userId === userArray[i]._id)
            if(scoreArray[i].userId === userArray[i]._id) {
                userArray[i].scoreArray = []
                userArray[i].scoreArray.push(scoreArray[i].score)
                // return userArray[i]
                // userArray[i].score = scoreArray[i].score
            }
        }
    }

    //merge highestScorePerUser and add those fields to user obj.
    const addScoreToUser = (scoreArray, userArray) => {
        // console.log('scoreArray',scoreArray)
        // console.log('userArray',userArray)
        for (var i = 0; i < userArray.length; i++) {
            if(scoreArray[i].userId === userArray[i]._id) {
                userArray[i].score = scoreArray[i].score
            }
        }
    }

    //sort array
    const sortArrDescending = array => array.sort((prevValue, currentValue) => {
        return currentValue.score - prevValue.score
    })

    //when app is first initially loaded
    //save users and scores in state
    useEffect(() => {
        // console.log('hasUsers && hasScores', hasUsers && hasScores)
        if(hasUsers && hasScores) {

            const highestScores = highestScorePerUser(scores)
            addScoreToUser(highestScores, users)
            
            const sortedUsers = sortArrDescending(users)
            console.log('sortedUsers', sortedUsers)
            
            setUsersArr(sortedUsers)
            // setScoresArr(scores)
            const userAllScores = userScoresArray(scores, users)
            console.log('userAllScores',userAllScores)
        } else {
            //show error
        }
    }, [])


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
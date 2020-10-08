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

    //sort array
    const sortArrDescending = array => array.sort((prevValue, currentValue) => {
        // console.log('prev', prevValue)
        // console.log('currentValue', currentValue)
        return currentValue - prevValue
    })

    //merge highestScorePerUser and add those fields to user obj.
    const addScoreToUser = (scoreArray, userArray) => {
        const userWithScoreArray = userArray.map(user => {
            user.scoreArray = []
            for (var i = 0; i < scoreArray.length; i++) {
                if(scoreArray[i].userId === user._id) {
                    user.scoreArray.push(scoreArray[i].score)
                }
            }
            const array = user.scoreArray
            return sortArrDescending(array)
            // sortArrDescending(user.scoreArray)
        })
        return userWithScoreArray
    }

    //when app is first initially loaded
    //save users and scores in state
    useEffect(() => {
        // console.log('hasUsers && hasScores', hasUsers && hasScores)
        if(hasUsers && hasScores) {

            // const highestScores = highestScorePerUser(scores)
            const userWithScores = addScoreToUser(scores, users)
            console.log('userWithScores',userWithScores)
            
            setUsersArr(userWithScores)
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
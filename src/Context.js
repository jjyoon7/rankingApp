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
        } else {
            //show error
        }
    }, [])


    return (
        <Context.Provider value={{
                                    parsedDataArr,
                                    setParsedDataArr,
        }}>
            {props.children}
        </Context.Provider>
    )
}

export { Context, ContextProvider }
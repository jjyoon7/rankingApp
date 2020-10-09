import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../Context'

// import useModal from '../../customHooks/useModal/useModal'

export default function UserScoreList() {
    const { isModalOpen, userScoreArr } = useContext(Context)
    const [ userScoreList, setUserScoreList ] = useState(null)

    // const userScoreListModal = useModal(isModalOpen, userScoreList)

    const onClickUserScoreList = () => {

    }

    useEffect(() => {
        const mappedScoreList = userScoreArr.map(score => {
            // console.log('score', score)
            return <li key={score} className='score-li'>
                        {score}
                  </li>
        })
        
        setUserScoreList(mappedScoreList)
        // console.log('mappedScoreList', mappedScoreList)
    }, [ userScoreArr ])

    return (
        <div className='user-score-list-div' onClick={onClickUserScoreList}>
            <ul className='user-score-list-ul'>
                {userScoreList}
            </ul>
        </div>
    )
}

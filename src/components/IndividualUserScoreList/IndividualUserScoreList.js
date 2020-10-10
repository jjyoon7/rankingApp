import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../Context'

// import useModal from '../../customHooks/useModal/useModal'

export default function IndividualUserScoreList() {
    const { usersArr, userScoreArr } = useContext(Context)
    const [ IndividualUserScoreList, setIndividualUserScoreList ] = useState(null)

    // const IndividualUserScoreListModal = useModal(isModalOpen, IndividualUserScoreList)

    const onClickIndividualUserScoreList = () => {

    }

    useEffect(() => {
        const mappedScoreList = userScoreArr.map(score => {
            // console.log('score', score)
            return <li key={score} className='score-li'>
                        {score}
                  </li>
        })
        
        setIndividualUserScoreList(mappedScoreList)
        // console.log('mappedScoreList', mappedScoreList)
    }, [ userScoreArr, usersArr ])

    return (
        <div className='user-score-list-div' onClick={onClickIndividualUserScoreList}>
            <ul className='user-score-list-ul'>
                {IndividualUserScoreList}
            </ul>
        </div>
    )
}

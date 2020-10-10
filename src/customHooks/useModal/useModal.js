import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../Context'
import { createPortal } from 'react-dom'

import './useModal.css'

const modalRoot = document.getElementById("modal-root")

export default function Modal(isOpen, IndividualUserScoreList) {
  const { toggleModal } = useContext(Context)
  const [ mappedScoreList, setMappedScoreList ] = useState(null)
  const el = document.createElement("div")

  useEffect(() => {
    // append to root when the children of Modal are mounted
    modalRoot.appendChild(el)

    // do a cleanup
    return () => {
      modalRoot.removeChild(el)
    }
  }, [el])

  const onClickModalButton = () => {
      toggleModal()
  }

  useEffect(() => {
    if(IndividualUserScoreList.length > 0) {
      const userScores = IndividualUserScoreList.map(score => {
        return <h2>{score}</h2>
      })
  
      setMappedScoreList(userScores)
    }
  }, [])

  return (
    isOpen &&
    createPortal(
      // child element
      <div className="modal-div">
          {mappedScoreList}
          <button className="modal-button button-primary primary-blue white-text" onClick={onClickModalButton}>close</button>
      </div>,
      // target container
      el
    )
  )
}
import React, { useState } from 'react'

const JobCard = ({ card }) => {
    const [isApplied, setIsApplied] =  useState(false)

    const buttonClass = isApplied ? 'button-apply-job is-applied' : 'button-apply-job';
    const buttonText = isApplied ? 'Applied' : 'Apply';
    const appliedButtonHandle = () => {
        setIsApplied(true)
    }
  return (
    <article 
        className='job-result-article' 
        data-location={card.data.modalidad}
        data-level={card.data.nivel}
        data-technology={card.data.technology}
        >
        <div>
            <h3>{card.titulo}</h3>
            <small>{card.empresa} | {card.ubicacion}</small>
            <p>{card.descripcion}</p>
        </div>
        <button 
            className={buttonClass} 
            type="button"
            onClick={appliedButtonHandle}
            >{buttonText}</button>
        </article>
    
  )
}

export default JobCard
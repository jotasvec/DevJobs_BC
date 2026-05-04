import React, { useState } from 'react'
import { Link } from '../../router/Link';


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
        data-location={card.data.modality}
        data-level={card.data.level}
        data-technology={card.data.technology}
        >
        <div>
            <Link href={`/jobs/${card.id}`} ><h3>{card.title}</h3></Link> 
            <small>{card.company} | {card.location}</small>
            <p>{card.description}</p>
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
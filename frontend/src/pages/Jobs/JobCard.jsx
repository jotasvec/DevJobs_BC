import { useState } from 'react'
import { Link } from '../../router/Link';

const JobCard = ({ card }) => {
    const [isApplied, setIsApplied] = useState(false)

    return (
        <article className="job-card">
            <div className="job-card-content">
                <Link href={`/jobs/${card.id}`}>
                    <h3 className="job-card-title">{card.title}</h3>
                </Link>
                <div className="job-card-meta">
                    <span>{card.company}</span>
                    <span className="job-card-dot"></span>
                    <span>{card.location}</span>
                </div>
                <p className="job-card-description">{card.description}</p>
                <div className="job-card-tags">
                    {card.data?.technology?.map?.((tech) => (
                        <span key={tech} className="job-card-tag">{tech}</span>
                    ))}
                </div>
            </div>
            <div className="job-card-actions">
                <button
                    className={`job-card-apply ${isApplied ? 'is-applied' : ''}`}
                    type="button"
                    onClick={() => setIsApplied(true)}
                    disabled={isApplied}
                >
                    {isApplied ? 'Applied' : 'Apply'}
                </button>
            </div>
        </article>
    )
}

export default JobCard

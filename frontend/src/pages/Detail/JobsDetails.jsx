import styles from './JobsDetails.module.css';
import { Link } from '../../router/Link';
import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const CircleCheck = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M9 12l2 2l4 -4" />
    </svg>
)

const JobSection = ({ title, content = "" }) => {
    const list = content.split('\n')
    return (
        <section className={styles.jobSection}>
            <h3>{title}</h3>
            {
                list.length === 1
                    ? <p>{content}</p>
                    : <ul>
                        {list.map((element, id) => (
                            <li key={id}><CircleCheck /> {element.replace('- ', '')}</li>
                        ))}
                    </ul>
            }
        </section>
    )
}

const ApplyButton = ({ className = '' }) => {
    const { isLoggedIn } = useAuth()
    return (
        <button
            className={`detail-apply-btn ${className} ${!isLoggedIn ? 'is-disabled' : ''}`}
            disabled={!isLoggedIn}
        >
            {isLoggedIn ? 'Apply Now' : 'Login to Apply'}
        </button>
    )
}

const JobsDetails = () => {
    const { jobID } = useParams();
    const [job, setJob] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`https://jscamp-api.vercel.app/api/jobs/${jobID}`)
            .then(response => {
                if (!response.ok) throw new Error(`Job Not Found \n Status: ${response.statusText} `);
                return response.json()
            })
            .then(json => setJob(json))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [jobID])

    if (error || !job) {
        return (
            <div className="page-header">
                <h1>Job Not Found</h1>
                <p>The job listing you're looking for doesn't exist or has been removed.</p>
                <button className="auth-submit" onClick={() => navigate('/')}>Go Home</button>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="page-loading">
                <span>Loading job details...</span>
            </div>
        )
    }

    return (
        <>
            <div className={styles.jobsDetails}>
                <nav className={styles.breadcrumb}>
                    <Link href="/jobs">Jobs</Link>
                    <span>/</span>
                    <span>{job.titulo}</span>
                </nav>

                <section className={styles.jobHeader}>
                    <div>
                        <h1>{job.titulo}</h1>
                        <div className={styles.jobHeaderMeta}>
                            <span>{job.empresa}</span>
                            <span className={styles.metaDot}></span>
                            <span>{job.ubicacion}</span>
                        </div>
                    </div>
                    <ApplyButton />
                </section>

                <JobSection title="Description" content={job.content?.description} />
                <JobSection title="Responsibilities" content={job.content?.responsibilities} />
                <JobSection title="Requirements" content={job.content?.requirements} />
                <JobSection title="About Company" content={job.content?.about} />
            </div>

            <div className={styles.bottomButton}>
                <ApplyButton />
            </div>
        </>
    )
}

export default JobsDetails

import styles from './JobsDetails.module.css';
import { Link } from '../../router/Link';
import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { ROUTES, UI, API } from '../../constants.js';
import ApplicationForm from '../../components/ApplicationForm.jsx';
import ApplyButton from '../../components/ApplyButton.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
//import { useRouter } from '../../hooks/useRouter.jsx';

const CircleCheck = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const JobsDetails = () => {
    const { isLoggedIn } = useAuth()
    //const { navigateTo } =  useRouter()
    const { jobID } = useParams();
    const [job, setJob] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [apply, setApply] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`${API.JOBS}/${jobID}`)
            .then(response => {
                if (!response.ok) throw new Error(`Job Not Found \n Status: ${response.statusText} `);
                return response.json()
            })
            .then(json => setJob(json.data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [jobID])

    if (error || !job) {
        return (
            <div className="page-header">
                <h1>Job Not Found</h1>
                <p>The job listing you're looking for doesn't exist or has been removed.</p>
                <button className="auth-submit" onClick={() => navigate(ROUTES.HOME)}>{UI.GO_HOME}</button>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="page-loading">
                <span>{UI.LOADING_JOB_DETAILS}</span>
            </div>
        )
    }

    const actionButton = (
        <ApplyButton
            className={`${!isLoggedIn ? 'is-disabled' : ''}`}
            disabled={!isLoggedIn}
            onClick={ () => {
                if (!isLoggedIn) {
                    navigate(ROUTES.SIGNIN)
                    return
                }
                setApply(true)                
            }}
        >
            {
                isLoggedIn
                ? UI.APPLY_NOW
                : UI.LOGIN_TO_APPLY
            }

        </ApplyButton>
    )

    return (
        <>
            <div className={styles.jobsDetails}>
                <nav className={styles.breadcrumb}>
                    <Link href={ROUTES.JOBS}>{UI.JOBS}</Link>
                    <span>/</span>
                    <span>{job.title}</span>
                </nav>

                <section className={styles.jobHeader}>
                    <div>
                        <h1>{job.title}</h1>
                        <div className={styles.jobHeaderMeta}>
                            <span>{job.company}</span>
                            <span className={styles.metaDot}></span>
                            <span>{job.location}</span>
                        </div>
                    </div>
                    {actionButton}
                </section>

                <JobSection title="Description" content={job.content?.description} />
                <JobSection title="Responsibilities" content={job.content?.responsibilities} />
                <JobSection title="Requirements" content={job.content?.requirements} />
                <JobSection title="About Company" content={job.content?.about} />
            </div>

            <div className={styles.bottomButton}>
                {actionButton}
            </div>
            {
                apply && (
                    <ApplicationForm 
                        jobId={jobID}
                        isLoggedIn={isLoggedIn}
                    />
                )
            }
        </>
    )
}

export default JobsDetails

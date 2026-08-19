import styles from './JobsDetails.module.css';
import { Link } from '../../router/Link';
import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { ROUTES, UI, API } from '../../constants.js';
import ApplicationForm from '../../components/ApplicationForm.jsx';
import ApplyButton from '../../components/ApplyButton.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import { getJobById } from '../../services/jobs.services.js';
import { CheckCircle2 } from 'lucide-react';

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
                            <li key={id}><CheckCircle2 size={18} /> {element.replace('- ', '')}</li>
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
    const [hasApplied, setHasApplied] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchJob = async (id) => {
            setLoading(true)
            try {
                const { data } = await getJobById(id)
                setJob(data)
            } catch (err) {
                console.error(err);
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        if(jobID) {
            fetchJob(jobID)
        }
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

    const handleApplicationSuccess = () =>{
        setApply(false)
        setHasApplied(true)
        // hide bar after 5 seconds
        setTimeout(() => setHasApplied(false), 5000);

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
                            <span>{job.company?.name}</span>
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
            {hasApplied && (
                    <div className='bg-green-600 text-white p-3 rounded mb-4'>
                        <p>🎉 Has applied successfully!</p>
                    </div>
            )}
            {
                apply && (
                    <ApplicationForm 
                        jobId={jobID}
                        isLoggedIn={isLoggedIn}
                        onSuccess={handleApplicationSuccess}
                    />
                )
            }
        </>
    )
}

export default JobsDetails

import styles from './JobsDetails.module.css';
import { Link } from '../../router/Link';
import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

const CircleCheck = () =>{
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-circle-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12l2 2l4 -4" /></svg>
    )
}

const JobSection = ({title, content = ""}) =>{
    const list = content.split('\n')
    console.log('list', list)

    return (
        <section className="">
            <h3> {title} </h3>
            {
                list.length === 1 
                    ? <p>{content}</p> 
                    : <ul>
                        {list.map(element => (
                            <li> <CircleCheck /> {element.replace('- ', '')} </li>
                        ))}
                    </ul>

            }
            
            {/* <ul>
                <li> <CircleCheck /> Licenciatura en Informática o campo relacionado.</li>
                <li> <CircleCheck /> Mínimo de 5 años de experiencia en desarrollo de software.</li>
                <li> <CircleCheck /> Experiencia con frameworks de JavaScript (por ejemplo, React, Angular, Vue.js).</li>
                <li> <CircleCheck /> Familiaridad con metodologías ágiles y herramientas de control de versiones (por ejemplo, Git).</li>
            </ul> */}      
        </section>
     )
}


const JobsDetails = () => {
    const { jobID } = useParams(); 
    const [job, setJob] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()



    useEffect(() => {
  /*       async function fetchJobDetail() {
            try {
                setLoading(true)
                const response = await fetch(`https://jscamp-api.vercel.app/api/jobs/${jobID}`)
                const data = await response.json()
                console.log('data', data)
                setJob(data)
            } catch (error) {
                console.log('error -> ', error)
            } finally{
                setLoading(false)
            }
        }
        fetchJobDetail() */
        fetch(`https://jscamp-api.vercel.app/api/jobs/${jobID}`)
            .then( response => {
                if (!response.ok) throw new Error(`Job Not Found \n Status: ${response.statusText} `);
                return response.json()
            })
            .then( json => setJob(json) )
            .catch( err => setError(err.message))
            .finally( () => setLoading(false) )

        
    }, [jobID])

    if(error || !job){
        return (
            <div style={{maxWidth: '1280px', margin: ' auto', padding: '0 1rem'}}>
                <div>
                    <h2>Job Not Found! </h2>
                    <button type="button" onClick={() => navigate('/')}>Go Home</button>
                </div>
            </div>
        )
    }


  return (
    <>
        {
            loading 
                ?  <h1>Loading Job ... </h1> : 
            <div className={styles.jobsDetails} >
            <nav style={{ textAlign: 'left', marginLeft: '-2rem' }}> <small> <Link href="/jobs">Jobs</Link> / {job.titulo} </small> </nav>
            <section className={styles.jobTitle}>
                <div>
                    <h2>{job.titulo}</h2>
                    <small>{job.empresa} | {job.ubicacion} </small>
                </div>
                <button className=''>Apply Now!</button>
            </section>
 
            <JobSection title="Description" content={job.content?.description} />
            <JobSection title="Responsibilities" content={job.content?.responsibilities} />
            <JobSection title="Requirements" content={job.content?.requirements} />
            <JobSection title="About Company" content={job.content?.about} />

            {/* <section className="">
                <h3>Responsabilidades</h3>
                <ul>
                    <li> <CircleCheck /> Diseñar, desarrollar y mantener aplicaciones web utilizando tecnologías modernas.</li>
                    <li> <CircleCheck />  Colaborar con equipos de producto y diseño para definir y entregar nuevas características.</li>
                    <li> <CircleCheck />  Escribir código limpio, eficiente y bien documentado.</li>
                    <li> <CircleCheck />  ealizar revisiones de código y proporcionar retroalimentación constructiva a los miembros del equipo.</li>
                </ul>
            
            </section> */}
        </div>
        }
        <div className={styles.bottomButton}>
            <button >Apply Now!</button>
        </div>
    </>
  )
}

export default JobsDetails
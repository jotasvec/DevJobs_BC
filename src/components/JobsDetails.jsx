import React from 'react'
import styles from './JobsDetails.module.css';
import { Link } from '../router/Link';

const CircleCheck = () =>{
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-circle-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12l2 2l4 -4" /></svg>
    )
}

const JobsDetails = () => {
  return (
    <>
        <div className={styles.jobsDetails} >
            <small style={{ textAlign: 'left', marginLeft: '-2rem' }}> <Link href="/jobs">Jobs</Link> / Ingeniero de Software Senior</small>
            <section className={styles.jobTitle}>
                <div>
                    <h2>Ingeniero de Software Senior</h2>
                    <small>Tech solutions Inc | Remoto </small>
                </div>
                <button className=''>Apply Now!</button>
            </section>
            <section className={styles.description} >
                <h3>Descripcion del Puesto</h3>
                <p>Tech Solutions Inc. está buscando un Ingeniero de Software Senior altamente motivado y experimentado para unirse a nuestro equipo remoto. El candidato ideal
                    tendrá una sólida formación en desarrollo de software, con experiencia en el diseño, desarrollo e implementación de soluciones de software escalables y de alto
                    rendimiento. Como Ingeniero de Software Senior, usted será responsable de liderar proyectos de desarrollo, mentorizar a ingenieros junior y colaborar con equipos
                    multifuncionales para entregar productos de software de alta calidad.
                </p>
            </section>
            <section className="">
                <h3>Responsabilidades</h3>
                <ul>
                    <li> <CircleCheck /> Diseñar, desarrollar y mantener aplicaciones web utilizando tecnologías modernas.</li>
                    <li> <CircleCheck />  Colaborar con equipos de producto y diseño para definir y entregar nuevas características.</li>
                    <li> <CircleCheck />  Escribir código limpio, eficiente y bien documentado.</li>
                    <li> <CircleCheck />  ealizar revisiones de código y proporcionar retroalimentación constructiva a los miembros del equipo.</li>
                </ul>
            
            </section>
            <section className="">
                <h3>Requisitos</h3>
                <ul>
                    <li> <CircleCheck /> Licenciatura en Informática o campo relacionado.</li>
                    <li> <CircleCheck /> Mínimo de 5 años de experiencia en desarrollo de software.</li>
                    <li> <CircleCheck /> Experiencia con frameworks de JavaScript (por ejemplo, React, Angular, Vue.js).</li>
                    <li> <CircleCheck /> Familiaridad con metodologías ágiles y herramientas de control de versiones (por ejemplo, Git).</li>
                </ul>
                
            </section>
            <section>
                <h3>About Company</h3>
                <p>
                    Tech Solutions Inc. es una empresa de tecnología innovadora que se centra en la creación de soluciones de software de vanguardia para diversas industrias. Estamos
                    comprometidos con el fomento de un entorno de trabajo colaborativo e inclusivo donde cada empleado pueda prosperar y crecer profesionalmente. Ofrecemos salarios
                    competitivos, beneficios integrales y oportunidades de desarrollo profesional continuo.
                </p>
                
            </section>
        </div>
        <div className={styles.bottomButton}>
            <button >Apply Now!</button>
        </div>


    </>
  )
}

export default JobsDetails
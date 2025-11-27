import React, { useState } from 'react';
import '../App.css';
import Avatar from './Avatar';
import { Link } from '../router/Link.jsx';

const Header = () => {

  return (
    <header>
        <Link href="/" style={{textDecoration: 'none'}}>
            <h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-code"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 8l-4 4l4 4" /><path d="M17 8l4 4l-4 4" /><path d="M14 4l-4 16" /></svg>
                DevJobs
            </h2>
        </Link>
        <nav>
            <Link href="/" rel="noopener noreferrer">Start</Link>
            <Link href="/jobs"  rel="noopener noreferrer">Jobs</Link>
            <a href="" target="_blank" rel="noopener noreferrer">Companies</a>
            <a href="" target="_blank" rel="noopener noreferrer">Salaries</a>
        </nav>
        <div>
            <a href="" target="_blank" rel="noopener noreferrer">Post a Job</a>
            <a href="" target="_blank" rel="noopener noreferrer">SignIn</a>
            <Avatar username="jotasvec" service="x"/>
            
            {/* example another company avatar avatar */}
            <Avatar service="youtube" username="youtube" /> 
            {/* <debjobs-avatar
                service="x"
                username="jotasvec"
                size="35"
            ></debjobs-avatar>
            {/* <!-- reusable avatar examples using the component -->
            <!-- Avatar de Twitter --> 
            <devjobs-avatar service="twitter" username="midudev"></devjobs-avatar>

            {/* <!-- Avatar de YouTube con tamaño custom --> 
            <devjobs-avatar service="youtube" username="midudev" size="100"> </devjobs-avatar> */}
        </div>
        
    </header>
  )
}

export default Header
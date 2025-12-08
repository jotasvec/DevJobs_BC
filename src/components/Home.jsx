import React, { useState } from 'react'
import SearchField from './SearchField'
import { useRouter } from '../hooks/useRouter'

const Home = () => {
    const { navigateTo } = useRouter()
    const [text, setText] = useState("")

    const handleSearchOnSubmit = (searchQuery) => {
        const url = text 
            ? `/jobs?search=${encodeURIComponent(searchQuery) }` 
            : '/jobs';
        navigateTo(url)
    }

  return (
    <>
        <section className='hero'>
            <img src="/background.webp" alt="Dev Jobs" width="200" />
            <h1>Find your dream Job</h1>
            <p>Join to our community and find the next big step on your career</p>
            <SearchField 
                value={text}
                onChange={(e) => setText(e.target.value)}
                onSubmit={handleSearchOnSubmit}    />
            </section>
        <section className='features'>
            <div className='features-top'>
                <h2>Why DevJobs</h2>
                <p>Search and pick your job from different sites in just one place.</p>
            </div>
            <div className='features-bottom'>
                <article>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-briefcase"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /><path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" /><path d="M12 12l0 .01" /><path d="M3 13a20 20 0 0 0 18 0" /></svg>
                    <h3>Find Jour Dram Job</h3>
                    <p> Search tons thousands of the best Dev / IT Jobs Offers.</p>
                </article>
                <article>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-users-group"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" /><path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M17 10h2a2 2 0 0 1 2 2v1" /><path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M3 13v-1a2 2 0 0 1 2 -2h2" /></svg>
                    <h3>Apply for the best companies</h3>
                    <p>apply for companies that fits your skills.</p>
                </article>
                <article>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-rocket"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3" /><path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3" /><path d="M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>
                    <h3>Get a competitive salary</h3>
                    <p>Check the trend salary market with our Salary Calculator.</p>
                </article>
            </div>
        </section>
    </>
  )
}

export default Home
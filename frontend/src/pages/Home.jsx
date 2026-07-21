import { useState } from 'react'
import { useRouter } from '../hooks/useRouter'
import { ROUTES, UI, MODALITY, LEVEL } from '../constants.js'

const Home = () => {
    const { navigateTo } = useRouter()
    const [text, setText] = useState("")

    const handleSearchOnSubmit = (e) => {
        e.preventDefault()
        const url = text
            ? `/jobs?search=${encodeURIComponent(text)}`
            : '/jobs'
        navigateTo(url)
    }

    return (
        <>
            <section className="hero">
                <div className="hero-content">
                    <span className="hero-badge">&#10024; 12,400+ jobs available</span>
                    <h1>
                        Find your <span className="text-accent">next</span><br />
                        developer role
                    </h1>
                    <p>
                        Browse thousands of jobs from startups to big tech.
                        Filter by stack, location, and experience level.
                    </p>

                    <div className="hero-search-wrapper">
                        <form className="hero-search" onSubmit={handleSearchOnSubmit}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                                <path d="M21 21l-6 -6" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search jobs, companies, or technologies..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                autoComplete="off"
                            />
                            <span className="search-kbd">&#8984;K</span>
                            <button type="submit">Search</button>
                        </form>
                    </div>

                    <div className="hero-quick-filters">
                        <button onClick={() => navigateTo(`${ROUTES.JOBS}?technology=react`)}>React</button>
                        <button onClick={() => navigateTo(`${ROUTES.JOBS}?modality=${MODALITY.REMOTE}`)}>Remote</button>
                        <button onClick={() => navigateTo(`${ROUTES.JOBS}?level=${LEVEL.SENIOR}`)}>Senior</button>
                        <button onClick={() => navigateTo(`${ROUTES.JOBS}?technology=nodejs`)}>Node.js</button>
                        <button onClick={() => navigateTo(ROUTES.JOBS)}>View all</button>
                    </div>

                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-value">12.4k</span>
                            <span className="hero-stat-label">jobs</span>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <span className="hero-stat-value">850+</span>
                            <span className="hero-stat-label">companies</span>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <span className="hero-stat-value">42</span>
                            <span className="hero-stat-label">technologies</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-features">
                <div className="home-features-inner">
                    <div className="home-features-header">
                        <span className="home-features-label">Why DevJobs</span>
                        <h2>Built for developers, by developers</h2>
                        <p>Every feature is designed to help you find the right role faster.</p>
                    </div>
                    <div className="home-features-grid">
                        <article className="home-feature-card">
                            <div className="home-feature-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
                                    <path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" />
                                    <path d="M12 12l0 .01" />
                                    <path d="M3 13a20 20 0 0 0 18 0" />
                                </svg>
                            </div>
                            <h3>Smart Matching</h3>
                            <p>Jobs curated for your tech stack. No more wading through irrelevant listings.</p>
                        </article>
                        <article className="home-feature-card">
                            <div className="home-feature-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                    <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" />
                                    <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                    <path d="M17 10h2a2 2 0 0 1 2 2v1" />
                                    <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                    <path d="M3 13v-1a2 2 0 0 1 2 -2h2" />
                                </svg>
                            </div>
                            <h3>Radical Transparency</h3>
                            <p>Salary ranges, tech stacks, and culture fit &mdash; know before you apply.</p>
                        </article>
                        <article className="home-feature-card">
                            <div className="home-feature-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path d="M3 3v18h18" />
                                    <path d="M7 16l4 -8l4 4l4 -8" />
                                </svg>
                            </div>
                            <h3>Market Insights</h3>
                            <p>Real-time salary data and market trends. Negotiate with confidence.</p>
                        </article>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home

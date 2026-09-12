import { useState } from 'react'
import { useRouter } from '../hooks/useRouter'
import { ROUTES, UI, MODALITY, LEVEL } from '../constants.js'
import { Search, Briefcase, Users, TrendingUp } from 'lucide-react'

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
            {/* Hero Section */}
            <section className="relative min-h-[min(80vh,680px)] max-md:min-h-[min(85vh,600px)] flex flex-col items-center justify-center px-6 max-md:px-4 py-12 max-md:py-8 overflow-hidden">
                {/* Dot grid background */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(56,189,248,0.08) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 70%)',
                    }}
                />
                {/* Radial glow */}
                <div
                    className="absolute pointer-events-none"
                    style={{
                        top: '-30%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '800px',
                        height: '800px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 60%)',
                    }}
                />

                <div className="relative z-1 flex flex-col items-center max-w-3xl">
                    <span className="font-mono text-sm font-medium tracking-wider text-accent bg-accent/10 border border-accent/15 px-4 py-1.5 rounded-full mb-6">
                        &#10024; 12,400+ jobs available
                    </span>
                    <h1 className="font-heading text-[clamp(2.2rem,5vw,3.8rem)] max-md:text-[clamp(1.8rem,7vw,2.5rem)] font-extrabold leading-none tracking-tight text-center mb-4">
                        Find your <span className="text-accent">next</span><br />
                        developer role
                    </h1>
                    <p className="text-[clamp(1rem,2vw,1.15rem)] max-md:text-base text-text-secondary text-center max-w-xl mb-8 leading-relaxed">
                        Browse thousands of jobs from startups to big tech.
                        Filter by stack, location, and experience level.
                    </p>

                    {/* Search */}
                    <div className="w-full max-w-2xl">
                        <form
                            className="w-full flex items-center gap-2 bg-surface/80 backdrop-blur-xl border border-white/[0.08] rounded-xl px-5 py-2 transition-all focus-within:border-accent/30 focus-within:shadow-[0_0_0_3px_rgba(56,189,248,0.08),0_8px_32px_rgba(0,0,0,0.3)]"
                            onSubmit={handleSearchOnSubmit}
                        >
                            <Search size={20} className="shrink-0 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search jobs, companies, or technologies..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                autoComplete="off"
                                className="flex-1 min-w-0 bg-transparent border-none outline-none text-text font-sans text-[0.95rem] max-md:text-[0.875rem] py-2 placeholder:text-text-muted"
                            />
                            <span className="shrink-0 font-mono text-[0.7rem] font-medium text-text-muted bg-white/[0.06] border border-white/[0.08] rounded px-2 py-1 pointer-events-none opacity-60 leading-none max-md:hidden">
                                &#8984;K
                            </span>
                            <button
                                type="submit"
                                className="shrink-0 px-5 max-md:px-3 py-2.5 max-md:py-2 bg-accent text-[#080c14] font-semibold text-sm rounded-lg border-none cursor-pointer transition-opacity hover:opacity-90"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Quick filters */}
                    <div className="flex flex-wrap gap-2 justify-center mt-5 max-md:gap-1.5">
                        {[ 
                            { label: 'React', action: () => navigateTo(`${ROUTES.JOBS}?technology=react`) },
                            { label: 'Remote', action: () => navigateTo(`${ROUTES.JOBS}?modality=${MODALITY.REMOTE}`) },
                            { label: 'Senior', action: () => navigateTo(`${ROUTES.JOBS}?level=${LEVEL.SENIOR}`) },
                            { label: 'Node.js', action: () => navigateTo(`${ROUTES.JOBS}?technology=nodejs`) },
                            { label: 'View all', action: () => navigateTo(ROUTES.JOBS) },
                        ].map(({ label, action }) => (
                            <button
                                key={label}
                                onClick={action}
                                className="font-sans text-sm font-medium px-3.5 max-md:px-3 py-1.5 max-md:py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-text-secondary cursor-pointer transition-all hover:bg-accent/10 hover:border-accent/20 hover:text-accent"
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 max-md:gap-5 mt-10 max-md:mt-8 pt-8 max-md:pt-6 border-t border-white/[0.06] max-md:flex-col max-md:gap-4">
                        <div className="flex flex-col items-center gap-1">
                            <span className="font-mono text-xl max-md:text-lg font-medium text-text">12.4k</span>
                            <span className="text-sm text-text-muted">jobs</span>
                        </div>
                        <div className="w-px h-8 max-md:w-8 max-md:h-px bg-white/[0.08]" />
                        <div className="flex flex-col items-center gap-1">
                            <span className="font-mono text-xl max-md:text-lg font-medium text-text">850+</span>
                            <span className="text-sm text-text-muted">companies</span>
                        </div>
                        <div className="w-px h-8 max-md:w-8 max-md:h-px bg-white/[0.08]" />
                        <div className="flex flex-col items-center gap-1">
                            <span className="font-mono text-xl max-md:text-lg font-medium text-text">42</span>
                            <span className="text-sm text-text-muted">technologies</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 max-md:py-12 px-6 max-md:px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14 max-md:mb-10">
                        <span className="font-mono text-xs font-medium tracking-widest uppercase text-accent mb-3 block">
                            Why DevJobs
                        </span>
                        <h2 className="font-heading text-[clamp(1.5rem,3vw,2.25rem)] font-bold tracking-tight text-text mb-3">
                            Built for developers, by developers
                        </h2>
                        <p className="text-[1.05rem] max-md:text-base text-text-secondary max-w-xl mx-auto">
                            Every feature is designed to help you find the right role faster.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 max-md:grid-cols-1 gap-5 max-md:gap-4">
                        <article className="p-8 max-md:p-6 bg-card border border-white/[0.05] rounded-xl transition-all duration-200 hover:border-accent/15 hover:-translate-y-0.5">
                            <div className="w-12 h-12 flex items-center justify-center rounded-[0.6rem] bg-accent/[0.08] mb-5">
                                <Briefcase size={24} className="text-accent" />
                            </div>
                            <h3 className="font-heading text-lg font-semibold text-text mb-2">Smart Matching</h3>
                            <p className="text-sm leading-relaxed text-text-secondary">
                                Jobs curated for your tech stack. No more wading through irrelevant listings.
                            </p>
                        </article>
                        <article className="p-8 max-md:p-6 bg-card border border-white/[0.05] rounded-xl transition-all duration-200 hover:border-accent/15 hover:-translate-y-0.5">
                            <div className="w-12 h-12 flex items-center justify-center rounded-[0.6rem] bg-accent/[0.08] mb-5">
                                <Users size={24} className="text-accent" />
                            </div>
                            <h3 className="font-heading text-lg font-semibold text-text mb-2">Radical Transparency</h3>
                            <p className="text-sm leading-relaxed text-text-secondary">
                                Salary ranges, tech stacks, and culture fit - know before you apply.
                            </p>
                        </article>
                        <article className="p-8 max-md:p-6 bg-card border border-white/[0.05] rounded-xl transition-all duration-200 hover:border-accent/15 hover:-translate-y-0.5">
                            <div className="w-12 h-12 flex items-center justify-center rounded-[0.6rem] bg-accent/[0.08] mb-5">
                                <TrendingUp size={24} className="text-accent" />
                            </div>
                            <h3 className="font-heading text-lg font-semibold text-text mb-2">Market Insights</h3>
                            <p className="text-sm leading-relaxed text-text-secondary">
                                Real-time salary data and market trends. Negotiate with confidence.
                            </p>
                        </article>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home

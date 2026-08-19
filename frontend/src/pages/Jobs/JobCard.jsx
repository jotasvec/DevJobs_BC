import { useState } from 'react'
import { Link } from '../../router/Link';
import { MODALITY_COLORS, LEVEL_COLORS } from '../../constants';

const JobCard = ({ card }) => {
    const [isApplied, setIsApplied] = useState(false)
    const modality = card.data?.modality
    const level = card.data?.level

    return (
        <article className="flex bg- bg items-start justify-between gap-6 p-5 bg-card border border-white/8 rounded-xl transition-all duration-150 hover:border-accent/20 hover:-translate-y-0.5">
            <div className="flex-1 min-w-0">
                <Link href={`/jobs/${card.id}`}>
                    <h3 className="font-heading text-base font-semibold text-text mb-1.5 hover:text-accent transition-colors">
                        {card.title}
                    </h3>
                </Link>
                <div className="flex items-center gap-2 text-sm text-text-secondary mb-2.5">
                    <span>{card.company?.name}</span>
                    <span className="w-0.75 h-0.75 rounded-full bg-text-muted"></span>
                    <span>{card.location}</span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed mb-3 line-clamp-2">
                    {card.description}
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                    {modality && (
                        <span className={`font-mono text-[0.7rem] font-medium px-2 py-0.5 rounded capitalize ${MODALITY_COLORS[modality] || 'bg-white/6 text-text-muted'}`}>
                            {modality}
                        </span>
                    )}
                    {level && (
                        <span className={`font-mono text-[0.7rem] font-medium px-2 py-0.5 rounded capitalize ${LEVEL_COLORS[level] || 'bg-white/6 text-text-muted'}`}>
                            {level}
                        </span>
                    )}
                    {card.data?.technology?.map?.((tech) => (
                        <span key={tech} className="font-mono text-[0.7rem] font-medium px-2 py-0.5 bg-accent/10 text-accent rounded">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
            <div className="shrink-0">
                <button
                    className={`px-5 py-2 font-semibold text-sm rounded-lg border-none cursor-pointer transition-opacity whitespace-nowrap ${
                        isApplied 
                            ? 'bg-white/6 text-text-muted cursor-default' 
                            : 'bg-accent text-[#080c14] hover:opacity-90'
                    }`}
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

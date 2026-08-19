import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, Building2, Briefcase, FileText } from 'lucide-react'
import InputField from '../../components/InputField'
import SelectField from '../../components/SelectField'
import TextareaField from '../../components/TextareaField'
import ApplyButton from '../../components/ApplyButton'
import { ROUTES, UI, MODALITY_OPTIONS, LEVEL_OPTIONS } from '../../constants'
import { jobSchema } from '../../schemas/jobs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCompany } from '../../hooks/useCompany'
import { createJob } from '../../services/jobs.services'
import { useRouter } from '../../hooks/useRouter'

const LABELS = {
    title: 'Job Title',
    location: 'Location',
    description: 'Short Description',
    companyId: 'Company',
    technology: 'Technologies',
    level: 'Level',
    modality: 'Modality',
    responsibilities: 'Responsibilities',
    requirements: 'Requirements',
    about: 'About the Role',
    'content.description': 'Detailed Description',
}

const CreateJobs = () => {
    const { navigateTo } = useRouter()
    const { company, companies } = useCompany()
    const [error, setError] = useState(null)
    const [companySearch, setCompanySearch] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef(null)
    const companyPrefilled = useRef(false)

    const recruiterCompany = company?.data
    const allCompanies = companies?.data || []

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            data: { modality: '', level: '' },
        }
    })

    const filteredCompanies = allCompanies.filter(c =>
        c.name.toLowerCase().includes(companySearch.toLowerCase())
    )

    useEffect(() => {
        // Pre-fill recruiter's company once when data arrives
        if (recruiterCompany && !companyPrefilled.current) {
            companyPrefilled.current = true
            setCompanySearch(recruiterCompany.name)
            setValue('companyId', recruiterCompany.id, { shouldValidate: true })
        }
        
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [recruiterCompany, setValue])

    const handleCompanySelect = (selectedCompany) => {
        setCompanySearch(selectedCompany.name)
        setValue('companyId', selectedCompany.id, { shouldValidate: true })
        setShowDropdown(false)
    }

    const handleCompanySearchChange = (e) => {
        const value = e.target.value
        setCompanySearch(value)
        setValue('companyId', '', { shouldValidate: true })
        setShowDropdown(value.length > 0)
    }

    const clearCompanySearch = () => {
        setCompanySearch('')
        setValue('companyId', '', { shouldValidate: true })
        setShowDropdown(false)
    }

    const onSubmit = async (data) => {
        setError(null)
        try {
            const body = {
                ...data,
                data: {
                    ...data.data,
                    technology: data.data?.technology?.length > 0
                        ? data.data.technology
                        : undefined
                }
            }
            await createJob(body)
            navigateTo(ROUTES.MY_JOBS)
        } catch (err) {
            console.log('err', err)
            setError(err.message)
        }
    }

    return (
        <section className='max-w-4xl mx-auto my-8 px-4'>
            <div className="mb-8">
                <h2 className='text-3xl font-bold text-text-primary tracking-tight'>Post a new Job</h2>
                <p className="text-text-secondary mt-2">Fill out the details below to publish a new open position.</p>
            </div>

            {error && (
                <div className='bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg px-4 py-3 mb-6 text-sm flex items-center gap-2'>
                    <X size={16} />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* SECTION 1: Basic Info */}
                <div className="bg-surface/50 border border-white/5 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-text-primary font-medium border-b border-white/10 pb-4">
                        <Briefcase size={20} className="text-brand-primary" />
                        <h3>Basic Information</h3>
                    </div>

                    <div className="space-y-5">
                        <InputField
                            name="title"
                            label={LABELS.title}
                            placeholder="e.g. Senior React Developer"
                            register={register}
                            error={errors?.title}
                        />

                        <InputField
                            name="description"
                            label={LABELS.description}
                            placeholder="Brief summary of the role (will be shown in search results)"
                            register={register}
                            error={errors?.description}
                        />

                        {/* Company Autocomplete */}
                        <div className='flex flex-col gap-1.5 relative' ref={dropdownRef}>
                            <label className="text-sm font-medium text-text-secondary">{LABELS.companyId}</label>
                            <div className={`flex items-center  border transition-colors rounded-xl overflow-hidden ${errors?.companyId ? 'border-red-500 focus-within:border-red-500' : 'border-white/10 focus-within:border-brand-primary'} bg-input-bg `}>
                                <Building2 size={18} className="ml-3 text-text-muted bg-transparent" />
                                <input
                                    type="text"
                                    className="flex-1 border-none py-2.5 px-3 text-sm focus:outline-none text-text-primary placeholder:text-text-muted"
                                    value={companySearch}
                                    onChange={handleCompanySearchChange}
                                    onFocus={() => companySearch.length > 0 && setShowDropdown(true)}
                                    placeholder="Search for a company..."
                                    autoComplete='off'
                                />
                                {companySearch && (
                                    
                                    <X size={16}  onClick={clearCompanySearch} />
                                )}
                            </div>
                            
                            {showDropdown && companySearch && (
                                <ul className="absolute top-18 z-20 w-full bg-surface border border-white/10 rounded-xl max-h-60 overflow-y-auto shadow-xl py-1">
                                    {filteredCompanies.length > 0 ? (
                                        filteredCompanies.map(c => (
                                            <li
                                                key={c.id}
                                                onClick={() => handleCompanySelect(c)}
                                                className="px-4 py-2.5 cursor-pointer hover:bg-white/5 text-sm text-text-primary transition-colors flex flex-col"
                                            >
                                                <span className="font-medium">{c.name}</span>
                                                {c.industry && (
                                                    <span className="text-xs text-text-muted mt-0.5">{c.industry}</span>
                                                )}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-4 py-3 text-sm text-text-muted text-center italic">
                                            No company found matching "{companySearch}"
                                        </li>
                                    )}
                                </ul>
                            )}
                            <input type="hidden" {...register('companyId')} />
                            {errors?.companyId && (
                                <p className="text-red-500 text-xs mt-1">{errors.companyId.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* SECTION 2: Job Specifications */}
                <div className="bg-surface/50 border border-white/5 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-text-primary font-medium border-b border-white/10 pb-4">
                        <FileText size={20} className="text-brand-primary" />
                        <h3>Role Specifications</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <SelectField
                            name="data.modality"
                            label={LABELS.modality}
                            register={register}
                            options={MODALITY_OPTIONS}
                            error={errors?.data?.modality}
                        />

                        <SelectField
                            name="data.level"
                            label={LABELS.level}
                            register={register}
                            options={LEVEL_OPTIONS}
                            error={errors?.data?.level}
                        />

                        <InputField
                            name="location"
                            label={LABELS.location}
                            placeholder="e.g. Remote, Austin, TX"
                            register={register}
                            error={errors?.location}
                        />

                        <InputField
                            name="data.technology"
                            label={LABELS.technology}
                            placeholder="React, Node.js (comma separated)"
                            register={register}
                            error={errors?.data?.technology}
                        />
                    </div>
                </div>

                {/* SECTION 3: Content & Details */}
                <div className="bg-surface/50 border border-white/5 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-text-primary font-medium border-b border-white/10 pb-4">
                        <FileText size={20} className="text-brand-primary" />
                        <h3>Detailed Content</h3>
                    </div>

                    <div className="space-y-5">
                        <TextareaField
                            name="content.description"
                            label={LABELS['content.description']}
                            placeholder="Describe the role in detail..."
                            register={register}
                            error={errors?.content?.description}
                        />

                        <TextareaField
                            name="content.responsibilities"
                            label={LABELS.responsibilities}
                            placeholder="Key responsibilities..."
                            register={register}
                            error={errors?.content?.responsibilities}
                        />

                        <TextareaField
                            name="content.requirements"
                            label={LABELS.requirements}
                            placeholder="Required skills and experience..."
                            register={register}
                            error={errors?.content?.requirements}
                        />

                        <TextareaField
                            name="content.about"
                            label={LABELS.about}
                            placeholder="Tell candidates about the team and culture..."
                            register={register}
                            error={errors?.content?.about}
                        />
                    </div>
                </div>

                {/* Submit Area */}
                <div className="pt-4 flex justify-end">
                    <div className="w-full md:w-1/3">
                        <ApplyButton type='submit'>
                            {isSubmitting ? "Publishing Job..." : UI.CREATE_JOB}
                        </ApplyButton>
                    </div>
                </div>
            </form>
        </section>
    )
}

export default CreateJobs
import React, { useState } from 'react'
import { useParams } from 'react-router';
import { useRouter } from '../../hooks/useRouter';
import { ROUTES, UI, API, ROLES } from '../../constants.js';
import InputField from '../../components/InputField.jsx';
import TextareaField from '../../components/TextareaField.jsx';
import Recruiter from './Recruiter.jsx';
import Seeker from './Seeker.jsx';
import { useSession } from '../../lib/auth-client.js';
import useUserProfile from '../../hooks/useUserProfile.jsx';
import { updateRecruiterProfile, updateSeekerProfile, updateUser } from '../../services/users.services.js';
import { useCombinedSchema } from '../../hooks/useCombinedSchema.jsx';
import { CheckCircle2, AlertCircle, User, Pencil } from 'lucide-react';

const UserProfile = () => {
    const { userID } = useParams()
    const [feedback, setFeedback] = useState(null)
    
    const { navigateTo } = useRouter();
    const session = useSession()
    if (!session) navigateTo(ROUTES.HOME)

    const { user, profile, error, loading } = useUserProfile(userID)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useCombinedSchema(user, profile)

    

    const onSubmit = async (data) => {
        setFeedback(null);
        try {
            const { name, lastName, bio, image, phone, ...profileFields } = data;
            await updateUser(userID, {
                name, lastName, bio, image, phone
            })
           
            if (user.role === ROLES.SEEKER) {
                await updateSeekerProfile(profileFields)
            } else if(user.role === ROLES.RECRUITER) {
                await updateRecruiterProfile(profileFields)
            }

            setFeedback({ type: 'success', message: 'Profile saved successfully!' });
            setTimeout(() => setFeedback(null), 3000);
        } catch (err) {
            console.error('Failed to save profile:', err);
            setFeedback({ type: 'error', message: err.message || 'Failed to save profile. Please try again.' });
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                <span>{UI.LOADING_PROFILE}</span>
            </div>
        )
    }

    if (error || !user) {
        return (
            <div className="page-header">
                <h1>Profile Not Found</h1>
                <p>The User Profile doesn't exist or has been removed.</p>
                <button className="auth-submit" onClick={() => navigateTo(ROUTES.HOME)}>{UI.GO_HOME}</button>
            </div>
        )
    }

    return (
        <div className="max-w-[56rem] mx-auto px-4 max-sm:px-4 py-6 pb-12">
            <div className="text-center mb-10">
                <h1 className="font-heading text-[1.75rem] font-bold text-text mb-1">Welcome, {user.name}</h1>
                <p className="text-[0.95rem] text-text-secondary">Manage your account settings and preferences</p>
            </div>

            {feedback && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm mb-5 animate-[feedbackSlideIn_0.2s_ease-out] ${
                    feedback.type === 'success'
                        ? 'bg-success/10 border border-success/20 text-success'
                        : 'bg-error/10 border border-error/20 text-error'
                }`}>
                    {feedback.type === 'success' ? <CheckCircle2 size={16} className="shrink-0" /> : <AlertCircle size={16} className="shrink-0" />}
                    {feedback.message}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="profile-section">
                    <div className="flex items-center gap-6 mb-6 pb-6 border-b border-white/[0.06]">
                        <div className="relative w-20 h-20 shrink-0">
                            <img
                                src={`https://unavatar.io/github/${user?.email?.split('@')[0] || 'user'}`}
                                alt={user.name}
                                className="w-20 h-20 rounded-full border-[3px] border-accent/30"
                            />
                            <button type="button" className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-accent text-[#080c14] border-2 border-card flex items-center justify-center cursor-pointer transition-all hover:scale-110 hover:opacity-90" title="Edit profile picture">
                                <Pencil size={14} />
                            </button>
                        </div>
                        <div>
                            <h3 className="font-heading text-xl font-semibold text-text mb-1">{user.name} {user.lastName}</h3>
                            <p className="text-sm text-text-secondary">{user.email}</p>
                        </div>
                    </div>
                    <div className="profile-section-header">
                        <div className="profile-section-icon">
                            <User size={16} />
                        </div>
                        <div>
                            <h2>Personal Information</h2>
                            <span>Your basic account details</span>
                        </div>
                    </div>
                    <div className="profile-grid">
                        <InputField label='Name' name='name' placeholder='John' register={register} error={errors?.name} />
                        <InputField label='Last Name' name='lastName' placeholder='Doe' register={register} error={errors?.lastName} />
                        <InputField label='Email' name='email' placeholder='user@johndoe.com' register={register} disabled />
                        <InputField label='Telephone' name='phone' type='tel' placeholder='+1 234 567 890' register={register} error={errors?.phone} />
                        <div className="col-span-full">
                            <TextareaField className="overflow-hidden min-h-max " label='Biography' name='bio' placeholder="I'm a great engineer..." defaultValue={user.bio} register={register} error={errors?.bio} />
                        </div>
                    </div>
                </div>

                {user.role === ROLES.SEEKER && (
                    <Seeker profile={profile} register={register} errors={errors} />
                )}
                {user.role === ROLES.RECRUITER && (
                    <Recruiter profile={profile} register={register} errors={errors} />
                )}

                <div className="flex justify-end mt-6">
                    <button type="submit" className="px-8 py-[0.7rem] bg-accent text-[#080c14] font-semibold text-[0.95rem] rounded-lg border-none cursor-pointer transition-all hover:opacity-90 hover:-translate-y-px min-w-[140px] disabled:opacity-50 disabled:cursor-not-disabled disabled:transform-none active:scale-[0.98]" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : UI.SAVE_CHANGES}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UserProfile

import React from 'react';
import InputField from '../../components/InputField.jsx';
import { MODALITY_OPTIONS, profileFields } from '../../constants.js';
import TextareaField from '../../components/TextareaField.jsx';

const SeekerIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
        <path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" />
        <path d="M12 12l0 .01" />
        <path d="M3 13a20 20 0 0 0 18 0" />
    </svg>
)

const LinkIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M9 15l3 -3l-3 -3" />
        <path d="M6 12h12" />
    </svg>
)

const Seeker = ({ profile, register, errors }) => {
    return (
        <>
            <div className="profile-section">
                <div className="profile-section-header">
                    <div className="profile-section-icon">
                        <SeekerIcon />
                    </div>
                    <div>
                        <h2>Job Preferences</h2>
                        <span>What kind of role are you looking for?</span>
                    </div>
                </div>
                <div className="profile-grid">
                    <InputField
                        label="Location"
                        name="location"
                        placeholder="your location"
                        register={register}
                        error={errors?.location}
                    />

                    <div className="auth-field">
                        <label htmlFor="modality">Modality</label>
                        <select
                            id="modality"
                            name="modality"
                            {...register("modality")}
                        >
                            <option value="">Select modality</option>
                            {MODALITY_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        {errors?.modality && (
                            <p className="input-error">{errors.modality.message}</p>
                        )}
                    </div>

                    <InputField
                        label="Experience (years)"
                        name="experienceYears"
                        type="number"
                        placeholder={profile?.experienceYears || "0"}
                        register={register}
                        error={errors?.experienceYears}
                    />

                    <InputField
                        label="Expected Salary"
                        name="expectedSalary"
                        type="number"
                        placeholder={profile?.expectedSalary || "0"}
                        register={register}
                        error={errors?.expectedSalary}
                    />
                </div>
            </div>

            <div className="profile-section">
                <div className="profile-section-header">
                    <div className="profile-section-icon">
                        <LinkIcon />
                    </div>
                    <div>
                        <h2>Online Presence</h2>
                        <span>Showcase your work and experience</span>
                    </div>
                </div>
                <div className="profile-grid">
                    {profileFields.map(field => 
                        field.name !== 'coverLetter' && (
                        <InputField
                            key={field.name}
                            name={field.name}
                            label={field.label}
                            placeholder={profile?.[field.name] || field.label}
                            register={register}
                            error={errors?.[field.name]}
                        />
                    ))}
                </div>
                <div className="full-width">
                    <TextareaField className="overflow-hidden h-auto" label='Cover Letter' name='coverLetter' placeholder="I'm a great engineer..." register={register} error={errors?.coverLetter} />
                </div>
            </div>
        </>
    );
};

export default Seeker;

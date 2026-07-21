import React from 'react';
import InputField from '../../components/InputField.jsx';
import { MODALITY_OPTIONS, profileFields } from '../../constants.js';

const Seeker = ({ profile, register, errors }) => {
    console.log('profile: ', profile )
    return (
        <div>
            <h3>Seeker Profile</h3>

            <InputField
                label="Location"
                name="location"
                placeholder="Madrid, Spain"
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
                placeholder={profile.experienceYears}
                defaultValue={profile.experienceYears}
                register={register}
                error={errors?.experienceYears}
            />

            <InputField
                label="Expected Salary"
                name="expectedSalary"
                type="number"
                placeholder={profile.expectedSalary}
                defaultValue={profile.expectedSalary}
                register={register}
                error={errors?.expectedSalary}
            />

            <h3>Links</h3>

            {
                profileFields.map(field => (
                    <InputField 
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        placeholder={profile[field.name]}
                        defaultValue={profile[field.name]}
                        register={register}
                        error={errors?.[field.name]}
                    />
                ))
            }
            
        </div>
    );
};

export default Seeker;

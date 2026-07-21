import React, { useEffect, useState } from 'react';
import InputField from '../../components/InputField.jsx';
import { API } from '../../constants.js';

const BuildingIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M4 21v-17a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v17" />
        <path d="M9 21v-6a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6" />
        <path d="M10 7l-2 0l0 -2" />
        <path d="M14 7l2 0l0 -2" />
        <path d="M10 11l-2 0l0 -2" />
        <path d="M14 11l2 0l0 -2" />
        <path d="M10 15l-2 0l0 -2" />
        <path d="M14 15l2 0l0 -2" />
    </svg>
)

const Recruiter = ({ profile, register, errors }) => {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        fetch(`${API.COMPANIES}`, { credentials: 'include' })
            .then(res => res.ok ? res.json() : { data: [] })
            .then(json => setCompanies(json.data || []))
            .catch(() => setCompanies([]));
    }, []);

    const company = profile?.companyId && companies.length > 0
        ? companies.find(c => c.id === profile.companyId)
        : null;

    return (
        <div className="profile-section">
            <div className="profile-section-header">
                <div className="profile-section-icon">
                    <BuildingIcon />
                </div>
                <div>
                    <h2>Recruiter Details</h2>
                    <span>Your company and contact information</span>
                </div>
            </div>
            <div className="profile-grid">
                <div className="auth-field">
                    <label htmlFor="companyId">Company</label>
                    <select
                        id="companyId"
                        name="companyId"
                        {...register("companyId")}
                    >
                        <option value="">
                            {profile?.companyId
                                ? company?.name || 'Current company'
                                : 'Select a company'
                            }
                        </option>
                        {companies.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    {errors?.companyId && (
                        <p className="input-error">{errors.companyId.message}</p>
                    )}
                </div>

                <InputField
                    label="Position"
                    name="position"
                    placeholder={profile?.position || "e.g. Senior Recruiter"}
                    defaultValue={profile?.position}
                    register={register}
                    error={errors?.position}
                />

                <InputField
                    label="Phone"
                    name="phone"
                    placeholder={profile?.phone || "+1 234 567 890"}
                    defaultValue={profile?.phone}
                    register={register}
                    error={errors?.phone}
                />

                <InputField
                    label="Department"
                    name="department"
                    placeholder={profile?.department || "e.g. Engineering"}
                    defaultValue={profile?.department}
                    register={register}
                    error={errors?.department}
                />
            </div>
        </div>
    );
};

export default Recruiter;

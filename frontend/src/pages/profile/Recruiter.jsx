import React from 'react';
import { useQuery } from '@tanstack/react-query';
import InputField from '../../components/InputField.jsx';
import { getAllCompanies } from '../../services/company.services.js';
import { Building2 } from 'lucide-react';

const Recruiter = ({ profile, register, errors }) => {
    const { data: companiesData, isLoading } = useQuery({
        queryKey: ['companies'],
        queryFn: () => getAllCompanies(new URLSearchParams()),
    })

    const companies = companiesData?.data || []
    const company = profile?.companyId && companies.length > 0
        ? companies.find(c => c.id === profile.companyId)
        : null;

    return (
        <div className="profile-section">
            <div className="profile-section-header">
                <div className="profile-section-icon">
                    <Building2 size={16} />
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
                    register={register}
                    error={errors?.position}
                />

                <InputField
                    label="Department"
                    name="department"
                    placeholder={profile?.department || "e.g. Engineering"}
                    register={register}
                    error={errors?.department}
                />
            </div>
        </div>
    );
};

export default Recruiter;

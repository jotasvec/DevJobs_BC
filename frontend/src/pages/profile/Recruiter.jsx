import React, { useEffect, useState } from 'react';
import InputField from '../../components/InputField.jsx';
import { API } from '../../constants.js';

const Recruiter = ({ profile, register, errors }) => {
    const [companies, setCompanies] = useState([]);
    const [company, setCompany] = useState({})

    useEffect(() => {
        fetch(`${API.COMPANIES}`, { credentials: 'include' })
            .then(res => res.ok ? res.json() : { data: [] })
            .then(json => setCompanies(json.data || []))
            .catch(() => setCompanies([]));
    },[]);

    useEffect(() => {
        companies.map(c => {
            if (c.id === profile.companyId) {
                setCompany(c)
            }
        });
    },)

    return (
        <div>
            <h3>Recruiter Profile</h3>

            <div className="auth-field">
                <label htmlFor="companyId">Company</label>
                <select
                    id="companyId"
                    name="companyId"
                    {...register("companyId")}

                >
                    <option value="">
                        {profile.companyId 
                            ? company.name
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
                placeholder={profile.position}
                defaultValue={profile.position}
                register={register}
                error={errors?.position}
            />

            <InputField
                label="Phone"
                name="phone"
                placeholder={profile.phone}
                defaultValue={profile.phone}
                register={register}
                error={errors?.phone}
            />

            <InputField
                label="Department"
                name="department"
                placeholder={profile.department}
                defaultValue={profile.department}
                register={register}
                error={errors?.department}
            />
        </div>
    );
};

export default Recruiter;

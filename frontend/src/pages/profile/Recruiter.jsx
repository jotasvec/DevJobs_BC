import React, { useEffect, useState } from 'react';
import InputField from '../../components/InputField.jsx';
import { API } from '../../constants.js';

const Recruiter = ({ profile, register, errors }) => {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        fetch(`${API.COMPANIES}`, { credentials: 'include' })
            .then(r => r.ok ? r.json() : { data: [] })
            .then(json => setCompanies(json.data || []))
            .catch(() => setCompanies([]));
    }, []);

    console.log('profile: ', profile)
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
                    <option value="">Select a company</option>
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
                placeholder="Engineering Manager"
                register={register}
                error={errors?.position}
            />

            <InputField
                label="Phone"
                name="phone"
                placeholder="+1-555-0101"
                register={register}
                error={errors?.phone}
            />

            <InputField
                label="Department"
                name="department"
                placeholder="Engineering"
                register={register}
                error={errors?.department}
            />
        </div>
    );
};

export default Recruiter;

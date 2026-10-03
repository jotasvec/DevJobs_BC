import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import InputField from '../../components/InputField.jsx';
import Modal from '../../components/UI/Modal.jsx';
import { getAllCompanies, createCompany } from '../../services/company.services.js';
import { Building2, Plus } from 'lucide-react';

const Recruiter = ({ profile, register, errors }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState('');
    const [companyIndustry, setCompanyIndustry] = useState('');
    const [companyLocation, setCompanyLocation] = useState('');
    const [createError, setCreateError] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const queryClient = useQueryClient();

    const { data: companiesData } = useQuery({
        queryKey: ['companies'],
        queryFn: () => getAllCompanies(new URLSearchParams()),
    });

    const companies = companiesData?.data || [];
    const company = profile?.companyId && companies.length > 0
        ? companies.find(c => c.id === profile.companyId)
        : null;

    const handleSelectChange = (e) => {
        const value = e.target.value;
        if (value === '__create_new__') {
            setShowCreateModal(true);
        } else {
            register('companyId').onChange(e);
        }
    };

    const handleCreateCompany = async () => {
        if (!companyName.trim()) {
            setCreateError('Company name is required');
            return;
        }

        setIsCreating(true);
        setCreateError(null);

        try {
            const body = { name: companyName.trim() };
            if (companyWebsite.trim()) body.website = companyWebsite.trim();
            if (companyIndustry.trim()) body.industry = companyIndustry.trim();
            if (companyLocation.trim()) body.location = companyLocation.trim();

            const res = await createCompany(body);
            const newCompany = res.data;

            await queryClient.invalidateQueries({ queryKey: ['companies'] });

            setCompanyName('');
            setCompanyWebsite('');
            setCompanyIndustry('');
            setCompanyLocation('');
            setShowCreateModal(false);

            const companyIdField = document.getElementById('companyId');
            if (companyIdField) {
                companyIdField.value = newCompany.id;
                companyIdField.dispatchEvent(new Event('change', { bubbles: true }));
            }
        } catch (err) {
            console.error('Failed to create company:', err);
            setCreateError(err.message || 'Failed to create company');
        } finally {
            setIsCreating(false);
        }
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setCreateError(null);
    };

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
                        onChange={handleSelectChange}
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
                        <option value="__create_new__">+ Create new company</option>
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

            <Modal isOpen={showCreateModal} onClose={handleCloseModal}>
                <Modal.Header onClose={handleCloseModal}>Create Company</Modal.Header>
                <Modal.Body>
                    <div className="space-y-4">
                        {createError && (
                            <div className="px-4 py-3 rounded-lg text-sm bg-error/10 border border-error/20 text-error">
                                {createError}
                            </div>
                        )}
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-text-secondary mb-1">
                                Company Name *
                            </label>
                            <input
                                id="companyName"
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Acme Corp"
                                className="w-full px-3 py-2 bg-white/4 border border-white/10 rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50"
                            />
                        </div>
                        <div>
                            <label htmlFor="companyWebsite" className="block text-sm font-medium text-text-secondary mb-1">
                                Website
                            </label>
                            <input
                                id="companyWebsite"
                                type="url"
                                value={companyWebsite}
                                onChange={(e) => setCompanyWebsite(e.target.value)}
                                placeholder="https://acme.com"
                                className="w-full px-3 py-2 bg-white/4 border border-white/10 rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50"
                            />
                        </div>
                        <div>
                            <label htmlFor="companyIndustry" className="block text-sm font-medium text-text-secondary mb-1">
                                Industry
                            </label>
                            <input
                                id="companyIndustry"
                                type="text"
                                value={companyIndustry}
                                onChange={(e) => setCompanyIndustry(e.target.value)}
                                placeholder="Technology"
                                className="w-full px-3 py-2 bg-white/4 border border-white/10 rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50"
                            />
                        </div>
                        <div>
                            <label htmlFor="companyLocation" className="block text-sm font-medium text-text-secondary mb-1">
                                Location
                            </label>
                            <input
                                id="companyLocation"
                                type="text"
                                value={companyLocation}
                                onChange={(e) => setCompanyLocation(e.target.value)}
                                placeholder="San Francisco, CA"
                                className="w-full px-3 py-2 bg-white/4 border border-white/10 rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50"
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer
                    confirmText={isCreating ? 'Creating...' : 'Create'}
                    onConfirm={handleCreateCompany}
                    onClose={handleCloseModal}
                    variant="primary"
                    confirmDisabled={isCreating || !companyName.trim()}
                />
            </Modal>
        </div>
    );
};

export default Recruiter;

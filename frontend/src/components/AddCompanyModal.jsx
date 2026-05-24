import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddCompanyModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    description: '',
    location: '',
    city: '',
    foundedOn: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Company Name is required';
    
    if (!formData.logoUrl.trim()) {
      tempErrors.logoUrl = 'Logo URL is required';
    } else if (!/^https?:\/\/.+/i.test(formData.logoUrl)) {
      tempErrors.logoUrl = 'Must be a valid HTTP or HTTPS URL';
    }

    if (!formData.description.trim()) {
      tempErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      tempErrors.description = 'Description should be at least 20 characters long';
    }

    if (!formData.location.trim()) tempErrors.location = 'Location (e.g. state/country) is required';
    if (!formData.city.trim()) tempErrors.city = 'City is required';

    const currentYear = new Date().getFullYear();
    const foundedYear = Number(formData.foundedOn);
    if (!formData.foundedOn) {
      tempErrors.foundedOn = 'Founded year is required';
    } else if (isNaN(foundedYear) || foundedYear < 1700 || foundedYear > currentYear) {
      tempErrors.foundedOn = `Must be a valid year between 1700 and ${currentYear}`;
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSuggestLogo = () => {
    const defaultLogos = [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=150',
      'https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=150',
      'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=150'
    ];
    const randomLogo = defaultLogos[Math.floor(Math.random() * defaultLogos.length)];
    setFormData((prev) => ({ ...prev, logoUrl: randomLogo }));
    if (errors.logoUrl) {
      setErrors((prev) => ({ ...prev, logoUrl: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        name: '',
        logoUrl: '',
        description: '',
        location: '',
        city: '',
        foundedOn: '',
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-slide-up border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">Add New Company</h2>
            <p className="text-xs text-slate-500 mt-1">Register a new firm to start gathering employee ratings.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form Scrollable Area */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Zoronal Solutions"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                errors.name 
                  ? 'border-rose-300 bg-rose-50/25 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                  : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.name}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Logo Image URL
              </label>
              <button
                type="button"
                onClick={handleSuggestLogo}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider transition-colors"
              >
                Auto-fill Sample Logo
              </button>
            </div>
            <input
              type="text"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                errors.logoUrl 
                  ? 'border-rose-300 bg-rose-50/25 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                  : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.logoUrl && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.logoUrl}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. San Francisco"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                  errors.city 
                    ? 'border-rose-300 bg-rose-50/25 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                    : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
              />
              {errors.city && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Location (State/Region)
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. California, USA"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                  errors.location 
                    ? 'border-rose-300 bg-rose-50/25 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                    : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
              />
              {errors.location && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.location}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Founded On (Year)
            </label>
            <input
              type="number"
              name="foundedOn"
              value={formData.foundedOn}
              onChange={handleChange}
              placeholder="e.g. 2012"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                errors.foundedOn 
                  ? 'border-rose-300 bg-rose-50/25 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                  : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.foundedOn && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.foundedOn}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Company Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Provide a comprehensive summary of the company's domain, team size, and products..."
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all resize-none ${
                errors.description 
                  ? 'border-rose-300 bg-rose-50/25 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                  : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.description && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.description}</p>}
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {submitting ? 'Adding...' : 'Create Company'}
          </button>
        </div>
      </div>
    </div>
  );
}

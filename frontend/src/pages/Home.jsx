import React, { useState, useMemo } from 'react';
import CompanyCard from '../components/CompanyCard';
import AddCompanyModal from '../components/AddCompanyModal';
import { Search, Plus, Filter, SlidersHorizontal, RotateCcw, Building2 } from 'lucide-react';

export default function Home({ companies, loading, onSelectCompany, onAddCompany, user, onOpenAuthModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCompanyClick = () => {
    if (!user) {
      // Trigger AuthModal. We pass a callback to open the AddCompanyModal on successful login!
      onOpenAuthModal(() => setIsModalOpen(true));
    } else {
      setIsModalOpen(true);
    }
  };

  // Derive city list and founded years for dropdowns dynamically from companies data!
  const cities = useMemo(() => {
    const allCities = companies.map((c) => c.city).filter(Boolean);
    return [...new Set(allCities)].sort();
  }, [companies]);

  const foundedYears = useMemo(() => {
    const allYears = companies.map((c) => c.foundedOn).filter(Boolean);
    return [...new Set(allYears)].sort((a, b) => b - a);
  }, [companies]);

  // Real-time Filtering
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            company.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === '' || company.city === selectedCity;
      const matchesYear = selectedYear === '' || company.foundedOn === Number(selectedYear);
      return matchesSearch && matchesCity && matchesYear;
    });
  }, [companies, searchTerm, selectedCity, selectedYear]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedYear('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 px-6 py-12 shadow-xl sm:px-12 sm:py-16 md:px-16">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-blue-400 border border-blue-500/20">
            Real Insights. Real People.
          </span>
          <h1 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
            Find the right workspace for <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">your future</span>.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Explore transparent reviews, rating scores, salary indicators, and leadership analysis submitted anonymously by verified employees.
          </p>
        </div>
        {/* Subtle background glow decorator */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-600/25 blur-3xl"></div>
        <div className="absolute right-32 bottom-0 h-48 w-48 rounded-full bg-indigo-600/20 blur-3xl"></div>
      </div>

      {/* Control Panel (Search, Filter, Actions) */}
      <div className="mt-8 grid gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:grid-cols-12 md:items-center">
        {/* Search Input */}
        <div className="relative md:col-span-5">
          <Search className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search companies by name or keyword..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* City Filter */}
        <div className="relative md:col-span-2.5">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            <Filter className="h-4 w-4" />
          </div>
        </div>

        {/* Founded Year Filter */}
        <div className="relative md:col-span-2.5">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white"
          >
            <option value="">All Years</option>
            {foundedYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
        </div>

        {/* Add Company Trigger Button */}
        <div className="md:col-span-2">
          <button
            onClick={handleAddCompanyClick}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Company
          </button>
        </div>
      </div>

      {/* Reset Filter Banner when matching nothing */}
      {(selectedCity || selectedYear || searchTerm) && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2 border border-slate-100">
          <p className="text-xs text-slate-500">
            Active filters matches <span className="font-semibold text-slate-800">{filteredCompanies.length}</span> results.
          </p>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Filters
          </button>
        </div>
      )}

      {/* Grid listing & States */}
      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="h-14 w-14 rounded-xl shimmer shrink-0"></div>
                  <div className="space-y-2 flex-1 pt-1">
                    <div className="h-4 w-2/3 rounded shimmer"></div>
                    <div className="h-3 w-1/3 rounded shimmer"></div>
                  </div>
                </div>
                <div className="h-3 w-1/2 rounded shimmer mt-4"></div>
                <div className="space-y-2 mt-4">
                  <div className="h-3 w-full rounded shimmer"></div>
                  <div className="h-3 w-5/6 rounded shimmer"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCompanies.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company._id}
              company={company}
              onClick={() => onSelectCompany(company._id)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
            <Building2 className="h-8 w-8" />
          </div>
          <h3 className="font-display mt-6 text-lg font-bold text-slate-900">No Companies Found</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            {searchTerm || selectedCity || selectedYear
              ? "We couldn't find any firms matching your filter parameters. Try adjusting your query or resetting filters."
              : "No companies are listed on the directory yet. Be the first to add an organization and kickstart reviews!"}
          </p>
          {searchTerm || selectedCity || selectedYear ? (
            <button
              onClick={handleResetFilters}
              className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Reset Search Parameters
            </button>
          ) : (
            <button
              onClick={handleAddCompanyClick}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all"
            >
              Register First Company
            </button>
          )}
        </div>
      )}

      {/* Add Company Modal */}
      <AddCompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onAddCompany}
      />
    </div>
  );
}

import React from 'react';

export const CountrySelector = ({
  selectedCountries,
  onCountriesChange,
  allCountries,
}) => {
  const handleCountryChange = (country) => {
    if (selectedCountries.includes(country)) {
      onCountriesChange(selectedCountries.filter((c) => c !== country));
    } else {
      onCountriesChange([...selectedCountries, country]);
    }
  };

  return (
    <div className="bg-white rounded-lg p-2 shadow-sm w-full">
      <label className="block text-xs font-medium text-gray-700 mb-1">
        Select Countries
      </label>
      <div className="space-y-1 max-h-[120px] overflow-y-auto">
        <div className="grid grid-cols-3 gap-1">
          {allCountries.map((country) => (
            <label
              key={country}
              className={`inline-flex items-center justify-center px-2 py-1 rounded-full border text-xs
                        transition-colors duration-200 cursor-pointer
                        ${
                          selectedCountries.includes(country)
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={selectedCountries.includes(country)}
                onChange={() => handleCountryChange(country)}
              />
              <span className="truncate">{country}</span>
              {selectedCountries.includes(country) && (
                <span className="ml-1">✓</span>
              )}
            </label>
          ))}
        </div>
      </div>
      <div className="mt-1 h-4 text-xs text-gray-500">
        {selectedCountries.length > 0 && (
          <span>
            {selectedCountries.length}{' '}
            {selectedCountries.length === 1 ? 'country' : 'countries'} selected
          </span>
        )}
      </div>
    </div>
  );
};

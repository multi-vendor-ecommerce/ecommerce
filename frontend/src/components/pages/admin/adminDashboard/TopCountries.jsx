import React from "react";

const countriesData = [
  { name: "United States", flag: "🇺🇸", percent: 38.61 },
  { name: "Brazil", flag: "🇧🇷", percent: 32.79 },
  { name: "India", flag: "🇮🇳", percent: 26.42 },
  { name: "United Kingdom", flag: "🇬🇧", percent: 17.42 },
  { name: "Turkey", flag: "🇹🇷", percent: 12.85 },
];

const TopCountries = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow w-full">
      <h2 className="font-semibold mb-4">Top countries</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Optional World Map Image */}
        <div className="w-full lg:w-1/2">
          <img
            src="https://www.transparenttextures.com/patterns/world-map.png"
            alt="world map"
            className="w-full h-48 object-cover opacity-40"
          />
        </div>

        {/* Country Data */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          {countriesData.map((country) => (
            <div key={country.name}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-sm font-medium">{country.name}</span>
                </div>
                <span className="text-sm font-semibold">{country.percent}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="h-2 bg-blue-500 rounded-full"
                  style={{ width: `${country.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCountries;

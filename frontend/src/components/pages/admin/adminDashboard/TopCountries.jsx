import React from "react";

const countriesData = [
  { name: "USA", flag: "🇺🇸", percent: 38.61 },
  { name: "Brazil", flag: "🇧🇷", percent: 32.79 },
  { name: "India", flag: "🇮🇳", percent: 26.42 },
  { name: "UK", flag: "🇬🇧", percent: 17.42 },
  { name: "Turkey", flag: "🇹🇷", percent: 12.85 },
];

const TopCountries = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-purple-500 transition duration-300 w-full">
      <h2 className="text-lg md:text-xl ml font-semibold text-gray-800 mb-4">Top Countries</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* World Map Illustration */}
        <div className="w-full lg:w-[60%]">
          <img
            src="https://tse2.mm.bing.net/th?id=OIP.ihpaTIrHszzNHm45oYOE2gHaDw&pid=Api&P=0&h=180"
            alt="world map"
            className="w-full h-52 object-cover rounded-md opacity-40"
          />
        </div>

        {/* Country Stats */}
        <div className="w-full lg:w-[40%] flex flex-col gap-4">
          {countriesData.map((country) => (
            <div key={country.name}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{country.flag}</span>
                  <span className="text-sm font-semibold text-gray-700">{country.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-600">{country.percent}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
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

import { useEffect, useState } from "react";

const API_KEY = "1be3f4a1fc8854e75aed83ce808be3c0"; // 🔑 Replace with your OpenWeatherMap key

export default function App() {
  const [city, setCity] = useState("Berlin");
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [units, setUnits] = useState("metric");

  useEffect(() => {
    fetchWeather(city);
  }, [city, units]);

  async function fetchWeather(cityName) {
    try {
      const res1 = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${units}&appid=${API_KEY}`
      );
      const data1 = await res1.json();

      const res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${units}&appid=${API_KEY}`
      );
      const data2 = await res2.json();

      setWeather(data1);
      setForecast(data2);
    } catch (err) {
      console.error(err);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim() !== "") {
      setCity(query.trim());
      setQuery("");
    }
  }

  const tempUnit = units === "metric" ? "°C" : "°F";
  const speedUnit = units === "metric" ? "m/s" : "mph";

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between w-full max-w-4xl mb-6">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <span className="text-yellow-400">☀️</span> Weather Now
        </h1>
        <div>
          <select
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            className="bg-gray-800 px-3 py-1 rounded-lg"
          >
            <option value="metric">Metric (°C)</option>
            <option value="imperial">Imperial (°F)</option>
          </select>
        </div>
      </header>

      {/* Title */}
      <h2 className="text-2xl font-semibold mb-6">
        How’s the sky looking today?
      </h2>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex w-full max-w-xl mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a place..."
          className="flex-1 px-4 py-2 rounded-l-xl bg-gray-800 text-white outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 rounded-r-xl hover:bg-indigo-500"
        >
          Search
        </button>
      </form>

      {/* Weather card */}
      {weather && (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 w-full max-w-4xl flex flex-col items-center text-center mb-8">
          <h3 className="text-lg">
            {weather.name}, {weather.sys.country}
          </h3>
          <p className="text-sm opacity-80 mb-2">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="text-6xl font-bold flex items-center gap-4">
            <span>
              {Math.round(weather.main.temp)}
              {tempUnit}
            </span>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 w-full">
            <div className="bg-gray-800 p-3 rounded-xl">
              Feels Like: {Math.round(weather.main.feels_like)}
              {tempUnit}
            </div>
            <div className="bg-gray-800 p-3 rounded-xl">
              Humidity: {weather.main.humidity}%
            </div>
            <div className="bg-gray-800 p-3 rounded-xl">
              Wind: {Math.round(weather.wind.speed)} {speedUnit}
            </div>
            <div className="bg-gray-800 p-3 rounded-xl">
              Precipitation: {weather.rain ? weather.rain["1h"] : 0} mm
            </div>
          </div>
        </div>
      )}

      {/* Hourly Forecast */}
      {forecast && (
        <div className="bg-gray-900 p-4 rounded-2xl w-full max-w-4xl mb-8">
          <h3 className="text-lg font-semibold mb-3">Hourly forecast</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {forecast.list.slice(0, 8).map((f, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center bg-gray-800 p-3 rounded-xl"
              >
                <p>{new Date(f.dt * 1000).getHours()}:00</p>
                <img
                  src={`https://openweathermap.org/img/wn/${f.weather[0].icon}.png`}
                  alt={f.weather[0].description}
                />
                <p>
                  {Math.round(f.main.temp)}
                  {tempUnit}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Forecast */}
      {forecast && (
        <div className="bg-gray-900 p-4 rounded-2xl w-full max-w-4xl">
          <h3 className="text-lg font-semibold mb-3">Daily forecast</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {Object.values(
              forecast.list.reduce((acc, f) => {
                const day = new Date(f.dt * 1000).toLocaleDateString(
                  undefined,
                  { weekday: "short" }
                );
                if (!acc[day]) acc[day] = f;
                return acc;
              }, {})
            )
              .slice(0, 7)
              .map((f, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center bg-gray-800 p-3 rounded-xl"
                >
                  <p>
                    {new Date(f.dt * 1000).toLocaleDateString(undefined, {
                      weekday: "short",
                    })}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${f.weather[0].icon}.png`}
                    alt={f.weather[0].description}
                  />
                  <p>
                    {Math.round(f.main.temp)}
                    {tempUnit}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

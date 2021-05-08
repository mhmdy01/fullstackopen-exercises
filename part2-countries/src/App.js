import React, { useState, useEffect } from "react";

const Country = ({ country, showHeader, showInfo, showWeather }) => {
  const [headerVisible, setHeaderVisible] = useState(showHeader);
  const [infoVisible, setInfoVisible] = useState(showInfo);
  const [weatherVisible, setWeatherVisible] = useState(showWeather);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!weatherVisible) {
      return;
    }
    let mounted = true;

    console.log("fetching weather");
    const API_URL =
      `${process.env.REACT_APP_WEATHER_API}/current` +
      `?access_key=${process.env.REACT_APP_WEATHER_API_KEY}` +
      `&query=${country.capital}`;
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (mounted) {
          setWeather(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => (mounted = false);
  }, [weatherVisible, country.capital]);

  const toggleInfoVisiblity = () => {
    setInfoVisible(!infoVisible);
  };

  const headerDiv = () => {
    return (
      <div>
        {country.name}{" "}
        <button onClick={toggleInfoVisiblity}>
          {infoVisible ? "hide" : "show"}
        </button>
      </div>
    );
  };
  const infoDiv = () => {
    return (
      <div>
        <h3>{country.name}</h3>
        <p>capital: {country.capital}</p>
        <p>population: {country.population}</p>
        <h4>languages</h4>
        <ul>
          {country.languages.map((lang) => (
            <li key={lang.iso639_2}>{lang.name}</li>
          ))}
        </ul>
        <img src={country.flag} alt={`${country.name}'s flag`} width="100" />
      </div>
    );
  };
  const weatherDiv = () => {
    console.log(weather);
    if (!weather || !weather.current) {
      return <div />;
    }
    return (
      <div>
        <h4>weather in {country.capital}</h4>
        <p>
          <strong>temperature:</strong>{" "}
          <span>{weather.current.temperature} celsius</span>
        </p>
        <img
          src={weather.current.weather_icons[0]}
          alt={weather.current.weather_descriptions[0]}
        />
        <p>
          <strong>wind:</strong> <span>{weather.current.wind_speed} mph</span>{" "}
          <span>direction {weather.current.wind_dir}</span>
        </p>
      </div>
    );
  };

  return (
    <div>
      {headerVisible && headerDiv()}
      {infoVisible && infoDiv()}
      {weatherVisible && weatherDiv()}
    </div>
  );
};

const FilteredCountries = ({ countries }) => {
  if (countries === null) {
    return <div />;
  }

  const total = countries.length;
  if (total > 10) {
    return <div>too many matches, specify another filter</div>;
  } else if (total > 1) {
    return (
      <div>
        {countries.map((country) => (
          <Country
            key={country.name}
            country={country}
            showHeader={true}
            showInfo={false}
            showWeather={false}
          />
        ))}
      </div>
    );
  } else if (total === 1) {
    const country = countries[0];
    return (
      <div>
        <Country
          country={country}
          showHeader={false}
          showInfo={true}
          showWeather={true}
        />
        ;
      </div>
    );
  } else {
    return <div>no matches, specify another filter</div>;
  }
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    console.log("fetching from api");
    const API_URL = `${process.env.REACT_APP_COUNTRIES_API}/all`;
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const updateKeyword = (event) => {
    setKeyword(event.target.value);
  };

  const toLowerCase = (s) => s.toLowerCase();
  const filteredCountries = keyword
    ? countries.filter((country) =>
        toLowerCase(country.name).includes(toLowerCase(keyword))
      )
    : null;

  return (
    <div>
      <div>
        search:{" "}
        <input
          value={keyword}
          onChange={updateKeyword}
          placeholder="type country name"
        />
      </div>
      <FilteredCountries countries={filteredCountries} />
    </div>
  );
};

export default App;

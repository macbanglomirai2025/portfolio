async function getWeather() {
  const cityInput = document.getElementById("city");
  const resultDiv = document.getElementById("weather");

  const city = cityInput.value.trim();
  if (!city) {
    resultDiv.innerHTML = '<p style="color:#ef4444">Please enter a city name</p>';
    return;
  }

  resultDiv.innerHTML = "<p>Loading...</p>";

  // Replace with your actual OpenWeatherMap API key
  // Get free key: https://home.openweathermap.org/api_keys
  const apiKey = "YOUR_ACTUAL_API_KEY_HERE"; // ← CHANGE THIS

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.status === 404 ? "City not found" : "API error");
    }

    const data = await response.json();
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    resultDiv.innerHTML = `
      <img src="${iconUrl}" alt="${data.weather[0].description}" style="width:90px; height:90px;">
      <h2>${data.name}, ${data.sys.country}</h2>
      <p style="font-size:1.8rem; margin:10px 0;"><strong>${Math.round(data.main.temp)} °C</strong></p>
      <p>Feels like: ${Math.round(data.main.feels_like)} °C</p>
      <p>${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind: ${data.wind.speed} m/s</p>
    `;
  } catch (error) {
    resultDiv.innerHTML = `<p style="color:#ef4444">${error.message}. Please try again.</p>`;
    console.error("Weather fetch error:", error);
  }
}
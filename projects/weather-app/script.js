// ── WeatherAPI key ──
const API_KEY = "4a719da334a945a9951145233260603";

const cityInput  = document.getElementById("city");
const weatherDiv = document.getElementById("weather");
const loadingDiv = document.getElementById("loading");
const errorDiv   = document.getElementById("error-msg");
const quickBtns  = document.querySelectorAll(".quick-btn");

// ── Quick city buttons ──────────────────────────────────
quickBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    cityInput.value = btn.dataset.city;
    getWeather();
  });
});

// ── Enter key ───────────────────────────────────────────
cityInput.addEventListener("keydown", e => {
  if (e.key === "Enter") getWeather();
});

// ── Show / hide helpers ─────────────────────────────────
function show(el)  { el.style.display = ""; }
function hide(el)  { el.style.display = "none"; }

function showError(msg) {
  hide(loadingDiv);
  hide(weatherDiv);
  errorDiv.textContent = msg;
  show(errorDiv);
}

// ── Main fetch ──────────────────────────────────────────
async function getWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  hide(weatherDiv);
  hide(errorDiv);
  show(loadingDiv);

  const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    hide(loadingDiv);
    renderWeather(data);

  } catch (err) {
    showError(err.message || "Failed to fetch weather. Please try again.");
    console.error(err);
  }
}

// ── Render ───────────────────────────────────────────────
function renderWeather(d) {

  const temp      = Math.round(d.current.temp_c);
  const feelsLike = Math.round(d.current.feelslike_c);
  const desc      = d.current.condition.text;
  const iconUrl   = "https:" + d.current.condition.icon;

  const humidity  = d.current.humidity;
  const windSpeed = d.current.wind_kph;
  const windDir   = d.current.wind_dir;
  const pressure  = d.current.pressure_mb;

  weatherDiv.innerHTML = `
    <div class="wc-top">
      <div class="wc-left">
        <div class="wc-city">${escHtml(d.location.name)}</div>
        <div class="wc-country">${escHtml(d.location.country)} · ${escHtml(desc)}</div>
      </div>
      <div class="wc-right">
        <img class="wc-icon" src="${iconUrl}" alt="${escHtml(desc)}" />
      </div>
    </div>

    <div class="wc-temp-row">
      <span class="wc-temp">${temp}</span>
      <span class="wc-temp-unit">°C</span>
      <span class="wc-feels">Feels like ${feelsLike}°C</span>
    </div>

    <div class="wc-details">
      <div class="wc-detail">
        <svg class="wc-detail-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        <span class="wc-detail-val">${humidity}%</span>
        <span class="wc-detail-label">Humidity</span>
      </div>

      <div class="wc-detail">
        <svg class="wc-detail-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/>
        </svg>
        <span class="wc-detail-val">${windSpeed} kph</span>
        <span class="wc-detail-label">Wind · ${windDir}</span>
      </div>

      <div class="wc-detail">
        <svg class="wc-detail-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
        </svg>
        <span class="wc-detail-val">${pressure}</span>
        <span class="wc-detail-label">Pressure mb</span>
      </div>
    </div>
  `;

  show(weatherDiv);
}

// ── Escape HTML ──────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
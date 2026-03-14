// ============================================================
//  Weather App — script.js
//  API: WeatherAPI (https://www.weatherapi.com)
//
//  NOTE: API key is visible in client-side JS — this is
//  fine for a student / portfolio project. For a production
//  app, move the key to a server-side environment variable.
// ============================================================

const API_KEY = "4a719da334a945a9951145233260603";

// ── DOM references ───────────────────────────────────────────
const cityInput  = document.getElementById("city");
const weatherDiv = document.getElementById("weather");
const loadingDiv = document.getElementById("loading");
const errorDiv   = document.getElementById("error-msg");
const quickBtns  = document.querySelectorAll(".quick-btn");

// ── Quick-city buttons ───────────────────────────────────────
quickBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    cityInput.value = btn.dataset.city;
    getWeather();
  });
});

// ── Enter key on input ───────────────────────────────────────
cityInput.addEventListener("keydown", e => {
  if (e.key === "Enter") getWeather();
});

// ── Show / hide helpers ──────────────────────────────────────
function show(el) { el.style.display = "block"; }
function hide(el) { el.style.display = "none";  }

function showError(msg) {
  hide(loadingDiv);
  hide(weatherDiv);
  errorDiv.textContent = msg;
  show(errorDiv);
}

// ── Main fetch ───────────────────────────────────────────────
async function getWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  // Reset state
  hide(weatherDiv);
  hide(errorDiv);
  show(loadingDiv);

  // Disable button while loading to prevent duplicate requests
  const btn = document.getElementById("search-btn");
  if (btn) btn.disabled = true;

  const url =
    `https://api.weatherapi.com/v1/current.json` +
    `?key=${API_KEY}` +
    `&q=${encodeURIComponent(city)}` +
    `&aqi=no`;

  try {
    const res = await fetch(url);

    // Handle non-200 HTTP responses
    if (!res.ok) {
      throw new Error(`Server error ${res.status}. Please try again.`);
    }

    const data = await res.json();

    // WeatherAPI returns errors inside JSON with a 400 status
    if (data.error) {
      throw new Error(data.error.message);
    }

    hide(loadingDiv);
    renderWeather(data);

    // Update page title so the browser tab shows the city name
    document.title = `${data.location.name} Weather | Akele Coder`;

  } catch (err) {
    showError(err.message || "Failed to fetch weather. Please check the city name and try again.");
    console.error("Weather fetch error:", err);
  } finally {
    // Always re-enable the button
    if (btn) btn.disabled = false;
  }
}

// ── Render weather card ──────────────────────────────────────
function renderWeather(d) {
  const loc       = d.location;
  const cur       = d.current;

  const temp      = Math.round(cur.temp_c);
  const feelsLike = Math.round(cur.feelslike_c);
  const desc      = cur.condition.text;
  const iconUrl   = "https:" + cur.condition.icon;

  const humidity  = cur.humidity;
  const windSpeed = cur.wind_kph;
  const windDir   = cur.wind_dir;
  const pressure  = cur.pressure_mb;
  const uvIndex   = cur.uv;
  const visibility= cur.vis_km;

  weatherDiv.innerHTML = `
    <div class="wc-top">
      <div class="wc-left">
        <div class="wc-city">${escHtml(loc.name)}</div>
        <div class="wc-region">${escHtml(loc.region || loc.country)}, ${escHtml(loc.country)}</div>
        <div class="wc-desc-text">${escHtml(desc)}</div>
      </div>
      <div class="wc-right">
        <img class="wc-icon" src="${iconUrl}" alt="${escHtml(desc)}" width="72" height="72" />
      </div>
    </div>

    <div class="wc-temp-row">
      <span class="wc-temp">${temp}</span>
      <span class="wc-temp-unit">°C</span>
      <span class="wc-feels">Feels like ${feelsLike}°</span>
    </div>

    <div class="wc-details">

      <div class="wc-detail">
        <svg class="wc-detail-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        <span class="wc-detail-val">${humidity}%</span>
        <span class="wc-detail-label">Humidity</span>
      </div>

      <div class="wc-detail">
        <svg class="wc-detail-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/>
        </svg>
        <span class="wc-detail-val">${windSpeed} <small>kph</small></span>
        <span class="wc-detail-label">Wind · ${escHtml(windDir)}</span>
      </div>

      <div class="wc-detail">
        <svg class="wc-detail-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
        </svg>
        <span class="wc-detail-val">${pressure} <small>mb</small></span>
        <span class="wc-detail-label">Pressure</span>
      </div>

      <div class="wc-detail">
        <svg class="wc-detail-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <span class="wc-detail-val">${uvIndex}</span>
        <span class="wc-detail-label">UV Index</span>
      </div>

      <div class="wc-detail">
        <svg class="wc-detail-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        <span class="wc-detail-val">${visibility} <small>km</small></span>
        <span class="wc-detail-label">Visibility</span>
      </div>

      <div class="wc-detail">
        <svg class="wc-detail-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span class="wc-detail-val">${getLocalTime(loc.localtime)}</span>
        <span class="wc-detail-label">Local Time</span>
      </div>

    </div>
  `;

  show(weatherDiv);
}

// ── Helper: extract HH:MM from "2024-01-15 14:30" ───────────
function getLocalTime(localtime) {
  if (!localtime) return "—";
  const parts = localtime.split(" ");
  return parts[1] || "—";
}

// ── Escape HTML to prevent XSS ───────────────────────────────
function escHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
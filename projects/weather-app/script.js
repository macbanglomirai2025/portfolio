// ── Replace with your free key from https://home.openweathermap.org/api_keys ──
const API_KEY = "YOUR_ACTUAL_API_KEY_HERE";

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
function show(el)  { el.style.display = "";    }
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

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const msg = res.status === 404
        ? `City "${city}" not found. Check spelling and try again.`
        : res.status === 401
          ? "Invalid API key. Please update script.js with your key."
          : `Something went wrong (${res.status}).`;
      throw new Error(msg);
    }

    const d = await res.json();
    hide(loadingDiv);
    renderWeather(d);

  } catch (err) {
    showError(err.message || "Failed to fetch weather. Please try again.");
    console.error(err);
  }
}

// ── Render ───────────────────────────────────────────────
function renderWeather(d) {
  const temp      = Math.round(d.main.temp);
  const feelsLike = Math.round(d.main.feels_like);
  const desc      = d.weather[0].description.replace(/\b\w/g, c => c.toUpperCase());
  const icon      = d.weather[0].icon;
  const iconUrl   = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  // Wind direction label
  const windDeg = d.wind.deg ?? 0;
  const dirs    = ["N","NE","E","SE","S","SW","W","NW"];
  const windDir = dirs[Math.round(windDeg / 45) % 8];

  weatherDiv.innerHTML = `
    <div class="wc-top">
      <div class="wc-left">
        <div class="wc-city">${escHtml(d.name)}</div>
        <div class="wc-country">${escHtml(d.sys.country)} · ${escHtml(desc)}</div>
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
          <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5"/>
        </svg>
        <span class="wc-detail-val">${d.main.humidity}%</span>
        <span class="wc-detail-label">Humidity</span>
      </div>
      <div class="wc-detail">
        <svg class="wc-detail-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/>
        </svg>
        <span class="wc-detail-val">${d.wind.speed} m/s</span>
        <span class="wc-detail-label">Wind · ${windDir}</span>
      </div>
      <div class="wc-detail">
        <svg class="wc-detail-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
        </svg>
        <span class="wc-detail-val">${d.main.pressure}</span>
        <span class="wc-detail-label">Pressure hPa</span>
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
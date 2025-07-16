function updateClock() {
  const now = new Date();
  let hour = String(now.getHours()).padStart(2, '0');
  let minute = String(now.getMinutes()).padStart(2, '0');
  document.getElementById("clock").textContent = `${hour}:${minute}`;
}
setInterval(updateClock, 1000);
updateClock();

async function fetchWeather() {
  const apiKey = "cfbd7afb1454cca4e839863934c6ffe9"; // your OpenWeather API key
  const city = "Amman,JO";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const emoji = getWeatherEmoji(data.weather[0].main);
    document.getElementById("weather").textContent = `${emoji} ${temp}°C – ${desc}`;
  } catch (e) {
    document.getElementById("weather").textContent = "⚠️ Failed to load weather";
  }
}

function getWeatherEmoji(condition) {
  switch (condition) {
    case "Clear": return "☀️";
    case "Clouds": return "☁️";
    case "Rain": return "🌧️";
    case "Drizzle": return "🌦️";
    case "Thunderstorm": return "⛈️";
    case "Snow": return "❄️";
    default: return "🌡️";
  }
}

fetchWeather();

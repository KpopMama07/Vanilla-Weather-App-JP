let now = new Date();
let time = document.querySelector("time");
let date = now.getDate() + "日";
let year = now.getFullYear();
let hours = now.getHours();
let todayMinute = now.getMinutes();
if (todayMinute < 10) {
  todayMinute = `0${todayMinute}`;
}

let p = document.querySelector("p");

p.innerHTML = `${hours}:${todayMinute}`;

let days = [
  "日曜日",
  "月曜日",
  "火曜日",
  "水曜日",
  "木曜日",
  "金曜日",
  "土曜日",
];
let day = days[now.getDay()];

let months = [
  "１月",
  "２月",
  "３月",
  "４月",
  "５月",
  "６月",
  "７月",
  "８月",
  "９月",
  "１０月",
  "１１月",
  "１２月",
];
let month = months[now.getMonth()];

weekday.innerHTML = `今日は ${day}, ${month} ${date}, ${year}`;

function showTemperature(response) {
  celsiusTemperature = response.data.main.temp;
  let temperature = Math.round(response.data.main.temp);
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `湿度: ${response.data.main.humidity}%`;
  let wind = document.querySelector("#wind");
  wind.innerHTML = `風速: ${Math.round(response.data.wind.speed)} km/hr`;
  let description = document.querySelector("#description");
  description.innerHTML = response.data.weather[0].description;
  let main = document.querySelector("main");
  main.innerHTML = temperature + "℃";
  let h1 = document.querySelector("h1");
  h1.innerHTML = response.data.name;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@4x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "c6f8ef4575250284954db9f4dfa7a996";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ja`;
  axios.get(apiUrl).then(showTemperature);
}

searchCity("Shibukawa");

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#searchInput").value;
  let h1 = document.querySelector("h1");
  if (searchInput.value === "") {
    h1.innerHTML = "#searchInput";
  } else {
    h1.innerHTML = "あなたの市に入ってください！";
    searchCity(searchInput);
  }
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", search);

function searchLocation(position) {
  let apiKey = "c6f8ef4575250284954db9f4dfa7a996";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=ja`;
  axios.get(apiUrl).then(showTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let celsiusTemperature = null;

function showFarenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#actualDegree");
  let farenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(farenheitTemperature) + "°F";
}

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", showFarenheitTemperature);

function showCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#actualDegree");
  temperatureElement.innerHTML = Math.round(celsiusTemperature) + "°C";
}

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", showCelsiusTemperature);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["日", "月", "火", "水", "木", "金", "土"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class = "row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-2">
          <div class="card-1" style="width: 7rem">
            <ul class="list-group">
              <li class="list-group-item"><small class="day" id="day">${formatDay(
                forecastDay.dt
              )}</small></li>
              <li class="list-group-item"><img src="https://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png" alt="" width="42" /></li>
              <li class="list-group-item"><small class="forecast-temp" id="forecast-temp"><span class="temp-max">${Math.round(
                forecastDay.temp.max
              )}°   </span><span class="temp-min">${Math.round(
          forecastDay.temp.min
        )}°</span> </small></li>
            </ul>
          </div>
        </div>
        `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "c6f8ef4575250284954db9f4dfa7a996";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${apiKey}&lang=ja`;

  axios.get(apiUrl).then(displayForecast);
}

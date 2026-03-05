async function getWeather(){

let city = document.getElementById("city").value

let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY&units=metric`

let response = await fetch(url)

let data = await response.json()

document.getElementById("weather").innerHTML =

`Temperature: ${data.main.temp} °C`
}


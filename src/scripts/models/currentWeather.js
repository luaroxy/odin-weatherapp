export default class CurrentWeather {
  constructor(currentWeatherData) {
    this.temperature = Math.round(currentWeatherData.main.temp);
    this.weatherCondition = currentWeatherData.weather[0].description;
    this.feelsLikeTemp = Math.round(currentWeatherData.main.feels_like);
    this.humidity = currentWeatherData.main.humidity;
    this.windSpeed = currentWeatherData.wind.speed;
    this.pressure = currentWeatherData.main.pressure;
    this.sunrise = currentWeatherData.sys.sunrise;
    this.sunset = currentWeatherData.sys.sunset;
  }
}

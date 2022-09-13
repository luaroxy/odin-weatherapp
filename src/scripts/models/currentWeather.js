export default class CurrentWeather {
  constructor(currentWeatherData) {
    this.temperature = Math.round(currentWeatherData.main.temp);
    this.weatherConditionDesc = currentWeatherData.weather[0].description;
    this.weatherConditionImg = currentWeatherData.weather[0].main;
    this.feelsLikeTemp = Math.round(currentWeatherData.main.feels_like);
    this.humidity = `${currentWeatherData.main.humidity}%`;
    this.windSpeed = `${currentWeatherData.wind.speed} m/s`;
    this.pressure = `${currentWeatherData.main.pressure} hPa`;
    this.sunrise = this.convertToTime(currentWeatherData.sys.sunrise);
    this.sunset = this.convertToTime(currentWeatherData.sys.sunset);
  }

  convertToTime(rawData) {
    const date = new Date(rawData * 1000);
    const hours = date.getHours();
    const minutes = `0${date.getMinutes()}`;
    const formattedTime = `${hours}:${minutes.substr(-2)}`;
    return formattedTime;
  }
}

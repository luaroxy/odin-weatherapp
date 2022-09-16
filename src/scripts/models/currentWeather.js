export default class CurrentWeather {
  constructor(currentWeatherData) {
    this.temperature = Math.round(currentWeatherData.main.temp);
    this.weatherConditionDesc = currentWeatherData.weather[0].description;
    this.weatherConditionImg = currentWeatherData.weather[0].main;
    this.feelsLikeTemp = Math.round(currentWeatherData.main.feels_like);
    this.humidity = `${currentWeatherData.main.humidity}%`;
    this.windSpeed = `${currentWeatherData.wind.speed} m/s`;
    this.pressure = `${currentWeatherData.main.pressure} hPa`;
    this.sunrise = this.convertToSearchedCityTime(currentWeatherData.sys.sunrise, currentWeatherData.timezone);
    this.sunset = this.convertToSearchedCityTime(currentWeatherData.sys.sunset, currentWeatherData.timezone);
  }

  convertToSearchedCityTime(unixTime, timezone) {
    const localDate = new Date(unixTime * 1000);
    const utcUnixTime = localDate.getTime() + localDate.getTimezoneOffset() * 60000;
    const unixTimeInSearchedCity = utcUnixTime + timezone * 1000;
    const dateInSearchedCity = new Date(unixTimeInSearchedCity);
    const hours = dateInSearchedCity.getHours();
    const minutes = `0${dateInSearchedCity.getMinutes()}`;
    const formattedTime = `${hours}:${minutes.substr(-2)}`;
    return formattedTime;
  }
}

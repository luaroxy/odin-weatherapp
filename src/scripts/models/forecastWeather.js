export default class ForecastWeather {
  constructor(forecastWeatherData) {
    this.temperatures = this.getTemperatures(forecastWeatherData);
    this.weatherCondition = this.getWeatherConditions(forecastWeatherData);
    this.time = this.getTimes(forecastWeatherData);
  }

  getTemperatures(forecastWeatherData) {
    const temperatures = [];
    forecastWeatherData.list.forEach((item) => {
      const temp = Math.round(item.main.temp);
      temperatures.push(temp);
    });
    return temperatures;
  }

  getWeatherConditions(forecastWeatherData) {
    const weatherCondition = [];
    forecastWeatherData.list.forEach((item) => {
      const cond = item.weather[0].main;
      weatherCondition.push(cond);
    });
    return weatherCondition;
  }

  getTimes(forecastWeatherData) {
    const times = [];
    const { timezone } = forecastWeatherData.city;
    forecastWeatherData.list.forEach((item) => {
      const time = this.convertToSearchedCityTime(item, timezone);
      times.push(time);
    });
    return times;
  }

  convertToSearchedCityTime(unixTime, timezone) {
    const localDate = new Date(unixTime.dt * 1000);
    const utcUnixTime = localDate.getTime() + localDate.getTimezoneOffset() * 60000;
    const unixTimeInSearchedCity = utcUnixTime + timezone * 1000;
    const dateInSearchedCity = new Date(unixTimeInSearchedCity);
    const hours = dateInSearchedCity.getHours();
    const time = `${hours}:00`;
    return time;
  }
}

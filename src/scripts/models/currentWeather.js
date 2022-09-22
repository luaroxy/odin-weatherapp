export default class CurrentWeather {
  constructor(currentWeatherData, unit) {
    this.temperature = this.getTemperature(Math.round(currentWeatherData.main.temp), unit);
    this.feelsLikeTemp = this.getTemperature(Math.round(currentWeatherData.main.feels_like), unit);
    this.humidity = `${currentWeatherData.main.humidity}%`;
    this.windSpeed = `${currentWeatherData.wind.speed} m/s`;
    this.pressure = `${currentWeatherData.main.pressure} hPa`;
    this.sunrise = this.convertToSearchedCityTime(currentWeatherData.sys.sunrise, currentWeatherData.timezone);
    this.sunset = this.convertToSearchedCityTime(currentWeatherData.sys.sunset, currentWeatherData.timezone);
    this.weatherConditionDesc = currentWeatherData.weather[0].description;
    this.weatherConditionImg = this.getWeatherConditionImg(
      currentWeatherData.weather[0].main,
      currentWeatherData.sys.sunrise,
      currentWeatherData.sys.sunset,
      currentWeatherData.timezone
    );
    this.backgroundVideo = this.getBackgroundVideoLink(this.weatherConditionImg);
  }

  getTemperature(degree, unit) {
    return unit === "metric" ? `${degree}℃` : `${degree}℉`;
  }

  convertToSearchedCityDate(unixTime, timezone) {
    const localDate = unixTime === 0 ? new Date() : new Date(unixTime * 1000);
    const utcUnixTime = localDate.getTime() + localDate.getTimezoneOffset() * 60000;
    const unixTimeInSearchedCity = utcUnixTime + timezone * 1000;
    const dateInSearchedCity = new Date(unixTimeInSearchedCity);
    return dateInSearchedCity;
  }

  convertToSearchedCityTime(unixTime, timezone) {
    const dateInSearchedCity = this.convertToSearchedCityDate(unixTime, timezone);
    const hours = dateInSearchedCity.getHours();
    const minutes = `0${dateInSearchedCity.getMinutes()}`;
    const formattedTime = `${hours}:${minutes.substr(-2)}`;
    return formattedTime;
  }

  getWeatherConditionImg(value, sunriseUnix, sunsetUnix, timezone) {
    if (value === "Drizzle") return "Rain";
    const mistEquivalentes = ["Smoke", "Haze", "Dust", "Fog", "Sand", "Dust", "Ash", "Squall", "Tornado"];
    if (mistEquivalentes.includes(value)) return "Mist";
    if (value !== "Clear") return value;
    const currentDate = this.convertToSearchedCityDate(0, timezone);
    const sunriseDate = this.convertToSearchedCityDate(sunriseUnix, timezone);
    const sunsetDate = this.convertToSearchedCityDate(sunsetUnix, timezone);
    return currentDate > sunriseDate && currentDate < sunsetDate ? `${value}Day` : `${value}Night`;
  }

  getBackgroundVideoLink(weatherCondition) {
    const videoLinks = {
      ClearDay:
        "https://player.vimeo.com/external/345805150.hd.mp4?s=36c4e596b480ef0e8049370becbaf261b3989a01&profile_id=170&oauth2_token_id=57447761",
      ClearNight:
        "https://player.vimeo.com/external/469307950.hd.mp4?s=2e67aa02a21d5c64c6579043a78f09723ebc5ddb&profile_id=175&oauth2_token_id=57447761",
      Clouds:
        "https://player.vimeo.com/external/444212674.hd.mp4?s=4071981264d9e78acf09a0400e4638432495c4f0&profile_id=175&oauth2_token_id=57447761",
      Mist: "https://player.vimeo.com/external/343732132.hd.mp4?s=5bfde23f17e3858dbdc140afe7a35b6a9ef1127d&profile_id=175&oauth2_token_id=57447761",
      Rain: "https://player.vimeo.com/external/569217602.hd.mp4?s=9a96178c91fe19a6317ed594785f2e368cd1eade&profile_id=174&oauth2_token_id=57447761",
      Snow: "https://player.vimeo.com/external/510831169.hd.mp4?s=d90049559b76f0b9e0bda102ea8a7421d7a64d81&profile_id=175&oauth2_token_id=57447761",
      Thunderstorm:
        "https://player.vimeo.com/external/480223896.hd.mp4?s=e4b94f0b5700bfa68cb6f02b41f94ecca91242e9&profile_id=169&oauth2_token_id=57447761",
    };
    return videoLinks[weatherCondition];
  }
}

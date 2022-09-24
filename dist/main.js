/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/controllers/mainController.js":
/*!***************************************************!*\
  !*** ./src/scripts/controllers/mainController.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MainController)
/* harmony export */ });
class MainController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.city = {};
    this.unit = "metric";
    document.getElementById("search").addEventListener("blur", e => this.loadPage(document.getElementById("search").value));
    document.getElementById("search").addEventListener("keypress", e => this.checkIfEnter(e));
    window.addEventListener("load", () => this.loadPage("new york"));
    document.getElementById("checkbox-unit").addEventListener("change", e => this.changeTemperature(e));
  }

  async loadPage(city) {
    document.getElementById("video").playbackRate = 0.5;
    this.city = city;
    const cityInfo = await this.model.getCityInfo(city, this.unit);
    const currentWeather = await this.model.getCurrentWeather(city, this.unit);
    const forecastWeather = await this.model.getForecastWeather(city, this.unit);
    this.view.appendCityInfo(cityInfo);
    this.view.appendCurrentWeather(currentWeather);
    this.view.appendForecastWeather(forecastWeather);
  }

  checkIfEnter(e) {
    if (e.key === "Enter") document.getElementById("search").blur();
  }

  changeTemperature(e) {
    const unit = e.currentTarget.checked ? "imperial" : "metric";
    this.view.changeUnitTemp(unit);
    this.unit = unit;
    this.callFunc(this.city);
  }

}

/***/ }),

/***/ "./src/scripts/models/APIs.js":
/*!************************************!*\
  !*** ./src/scripts/models/APIs.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ APIs)
/* harmony export */ });
class APIs {
  constructor() {
    this.urlGenerator = new UrlGenerator("e52320b984040185e6040a1e67f254e0");
  }

  async getGeoCoordinates(city) {
    try {
      const url = this.urlGenerator.generateGeoCoordsUrl(city);
      const response = await fetch(url, {
        mode: "cors"
      });
      const geocodingData = await response.json();
      const {
        lat,
        lon
      } = geocodingData[0];
      document.getElementById("error").style.display = "none";
      return {
        lat,
        lon
      };
    } catch (err) {
      console.log(err);
      document.getElementById("error").style.display = "block";
      return null;
    }
  }

  async getCurrentWeatherData(city, unit) {
    try {
      const {
        lat,
        lon
      } = await this.getGeoCoordinates(city);
      const url = this.urlGenerator.generateCurrentWeatherUrl(lat, lon, unit);
      const response = await fetch(url, {
        mode: "cors"
      });
      const weatherData = await response.json();
      document.getElementById("error").style.display = "none";
      return weatherData;
    } catch (err) {
      console.log(err);
      document.getElementById("error").style.display = "block";
      return null;
    }
  }

  async getForecastWeatherData(city, unit) {
    try {
      const {
        lat,
        lon
      } = await this.getGeoCoordinates(city);
      const url = this.urlGenerator.generateForecastWeatherUrl(lat, lon, unit);
      const response = await fetch(url, {
        mode: "cors"
      });
      const forecastData = await response.json();
      document.getElementById("error").style.display = "none";
      return forecastData;
    } catch (err) {
      console.log(err);
      document.getElementById("error").style.display = "block";
      return null;
    }
  }

}

class UrlGenerator {
  constructor(appId) {
    this.baseUrl = "https://api.openweathermap.org";
    this.appId = appId;
  }

  generateGeoCoordsUrl(city) {
    return `${this.baseUrl}/geo/1.0/direct?q=${city}&appid=${this.appId}`;
  }

  generateCurrentWeatherUrl(lat, lon, unit) {
    return `${this.baseUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.appId}&units=${unit}`;
  }

  generateForecastWeatherUrl(lat, lon, unit) {
    return `${this.baseUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=8&appid=${this.appId}&units=${unit}`;
  }

}

/***/ }),

/***/ "./src/scripts/models/cityInfo.js":
/*!****************************************!*\
  !*** ./src/scripts/models/cityInfo.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CityInfo)
/* harmony export */ });
class CityInfo {
  constructor(ApiData) {
    this.cityDescription = this.createCityDescription(ApiData);
    this.dateDescription = this.createDateDescription(ApiData);
  }

  createCityDescription(ApiData) {
    const city = ApiData.name;
    const {
      country
    } = ApiData.sys;
    return `${city}, ${country}`;
  }

  createDateDescription(ApiData) {
    const day = this.getDay();
    const month = this.getMonth();
    const date = this.getDate();
    return `${day}, ${month} ${date}`;
  }

  getDay() {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date();
    const day = weekday[d.getDay()];
    return day;
  }

  getMonth() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    const month = monthNames[d.getMonth()];
    return month;
  }

  getDate() {
    const d = new Date();
    const date = d.getDate();
    return date;
  }

}

/***/ }),

/***/ "./src/scripts/models/currentWeather.js":
/*!**********************************************!*\
  !*** ./src/scripts/models/currentWeather.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CurrentWeather)
/* harmony export */ });
class CurrentWeather {
  constructor(currentWeatherData, unit) {
    this.temperature = this.getTemperature(Math.round(currentWeatherData.main.temp), unit);
    this.feelsLikeTemp = this.getTemperature(Math.round(currentWeatherData.main.feels_like), unit);
    this.humidity = `${currentWeatherData.main.humidity}%`;
    this.windSpeed = `${currentWeatherData.wind.speed} m/s`;
    this.pressure = `${currentWeatherData.main.pressure} hPa`;
    this.sunrise = this.convertToSearchedCityTime(currentWeatherData.sys.sunrise, currentWeatherData.timezone);
    this.sunset = this.convertToSearchedCityTime(currentWeatherData.sys.sunset, currentWeatherData.timezone);
    this.weatherConditionDesc = currentWeatherData.weather[0].description;
    this.weatherConditionImg = this.getWeatherConditionImg(currentWeatherData.weather[0].main, currentWeatherData.sys.sunrise, currentWeatherData.sys.sunset, currentWeatherData.timezone);
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
      ClearDay: "https://player.vimeo.com/external/345805150.hd.mp4?s=36c4e596b480ef0e8049370becbaf261b3989a01&profile_id=170&oauth2_token_id=57447761",
      ClearNight: "https://player.vimeo.com/external/469307950.hd.mp4?s=2e67aa02a21d5c64c6579043a78f09723ebc5ddb&profile_id=175&oauth2_token_id=57447761",
      Clouds: "https://player.vimeo.com/external/444212674.hd.mp4?s=4071981264d9e78acf09a0400e4638432495c4f0&profile_id=175&oauth2_token_id=57447761",
      Mist: "https://player.vimeo.com/external/343732132.hd.mp4?s=5bfde23f17e3858dbdc140afe7a35b6a9ef1127d&profile_id=175&oauth2_token_id=57447761",
      Rain: "https://player.vimeo.com/external/569217602.hd.mp4?s=9a96178c91fe19a6317ed594785f2e368cd1eade&profile_id=174&oauth2_token_id=57447761",
      Snow: "https://player.vimeo.com/external/510831169.hd.mp4?s=d90049559b76f0b9e0bda102ea8a7421d7a64d81&profile_id=175&oauth2_token_id=57447761",
      Thunderstorm: "https://player.vimeo.com/external/480223896.hd.mp4?s=e4b94f0b5700bfa68cb6f02b41f94ecca91242e9&profile_id=169&oauth2_token_id=57447761"
    };
    return videoLinks[weatherCondition];
  }

}

/***/ }),

/***/ "./src/scripts/models/forecastWeather.js":
/*!***********************************************!*\
  !*** ./src/scripts/models/forecastWeather.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ForecastWeather)
/* harmony export */ });
class ForecastWeather {
  constructor(forecastWeatherData, unit) {
    this.temperatures = this.getTemperatures(forecastWeatherData, unit);
    this.weatherCondition = this.getWeatherConditions(forecastWeatherData);
    this.time = this.getTimes(forecastWeatherData);
  }

  getTemperatures(forecastWeatherData, unit) {
    const temperatures = [];
    forecastWeatherData.list.forEach(item => {
      const temp = Math.round(item.main.temp);
      const tempWithUnit = this.getTemperatureUnit(temp, unit);
      temperatures.push(tempWithUnit);
    });
    return temperatures;
  }

  getTemperatureUnit(degree, unit) {
    return unit === "metric" ? `${degree}℃` : `${degree}℉`;
  }

  convertToSearchedCityDate(unixTime, timezone) {
    const localDate = new Date(unixTime * 1000);
    const utcUnixTime = localDate.getTime() + localDate.getTimezoneOffset() * 60000;
    const unixTimeInSearchedCity = utcUnixTime + timezone * 1000;
    const dateInSearchedCity = new Date(unixTimeInSearchedCity);
    return dateInSearchedCity;
  }

  getWeatherConditionImg(value, time, sunriseUnix, sunsetUnix, timezone) {
    if (value !== "Clear") return value;
    const currentHour = this.convertToSearchedCityDate(time, timezone).getHours();
    const sunriseHour = this.convertToSearchedCityDate(sunriseUnix, timezone).getHours();
    const sunsetHour = this.convertToSearchedCityDate(sunsetUnix, timezone).getHours();
    return currentHour > sunriseHour && currentHour < sunsetHour ? `${value}Day` : `${value}Night`;
  }

  getWeatherConditions(forecastWeatherData) {
    const weatherCondition = [];
    const sunriseUnix = forecastWeatherData.city.sunrise;
    const sunsetUnix = forecastWeatherData.city.sunset;
    const {
      timezone
    } = forecastWeatherData.city;
    forecastWeatherData.list.forEach(item => {
      const cond = this.getWeatherConditionImg(item.weather[0].main, item.dt, sunriseUnix, sunsetUnix, timezone);
      weatherCondition.push(cond);
    });
    return weatherCondition;
  }

  getTimes(forecastWeatherData) {
    const times = [];
    const {
      timezone
    } = forecastWeatherData.city;
    forecastWeatherData.list.forEach(item => {
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

/***/ }),

/***/ "./src/scripts/models/mainModel.js":
/*!*****************************************!*\
  !*** ./src/scripts/models/mainModel.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MainModel)
/* harmony export */ });
/* harmony import */ var _currentWeather__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./currentWeather */ "./src/scripts/models/currentWeather.js");
/* harmony import */ var _forecastWeather__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./forecastWeather */ "./src/scripts/models/forecastWeather.js");
/* harmony import */ var _cityInfo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cityInfo */ "./src/scripts/models/cityInfo.js");
/* harmony import */ var _APIs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./APIs */ "./src/scripts/models/APIs.js");




class MainModel {
  constructor() {
    this.data = {};
    this.APIs = new _APIs__WEBPACK_IMPORTED_MODULE_3__["default"]();
  }

  async getCityInfo(city, unit) {
    const ApiData = await this.APIs.getCurrentWeatherData(city, unit);
    const cityInfo = new _cityInfo__WEBPACK_IMPORTED_MODULE_2__["default"](ApiData);
    return cityInfo;
  }

  async getCurrentWeather(city, unit) {
    const currentWeatherData = await this.APIs.getCurrentWeatherData(city, unit);
    const currentWeather = new _currentWeather__WEBPACK_IMPORTED_MODULE_0__["default"](currentWeatherData, unit);
    return currentWeather;
  }

  async getForecastWeather(city, unit) {
    const forecastWeatherData = await this.APIs.getForecastWeatherData(city, unit);
    const forecastWeather = new _forecastWeather__WEBPACK_IMPORTED_MODULE_1__["default"](forecastWeatherData, unit);
    return forecastWeather;
  }

}

/***/ }),

/***/ "./src/scripts/views/cityInfoView.js":
/*!*******************************************!*\
  !*** ./src/scripts/views/cityInfoView.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CityInfoView)
/* harmony export */ });
class CityInfoView {
  constructor(element, cityInfoModel) {
    this.element = element;
    this.model = cityInfoModel;
    this.city = cityInfoModel.cityDescription;
    this.date = cityInfoModel.dateDescription;
  }

  get city() {
    return this.element.querySelector("h1");
  }

  set city(value) {
    this.city.textContent = value;
  }

  get date() {
    return this.element.querySelector("h2");
  }

  set date(value) {
    this.date.textContent = value;
  }

}

/***/ }),

/***/ "./src/scripts/views/currentWeatherView.js":
/*!*************************************************!*\
  !*** ./src/scripts/views/currentWeatherView.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CurrentWeatherView)
/* harmony export */ });
class CurrentWeatherView {
  constructor(element, currentWeatherModel) {
    this.element = element;
    this.model = currentWeatherModel;
    this.weatherConditionImg = currentWeatherModel.weatherConditionImg;
    this.temperature = currentWeatherModel.temperature;
    this.weatherConditionDesc = currentWeatherModel.weatherConditionDesc;
    this.feelsLikeTemp = currentWeatherModel.feelsLikeTemp;
    this.sunrise = currentWeatherModel.sunrise;
    this.sunset = currentWeatherModel.sunset;
    this.humidity = currentWeatherModel.humidity;
    this.windSpeed = currentWeatherModel.windSpeed;
    this.pressure = currentWeatherModel.pressure;
    this.nowWeatherCondition = currentWeatherModel.weatherConditionImg;
    this.nowTemperature = currentWeatherModel.temperature;
    this.backgroundVideo = currentWeatherModel.backgroundVideo;
  }

  get weatherConditionImg() {
    return this.element.querySelector("img");
  }

  set weatherConditionImg(value) {
    this.weatherConditionImg.src = `images/${value}.png`;
  }

  get temperature() {
    return this.element.querySelector("h1");
  }

  set temperature(value) {
    this.temperature.textContent = value;
  }

  get weatherConditionDesc() {
    return this.element.querySelector("h2");
  }

  set weatherConditionDesc(value) {
    this.weatherConditionDesc.textContent = value;
  }

  get feelsLikeTemp() {
    return this.element.querySelector(".feels-like");
  }

  set feelsLikeTemp(value) {
    this.feelsLikeTemp.textContent = value;
  }

  get sunrise() {
    return this.element.querySelector(".sunrise");
  }

  set sunrise(value) {
    this.sunrise.textContent = value;
  }

  get sunset() {
    return this.element.querySelector(".sunset");
  }

  set sunset(value) {
    this.sunset.textContent = value;
  }

  get humidity() {
    return this.element.querySelector(".humidity");
  }

  set humidity(value) {
    this.humidity.textContent = value;
  }

  get windSpeed() {
    return this.element.querySelector(".wind-speed");
  }

  set windSpeed(value) {
    this.windSpeed.textContent = value;
  }

  get pressure() {
    return this.element.querySelector(".pressure");
  }

  set pressure(value) {
    this.pressure.textContent = value;
  }

  get nowWeatherCondition() {
    return document.getElementById("forecast__item__current-condition");
  }

  set nowWeatherCondition(value) {
    this.nowWeatherCondition.src = `images/${value}.png`;
  }

  get nowTemperature() {
    return document.getElementById("forecast__item__curent-temp");
  }

  set nowTemperature(value) {
    this.nowTemperature.textContent = value;
  }

  get backgroundVideo() {
    return document.getElementById("video");
  }

  set backgroundVideo(value) {
    this.backgroundVideo.src = value;
  }

}

/***/ }),

/***/ "./src/scripts/views/forecastWeatherView.js":
/*!**************************************************!*\
  !*** ./src/scripts/views/forecastWeatherView.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ forecastWeatherView)
/* harmony export */ });
class forecastWeatherView {
  constructor(element, forecastWeatherModel) {
    this.element = element;
    this.model = forecastWeatherModel;
    this.time = forecastWeatherModel.time;
    this.weatherCondition = forecastWeatherModel.weatherCondition;
    this.temperatures = forecastWeatherModel.temperatures;
  }

  get time() {
    return this.element.querySelectorAll(".forecast__item__time");
  }

  set time(value) {
    for (let i = 0; i < this.time.length; i++) {
      this.time[i].textContent = value[i];
    }
  }

  get weatherCondition() {
    return this.element.querySelectorAll("img");
  }

  set weatherCondition(value) {
    for (let i = 1; i < this.weatherCondition.length; i++) {
      this.weatherCondition[i].src = `images/${value[i - 1]}.png`;
    }
  }

  get temperatures() {
    return this.element.querySelectorAll(".forecast__item__temperature");
  }

  set temperatures(value) {
    for (let i = 0; i < this.time.length; i++) {
      this.temperatures[i].textContent = value[i];
    }
  }

}

/***/ }),

/***/ "./src/scripts/views/mainView.js":
/*!***************************************!*\
  !*** ./src/scripts/views/mainView.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MainView)
/* harmony export */ });
/* harmony import */ var _cityInfoView__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cityInfoView */ "./src/scripts/views/cityInfoView.js");
/* harmony import */ var _currentWeatherView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./currentWeatherView */ "./src/scripts/views/currentWeatherView.js");
/* harmony import */ var _forecastWeatherView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./forecastWeatherView */ "./src/scripts/views/forecastWeatherView.js");



class MainView {
  appendCityInfo(cityInfo) {
    const element = document.getElementById("city-info");
    new _cityInfoView__WEBPACK_IMPORTED_MODULE_0__["default"](element, cityInfo);
  }

  appendCurrentWeather(currentWeather) {
    const element = document.getElementById("current-weather");
    new _currentWeatherView__WEBPACK_IMPORTED_MODULE_1__["default"](element, currentWeather);
  }

  appendForecastWeather(forecastWeather) {
    const element = document.getElementById("forecast");
    new _forecastWeatherView__WEBPACK_IMPORTED_MODULE_2__["default"](element, forecastWeather);
  }

  changeUnitTemp(unit) {
    if (unit === "imperial") {
      document.querySelector(".unitC").style.color = "white";
      document.querySelector(".unitF").style.color = "black";
    } else {
      document.querySelector(".unitF").style.color = "white";
      document.querySelector(".unitC").style.color = "black";
    }
  }

}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/main.css":
/*!*******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/main.css ***!
  \*******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./normalize.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/normalize.css");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3__);
// Imports




var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../images/magnify.png */ "./src/images/magnify.png"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ":root {\n  --clr-neutral: hsl(0, 0%, 100%);\n  --clr-neutral-transp: rgba(255, 255, 255, 0.171);\n  --ff-primary: \"Poppins\", sans-serif;\n  --fw-300: 300;\n  --fw-400: 400;\n  --fw-500: 500;\n  --fw-600: 600;\n  --fw-700: 700;\n}\n\n*,\n*::before,\n*::after {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  text-shadow: 2px 2px 8px #000000;\n}\n\nbody {\n  width: 100vw;\n  min-height: 100vh;\n  background-color: rgb(212, 207, 207);\n  font-family: var(--ff-primary);\n  color: var(--clr-neutral);\n}\n\nmain {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n  position: relative;\n  width: 100vw;\n  min-height: 100vh;\n  padding: 4rem 2rem;\n  overflow: hidden;\n}\n\n.video-container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  z-index: -5;\n}\n\nvideo {\n  width: 100vw;\n  height: 100vh;\n  object-fit: cover;\n}\n\n.unitC,\n.unitF {\n  font-size: 0.85rem;\n  height: 16px;\n  width: 16px;\n  border-radius: 8px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  color: black;\n  z-index: 20;\n  pointer-events: none;\n  text-shadow: none;\n}\n\n.unitF {\n  color: white;\n}\n\n.checkbox-container {\n  position: absolute;\n  top: 3rem;\n  right: 3rem;\n}\n\n.checkbox {\n  opacity: 0;\n  position: absolute;\n}\n\n.label {\n  background-color: #111;\n  border-radius: 50px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 5px;\n  position: relative;\n  height: 26px;\n  width: 50px;\n  transform: scale(1.5);\n}\n\n.label .ball {\n  background-color: #fff;\n  border-radius: 50%;\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  height: 22px;\n  width: 22px;\n  transform: translateX(0px);\n  transition: transform 0.2s linear;\n}\n\n.checkbox:checked + .label .ball {\n  transform: translateX(24px);\n}\n\n.search-wrapper {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 10px;\n}\n\n.search-wrapper input {\n  width: 40%;\n  padding: 10px 10px 10px 40px;\n  border-radius: 2rem;\n  border: none;\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n  background-repeat: no-repeat;\n  background-position: 10px center;\n  background-size: calc(1rem + 0.5vw);\n  background-color: white;\n  text-shadow: none;\n}\n\n#error {\n  display: none;\n}\n\n.city-info h1 {\n  margin: 0.3rem 0;\n  letter-spacing: 0.1rem;\n  font-weight: var(--fw-600);\n  font-size: 2.5rem;\n}\n\nh2 {\n  font-size: 1.1rem;\n  font-weight: var(--fw-300);\n}\n\n.current-weather {\n  display: flex;\n  justify-content: space-around;\n}\n\n.current-weather_cointainer {\n  display: flex;\n}\n\n.current-weather_cointainer img {\n  width: calc(10rem + 10vw);\n}\n\n.current-weather_cointainer h1 {\n  margin: 0.3rem 0;\n  font-size: 4rem;\n  font-weight: var(--fw-400);\n}\n\n.current-weather_temp {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n.current-weather__details {\n  display: flex;\n  align-items: center;\n  align-self: center;\n  height: max-content;\n  padding: 2rem 4rem;\n  gap: 4rem;\n  border-radius: 0.5rem;\n  background-color: var(--clr-neutral-transp);\n}\n\n.current-weather__item {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 1rem;\n}\n\n.current-weather__item img {\n  width: calc(1rem + 1vw);\n}\n\n.current-weather__details__column {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n\n.forecast {\n  display: flex;\n  justify-content: space-around;\n  width: 100%;\n  padding: 1rem 2rem;\n  border-radius: 0.5rem;\n  background-color: var(--clr-neutral-transp);\n}\n\n.forecast__item {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.forecast__item img {\n  width: calc(2rem + 3vw);\n}\n", "",{"version":3,"sources":["webpack://./src/styles/main.css"],"names":[],"mappings":"AAEA;EACE,+BAA+B;EAC/B,gDAAgD;EAChD,mCAAmC;EACnC,aAAa;EACb,aAAa;EACb,aAAa;EACb,aAAa;EACb,aAAa;AACf;;AAEA;;;EAGE,SAAS;EACT,UAAU;EACV,sBAAsB;EACtB,gCAAgC;AAClC;;AAEA;EACE,YAAY;EACZ,iBAAiB;EACjB,oCAAoC;EACpC,8BAA8B;EAC9B,yBAAyB;AAC3B;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,6BAA6B;EAC7B,kBAAkB;EAClB,YAAY;EACZ,iBAAiB;EACjB,kBAAkB;EAClB,gBAAgB;AAClB;;AAEA;EACE,kBAAkB;EAClB,MAAM;EACN,OAAO;EACP,YAAY;EACZ,aAAa;EACb,WAAW;AACb;;AAEA;EACE,YAAY;EACZ,aAAa;EACb,iBAAiB;AACnB;;AAEA;;EAEE,kBAAkB;EAClB,YAAY;EACZ,WAAW;EACX,kBAAkB;EAClB,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,YAAY;EACZ,WAAW;EACX,oBAAoB;EACpB,iBAAiB;AACnB;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,kBAAkB;EAClB,SAAS;EACT,WAAW;AACb;;AAEA;EACE,UAAU;EACV,kBAAkB;AACpB;;AAEA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,8BAA8B;EAC9B,YAAY;EACZ,kBAAkB;EAClB,YAAY;EACZ,WAAW;EACX,qBAAqB;AACvB;;AAEA;EACE,sBAAsB;EACtB,kBAAkB;EAClB,kBAAkB;EAClB,QAAQ;EACR,SAAS;EACT,YAAY;EACZ,WAAW;EACX,0BAA0B;EAC1B,iCAAiC;AACnC;;AAEA;EACE,2BAA2B;AAC7B;;AAEA;EACE,kBAAkB;EAClB,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,SAAS;AACX;;AAEA;EACE,UAAU;EACV,4BAA4B;EAC5B,mBAAmB;EACnB,YAAY;EACZ,yDAA4C;EAC5C,4BAA4B;EAC5B,gCAAgC;EAChC,mCAAmC;EACnC,uBAAuB;EACvB,iBAAiB;AACnB;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,gBAAgB;EAChB,sBAAsB;EACtB,0BAA0B;EAC1B,iBAAiB;AACnB;;AAEA;EACE,iBAAiB;EACjB,0BAA0B;AAC5B;;AAEA;EACE,aAAa;EACb,6BAA6B;AAC/B;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,gBAAgB;EAChB,eAAe;EACf,0BAA0B;AAC5B;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,uBAAuB;AACzB;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,kBAAkB;EAClB,mBAAmB;EACnB,kBAAkB;EAClB,SAAS;EACT,qBAAqB;EACrB,2CAA2C;AAC7C;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,WAAW;EACX,eAAe;AACjB;;AAEA;EACE,uBAAuB;AACzB;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,SAAS;AACX;;AAEA;EACE,aAAa;EACb,6BAA6B;EAC7B,WAAW;EACX,kBAAkB;EAClB,qBAAqB;EACrB,2CAA2C;AAC7C;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;AACrB;;AAEA;EACE,uBAAuB;AACzB","sourcesContent":["@import url(./normalize.css);\n\n:root {\n  --clr-neutral: hsl(0, 0%, 100%);\n  --clr-neutral-transp: rgba(255, 255, 255, 0.171);\n  --ff-primary: \"Poppins\", sans-serif;\n  --fw-300: 300;\n  --fw-400: 400;\n  --fw-500: 500;\n  --fw-600: 600;\n  --fw-700: 700;\n}\n\n*,\n*::before,\n*::after {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  text-shadow: 2px 2px 8px #000000;\n}\n\nbody {\n  width: 100vw;\n  min-height: 100vh;\n  background-color: rgb(212, 207, 207);\n  font-family: var(--ff-primary);\n  color: var(--clr-neutral);\n}\n\nmain {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n  position: relative;\n  width: 100vw;\n  min-height: 100vh;\n  padding: 4rem 2rem;\n  overflow: hidden;\n}\n\n.video-container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  z-index: -5;\n}\n\nvideo {\n  width: 100vw;\n  height: 100vh;\n  object-fit: cover;\n}\n\n.unitC,\n.unitF {\n  font-size: 0.85rem;\n  height: 16px;\n  width: 16px;\n  border-radius: 8px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  color: black;\n  z-index: 20;\n  pointer-events: none;\n  text-shadow: none;\n}\n\n.unitF {\n  color: white;\n}\n\n.checkbox-container {\n  position: absolute;\n  top: 3rem;\n  right: 3rem;\n}\n\n.checkbox {\n  opacity: 0;\n  position: absolute;\n}\n\n.label {\n  background-color: #111;\n  border-radius: 50px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 5px;\n  position: relative;\n  height: 26px;\n  width: 50px;\n  transform: scale(1.5);\n}\n\n.label .ball {\n  background-color: #fff;\n  border-radius: 50%;\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  height: 22px;\n  width: 22px;\n  transform: translateX(0px);\n  transition: transform 0.2s linear;\n}\n\n.checkbox:checked + .label .ball {\n  transform: translateX(24px);\n}\n\n.search-wrapper {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 10px;\n}\n\n.search-wrapper input {\n  width: 40%;\n  padding: 10px 10px 10px 40px;\n  border-radius: 2rem;\n  border: none;\n  background-image: url(../images/magnify.png);\n  background-repeat: no-repeat;\n  background-position: 10px center;\n  background-size: calc(1rem + 0.5vw);\n  background-color: white;\n  text-shadow: none;\n}\n\n#error {\n  display: none;\n}\n\n.city-info h1 {\n  margin: 0.3rem 0;\n  letter-spacing: 0.1rem;\n  font-weight: var(--fw-600);\n  font-size: 2.5rem;\n}\n\nh2 {\n  font-size: 1.1rem;\n  font-weight: var(--fw-300);\n}\n\n.current-weather {\n  display: flex;\n  justify-content: space-around;\n}\n\n.current-weather_cointainer {\n  display: flex;\n}\n\n.current-weather_cointainer img {\n  width: calc(10rem + 10vw);\n}\n\n.current-weather_cointainer h1 {\n  margin: 0.3rem 0;\n  font-size: 4rem;\n  font-weight: var(--fw-400);\n}\n\n.current-weather_temp {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n.current-weather__details {\n  display: flex;\n  align-items: center;\n  align-self: center;\n  height: max-content;\n  padding: 2rem 4rem;\n  gap: 4rem;\n  border-radius: 0.5rem;\n  background-color: var(--clr-neutral-transp);\n}\n\n.current-weather__item {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 1rem;\n}\n\n.current-weather__item img {\n  width: calc(1rem + 1vw);\n}\n\n.current-weather__details__column {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n\n.forecast {\n  display: flex;\n  justify-content: space-around;\n  width: 100%;\n  padding: 1rem 2rem;\n  border-radius: 0.5rem;\n  background-color: var(--clr-neutral-transp);\n}\n\n.forecast__item {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.forecast__item img {\n  width: calc(2rem + 3vw);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/normalize.css":
/*!************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/normalize.css ***!
  \************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\n html {\n    line-height: 1.15; /* 1 */\n    -webkit-text-size-adjust: 100%; /* 2 */\n  }\n  \n  /* Sections\n     ========================================================================== */\n  \n  /**\n   * Remove the margin in all browsers.\n   */\n  \n  body {\n    margin: 0;\n  }\n  \n  /**\n   * Render the `main` element consistently in IE.\n   */\n  \n  main {\n    display: block;\n  }\n  \n  /**\n   * Correct the font size and margin on `h1` elements within `section` and\n   * `article` contexts in Chrome, Firefox, and Safari.\n   */\n  \n  h1 {\n    font-size: 2em;\n    margin: 0.67em 0;\n  }\n  \n  /* Grouping content\n     ========================================================================== */\n  \n  /**\n   * 1. Add the correct box sizing in Firefox.\n   * 2. Show the overflow in Edge and IE.\n   */\n  \n  hr {\n    box-sizing: content-box; /* 1 */\n    height: 0; /* 1 */\n    overflow: visible; /* 2 */\n  }\n  \n  /**\n   * 1. Correct the inheritance and scaling of font size in all browsers.\n   * 2. Correct the odd `em` font sizing in all browsers.\n   */\n  \n  pre {\n    font-family: monospace, monospace; /* 1 */\n    font-size: 1em; /* 2 */\n  }\n  \n  /* Text-level semantics\n     ========================================================================== */\n  \n  /**\n   * Remove the gray background on active links in IE 10.\n   */\n  \n  a {\n    background-color: transparent;\n  }\n  \n  /**\n   * 1. Remove the bottom border in Chrome 57-\n   * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n   */\n  \n  abbr[title] {\n    border-bottom: none; /* 1 */\n    text-decoration: underline; /* 2 */\n    text-decoration: underline dotted; /* 2 */\n  }\n  \n  /**\n   * Add the correct font weight in Chrome, Edge, and Safari.\n   */\n  \n  b,\n  strong {\n    font-weight: bolder;\n  }\n  \n  /**\n   * 1. Correct the inheritance and scaling of font size in all browsers.\n   * 2. Correct the odd `em` font sizing in all browsers.\n   */\n  \n  code,\n  kbd,\n  samp {\n    font-family: monospace, monospace; /* 1 */\n    font-size: 1em; /* 2 */\n  }\n  \n  /**\n   * Add the correct font size in all browsers.\n   */\n  \n  small {\n    font-size: 80%;\n  }\n  \n  /**\n   * Prevent `sub` and `sup` elements from affecting the line height in\n   * all browsers.\n   */\n  \n  sub,\n  sup {\n    font-size: 75%;\n    line-height: 0;\n    position: relative;\n    vertical-align: baseline;\n  }\n  \n  sub {\n    bottom: -0.25em;\n  }\n  \n  sup {\n    top: -0.5em;\n  }\n  \n  /* Embedded content\n     ========================================================================== */\n  \n  /**\n   * Remove the border on images inside links in IE 10.\n   */\n  \n  img {\n    border-style: none;\n  }\n  \n  /* Forms\n     ========================================================================== */\n  \n  /**\n   * 1. Change the font styles in all browsers.\n   * 2. Remove the margin in Firefox and Safari.\n   */\n  \n  button,\n  input,\n  optgroup,\n  select,\n  textarea {\n    font-family: inherit; /* 1 */\n    font-size: 100%; /* 1 */\n    line-height: 1.15; /* 1 */\n    margin: 0; /* 2 */\n  }\n  \n  /**\n   * Show the overflow in IE.\n   * 1. Show the overflow in Edge.\n   */\n  \n  button,\n  input { /* 1 */\n    overflow: visible;\n  }\n  \n  /**\n   * Remove the inheritance of text transform in Edge, Firefox, and IE.\n   * 1. Remove the inheritance of text transform in Firefox.\n   */\n  \n  button,\n  select { /* 1 */\n    text-transform: none;\n  }\n  \n  /**\n   * Correct the inability to style clickable types in iOS and Safari.\n   */\n  \n  button,\n  [type=\"button\"],\n  [type=\"reset\"],\n  [type=\"submit\"] {\n    -webkit-appearance: button;\n  }\n  \n  /**\n   * Remove the inner border and padding in Firefox.\n   */\n  \n  button::-moz-focus-inner,\n  [type=\"button\"]::-moz-focus-inner,\n  [type=\"reset\"]::-moz-focus-inner,\n  [type=\"submit\"]::-moz-focus-inner {\n    border-style: none;\n    padding: 0;\n  }\n  \n  /**\n   * Restore the focus styles unset by the previous rule.\n   */\n  \n  button:-moz-focusring,\n  [type=\"button\"]:-moz-focusring,\n  [type=\"reset\"]:-moz-focusring,\n  [type=\"submit\"]:-moz-focusring {\n    outline: 1px dotted ButtonText;\n  }\n  \n  /**\n   * Correct the padding in Firefox.\n   */\n  \n  fieldset {\n    padding: 0.35em 0.75em 0.625em;\n  }\n  \n  /**\n   * 1. Correct the text wrapping in Edge and IE.\n   * 2. Correct the color inheritance from `fieldset` elements in IE.\n   * 3. Remove the padding so developers are not caught out when they zero out\n   *    `fieldset` elements in all browsers.\n   */\n  \n  legend {\n    box-sizing: border-box; /* 1 */\n    color: inherit; /* 2 */\n    display: table; /* 1 */\n    max-width: 100%; /* 1 */\n    padding: 0; /* 3 */\n    white-space: normal; /* 1 */\n  }\n  \n  /**\n   * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n   */\n  \n  progress {\n    vertical-align: baseline;\n  }\n  \n  /**\n   * Remove the default vertical scrollbar in IE 10+.\n   */\n  \n  textarea {\n    overflow: auto;\n  }\n  \n  /**\n   * 1. Add the correct box sizing in IE 10.\n   * 2. Remove the padding in IE 10.\n   */\n  \n  [type=\"checkbox\"],\n  [type=\"radio\"] {\n    box-sizing: border-box; /* 1 */\n    padding: 0; /* 2 */\n  }\n  \n  /**\n   * Correct the cursor style of increment and decrement buttons in Chrome.\n   */\n  \n  [type=\"number\"]::-webkit-inner-spin-button,\n  [type=\"number\"]::-webkit-outer-spin-button {\n    height: auto;\n  }\n  \n  /**\n   * 1. Correct the odd appearance in Chrome and Safari.\n   * 2. Correct the outline style in Safari.\n   */\n  \n  [type=\"search\"] {\n    -webkit-appearance: textfield; /* 1 */\n    outline-offset: -2px; /* 2 */\n  }\n  \n  /**\n   * Remove the inner padding in Chrome and Safari on macOS.\n   */\n  \n  [type=\"search\"]::-webkit-search-decoration {\n    -webkit-appearance: none;\n  }\n  \n  /**\n   * 1. Correct the inability to style clickable types in iOS and Safari.\n   * 2. Change font properties to `inherit` in Safari.\n   */\n  \n  ::-webkit-file-upload-button {\n    -webkit-appearance: button; /* 1 */\n    font: inherit; /* 2 */\n  }\n  \n  /* Interactive\n     ========================================================================== */\n  \n  /*\n   * Add the correct display in Edge, IE 10+, and Firefox.\n   */\n  \n  details {\n    display: block;\n  }\n  \n  /*\n   * Add the correct display in all browsers.\n   */\n  \n  summary {\n    display: list-item;\n  }\n  \n  /* Misc\n     ========================================================================== */\n  \n  /**\n   * Add the correct display in IE 10+.\n   */\n  \n  template {\n    display: none;\n  }\n  \n  /**\n   * Add the correct display in IE 10.\n   */\n  \n  [hidden] {\n    display: none;\n  }", "",{"version":3,"sources":["webpack://./src/styles/normalize.css"],"names":[],"mappings":"AAAA,2EAA2E;;AAE3E;+EAC+E;;AAE/E;;;EAGE;;CAED;IACG,iBAAiB,EAAE,MAAM;IACzB,8BAA8B,EAAE,MAAM;EACxC;;EAEA;iFAC+E;;EAE/E;;IAEE;;EAEF;IACE,SAAS;EACX;;EAEA;;IAEE;;EAEF;IACE,cAAc;EAChB;;EAEA;;;IAGE;;EAEF;IACE,cAAc;IACd,gBAAgB;EAClB;;EAEA;iFAC+E;;EAE/E;;;IAGE;;EAEF;IACE,uBAAuB,EAAE,MAAM;IAC/B,SAAS,EAAE,MAAM;IACjB,iBAAiB,EAAE,MAAM;EAC3B;;EAEA;;;IAGE;;EAEF;IACE,iCAAiC,EAAE,MAAM;IACzC,cAAc,EAAE,MAAM;EACxB;;EAEA;iFAC+E;;EAE/E;;IAEE;;EAEF;IACE,6BAA6B;EAC/B;;EAEA;;;IAGE;;EAEF;IACE,mBAAmB,EAAE,MAAM;IAC3B,0BAA0B,EAAE,MAAM;IAClC,iCAAiC,EAAE,MAAM;EAC3C;;EAEA;;IAEE;;EAEF;;IAEE,mBAAmB;EACrB;;EAEA;;;IAGE;;EAEF;;;IAGE,iCAAiC,EAAE,MAAM;IACzC,cAAc,EAAE,MAAM;EACxB;;EAEA;;IAEE;;EAEF;IACE,cAAc;EAChB;;EAEA;;;IAGE;;EAEF;;IAEE,cAAc;IACd,cAAc;IACd,kBAAkB;IAClB,wBAAwB;EAC1B;;EAEA;IACE,eAAe;EACjB;;EAEA;IACE,WAAW;EACb;;EAEA;iFAC+E;;EAE/E;;IAEE;;EAEF;IACE,kBAAkB;EACpB;;EAEA;iFAC+E;;EAE/E;;;IAGE;;EAEF;;;;;IAKE,oBAAoB,EAAE,MAAM;IAC5B,eAAe,EAAE,MAAM;IACvB,iBAAiB,EAAE,MAAM;IACzB,SAAS,EAAE,MAAM;EACnB;;EAEA;;;IAGE;;EAEF;UACQ,MAAM;IACZ,iBAAiB;EACnB;;EAEA;;;IAGE;;EAEF;WACS,MAAM;IACb,oBAAoB;EACtB;;EAEA;;IAEE;;EAEF;;;;IAIE,0BAA0B;EAC5B;;EAEA;;IAEE;;EAEF;;;;IAIE,kBAAkB;IAClB,UAAU;EACZ;;EAEA;;IAEE;;EAEF;;;;IAIE,8BAA8B;EAChC;;EAEA;;IAEE;;EAEF;IACE,8BAA8B;EAChC;;EAEA;;;;;IAKE;;EAEF;IACE,sBAAsB,EAAE,MAAM;IAC9B,cAAc,EAAE,MAAM;IACtB,cAAc,EAAE,MAAM;IACtB,eAAe,EAAE,MAAM;IACvB,UAAU,EAAE,MAAM;IAClB,mBAAmB,EAAE,MAAM;EAC7B;;EAEA;;IAEE;;EAEF;IACE,wBAAwB;EAC1B;;EAEA;;IAEE;;EAEF;IACE,cAAc;EAChB;;EAEA;;;IAGE;;EAEF;;IAEE,sBAAsB,EAAE,MAAM;IAC9B,UAAU,EAAE,MAAM;EACpB;;EAEA;;IAEE;;EAEF;;IAEE,YAAY;EACd;;EAEA;;;IAGE;;EAEF;IACE,6BAA6B,EAAE,MAAM;IACrC,oBAAoB,EAAE,MAAM;EAC9B;;EAEA;;IAEE;;EAEF;IACE,wBAAwB;EAC1B;;EAEA;;;IAGE;;EAEF;IACE,0BAA0B,EAAE,MAAM;IAClC,aAAa,EAAE,MAAM;EACvB;;EAEA;iFAC+E;;EAE/E;;IAEE;;EAEF;IACE,cAAc;EAChB;;EAEA;;IAEE;;EAEF;IACE,kBAAkB;EACpB;;EAEA;iFAC+E;;EAE/E;;IAEE;;EAEF;IACE,aAAa;EACf;;EAEA;;IAEE;;EAEF;IACE,aAAa;EACf","sourcesContent":["/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\n html {\n    line-height: 1.15; /* 1 */\n    -webkit-text-size-adjust: 100%; /* 2 */\n  }\n  \n  /* Sections\n     ========================================================================== */\n  \n  /**\n   * Remove the margin in all browsers.\n   */\n  \n  body {\n    margin: 0;\n  }\n  \n  /**\n   * Render the `main` element consistently in IE.\n   */\n  \n  main {\n    display: block;\n  }\n  \n  /**\n   * Correct the font size and margin on `h1` elements within `section` and\n   * `article` contexts in Chrome, Firefox, and Safari.\n   */\n  \n  h1 {\n    font-size: 2em;\n    margin: 0.67em 0;\n  }\n  \n  /* Grouping content\n     ========================================================================== */\n  \n  /**\n   * 1. Add the correct box sizing in Firefox.\n   * 2. Show the overflow in Edge and IE.\n   */\n  \n  hr {\n    box-sizing: content-box; /* 1 */\n    height: 0; /* 1 */\n    overflow: visible; /* 2 */\n  }\n  \n  /**\n   * 1. Correct the inheritance and scaling of font size in all browsers.\n   * 2. Correct the odd `em` font sizing in all browsers.\n   */\n  \n  pre {\n    font-family: monospace, monospace; /* 1 */\n    font-size: 1em; /* 2 */\n  }\n  \n  /* Text-level semantics\n     ========================================================================== */\n  \n  /**\n   * Remove the gray background on active links in IE 10.\n   */\n  \n  a {\n    background-color: transparent;\n  }\n  \n  /**\n   * 1. Remove the bottom border in Chrome 57-\n   * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n   */\n  \n  abbr[title] {\n    border-bottom: none; /* 1 */\n    text-decoration: underline; /* 2 */\n    text-decoration: underline dotted; /* 2 */\n  }\n  \n  /**\n   * Add the correct font weight in Chrome, Edge, and Safari.\n   */\n  \n  b,\n  strong {\n    font-weight: bolder;\n  }\n  \n  /**\n   * 1. Correct the inheritance and scaling of font size in all browsers.\n   * 2. Correct the odd `em` font sizing in all browsers.\n   */\n  \n  code,\n  kbd,\n  samp {\n    font-family: monospace, monospace; /* 1 */\n    font-size: 1em; /* 2 */\n  }\n  \n  /**\n   * Add the correct font size in all browsers.\n   */\n  \n  small {\n    font-size: 80%;\n  }\n  \n  /**\n   * Prevent `sub` and `sup` elements from affecting the line height in\n   * all browsers.\n   */\n  \n  sub,\n  sup {\n    font-size: 75%;\n    line-height: 0;\n    position: relative;\n    vertical-align: baseline;\n  }\n  \n  sub {\n    bottom: -0.25em;\n  }\n  \n  sup {\n    top: -0.5em;\n  }\n  \n  /* Embedded content\n     ========================================================================== */\n  \n  /**\n   * Remove the border on images inside links in IE 10.\n   */\n  \n  img {\n    border-style: none;\n  }\n  \n  /* Forms\n     ========================================================================== */\n  \n  /**\n   * 1. Change the font styles in all browsers.\n   * 2. Remove the margin in Firefox and Safari.\n   */\n  \n  button,\n  input,\n  optgroup,\n  select,\n  textarea {\n    font-family: inherit; /* 1 */\n    font-size: 100%; /* 1 */\n    line-height: 1.15; /* 1 */\n    margin: 0; /* 2 */\n  }\n  \n  /**\n   * Show the overflow in IE.\n   * 1. Show the overflow in Edge.\n   */\n  \n  button,\n  input { /* 1 */\n    overflow: visible;\n  }\n  \n  /**\n   * Remove the inheritance of text transform in Edge, Firefox, and IE.\n   * 1. Remove the inheritance of text transform in Firefox.\n   */\n  \n  button,\n  select { /* 1 */\n    text-transform: none;\n  }\n  \n  /**\n   * Correct the inability to style clickable types in iOS and Safari.\n   */\n  \n  button,\n  [type=\"button\"],\n  [type=\"reset\"],\n  [type=\"submit\"] {\n    -webkit-appearance: button;\n  }\n  \n  /**\n   * Remove the inner border and padding in Firefox.\n   */\n  \n  button::-moz-focus-inner,\n  [type=\"button\"]::-moz-focus-inner,\n  [type=\"reset\"]::-moz-focus-inner,\n  [type=\"submit\"]::-moz-focus-inner {\n    border-style: none;\n    padding: 0;\n  }\n  \n  /**\n   * Restore the focus styles unset by the previous rule.\n   */\n  \n  button:-moz-focusring,\n  [type=\"button\"]:-moz-focusring,\n  [type=\"reset\"]:-moz-focusring,\n  [type=\"submit\"]:-moz-focusring {\n    outline: 1px dotted ButtonText;\n  }\n  \n  /**\n   * Correct the padding in Firefox.\n   */\n  \n  fieldset {\n    padding: 0.35em 0.75em 0.625em;\n  }\n  \n  /**\n   * 1. Correct the text wrapping in Edge and IE.\n   * 2. Correct the color inheritance from `fieldset` elements in IE.\n   * 3. Remove the padding so developers are not caught out when they zero out\n   *    `fieldset` elements in all browsers.\n   */\n  \n  legend {\n    box-sizing: border-box; /* 1 */\n    color: inherit; /* 2 */\n    display: table; /* 1 */\n    max-width: 100%; /* 1 */\n    padding: 0; /* 3 */\n    white-space: normal; /* 1 */\n  }\n  \n  /**\n   * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n   */\n  \n  progress {\n    vertical-align: baseline;\n  }\n  \n  /**\n   * Remove the default vertical scrollbar in IE 10+.\n   */\n  \n  textarea {\n    overflow: auto;\n  }\n  \n  /**\n   * 1. Add the correct box sizing in IE 10.\n   * 2. Remove the padding in IE 10.\n   */\n  \n  [type=\"checkbox\"],\n  [type=\"radio\"] {\n    box-sizing: border-box; /* 1 */\n    padding: 0; /* 2 */\n  }\n  \n  /**\n   * Correct the cursor style of increment and decrement buttons in Chrome.\n   */\n  \n  [type=\"number\"]::-webkit-inner-spin-button,\n  [type=\"number\"]::-webkit-outer-spin-button {\n    height: auto;\n  }\n  \n  /**\n   * 1. Correct the odd appearance in Chrome and Safari.\n   * 2. Correct the outline style in Safari.\n   */\n  \n  [type=\"search\"] {\n    -webkit-appearance: textfield; /* 1 */\n    outline-offset: -2px; /* 2 */\n  }\n  \n  /**\n   * Remove the inner padding in Chrome and Safari on macOS.\n   */\n  \n  [type=\"search\"]::-webkit-search-decoration {\n    -webkit-appearance: none;\n  }\n  \n  /**\n   * 1. Correct the inability to style clickable types in iOS and Safari.\n   * 2. Change font properties to `inherit` in Safari.\n   */\n  \n  ::-webkit-file-upload-button {\n    -webkit-appearance: button; /* 1 */\n    font: inherit; /* 2 */\n  }\n  \n  /* Interactive\n     ========================================================================== */\n  \n  /*\n   * Add the correct display in Edge, IE 10+, and Firefox.\n   */\n  \n  details {\n    display: block;\n  }\n  \n  /*\n   * Add the correct display in all browsers.\n   */\n  \n  summary {\n    display: list-item;\n  }\n  \n  /* Misc\n     ========================================================================== */\n  \n  /**\n   * Add the correct display in IE 10+.\n   */\n  \n  template {\n    display: none;\n  }\n  \n  /**\n   * Add the correct display in IE 10.\n   */\n  \n  [hidden] {\n    display: none;\n  }"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }

  if (!url) {
    return url;
  }

  url = String(url.__esModule ? url.default : url); // If url is already wrapped in quotes, remove them

  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }

  if (options.hash) {
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles/main.css":
/*!*****************************!*\
  !*** ./src/styles/main.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./main.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/main.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./src/images/magnify.png":
/*!********************************!*\
  !*** ./src/images/magnify.png ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "001051c069dde3ca2ccb.png";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************************!*\
  !*** ./src/scripts/index.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles/main.css */ "./src/styles/main.css");
/* harmony import */ var _models_mainModel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models/mainModel */ "./src/scripts/models/mainModel.js");
/* harmony import */ var _views_mainView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./views/mainView */ "./src/scripts/views/mainView.js");
/* harmony import */ var _controllers_mainController__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./controllers/mainController */ "./src/scripts/controllers/mainController.js");




const model = new _models_mainModel__WEBPACK_IMPORTED_MODULE_1__["default"]();
const view = new _views_mainView__WEBPACK_IMPORTED_MODULE_2__["default"]();
const controller = new _controllers_mainController__WEBPACK_IMPORTED_MODULE_3__["default"](model, view);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NmQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7Ozs7O1dDckJBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBLE1BQU16SyxLQUFLLEdBQUcsSUFBSXNKLHlEQUFKLEVBQWQ7QUFDQSxNQUFNckosSUFBSSxHQUFHLElBQUl1Syx1REFBSixFQUFiO0FBQ0EsTUFBTUUsVUFBVSxHQUFHLElBQUk1SyxtRUFBSixDQUFtQkUsS0FBbkIsRUFBMEJDLElBQTFCLENBQW5CLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc2NyaXB0cy9jb250cm9sbGVycy9tYWluQ29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc2NyaXB0cy9tb2RlbHMvQVBJcy5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc2NyaXB0cy9tb2RlbHMvY2l0eUluZm8uanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3NjcmlwdHMvbW9kZWxzL2N1cnJlbnRXZWF0aGVyLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL3NyYy9zY3JpcHRzL21vZGVscy9mb3JlY2FzdFdlYXRoZXIuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3NjcmlwdHMvbW9kZWxzL21haW5Nb2RlbC5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc2NyaXB0cy92aWV3cy9jaXR5SW5mb1ZpZXcuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3NjcmlwdHMvdmlld3MvY3VycmVudFdlYXRoZXJWaWV3LmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL3NyYy9zY3JpcHRzL3ZpZXdzL2ZvcmVjYXN0V2VhdGhlclZpZXcuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3NjcmlwdHMvdmlld3MvbWFpblZpZXcuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3N0eWxlcy9tYWluLmNzcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc3R5bGVzL25vcm1hbGl6ZS5jc3MiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL3NyYy9zdHlsZXMvbWFpbi5jc3M/ZTgwYSIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3NjcmlwdHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFpbkNvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3Rvcihtb2RlbCwgdmlldykge1xuICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgIHRoaXMuY2l0eSA9IHt9O1xuICAgIHRoaXMudW5pdCA9IFwibWV0cmljXCI7XG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaFwiKS5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoZSkgPT4gdGhpcy5sb2FkUGFnZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaFwiKS52YWx1ZSkpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCAoZSkgPT4gdGhpcy5jaGVja0lmRW50ZXIoZSkpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB0aGlzLmxvYWRQYWdlKFwibmV3IHlvcmtcIikpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hlY2tib3gtdW5pdFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB0aGlzLmNoYW5nZVRlbXBlcmF0dXJlKGUpKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRQYWdlKGNpdHkpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZpZGVvXCIpLnBsYXliYWNrUmF0ZSA9IDAuNTtcblxuICAgIHRoaXMuY2l0eSA9IGNpdHk7XG5cbiAgICBjb25zdCBjaXR5SW5mbyA9IGF3YWl0IHRoaXMubW9kZWwuZ2V0Q2l0eUluZm8oY2l0eSwgdGhpcy51bml0KTtcbiAgICBjb25zdCBjdXJyZW50V2VhdGhlciA9IGF3YWl0IHRoaXMubW9kZWwuZ2V0Q3VycmVudFdlYXRoZXIoY2l0eSwgdGhpcy51bml0KTtcbiAgICBjb25zdCBmb3JlY2FzdFdlYXRoZXIgPSBhd2FpdCB0aGlzLm1vZGVsLmdldEZvcmVjYXN0V2VhdGhlcihjaXR5LCB0aGlzLnVuaXQpO1xuXG4gICAgdGhpcy52aWV3LmFwcGVuZENpdHlJbmZvKGNpdHlJbmZvKTtcbiAgICB0aGlzLnZpZXcuYXBwZW5kQ3VycmVudFdlYXRoZXIoY3VycmVudFdlYXRoZXIpO1xuICAgIHRoaXMudmlldy5hcHBlbmRGb3JlY2FzdFdlYXRoZXIoZm9yZWNhc3RXZWF0aGVyKTtcbiAgfVxuXG4gIGNoZWNrSWZFbnRlcihlKSB7XG4gICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIpIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoXCIpLmJsdXIoKTtcbiAgfVxuXG4gIGNoYW5nZVRlbXBlcmF0dXJlKGUpIHtcbiAgICBjb25zdCB1bml0ID0gZS5jdXJyZW50VGFyZ2V0LmNoZWNrZWQgPyBcImltcGVyaWFsXCIgOiBcIm1ldHJpY1wiO1xuICAgIHRoaXMudmlldy5jaGFuZ2VVbml0VGVtcCh1bml0KTtcbiAgICB0aGlzLnVuaXQgPSB1bml0O1xuICAgIHRoaXMuY2FsbEZ1bmModGhpcy5jaXR5KTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQVBJcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudXJsR2VuZXJhdG9yID0gbmV3IFVybEdlbmVyYXRvcihcImU1MjMyMGI5ODQwNDAxODVlNjA0MGExZTY3ZjI1NGUwXCIpO1xuICB9XG5cbiAgYXN5bmMgZ2V0R2VvQ29vcmRpbmF0ZXMoY2l0eSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB1cmwgPSB0aGlzLnVybEdlbmVyYXRvci5nZW5lcmF0ZUdlb0Nvb3Jkc1VybChjaXR5KTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xuICAgICAgY29uc3QgZ2VvY29kaW5nRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIGNvbnN0IHsgbGF0LCBsb24gfSA9IGdlb2NvZGluZ0RhdGFbMF07XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIHJldHVybiB7IGxhdCwgbG9uIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZ2V0Q3VycmVudFdlYXRoZXJEYXRhKGNpdHksIHVuaXQpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBsYXQsIGxvbiB9ID0gYXdhaXQgdGhpcy5nZXRHZW9Db29yZGluYXRlcyhjaXR5KTtcbiAgICAgIGNvbnN0IHVybCA9IHRoaXMudXJsR2VuZXJhdG9yLmdlbmVyYXRlQ3VycmVudFdlYXRoZXJVcmwobGF0LCBsb24sIHVuaXQpO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbW9kZTogXCJjb3JzXCIgfSk7XG4gICAgICBjb25zdCB3ZWF0aGVyRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgcmV0dXJuIHdlYXRoZXJEYXRhO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGdldEZvcmVjYXN0V2VhdGhlckRhdGEoY2l0eSwgdW5pdCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IGxhdCwgbG9uIH0gPSBhd2FpdCB0aGlzLmdldEdlb0Nvb3JkaW5hdGVzKGNpdHkpO1xuICAgICAgY29uc3QgdXJsID0gdGhpcy51cmxHZW5lcmF0b3IuZ2VuZXJhdGVGb3JlY2FzdFdlYXRoZXJVcmwobGF0LCBsb24sIHVuaXQpO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbW9kZTogXCJjb3JzXCIgfSk7XG4gICAgICBjb25zdCBmb3JlY2FzdERhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIHJldHVybiBmb3JlY2FzdERhdGE7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFVybEdlbmVyYXRvciB7XG4gIGNvbnN0cnVjdG9yKGFwcElkKSB7XG4gICAgdGhpcy5iYXNlVXJsID0gXCJodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmdcIjtcbiAgICB0aGlzLmFwcElkID0gYXBwSWQ7XG4gIH1cblxuICBnZW5lcmF0ZUdlb0Nvb3Jkc1VybChjaXR5KSB7XG4gICAgcmV0dXJuIGAke3RoaXMuYmFzZVVybH0vZ2VvLzEuMC9kaXJlY3Q/cT0ke2NpdHl9JmFwcGlkPSR7dGhpcy5hcHBJZH1gO1xuICB9XG5cbiAgZ2VuZXJhdGVDdXJyZW50V2VhdGhlclVybChsYXQsIGxvbiwgdW5pdCkge1xuICAgIHJldHVybiBgJHt0aGlzLmJhc2VVcmx9L2RhdGEvMi41L3dlYXRoZXI/bGF0PSR7bGF0fSZsb249JHtsb259JmFwcGlkPSR7dGhpcy5hcHBJZH0mdW5pdHM9JHt1bml0fWA7XG4gIH1cblxuICBnZW5lcmF0ZUZvcmVjYXN0V2VhdGhlclVybChsYXQsIGxvbiwgdW5pdCkge1xuICAgIHJldHVybiBgJHt0aGlzLmJhc2VVcmx9L2RhdGEvMi41L2ZvcmVjYXN0P2xhdD0ke2xhdH0mbG9uPSR7bG9ufSZjbnQ9OCZhcHBpZD0ke3RoaXMuYXBwSWR9JnVuaXRzPSR7dW5pdH1gO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDaXR5SW5mbyB7XG4gIGNvbnN0cnVjdG9yKEFwaURhdGEpIHtcbiAgICB0aGlzLmNpdHlEZXNjcmlwdGlvbiA9IHRoaXMuY3JlYXRlQ2l0eURlc2NyaXB0aW9uKEFwaURhdGEpO1xuICAgIHRoaXMuZGF0ZURlc2NyaXB0aW9uID0gdGhpcy5jcmVhdGVEYXRlRGVzY3JpcHRpb24oQXBpRGF0YSk7XG4gIH1cblxuICBjcmVhdGVDaXR5RGVzY3JpcHRpb24oQXBpRGF0YSkge1xuICAgIGNvbnN0IGNpdHkgPSBBcGlEYXRhLm5hbWU7XG4gICAgY29uc3QgeyBjb3VudHJ5IH0gPSBBcGlEYXRhLnN5cztcbiAgICByZXR1cm4gYCR7Y2l0eX0sICR7Y291bnRyeX1gO1xuICB9XG5cbiAgY3JlYXRlRGF0ZURlc2NyaXB0aW9uKEFwaURhdGEpIHtcbiAgICBjb25zdCBkYXkgPSB0aGlzLmdldERheSgpO1xuICAgIGNvbnN0IG1vbnRoID0gdGhpcy5nZXRNb250aCgpO1xuICAgIGNvbnN0IGRhdGUgPSB0aGlzLmdldERhdGUoKTtcbiAgICByZXR1cm4gYCR7ZGF5fSwgJHttb250aH0gJHtkYXRlfWA7XG4gIH1cblxuICBnZXREYXkoKSB7XG4gICAgY29uc3Qgd2Vla2RheSA9IFtcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCJdO1xuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGRheSA9IHdlZWtkYXlbZC5nZXREYXkoKV07XG4gICAgcmV0dXJuIGRheTtcbiAgfVxuXG4gIGdldE1vbnRoKCkge1xuICAgIGNvbnN0IG1vbnRoTmFtZXMgPSBbXG4gICAgICBcIkphbnVhcnlcIixcbiAgICAgIFwiRmVicnVhcnlcIixcbiAgICAgIFwiTWFyY2hcIixcbiAgICAgIFwiQXByaWxcIixcbiAgICAgIFwiTWF5XCIsXG4gICAgICBcIkp1bmVcIixcbiAgICAgIFwiSnVseVwiLFxuICAgICAgXCJBdWd1c3RcIixcbiAgICAgIFwiU2VwdGVtYmVyXCIsXG4gICAgICBcIk9jdG9iZXJcIixcbiAgICAgIFwiTm92ZW1iZXJcIixcbiAgICAgIFwiRGVjZW1iZXJcIixcbiAgICBdO1xuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IG1vbnRoID0gbW9udGhOYW1lc1tkLmdldE1vbnRoKCldO1xuICAgIHJldHVybiBtb250aDtcbiAgfVxuXG4gIGdldERhdGUoKSB7XG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgZGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuICAgIHJldHVybiBkYXRlO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDdXJyZW50V2VhdGhlciB7XG4gIGNvbnN0cnVjdG9yKGN1cnJlbnRXZWF0aGVyRGF0YSwgdW5pdCkge1xuICAgIHRoaXMudGVtcGVyYXR1cmUgPSB0aGlzLmdldFRlbXBlcmF0dXJlKE1hdGgucm91bmQoY3VycmVudFdlYXRoZXJEYXRhLm1haW4udGVtcCksIHVuaXQpO1xuICAgIHRoaXMuZmVlbHNMaWtlVGVtcCA9IHRoaXMuZ2V0VGVtcGVyYXR1cmUoTWF0aC5yb3VuZChjdXJyZW50V2VhdGhlckRhdGEubWFpbi5mZWVsc19saWtlKSwgdW5pdCk7XG4gICAgdGhpcy5odW1pZGl0eSA9IGAke2N1cnJlbnRXZWF0aGVyRGF0YS5tYWluLmh1bWlkaXR5fSVgO1xuICAgIHRoaXMud2luZFNwZWVkID0gYCR7Y3VycmVudFdlYXRoZXJEYXRhLndpbmQuc3BlZWR9IG0vc2A7XG4gICAgdGhpcy5wcmVzc3VyZSA9IGAke2N1cnJlbnRXZWF0aGVyRGF0YS5tYWluLnByZXNzdXJlfSBoUGFgO1xuICAgIHRoaXMuc3VucmlzZSA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5VGltZShjdXJyZW50V2VhdGhlckRhdGEuc3lzLnN1bnJpc2UsIGN1cnJlbnRXZWF0aGVyRGF0YS50aW1lem9uZSk7XG4gICAgdGhpcy5zdW5zZXQgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eVRpbWUoY3VycmVudFdlYXRoZXJEYXRhLnN5cy5zdW5zZXQsIGN1cnJlbnRXZWF0aGVyRGF0YS50aW1lem9uZSk7XG4gICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uRGVzYyA9IGN1cnJlbnRXZWF0aGVyRGF0YS53ZWF0aGVyWzBdLmRlc2NyaXB0aW9uO1xuICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbkltZyA9IHRoaXMuZ2V0V2VhdGhlckNvbmRpdGlvbkltZyhcbiAgICAgIGN1cnJlbnRXZWF0aGVyRGF0YS53ZWF0aGVyWzBdLm1haW4sXG4gICAgICBjdXJyZW50V2VhdGhlckRhdGEuc3lzLnN1bnJpc2UsXG4gICAgICBjdXJyZW50V2VhdGhlckRhdGEuc3lzLnN1bnNldCxcbiAgICAgIGN1cnJlbnRXZWF0aGVyRGF0YS50aW1lem9uZVxuICAgICk7XG4gICAgdGhpcy5iYWNrZ3JvdW5kVmlkZW8gPSB0aGlzLmdldEJhY2tncm91bmRWaWRlb0xpbmsodGhpcy53ZWF0aGVyQ29uZGl0aW9uSW1nKTtcbiAgfVxuXG4gIGdldFRlbXBlcmF0dXJlKGRlZ3JlZSwgdW5pdCkge1xuICAgIHJldHVybiB1bml0ID09PSBcIm1ldHJpY1wiID8gYCR7ZGVncmVlfeKEg2AgOiBgJHtkZWdyZWV94oSJYDtcbiAgfVxuXG4gIGNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUodW5peFRpbWUsIHRpbWV6b25lKSB7XG4gICAgY29uc3QgbG9jYWxEYXRlID0gdW5peFRpbWUgPT09IDAgPyBuZXcgRGF0ZSgpIDogbmV3IERhdGUodW5peFRpbWUgKiAxMDAwKTtcbiAgICBjb25zdCB1dGNVbml4VGltZSA9IGxvY2FsRGF0ZS5nZXRUaW1lKCkgKyBsb2NhbERhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSAqIDYwMDAwO1xuICAgIGNvbnN0IHVuaXhUaW1lSW5TZWFyY2hlZENpdHkgPSB1dGNVbml4VGltZSArIHRpbWV6b25lICogMTAwMDtcbiAgICBjb25zdCBkYXRlSW5TZWFyY2hlZENpdHkgPSBuZXcgRGF0ZSh1bml4VGltZUluU2VhcmNoZWRDaXR5KTtcbiAgICByZXR1cm4gZGF0ZUluU2VhcmNoZWRDaXR5O1xuICB9XG5cbiAgY29udmVydFRvU2VhcmNoZWRDaXR5VGltZSh1bml4VGltZSwgdGltZXpvbmUpIHtcbiAgICBjb25zdCBkYXRlSW5TZWFyY2hlZENpdHkgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUodW5peFRpbWUsIHRpbWV6b25lKTtcbiAgICBjb25zdCBob3VycyA9IGRhdGVJblNlYXJjaGVkQ2l0eS5nZXRIb3VycygpO1xuICAgIGNvbnN0IG1pbnV0ZXMgPSBgMCR7ZGF0ZUluU2VhcmNoZWRDaXR5LmdldE1pbnV0ZXMoKX1gO1xuICAgIGNvbnN0IGZvcm1hdHRlZFRpbWUgPSBgJHtob3Vyc306JHttaW51dGVzLnN1YnN0cigtMil9YDtcbiAgICByZXR1cm4gZm9ybWF0dGVkVGltZTtcbiAgfVxuXG4gIGdldFdlYXRoZXJDb25kaXRpb25JbWcodmFsdWUsIHN1bnJpc2VVbml4LCBzdW5zZXRVbml4LCB0aW1lem9uZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gXCJEcml6emxlXCIpIHJldHVybiBcIlJhaW5cIjtcbiAgICBjb25zdCBtaXN0RXF1aXZhbGVudGVzID0gW1wiU21va2VcIiwgXCJIYXplXCIsIFwiRHVzdFwiLCBcIkZvZ1wiLCBcIlNhbmRcIiwgXCJEdXN0XCIsIFwiQXNoXCIsIFwiU3F1YWxsXCIsIFwiVG9ybmFkb1wiXTtcbiAgICBpZiAobWlzdEVxdWl2YWxlbnRlcy5pbmNsdWRlcyh2YWx1ZSkpIHJldHVybiBcIk1pc3RcIjtcbiAgICBpZiAodmFsdWUgIT09IFwiQ2xlYXJcIikgcmV0dXJuIHZhbHVlO1xuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKDAsIHRpbWV6b25lKTtcbiAgICBjb25zdCBzdW5yaXNlRGF0ZSA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZShzdW5yaXNlVW5peCwgdGltZXpvbmUpO1xuICAgIGNvbnN0IHN1bnNldERhdGUgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoc3Vuc2V0VW5peCwgdGltZXpvbmUpO1xuICAgIHJldHVybiBjdXJyZW50RGF0ZSA+IHN1bnJpc2VEYXRlICYmIGN1cnJlbnREYXRlIDwgc3Vuc2V0RGF0ZSA/IGAke3ZhbHVlfURheWAgOiBgJHt2YWx1ZX1OaWdodGA7XG4gIH1cblxuICBnZXRCYWNrZ3JvdW5kVmlkZW9MaW5rKHdlYXRoZXJDb25kaXRpb24pIHtcbiAgICBjb25zdCB2aWRlb0xpbmtzID0ge1xuICAgICAgQ2xlYXJEYXk6XG4gICAgICAgIFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzM0NTgwNTE1MC5oZC5tcDQ/cz0zNmM0ZTU5NmI0ODBlZjBlODA0OTM3MGJlY2JhZjI2MWIzOTg5YTAxJnByb2ZpbGVfaWQ9MTcwJm9hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MVwiLFxuICAgICAgQ2xlYXJOaWdodDpcbiAgICAgICAgXCJodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvNDY5MzA3OTUwLmhkLm1wND9zPTJlNjdhYTAyYTIxZDVjNjRjNjU3OTA0M2E3OGYwOTcyM2ViYzVkZGImcHJvZmlsZV9pZD0xNzUmb2F1dGgyX3Rva2VuX2lkPTU3NDQ3NzYxXCIsXG4gICAgICBDbG91ZHM6XG4gICAgICAgIFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzQ0NDIxMjY3NC5oZC5tcDQ/cz00MDcxOTgxMjY0ZDllNzhhY2YwOWEwNDAwZTQ2Mzg0MzI0OTVjNGYwJnByb2ZpbGVfaWQ9MTc1Jm9hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MVwiLFxuICAgICAgTWlzdDogXCJodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvMzQzNzMyMTMyLmhkLm1wND9zPTViZmRlMjNmMTdlMzg1OGRiZGMxNDBhZmU3YTM1YjZhOWVmMTEyN2QmcHJvZmlsZV9pZD0xNzUmb2F1dGgyX3Rva2VuX2lkPTU3NDQ3NzYxXCIsXG4gICAgICBSYWluOiBcImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9leHRlcm5hbC81NjkyMTc2MDIuaGQubXA0P3M9OWE5NjE3OGM5MWZlMTlhNjMxN2VkNTk0Nzg1ZjJlMzY4Y2QxZWFkZSZwcm9maWxlX2lkPTE3NCZvYXV0aDJfdG9rZW5faWQ9NTc0NDc3NjFcIixcbiAgICAgIFNub3c6IFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzUxMDgzMTE2OS5oZC5tcDQ/cz1kOTAwNDk1NTliNzZmMGI5ZTBiZGExMDJlYThhNzQyMWQ3YTY0ZDgxJnByb2ZpbGVfaWQ9MTc1Jm9hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MVwiLFxuICAgICAgVGh1bmRlcnN0b3JtOlxuICAgICAgICBcImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9leHRlcm5hbC80ODAyMjM4OTYuaGQubXA0P3M9ZTRiOTRmMGI1NzAwYmZhNjhjYjZmMDJiNDFmOTRlY2NhOTEyNDJlOSZwcm9maWxlX2lkPTE2OSZvYXV0aDJfdG9rZW5faWQ9NTc0NDc3NjFcIixcbiAgICB9O1xuICAgIHJldHVybiB2aWRlb0xpbmtzW3dlYXRoZXJDb25kaXRpb25dO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBGb3JlY2FzdFdlYXRoZXIge1xuICBjb25zdHJ1Y3Rvcihmb3JlY2FzdFdlYXRoZXJEYXRhLCB1bml0KSB7XG4gICAgdGhpcy50ZW1wZXJhdHVyZXMgPSB0aGlzLmdldFRlbXBlcmF0dXJlcyhmb3JlY2FzdFdlYXRoZXJEYXRhLCB1bml0KTtcbiAgICB0aGlzLndlYXRoZXJDb25kaXRpb24gPSB0aGlzLmdldFdlYXRoZXJDb25kaXRpb25zKGZvcmVjYXN0V2VhdGhlckRhdGEpO1xuICAgIHRoaXMudGltZSA9IHRoaXMuZ2V0VGltZXMoZm9yZWNhc3RXZWF0aGVyRGF0YSk7XG4gIH1cblxuICBnZXRUZW1wZXJhdHVyZXMoZm9yZWNhc3RXZWF0aGVyRGF0YSwgdW5pdCkge1xuICAgIGNvbnN0IHRlbXBlcmF0dXJlcyA9IFtdO1xuICAgIGZvcmVjYXN0V2VhdGhlckRhdGEubGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCB0ZW1wID0gTWF0aC5yb3VuZChpdGVtLm1haW4udGVtcCk7XG4gICAgICBjb25zdCB0ZW1wV2l0aFVuaXQgPSB0aGlzLmdldFRlbXBlcmF0dXJlVW5pdCh0ZW1wLCB1bml0KTtcbiAgICAgIHRlbXBlcmF0dXJlcy5wdXNoKHRlbXBXaXRoVW5pdCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRlbXBlcmF0dXJlcztcbiAgfVxuXG4gIGdldFRlbXBlcmF0dXJlVW5pdChkZWdyZWUsIHVuaXQpIHtcbiAgICByZXR1cm4gdW5pdCA9PT0gXCJtZXRyaWNcIiA/IGAke2RlZ3JlZX3ihINgIDogYCR7ZGVncmVlfeKEiWA7XG4gIH1cblxuICBjb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKHVuaXhUaW1lLCB0aW1lem9uZSkge1xuICAgIGNvbnN0IGxvY2FsRGF0ZSA9IG5ldyBEYXRlKHVuaXhUaW1lICogMTAwMCk7XG4gICAgY29uc3QgdXRjVW5peFRpbWUgPSBsb2NhbERhdGUuZ2V0VGltZSgpICsgbG9jYWxEYXRlLmdldFRpbWV6b25lT2Zmc2V0KCkgKiA2MDAwMDtcbiAgICBjb25zdCB1bml4VGltZUluU2VhcmNoZWRDaXR5ID0gdXRjVW5peFRpbWUgKyB0aW1lem9uZSAqIDEwMDA7XG4gICAgY29uc3QgZGF0ZUluU2VhcmNoZWRDaXR5ID0gbmV3IERhdGUodW5peFRpbWVJblNlYXJjaGVkQ2l0eSk7XG4gICAgcmV0dXJuIGRhdGVJblNlYXJjaGVkQ2l0eTtcbiAgfVxuXG4gIGdldFdlYXRoZXJDb25kaXRpb25JbWcodmFsdWUsIHRpbWUsIHN1bnJpc2VVbml4LCBzdW5zZXRVbml4LCB0aW1lem9uZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gXCJDbGVhclwiKSByZXR1cm4gdmFsdWU7XG4gICAgY29uc3QgY3VycmVudEhvdXIgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUodGltZSwgdGltZXpvbmUpLmdldEhvdXJzKCk7XG4gICAgY29uc3Qgc3VucmlzZUhvdXIgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoc3VucmlzZVVuaXgsIHRpbWV6b25lKS5nZXRIb3VycygpO1xuICAgIGNvbnN0IHN1bnNldEhvdXIgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoc3Vuc2V0VW5peCwgdGltZXpvbmUpLmdldEhvdXJzKCk7XG4gICAgcmV0dXJuIGN1cnJlbnRIb3VyID4gc3VucmlzZUhvdXIgJiYgY3VycmVudEhvdXIgPCBzdW5zZXRIb3VyID8gYCR7dmFsdWV9RGF5YCA6IGAke3ZhbHVlfU5pZ2h0YDtcbiAgfVxuXG4gIGdldFdlYXRoZXJDb25kaXRpb25zKGZvcmVjYXN0V2VhdGhlckRhdGEpIHtcbiAgICBjb25zdCB3ZWF0aGVyQ29uZGl0aW9uID0gW107XG4gICAgY29uc3Qgc3VucmlzZVVuaXggPSBmb3JlY2FzdFdlYXRoZXJEYXRhLmNpdHkuc3VucmlzZTtcbiAgICBjb25zdCBzdW5zZXRVbml4ID0gZm9yZWNhc3RXZWF0aGVyRGF0YS5jaXR5LnN1bnNldDtcbiAgICBjb25zdCB7IHRpbWV6b25lIH0gPSBmb3JlY2FzdFdlYXRoZXJEYXRhLmNpdHk7XG4gICAgZm9yZWNhc3RXZWF0aGVyRGF0YS5saXN0LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGNvbmQgPSB0aGlzLmdldFdlYXRoZXJDb25kaXRpb25JbWcoaXRlbS53ZWF0aGVyWzBdLm1haW4sIGl0ZW0uZHQsIHN1bnJpc2VVbml4LCBzdW5zZXRVbml4LCB0aW1lem9uZSk7XG4gICAgICB3ZWF0aGVyQ29uZGl0aW9uLnB1c2goY29uZCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHdlYXRoZXJDb25kaXRpb247XG4gIH1cblxuICBnZXRUaW1lcyhmb3JlY2FzdFdlYXRoZXJEYXRhKSB7XG4gICAgY29uc3QgdGltZXMgPSBbXTtcbiAgICBjb25zdCB7IHRpbWV6b25lIH0gPSBmb3JlY2FzdFdlYXRoZXJEYXRhLmNpdHk7XG4gICAgZm9yZWNhc3RXZWF0aGVyRGF0YS5saXN0LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eVRpbWUoaXRlbSwgdGltZXpvbmUpO1xuICAgICAgdGltZXMucHVzaCh0aW1lKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGltZXM7XG4gIH1cblxuICBjb252ZXJ0VG9TZWFyY2hlZENpdHlUaW1lKHVuaXhUaW1lLCB0aW1lem9uZSkge1xuICAgIGNvbnN0IGxvY2FsRGF0ZSA9IG5ldyBEYXRlKHVuaXhUaW1lLmR0ICogMTAwMCk7XG4gICAgY29uc3QgdXRjVW5peFRpbWUgPSBsb2NhbERhdGUuZ2V0VGltZSgpICsgbG9jYWxEYXRlLmdldFRpbWV6b25lT2Zmc2V0KCkgKiA2MDAwMDtcbiAgICBjb25zdCB1bml4VGltZUluU2VhcmNoZWRDaXR5ID0gdXRjVW5peFRpbWUgKyB0aW1lem9uZSAqIDEwMDA7XG4gICAgY29uc3QgZGF0ZUluU2VhcmNoZWRDaXR5ID0gbmV3IERhdGUodW5peFRpbWVJblNlYXJjaGVkQ2l0eSk7XG4gICAgY29uc3QgaG91cnMgPSBkYXRlSW5TZWFyY2hlZENpdHkuZ2V0SG91cnMoKTtcbiAgICBjb25zdCB0aW1lID0gYCR7aG91cnN9OjAwYDtcbiAgICByZXR1cm4gdGltZTtcbiAgfVxufVxuIiwiaW1wb3J0IEN1cnJlbnRXZWF0aGVyIGZyb20gXCIuL2N1cnJlbnRXZWF0aGVyXCI7XG5pbXBvcnQgRm9yZWNhc3RXZWF0aGVyIGZyb20gXCIuL2ZvcmVjYXN0V2VhdGhlclwiO1xuaW1wb3J0IENpdHlJbmZvIGZyb20gXCIuL2NpdHlJbmZvXCI7XG5pbXBvcnQgQVBJcyBmcm9tIFwiLi9BUElzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1haW5Nb2RlbCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZGF0YSA9IHt9O1xuICAgIHRoaXMuQVBJcyA9IG5ldyBBUElzKCk7XG4gIH1cblxuICBhc3luYyBnZXRDaXR5SW5mbyhjaXR5LCB1bml0KSB7XG4gICAgY29uc3QgQXBpRGF0YSA9IGF3YWl0IHRoaXMuQVBJcy5nZXRDdXJyZW50V2VhdGhlckRhdGEoY2l0eSwgdW5pdCk7XG4gICAgY29uc3QgY2l0eUluZm8gPSBuZXcgQ2l0eUluZm8oQXBpRGF0YSk7XG4gICAgcmV0dXJuIGNpdHlJbmZvO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q3VycmVudFdlYXRoZXIoY2l0eSwgdW5pdCkge1xuICAgIGNvbnN0IGN1cnJlbnRXZWF0aGVyRGF0YSA9IGF3YWl0IHRoaXMuQVBJcy5nZXRDdXJyZW50V2VhdGhlckRhdGEoY2l0eSwgdW5pdCk7XG4gICAgY29uc3QgY3VycmVudFdlYXRoZXIgPSBuZXcgQ3VycmVudFdlYXRoZXIoY3VycmVudFdlYXRoZXJEYXRhLCB1bml0KTtcbiAgICByZXR1cm4gY3VycmVudFdlYXRoZXI7XG4gIH1cblxuICBhc3luYyBnZXRGb3JlY2FzdFdlYXRoZXIoY2l0eSwgdW5pdCkge1xuICAgIGNvbnN0IGZvcmVjYXN0V2VhdGhlckRhdGEgPSBhd2FpdCB0aGlzLkFQSXMuZ2V0Rm9yZWNhc3RXZWF0aGVyRGF0YShjaXR5LCB1bml0KTtcbiAgICBjb25zdCBmb3JlY2FzdFdlYXRoZXIgPSBuZXcgRm9yZWNhc3RXZWF0aGVyKGZvcmVjYXN0V2VhdGhlckRhdGEsIHVuaXQpO1xuICAgIHJldHVybiBmb3JlY2FzdFdlYXRoZXI7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENpdHlJbmZvVmlldyB7XG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGNpdHlJbmZvTW9kZWwpIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMubW9kZWwgPSBjaXR5SW5mb01vZGVsO1xuICAgIHRoaXMuY2l0eSA9IGNpdHlJbmZvTW9kZWwuY2l0eURlc2NyaXB0aW9uO1xuICAgIHRoaXMuZGF0ZSA9IGNpdHlJbmZvTW9kZWwuZGF0ZURlc2NyaXB0aW9uO1xuICB9XG5cbiAgZ2V0IGNpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDFcIik7XG4gIH1cblxuICBzZXQgY2l0eSh2YWx1ZSkge1xuICAgIHRoaXMuY2l0eS50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDJcIik7XG4gIH1cblxuICBzZXQgZGF0ZSh2YWx1ZSkge1xuICAgIHRoaXMuZGF0ZS50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDdXJyZW50V2VhdGhlclZpZXcge1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBjdXJyZW50V2VhdGhlck1vZGVsKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLm1vZGVsID0gY3VycmVudFdlYXRoZXJNb2RlbDtcbiAgICB0aGlzLndlYXRoZXJDb25kaXRpb25JbWcgPSBjdXJyZW50V2VhdGhlck1vZGVsLndlYXRoZXJDb25kaXRpb25JbWc7XG4gICAgdGhpcy50ZW1wZXJhdHVyZSA9IGN1cnJlbnRXZWF0aGVyTW9kZWwudGVtcGVyYXR1cmU7XG4gICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uRGVzYyA9IGN1cnJlbnRXZWF0aGVyTW9kZWwud2VhdGhlckNvbmRpdGlvbkRlc2M7XG4gICAgdGhpcy5mZWVsc0xpa2VUZW1wID0gY3VycmVudFdlYXRoZXJNb2RlbC5mZWVsc0xpa2VUZW1wO1xuICAgIHRoaXMuc3VucmlzZSA9IGN1cnJlbnRXZWF0aGVyTW9kZWwuc3VucmlzZTtcbiAgICB0aGlzLnN1bnNldCA9IGN1cnJlbnRXZWF0aGVyTW9kZWwuc3Vuc2V0O1xuICAgIHRoaXMuaHVtaWRpdHkgPSBjdXJyZW50V2VhdGhlck1vZGVsLmh1bWlkaXR5O1xuICAgIHRoaXMud2luZFNwZWVkID0gY3VycmVudFdlYXRoZXJNb2RlbC53aW5kU3BlZWQ7XG4gICAgdGhpcy5wcmVzc3VyZSA9IGN1cnJlbnRXZWF0aGVyTW9kZWwucHJlc3N1cmU7XG4gICAgdGhpcy5ub3dXZWF0aGVyQ29uZGl0aW9uID0gY3VycmVudFdlYXRoZXJNb2RlbC53ZWF0aGVyQ29uZGl0aW9uSW1nO1xuICAgIHRoaXMubm93VGVtcGVyYXR1cmUgPSBjdXJyZW50V2VhdGhlck1vZGVsLnRlbXBlcmF0dXJlO1xuICAgIHRoaXMuYmFja2dyb3VuZFZpZGVvID0gY3VycmVudFdlYXRoZXJNb2RlbC5iYWNrZ3JvdW5kVmlkZW87XG4gIH1cblxuICBnZXQgd2VhdGhlckNvbmRpdGlvbkltZygpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIik7XG4gIH1cblxuICBzZXQgd2VhdGhlckNvbmRpdGlvbkltZyh2YWx1ZSkge1xuICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbkltZy5zcmMgPSBgaW1hZ2VzLyR7dmFsdWV9LnBuZ2A7XG4gIH1cblxuICBnZXQgdGVtcGVyYXR1cmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDFcIik7XG4gIH1cblxuICBzZXQgdGVtcGVyYXR1cmUodmFsdWUpIHtcbiAgICB0aGlzLnRlbXBlcmF0dXJlLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgd2VhdGhlckNvbmRpdGlvbkRlc2MoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDJcIik7XG4gIH1cblxuICBzZXQgd2VhdGhlckNvbmRpdGlvbkRlc2ModmFsdWUpIHtcbiAgICB0aGlzLndlYXRoZXJDb25kaXRpb25EZXNjLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZmVlbHNMaWtlVGVtcCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmVlbHMtbGlrZVwiKTtcbiAgfVxuXG4gIHNldCBmZWVsc0xpa2VUZW1wKHZhbHVlKSB7XG4gICAgdGhpcy5mZWVsc0xpa2VUZW1wLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc3VucmlzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3VucmlzZVwiKTtcbiAgfVxuXG4gIHNldCBzdW5yaXNlKHZhbHVlKSB7XG4gICAgdGhpcy5zdW5yaXNlLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc3Vuc2V0KCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdW5zZXRcIik7XG4gIH1cblxuICBzZXQgc3Vuc2V0KHZhbHVlKSB7XG4gICAgdGhpcy5zdW5zZXQudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBodW1pZGl0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaHVtaWRpdHlcIik7XG4gIH1cblxuICBzZXQgaHVtaWRpdHkodmFsdWUpIHtcbiAgICB0aGlzLmh1bWlkaXR5LnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgd2luZFNwZWVkKCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5kLXNwZWVkXCIpO1xuICB9XG5cbiAgc2V0IHdpbmRTcGVlZCh2YWx1ZSkge1xuICAgIHRoaXMud2luZFNwZWVkLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgcHJlc3N1cmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnByZXNzdXJlXCIpO1xuICB9XG5cbiAgc2V0IHByZXNzdXJlKHZhbHVlKSB7XG4gICAgdGhpcy5wcmVzc3VyZS50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IG5vd1dlYXRoZXJDb25kaXRpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9yZWNhc3RfX2l0ZW1fX2N1cnJlbnQtY29uZGl0aW9uXCIpO1xuICB9XG5cbiAgc2V0IG5vd1dlYXRoZXJDb25kaXRpb24odmFsdWUpIHtcbiAgICB0aGlzLm5vd1dlYXRoZXJDb25kaXRpb24uc3JjID0gYGltYWdlcy8ke3ZhbHVlfS5wbmdgO1xuICB9XG5cbiAgZ2V0IG5vd1RlbXBlcmF0dXJlKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvcmVjYXN0X19pdGVtX19jdXJlbnQtdGVtcFwiKTtcbiAgfVxuXG4gIHNldCBub3dUZW1wZXJhdHVyZSh2YWx1ZSkge1xuICAgIHRoaXMubm93VGVtcGVyYXR1cmUudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBiYWNrZ3JvdW5kVmlkZW8oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidmlkZW9cIik7XG4gIH1cblxuICBzZXQgYmFja2dyb3VuZFZpZGVvKHZhbHVlKSB7XG4gICAgdGhpcy5iYWNrZ3JvdW5kVmlkZW8uc3JjID0gdmFsdWU7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIGZvcmVjYXN0V2VhdGhlclZpZXcge1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBmb3JlY2FzdFdlYXRoZXJNb2RlbCkge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5tb2RlbCA9IGZvcmVjYXN0V2VhdGhlck1vZGVsO1xuICAgIHRoaXMudGltZSA9IGZvcmVjYXN0V2VhdGhlck1vZGVsLnRpbWU7XG4gICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uID0gZm9yZWNhc3RXZWF0aGVyTW9kZWwud2VhdGhlckNvbmRpdGlvbjtcbiAgICB0aGlzLnRlbXBlcmF0dXJlcyA9IGZvcmVjYXN0V2VhdGhlck1vZGVsLnRlbXBlcmF0dXJlcztcbiAgfVxuXG4gIGdldCB0aW1lKCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5mb3JlY2FzdF9faXRlbV9fdGltZVwiKTtcbiAgfVxuXG4gIHNldCB0aW1lKHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRpbWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMudGltZVtpXS50ZXh0Q29udGVudCA9IHZhbHVlW2ldO1xuICAgIH1cbiAgfVxuXG4gIGdldCB3ZWF0aGVyQ29uZGl0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKTtcbiAgfVxuXG4gIHNldCB3ZWF0aGVyQ29uZGl0aW9uKHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLndlYXRoZXJDb25kaXRpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbltpXS5zcmMgPSBgaW1hZ2VzLyR7dmFsdWVbaSAtIDFdfS5wbmdgO1xuICAgIH1cbiAgfVxuXG4gIGdldCB0ZW1wZXJhdHVyZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZvcmVjYXN0X19pdGVtX190ZW1wZXJhdHVyZVwiKTtcbiAgfVxuXG4gIHNldCB0ZW1wZXJhdHVyZXModmFsdWUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGltZS5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy50ZW1wZXJhdHVyZXNbaV0udGV4dENvbnRlbnQgPSB2YWx1ZVtpXTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBDaXR5SW5mb1ZpZXcgZnJvbSBcIi4vY2l0eUluZm9WaWV3XCI7XG5pbXBvcnQgQ3VycmVudFdlYXRoZXJWaWV3IGZyb20gXCIuL2N1cnJlbnRXZWF0aGVyVmlld1wiO1xuaW1wb3J0IEZvcmVjYXN0V2VhdGhlclZpZXcgZnJvbSBcIi4vZm9yZWNhc3RXZWF0aGVyVmlld1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYWluVmlldyB7XG4gIGFwcGVuZENpdHlJbmZvKGNpdHlJbmZvKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eS1pbmZvXCIpO1xuICAgIG5ldyBDaXR5SW5mb1ZpZXcoZWxlbWVudCwgY2l0eUluZm8pO1xuICB9XG5cbiAgYXBwZW5kQ3VycmVudFdlYXRoZXIoY3VycmVudFdlYXRoZXIpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdXJyZW50LXdlYXRoZXJcIik7XG4gICAgbmV3IEN1cnJlbnRXZWF0aGVyVmlldyhlbGVtZW50LCBjdXJyZW50V2VhdGhlcik7XG4gIH1cblxuICBhcHBlbmRGb3JlY2FzdFdlYXRoZXIoZm9yZWNhc3RXZWF0aGVyKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9yZWNhc3RcIik7XG4gICAgbmV3IEZvcmVjYXN0V2VhdGhlclZpZXcoZWxlbWVudCwgZm9yZWNhc3RXZWF0aGVyKTtcbiAgfVxuXG4gIGNoYW5nZVVuaXRUZW1wKHVuaXQpIHtcbiAgICBpZiAodW5pdCA9PT0gXCJpbXBlcmlhbFwiKSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnVuaXRDXCIpLnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51bml0RlwiKS5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51bml0RlwiKS5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudW5pdENcIikuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XG4gICAgfVxuICB9XG59XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzBfX18gZnJvbSBcIi0hLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9ub3JtYWxpemUuY3NzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fID0gbmV3IFVSTChcIi4uL2ltYWdlcy9tYWduaWZ5LnBuZ1wiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18uaShfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzBfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIjpyb290IHtcXG4gIC0tY2xyLW5ldXRyYWw6IGhzbCgwLCAwJSwgMTAwJSk7XFxuICAtLWNsci1uZXV0cmFsLXRyYW5zcDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE3MSk7XFxuICAtLWZmLXByaW1hcnk6IFxcXCJQb3BwaW5zXFxcIiwgc2Fucy1zZXJpZjtcXG4gIC0tZnctMzAwOiAzMDA7XFxuICAtLWZ3LTQwMDogNDAwO1xcbiAgLS1mdy01MDA6IDUwMDtcXG4gIC0tZnctNjAwOiA2MDA7XFxuICAtLWZ3LTcwMDogNzAwO1xcbn1cXG5cXG4qLFxcbio6OmJlZm9yZSxcXG4qOjphZnRlciB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIHRleHQtc2hhZG93OiAycHggMnB4IDhweCAjMDAwMDAwO1xcbn1cXG5cXG5ib2R5IHtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIxMiwgMjA3LCAyMDcpO1xcbiAgZm9udC1mYW1pbHk6IHZhcigtLWZmLXByaW1hcnkpO1xcbiAgY29sb3I6IHZhcigtLWNsci1uZXV0cmFsKTtcXG59XFxuXFxubWFpbiB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgd2lkdGg6IDEwMHZ3O1xcbiAgbWluLWhlaWdodDogMTAwdmg7XFxuICBwYWRkaW5nOiA0cmVtIDJyZW07XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG5cXG4udmlkZW8tY29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICB3aWR0aDogMTAwdnc7XFxuICBoZWlnaHQ6IDEwMHZoO1xcbiAgei1pbmRleDogLTU7XFxufVxcblxcbnZpZGVvIHtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIGhlaWdodDogMTAwdmg7XFxuICBvYmplY3QtZml0OiBjb3ZlcjtcXG59XFxuXFxuLnVuaXRDLFxcbi51bml0RiB7XFxuICBmb250LXNpemU6IDAuODVyZW07XFxuICBoZWlnaHQ6IDE2cHg7XFxuICB3aWR0aDogMTZweDtcXG4gIGJvcmRlci1yYWRpdXM6IDhweDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBjb2xvcjogYmxhY2s7XFxuICB6LWluZGV4OiAyMDtcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbiAgdGV4dC1zaGFkb3c6IG5vbmU7XFxufVxcblxcbi51bml0RiB7XFxuICBjb2xvcjogd2hpdGU7XFxufVxcblxcbi5jaGVja2JveC1jb250YWluZXIge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAzcmVtO1xcbiAgcmlnaHQ6IDNyZW07XFxufVxcblxcbi5jaGVja2JveCB7XFxuICBvcGFjaXR5OiAwO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbn1cXG5cXG4ubGFiZWwge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzExMTtcXG4gIGJvcmRlci1yYWRpdXM6IDUwcHg7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gIHBhZGRpbmc6IDVweDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGhlaWdodDogMjZweDtcXG4gIHdpZHRoOiA1MHB4O1xcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjUpO1xcbn1cXG5cXG4ubGFiZWwgLmJhbGwge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMnB4O1xcbiAgbGVmdDogMnB4O1xcbiAgaGVpZ2h0OiAyMnB4O1xcbiAgd2lkdGg6IDIycHg7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTtcXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjJzIGxpbmVhcjtcXG59XFxuXFxuLmNoZWNrYm94OmNoZWNrZWQgKyAubGFiZWwgLmJhbGwge1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDI0cHgpO1xcbn1cXG5cXG4uc2VhcmNoLXdyYXBwZXIge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgZ2FwOiAxMHB4O1xcbn1cXG5cXG4uc2VhcmNoLXdyYXBwZXIgaW5wdXQge1xcbiAgd2lkdGg6IDQwJTtcXG4gIHBhZGRpbmc6IDEwcHggMTBweCAxMHB4IDQwcHg7XFxuICBib3JkZXItcmFkaXVzOiAycmVtO1xcbiAgYm9yZGVyOiBub25lO1xcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiICsgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyArIFwiKTtcXG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAxMHB4IGNlbnRlcjtcXG4gIGJhY2tncm91bmQtc2l6ZTogY2FsYygxcmVtICsgMC41dncpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICB0ZXh0LXNoYWRvdzogbm9uZTtcXG59XFxuXFxuI2Vycm9yIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi5jaXR5LWluZm8gaDEge1xcbiAgbWFyZ2luOiAwLjNyZW0gMDtcXG4gIGxldHRlci1zcGFjaW5nOiAwLjFyZW07XFxuICBmb250LXdlaWdodDogdmFyKC0tZnctNjAwKTtcXG4gIGZvbnQtc2l6ZTogMi41cmVtO1xcbn1cXG5cXG5oMiB7XFxuICBmb250LXNpemU6IDEuMXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy0zMDApO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9jb2ludGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfY29pbnRhaW5lciBpbWcge1xcbiAgd2lkdGg6IGNhbGMoMTByZW0gKyAxMHZ3KTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9jb2ludGFpbmVyIGgxIHtcXG4gIG1hcmdpbjogMC4zcmVtIDA7XFxuICBmb250LXNpemU6IDRyZW07XFxuICBmb250LXdlaWdodDogdmFyKC0tZnctNDAwKTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl90ZW1wIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfX2RldGFpbHMge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBhbGlnbi1zZWxmOiBjZW50ZXI7XFxuICBoZWlnaHQ6IG1heC1jb250ZW50O1xcbiAgcGFkZGluZzogMnJlbSA0cmVtO1xcbiAgZ2FwOiA0cmVtO1xcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY2xyLW5ldXRyYWwtdHJhbnNwKTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9faXRlbSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGdhcDogMC41cmVtO1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19pdGVtIGltZyB7XFxuICB3aWR0aDogY2FsYygxcmVtICsgMXZ3KTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9fZGV0YWlsc19fY29sdW1uIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgZ2FwOiAxcmVtO1xcbn1cXG5cXG4uZm9yZWNhc3Qge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBwYWRkaW5nOiAxcmVtIDJyZW07XFxuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbC10cmFuc3ApO1xcbn1cXG5cXG4uZm9yZWNhc3RfX2l0ZW0ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4uZm9yZWNhc3RfX2l0ZW0gaW1nIHtcXG4gIHdpZHRoOiBjYWxjKDJyZW0gKyAzdncpO1xcbn1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL21haW4uY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUVBO0VBQ0UsK0JBQStCO0VBQy9CLGdEQUFnRDtFQUNoRCxtQ0FBbUM7RUFDbkMsYUFBYTtFQUNiLGFBQWE7RUFDYixhQUFhO0VBQ2IsYUFBYTtFQUNiLGFBQWE7QUFDZjs7QUFFQTs7O0VBR0UsU0FBUztFQUNULFVBQVU7RUFDVixzQkFBc0I7RUFDdEIsZ0NBQWdDO0FBQ2xDOztBQUVBO0VBQ0UsWUFBWTtFQUNaLGlCQUFpQjtFQUNqQixvQ0FBb0M7RUFDcEMsOEJBQThCO0VBQzlCLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsNkJBQTZCO0VBQzdCLGtCQUFrQjtFQUNsQixZQUFZO0VBQ1osaUJBQWlCO0VBQ2pCLGtCQUFrQjtFQUNsQixnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsTUFBTTtFQUNOLE9BQU87RUFDUCxZQUFZO0VBQ1osYUFBYTtFQUNiLFdBQVc7QUFDYjs7QUFFQTtFQUNFLFlBQVk7RUFDWixhQUFhO0VBQ2IsaUJBQWlCO0FBQ25COztBQUVBOztFQUVFLGtCQUFrQjtFQUNsQixZQUFZO0VBQ1osV0FBVztFQUNYLGtCQUFrQjtFQUNsQixhQUFhO0VBQ2IsdUJBQXVCO0VBQ3ZCLG1CQUFtQjtFQUNuQixZQUFZO0VBQ1osV0FBVztFQUNYLG9CQUFvQjtFQUNwQixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsU0FBUztFQUNULFdBQVc7QUFDYjs7QUFFQTtFQUNFLFVBQVU7RUFDVixrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxzQkFBc0I7RUFDdEIsbUJBQW1CO0VBQ25CLGVBQWU7RUFDZixhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLDhCQUE4QjtFQUM5QixZQUFZO0VBQ1osa0JBQWtCO0VBQ2xCLFlBQVk7RUFDWixXQUFXO0VBQ1gscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0Usc0JBQXNCO0VBQ3RCLGtCQUFrQjtFQUNsQixrQkFBa0I7RUFDbEIsUUFBUTtFQUNSLFNBQVM7RUFDVCxZQUFZO0VBQ1osV0FBVztFQUNYLDBCQUEwQjtFQUMxQixpQ0FBaUM7QUFDbkM7O0FBRUE7RUFDRSwyQkFBMkI7QUFDN0I7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixtQkFBbUI7RUFDbkIsU0FBUztBQUNYOztBQUVBO0VBQ0UsVUFBVTtFQUNWLDRCQUE0QjtFQUM1QixtQkFBbUI7RUFDbkIsWUFBWTtFQUNaLHlEQUE0QztFQUM1Qyw0QkFBNEI7RUFDNUIsZ0NBQWdDO0VBQ2hDLG1DQUFtQztFQUNuQyx1QkFBdUI7RUFDdkIsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsYUFBYTtBQUNmOztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLHNCQUFzQjtFQUN0QiwwQkFBMEI7RUFDMUIsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsaUJBQWlCO0VBQ2pCLDBCQUEwQjtBQUM1Qjs7QUFFQTtFQUNFLGFBQWE7RUFDYiw2QkFBNkI7QUFDL0I7O0FBRUE7RUFDRSxhQUFhO0FBQ2Y7O0FBRUE7RUFDRSx5QkFBeUI7QUFDM0I7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIsZUFBZTtFQUNmLDBCQUEwQjtBQUM1Qjs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsdUJBQXVCO0FBQ3pCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQixrQkFBa0I7RUFDbEIsbUJBQW1CO0VBQ25CLGtCQUFrQjtFQUNsQixTQUFTO0VBQ1QscUJBQXFCO0VBQ3JCLDJDQUEyQztBQUM3Qzs7QUFFQTtFQUNFLGFBQWE7RUFDYixtQkFBbUI7RUFDbkIsV0FBVztFQUNYLGVBQWU7QUFDakI7O0FBRUE7RUFDRSx1QkFBdUI7QUFDekI7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLFNBQVM7QUFDWDs7QUFFQTtFQUNFLGFBQWE7RUFDYiw2QkFBNkI7RUFDN0IsV0FBVztFQUNYLGtCQUFrQjtFQUNsQixxQkFBcUI7RUFDckIsMkNBQTJDO0FBQzdDOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSx1QkFBdUI7QUFDekJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQGltcG9ydCB1cmwoLi9ub3JtYWxpemUuY3NzKTtcXG5cXG46cm9vdCB7XFxuICAtLWNsci1uZXV0cmFsOiBoc2woMCwgMCUsIDEwMCUpO1xcbiAgLS1jbHItbmV1dHJhbC10cmFuc3A6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xNzEpO1xcbiAgLS1mZi1wcmltYXJ5OiBcXFwiUG9wcGluc1xcXCIsIHNhbnMtc2VyaWY7XFxuICAtLWZ3LTMwMDogMzAwO1xcbiAgLS1mdy00MDA6IDQwMDtcXG4gIC0tZnctNTAwOiA1MDA7XFxuICAtLWZ3LTYwMDogNjAwO1xcbiAgLS1mdy03MDA6IDcwMDtcXG59XFxuXFxuKixcXG4qOjpiZWZvcmUsXFxuKjo6YWZ0ZXIge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICB0ZXh0LXNoYWRvdzogMnB4IDJweCA4cHggIzAwMDAwMDtcXG59XFxuXFxuYm9keSB7XFxuICB3aWR0aDogMTAwdnc7XFxuICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigyMTIsIDIwNywgMjA3KTtcXG4gIGZvbnQtZmFtaWx5OiB2YXIoLS1mZi1wcmltYXJ5KTtcXG4gIGNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbCk7XFxufVxcblxcbm1haW4ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgcGFkZGluZzogNHJlbSAycmVtO1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG59XFxuXFxuLnZpZGVvLWNvbnRhaW5lciB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgd2lkdGg6IDEwMHZ3O1xcbiAgaGVpZ2h0OiAxMDB2aDtcXG4gIHotaW5kZXg6IC01O1xcbn1cXG5cXG52aWRlbyB7XFxuICB3aWR0aDogMTAwdnc7XFxuICBoZWlnaHQ6IDEwMHZoO1xcbiAgb2JqZWN0LWZpdDogY292ZXI7XFxufVxcblxcbi51bml0QyxcXG4udW5pdEYge1xcbiAgZm9udC1zaXplOiAwLjg1cmVtO1xcbiAgaGVpZ2h0OiAxNnB4O1xcbiAgd2lkdGg6IDE2cHg7XFxuICBib3JkZXItcmFkaXVzOiA4cHg7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgY29sb3I6IGJsYWNrO1xcbiAgei1pbmRleDogMjA7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG4gIHRleHQtc2hhZG93OiBub25lO1xcbn1cXG5cXG4udW5pdEYge1xcbiAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG4uY2hlY2tib3gtY29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogM3JlbTtcXG4gIHJpZ2h0OiAzcmVtO1xcbn1cXG5cXG4uY2hlY2tib3gge1xcbiAgb3BhY2l0eTogMDtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG59XFxuXFxuLmxhYmVsIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMxMTE7XFxuICBib3JkZXItcmFkaXVzOiA1MHB4O1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICBwYWRkaW5nOiA1cHg7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBoZWlnaHQ6IDI2cHg7XFxuICB3aWR0aDogNTBweDtcXG4gIHRyYW5zZm9ybTogc2NhbGUoMS41KTtcXG59XFxuXFxuLmxhYmVsIC5iYWxsIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuICBib3JkZXItcmFkaXVzOiA1MCU7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDJweDtcXG4gIGxlZnQ6IDJweDtcXG4gIGhlaWdodDogMjJweDtcXG4gIHdpZHRoOiAyMnB4O1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7XFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4ycyBsaW5lYXI7XFxufVxcblxcbi5jaGVja2JveDpjaGVja2VkICsgLmxhYmVsIC5iYWxsIHtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgyNHB4KTtcXG59XFxuXFxuLnNlYXJjaC13cmFwcGVyIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGdhcDogMTBweDtcXG59XFxuXFxuLnNlYXJjaC13cmFwcGVyIGlucHV0IHtcXG4gIHdpZHRoOiA0MCU7XFxuICBwYWRkaW5nOiAxMHB4IDEwcHggMTBweCA0MHB4O1xcbiAgYm9yZGVyLXJhZGl1czogMnJlbTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCguLi9pbWFnZXMvbWFnbmlmeS5wbmcpO1xcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDEwcHggY2VudGVyO1xcbiAgYmFja2dyb3VuZC1zaXplOiBjYWxjKDFyZW0gKyAwLjV2dyk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gIHRleHQtc2hhZG93OiBub25lO1xcbn1cXG5cXG4jZXJyb3Ige1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLmNpdHktaW5mbyBoMSB7XFxuICBtYXJnaW46IDAuM3JlbSAwO1xcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy02MDApO1xcbiAgZm9udC1zaXplOiAyLjVyZW07XFxufVxcblxcbmgyIHtcXG4gIGZvbnQtc2l6ZTogMS4xcmVtO1xcbiAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTMwMCk7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX2NvaW50YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9jb2ludGFpbmVyIGltZyB7XFxuICB3aWR0aDogY2FsYygxMHJlbSArIDEwdncpO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX2NvaW50YWluZXIgaDEge1xcbiAgbWFyZ2luOiAwLjNyZW0gMDtcXG4gIGZvbnQtc2l6ZTogNHJlbTtcXG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy00MDApO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX3RlbXAge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9fZGV0YWlscyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGFsaWduLXNlbGY6IGNlbnRlcjtcXG4gIGhlaWdodDogbWF4LWNvbnRlbnQ7XFxuICBwYWRkaW5nOiAycmVtIDRyZW07XFxuICBnYXA6IDRyZW07XFxuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbC10cmFuc3ApO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19pdGVtIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgZ2FwOiAwLjVyZW07XFxuICBmb250LXNpemU6IDFyZW07XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfX2l0ZW0gaW1nIHtcXG4gIHdpZHRoOiBjYWxjKDFyZW0gKyAxdncpO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19kZXRhaWxzX19jb2x1bW4ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBnYXA6IDFyZW07XFxufVxcblxcbi5mb3JlY2FzdCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuICB3aWR0aDogMTAwJTtcXG4gIHBhZGRpbmc6IDFyZW0gMnJlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNsci1uZXV0cmFsLXRyYW5zcCk7XFxufVxcblxcbi5mb3JlY2FzdF9faXRlbSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5mb3JlY2FzdF9faXRlbSBpbWcge1xcbiAgd2lkdGg6IGNhbGMoMnJlbSArIDN2dyk7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIi8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cXG5cXG4vKiBEb2N1bWVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxcbiAqL1xcblxcbiBodG1sIHtcXG4gICAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXG4gICAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qIFNlY3Rpb25zXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBib2R5IHtcXG4gICAgbWFyZ2luOiAwO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlbmRlciB0aGUgYG1haW5gIGVsZW1lbnQgY29uc2lzdGVudGx5IGluIElFLlxcbiAgICovXFxuICBcXG4gIG1haW4ge1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBgaDFgIGVsZW1lbnRzIHdpdGhpbiBgc2VjdGlvbmAgYW5kXFxuICAgKiBgYXJ0aWNsZWAgY29udGV4dHMgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIGgxIHtcXG4gICAgZm9udC1zaXplOiAyZW07XFxuICAgIG1hcmdpbjogMC42N2VtIDA7XFxuICB9XFxuICBcXG4gIC8qIEdyb3VwaW5nIGNvbnRlbnRcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gRmlyZWZveC5cXG4gICAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxcbiAgICovXFxuICBcXG4gIGhyIHtcXG4gICAgYm94LXNpemluZzogY29udGVudC1ib3g7IC8qIDEgKi9cXG4gICAgaGVpZ2h0OiAwOyAvKiAxICovXFxuICAgIG92ZXJmbG93OiB2aXNpYmxlOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gICAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBwcmUge1xcbiAgICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG4gICAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxcbiAgICovXFxuICBcXG4gIGEge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxcbiAgICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBhYmJyW3RpdGxlXSB7XFxuICAgIGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBiLFxcbiAgc3Ryb25nIHtcXG4gICAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIGNvZGUsXFxuICBrYmQsXFxuICBzYW1wIHtcXG4gICAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxuICAgIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgc21hbGwge1xcbiAgICBmb250LXNpemU6IDgwJTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBQcmV2ZW50IGBzdWJgIGFuZCBgc3VwYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cXG4gICAqIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBzdWIsXFxuICBzdXAge1xcbiAgICBmb250LXNpemU6IDc1JTtcXG4gICAgbGluZS1oZWlnaHQ6IDA7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbiAgfVxcbiAgXFxuICBzdWIge1xcbiAgICBib3R0b206IC0wLjI1ZW07XFxuICB9XFxuICBcXG4gIHN1cCB7XFxuICAgIHRvcDogLTAuNWVtO1xcbiAgfVxcbiAgXFxuICAvKiBFbWJlZGRlZCBjb250ZW50XFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXFxuICAgKi9cXG4gIFxcbiAgaW1nIHtcXG4gICAgYm9yZGVyLXN0eWxlOiBub25lO1xcbiAgfVxcbiAgXFxuICAvKiBGb3Jtc1xcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cXG4gICAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBidXR0b24sXFxuICBpbnB1dCxcXG4gIG9wdGdyb3VwLFxcbiAgc2VsZWN0LFxcbiAgdGV4dGFyZWEge1xcbiAgICBmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xcbiAgICBmb250LXNpemU6IDEwMCU7IC8qIDEgKi9cXG4gICAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXG4gICAgbWFyZ2luOiAwOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogU2hvdyB0aGUgb3ZlcmZsb3cgaW4gSUUuXFxuICAgKiAxLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlLlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbixcXG4gIGlucHV0IHsgLyogMSAqL1xcbiAgICBvdmVyZmxvdzogdmlzaWJsZTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cXG4gICAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cXG4gICAqL1xcbiAgXFxuICBidXR0b24sXFxuICBzZWxlY3QgeyAvKiAxICovXFxuICAgIHRleHQtdHJhbnNmb3JtOiBub25lO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgYnV0dG9uLFxcbiAgW3R5cGU9XFxcImJ1dHRvblxcXCJdLFxcbiAgW3R5cGU9XFxcInJlc2V0XFxcIl0sXFxuICBbdHlwZT1cXFwic3VibWl0XFxcIl0ge1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcXG4gIFt0eXBlPVxcXCJidXR0b25cXFwiXTo6LW1vei1mb2N1cy1pbm5lcixcXG4gIFt0eXBlPVxcXCJyZXNldFxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcbiAgW3R5cGU9XFxcInN1Ym1pdFxcXCJdOjotbW96LWZvY3VzLWlubmVyIHtcXG4gICAgYm9yZGVyLXN0eWxlOiBub25lO1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cXG4gICAqL1xcbiAgXFxuICBidXR0b246LW1vei1mb2N1c3JpbmcsXFxuICBbdHlwZT1cXFwiYnV0dG9uXFxcIl06LW1vei1mb2N1c3JpbmcsXFxuICBbdHlwZT1cXFwicmVzZXRcXFwiXTotbW96LWZvY3VzcmluZyxcXG4gIFt0eXBlPVxcXCJzdWJtaXRcXFwiXTotbW96LWZvY3VzcmluZyB7XFxuICAgIG91dGxpbmU6IDFweCBkb3R0ZWQgQnV0dG9uVGV4dDtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXFxuICAgKi9cXG4gIFxcbiAgZmllbGRzZXQge1xcbiAgICBwYWRkaW5nOiAwLjM1ZW0gMC43NWVtIDAuNjI1ZW07XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cXG4gICAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBJRS5cXG4gICAqIDMuIFJlbW92ZSB0aGUgcGFkZGluZyBzbyBkZXZlbG9wZXJzIGFyZSBub3QgY2F1Z2h0IG91dCB3aGVuIHRoZXkgemVybyBvdXRcXG4gICAqICAgIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIGxlZ2VuZCB7XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cXG4gICAgY29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cXG4gICAgZGlzcGxheTogdGFibGU7IC8qIDEgKi9cXG4gICAgbWF4LXdpZHRoOiAxMDAlOyAvKiAxICovXFxuICAgIHBhZGRpbmc6IDA7IC8qIDMgKi9cXG4gICAgd2hpdGUtc3BhY2U6IG5vcm1hbDsgLyogMSAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXFxuICAgKi9cXG4gIFxcbiAgcHJvZ3Jlc3Mge1xcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXFxuICAgKi9cXG4gIFxcbiAgdGV4dGFyZWEge1xcbiAgICBvdmVyZmxvdzogYXV0bztcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cXG4gICAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC5cXG4gICAqL1xcbiAgXFxuICBbdHlwZT1cXFwiY2hlY2tib3hcXFwiXSxcXG4gIFt0eXBlPVxcXCJyYWRpb1xcXCJdIHtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xcbiAgICBwYWRkaW5nOiAwOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxcbiAgICovXFxuICBcXG4gIFt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcXG4gIFt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XFxuICAgIGhlaWdodDogYXV0bztcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cXG4gICAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIFt0eXBlPVxcXCJzZWFyY2hcXFwiXSB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXFxuICAgIG91dGxpbmUtb2Zmc2V0OiAtMnB4OyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxcbiAgICovXFxuICBcXG4gIFt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiAgICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBgaW5oZXJpdGAgaW4gU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIDo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xcbiAgICBmb250OiBpbmhlcml0OyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qIEludGVyYWN0aXZlXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gRWRnZSwgSUUgMTArLCBhbmQgRmlyZWZveC5cXG4gICAqL1xcbiAgXFxuICBkZXRhaWxzIHtcXG4gICAgZGlzcGxheTogYmxvY2s7XFxuICB9XFxuICBcXG4gIC8qXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgc3VtbWFyeSB7XFxuICAgIGRpc3BsYXk6IGxpc3QtaXRlbTtcXG4gIH1cXG4gIFxcbiAgLyogTWlzY1xcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXFxuICAgKi9cXG4gIFxcbiAgdGVtcGxhdGUge1xcbiAgICBkaXNwbGF5OiBub25lO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxcbiAgICovXFxuICBcXG4gIFtoaWRkZW5dIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG4gIH1cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL25vcm1hbGl6ZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUEsMkVBQTJFOztBQUUzRTsrRUFDK0U7O0FBRS9FOzs7RUFHRTs7Q0FFRDtJQUNHLGlCQUFpQixFQUFFLE1BQU07SUFDekIsOEJBQThCLEVBQUUsTUFBTTtFQUN4Qzs7RUFFQTtpRkFDK0U7O0VBRS9FOztJQUVFOztFQUVGO0lBQ0UsU0FBUztFQUNYOztFQUVBOztJQUVFOztFQUVGO0lBQ0UsY0FBYztFQUNoQjs7RUFFQTs7O0lBR0U7O0VBRUY7SUFDRSxjQUFjO0lBQ2QsZ0JBQWdCO0VBQ2xCOztFQUVBO2lGQUMrRTs7RUFFL0U7OztJQUdFOztFQUVGO0lBQ0UsdUJBQXVCLEVBQUUsTUFBTTtJQUMvQixTQUFTLEVBQUUsTUFBTTtJQUNqQixpQkFBaUIsRUFBRSxNQUFNO0VBQzNCOztFQUVBOzs7SUFHRTs7RUFFRjtJQUNFLGlDQUFpQyxFQUFFLE1BQU07SUFDekMsY0FBYyxFQUFFLE1BQU07RUFDeEI7O0VBRUE7aUZBQytFOztFQUUvRTs7SUFFRTs7RUFFRjtJQUNFLDZCQUE2QjtFQUMvQjs7RUFFQTs7O0lBR0U7O0VBRUY7SUFDRSxtQkFBbUIsRUFBRSxNQUFNO0lBQzNCLDBCQUEwQixFQUFFLE1BQU07SUFDbEMsaUNBQWlDLEVBQUUsTUFBTTtFQUMzQzs7RUFFQTs7SUFFRTs7RUFFRjs7SUFFRSxtQkFBbUI7RUFDckI7O0VBRUE7OztJQUdFOztFQUVGOzs7SUFHRSxpQ0FBaUMsRUFBRSxNQUFNO0lBQ3pDLGNBQWMsRUFBRSxNQUFNO0VBQ3hCOztFQUVBOztJQUVFOztFQUVGO0lBQ0UsY0FBYztFQUNoQjs7RUFFQTs7O0lBR0U7O0VBRUY7O0lBRUUsY0FBYztJQUNkLGNBQWM7SUFDZCxrQkFBa0I7SUFDbEIsd0JBQXdCO0VBQzFCOztFQUVBO0lBQ0UsZUFBZTtFQUNqQjs7RUFFQTtJQUNFLFdBQVc7RUFDYjs7RUFFQTtpRkFDK0U7O0VBRS9FOztJQUVFOztFQUVGO0lBQ0Usa0JBQWtCO0VBQ3BCOztFQUVBO2lGQUMrRTs7RUFFL0U7OztJQUdFOztFQUVGOzs7OztJQUtFLG9CQUFvQixFQUFFLE1BQU07SUFDNUIsZUFBZSxFQUFFLE1BQU07SUFDdkIsaUJBQWlCLEVBQUUsTUFBTTtJQUN6QixTQUFTLEVBQUUsTUFBTTtFQUNuQjs7RUFFQTs7O0lBR0U7O0VBRUY7VUFDUSxNQUFNO0lBQ1osaUJBQWlCO0VBQ25COztFQUVBOzs7SUFHRTs7RUFFRjtXQUNTLE1BQU07SUFDYixvQkFBb0I7RUFDdEI7O0VBRUE7O0lBRUU7O0VBRUY7Ozs7SUFJRSwwQkFBMEI7RUFDNUI7O0VBRUE7O0lBRUU7O0VBRUY7Ozs7SUFJRSxrQkFBa0I7SUFDbEIsVUFBVTtFQUNaOztFQUVBOztJQUVFOztFQUVGOzs7O0lBSUUsOEJBQThCO0VBQ2hDOztFQUVBOztJQUVFOztFQUVGO0lBQ0UsOEJBQThCO0VBQ2hDOztFQUVBOzs7OztJQUtFOztFQUVGO0lBQ0Usc0JBQXNCLEVBQUUsTUFBTTtJQUM5QixjQUFjLEVBQUUsTUFBTTtJQUN0QixjQUFjLEVBQUUsTUFBTTtJQUN0QixlQUFlLEVBQUUsTUFBTTtJQUN2QixVQUFVLEVBQUUsTUFBTTtJQUNsQixtQkFBbUIsRUFBRSxNQUFNO0VBQzdCOztFQUVBOztJQUVFOztFQUVGO0lBQ0Usd0JBQXdCO0VBQzFCOztFQUVBOztJQUVFOztFQUVGO0lBQ0UsY0FBYztFQUNoQjs7RUFFQTs7O0lBR0U7O0VBRUY7O0lBRUUsc0JBQXNCLEVBQUUsTUFBTTtJQUM5QixVQUFVLEVBQUUsTUFBTTtFQUNwQjs7RUFFQTs7SUFFRTs7RUFFRjs7SUFFRSxZQUFZO0VBQ2Q7O0VBRUE7OztJQUdFOztFQUVGO0lBQ0UsNkJBQTZCLEVBQUUsTUFBTTtJQUNyQyxvQkFBb0IsRUFBRSxNQUFNO0VBQzlCOztFQUVBOztJQUVFOztFQUVGO0lBQ0Usd0JBQXdCO0VBQzFCOztFQUVBOzs7SUFHRTs7RUFFRjtJQUNFLDBCQUEwQixFQUFFLE1BQU07SUFDbEMsYUFBYSxFQUFFLE1BQU07RUFDdkI7O0VBRUE7aUZBQytFOztFQUUvRTs7SUFFRTs7RUFFRjtJQUNFLGNBQWM7RUFDaEI7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSxrQkFBa0I7RUFDcEI7O0VBRUE7aUZBQytFOztFQUUvRTs7SUFFRTs7RUFFRjtJQUNFLGFBQWE7RUFDZjs7RUFFQTs7SUFFRTs7RUFFRjtJQUNFLGFBQWE7RUFDZlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiEgbm9ybWFsaXplLmNzcyB2OC4wLjEgfCBNSVQgTGljZW5zZSB8IGdpdGh1Yi5jb20vbmVjb2xhcy9ub3JtYWxpemUuY3NzICovXFxuXFxuLyogRG9jdW1lbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBQcmV2ZW50IGFkanVzdG1lbnRzIG9mIGZvbnQgc2l6ZSBhZnRlciBvcmllbnRhdGlvbiBjaGFuZ2VzIGluIGlPUy5cXG4gKi9cXG5cXG4gaHRtbCB7XFxuICAgIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuICAgIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKiBTZWN0aW9uc1xcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgYm9keSB7XFxuICAgIG1hcmdpbjogMDtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW5kZXIgdGhlIGBtYWluYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cXG4gICAqL1xcbiAgXFxuICBtYWluIHtcXG4gICAgZGlzcGxheTogYmxvY2s7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gYGgxYCBlbGVtZW50cyB3aXRoaW4gYHNlY3Rpb25gIGFuZFxcbiAgICogYGFydGljbGVgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBoMSB7XFxuICAgIGZvbnQtc2l6ZTogMmVtO1xcbiAgICBtYXJnaW46IDAuNjdlbSAwO1xcbiAgfVxcbiAgXFxuICAvKiBHcm91cGluZyBjb250ZW50XFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXFxuICAgKiAyLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlIGFuZCBJRS5cXG4gICAqL1xcbiAgXFxuICBociB7XFxuICAgIGJveC1zaXppbmc6IGNvbnRlbnQtYm94OyAvKiAxICovXFxuICAgIGhlaWdodDogMDsgLyogMSAqL1xcbiAgICBvdmVyZmxvdzogdmlzaWJsZTsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgcHJlIHtcXG4gICAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxuICAgIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qIFRleHQtbGV2ZWwgc2VtYW50aWNzXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgZ3JheSBiYWNrZ3JvdW5kIG9uIGFjdGl2ZSBsaW5rcyBpbiBJRSAxMC5cXG4gICAqL1xcbiAgXFxuICBhIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gUmVtb3ZlIHRoZSBib3R0b20gYm9yZGVyIGluIENocm9tZSA1Ny1cXG4gICAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgYWJiclt0aXRsZV0ge1xcbiAgICBib3JkZXItYm90dG9tOiBub25lOyAvKiAxICovXFxuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyAvKiAyICovXFxuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgYixcXG4gIHN0cm9uZyB7XFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkZXI7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gICAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBjb2RlLFxcbiAga2JkLFxcbiAgc2FtcCB7XFxuICAgIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xcbiAgICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIHNtYWxsIHtcXG4gICAgZm9udC1zaXplOiA4MCU7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUHJldmVudCBgc3ViYCBhbmQgYHN1cGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXFxuICAgKiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgc3ViLFxcbiAgc3VwIHtcXG4gICAgZm9udC1zaXplOiA3NSU7XFxuICAgIGxpbmUtaGVpZ2h0OiAwO1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG4gIH1cXG4gIFxcbiAgc3ViIHtcXG4gICAgYm90dG9tOiAtMC4yNWVtO1xcbiAgfVxcbiAgXFxuICBzdXAge1xcbiAgICB0b3A6IC0wLjVlbTtcXG4gIH1cXG4gIFxcbiAgLyogRW1iZWRkZWQgY29udGVudFxcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGJvcmRlciBvbiBpbWFnZXMgaW5zaWRlIGxpbmtzIGluIElFIDEwLlxcbiAgICovXFxuICBcXG4gIGltZyB7XFxuICAgIGJvcmRlci1zdHlsZTogbm9uZTtcXG4gIH1cXG4gIFxcbiAgLyogRm9ybXNcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ2hhbmdlIHRoZSBmb250IHN0eWxlcyBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKiAyLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgYnV0dG9uLFxcbiAgaW5wdXQsXFxuICBvcHRncm91cCxcXG4gIHNlbGVjdCxcXG4gIHRleHRhcmVhIHtcXG4gICAgZm9udC1mYW1pbHk6IGluaGVyaXQ7IC8qIDEgKi9cXG4gICAgZm9udC1zaXplOiAxMDAlOyAvKiAxICovXFxuICAgIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuICAgIG1hcmdpbjogMDsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxcbiAgICogMS4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZS5cXG4gICAqL1xcbiAgXFxuICBidXR0b24sXFxuICBpbnB1dCB7IC8qIDEgKi9cXG4gICAgb3ZlcmZsb3c6IHZpc2libGU7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBFZGdlLCBGaXJlZm94LCBhbmQgSUUuXFxuICAgKiAxLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXFxuICAgKi9cXG4gIFxcbiAgYnV0dG9uLFxcbiAgc2VsZWN0IHsgLyogMSAqL1xcbiAgICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbixcXG4gIFt0eXBlPVxcXCJidXR0b25cXFwiXSxcXG4gIFt0eXBlPVxcXCJyZXNldFxcXCJdLFxcbiAgW3R5cGU9XFxcInN1Ym1pdFxcXCJdIHtcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gICAqL1xcbiAgXFxuICBidXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXFxuICBbdHlwZT1cXFwiYnV0dG9uXFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuICBbdHlwZT1cXFwicmVzZXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lcixcXG4gIFt0eXBlPVxcXCJzdWJtaXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lciB7XFxuICAgIGJvcmRlci1zdHlsZTogbm9uZTtcXG4gICAgcGFkZGluZzogMDtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZXN0b3JlIHRoZSBmb2N1cyBzdHlsZXMgdW5zZXQgYnkgdGhlIHByZXZpb3VzIHJ1bGUuXFxuICAgKi9cXG4gIFxcbiAgYnV0dG9uOi1tb3otZm9jdXNyaW5nLFxcbiAgW3R5cGU9XFxcImJ1dHRvblxcXCJdOi1tb3otZm9jdXNyaW5nLFxcbiAgW3R5cGU9XFxcInJlc2V0XFxcIl06LW1vei1mb2N1c3JpbmcsXFxuICBbdHlwZT1cXFwic3VibWl0XFxcIl06LW1vei1mb2N1c3Jpbmcge1xcbiAgICBvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQ29ycmVjdCB0aGUgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAgICovXFxuICBcXG4gIGZpZWxkc2V0IHtcXG4gICAgcGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIHRleHQgd3JhcHBpbmcgaW4gRWRnZSBhbmQgSUUuXFxuICAgKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gSUUuXFxuICAgKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XFxuICAgKiAgICBgZmllbGRzZXRgIGVsZW1lbnRzIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBsZWdlbmQge1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuICAgIGNvbG9yOiBpbmhlcml0OyAvKiAyICovXFxuICAgIGRpc3BsYXk6IHRhYmxlOyAvKiAxICovXFxuICAgIG1heC13aWR0aDogMTAwJTsgLyogMSAqL1xcbiAgICBwYWRkaW5nOiAwOyAvKiAzICovXFxuICAgIHdoaXRlLXNwYWNlOiBub3JtYWw7IC8qIDEgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgdmVydGljYWwgYWxpZ25tZW50IGluIENocm9tZSwgRmlyZWZveCwgYW5kIE9wZXJhLlxcbiAgICovXFxuICBcXG4gIHByb2dyZXNzIHtcXG4gICAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgZGVmYXVsdCB2ZXJ0aWNhbCBzY3JvbGxiYXIgaW4gSUUgMTArLlxcbiAgICovXFxuICBcXG4gIHRleHRhcmVhIHtcXG4gICAgb3ZlcmZsb3c6IGF1dG87XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gSUUgMTAuXFxuICAgKiAyLiBSZW1vdmUgdGhlIHBhZGRpbmcgaW4gSUUgMTAuXFxuICAgKi9cXG4gIFxcbiAgW3R5cGU9XFxcImNoZWNrYm94XFxcIl0sXFxuICBbdHlwZT1cXFwicmFkaW9cXFwiXSB7XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cXG4gICAgcGFkZGluZzogMDsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIENvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIENocm9tZS5cXG4gICAqL1xcbiAgXFxuICBbdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXFxuICBbdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xcbiAgICBoZWlnaHQ6IGF1dG87XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXFxuICAgKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBbdHlwZT1cXFwic2VhcmNoXFxcIl0ge1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IHRleHRmaWVsZDsgLyogMSAqL1xcbiAgICBvdXRsaW5lLW9mZnNldDogLTJweDsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgaW5uZXIgcGFkZGluZyBpbiBDaHJvbWUgYW5kIFNhZmFyaSBvbiBtYWNPUy5cXG4gICAqL1xcbiAgXFxuICBbdHlwZT1cXFwic2VhcmNoXFxcIl06Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24ge1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4gICAqIDIuIENoYW5nZSBmb250IHByb3BlcnRpZXMgdG8gYGluaGVyaXRgIGluIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICA6Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247IC8qIDEgKi9cXG4gICAgZm9udDogaW5oZXJpdDsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKiBJbnRlcmFjdGl2ZVxcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLypcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFIDEwKywgYW5kIEZpcmVmb3guXFxuICAgKi9cXG4gIFxcbiAgZGV0YWlscyB7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgfVxcbiAgXFxuICAvKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIHN1bW1hcnkge1xcbiAgICBkaXNwbGF5OiBsaXN0LWl0ZW07XFxuICB9XFxuICBcXG4gIC8qIE1pc2NcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTArLlxcbiAgICovXFxuICBcXG4gIHRlbXBsYXRlIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMC5cXG4gICAqL1xcbiAgXFxuICBbaGlkZGVuXSB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICB9XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdOyAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuXG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuXG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG5cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTsgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcblxuXG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG5cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG5cbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcblxuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGlmICghdXJsKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIHVybCA9IFN0cmluZyh1cmwuX19lc01vZHVsZSA/IHVybC5kZWZhdWx0IDogdXJsKTsgLy8gSWYgdXJsIGlzIGFscmVhZHkgd3JhcHBlZCBpbiBxdW90ZXMsIHJlbW92ZSB0aGVtXG5cbiAgaWYgKC9eWydcIl0uKlsnXCJdJC8udGVzdCh1cmwpKSB7XG4gICAgdXJsID0gdXJsLnNsaWNlKDEsIC0xKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLmhhc2gpIHtcbiAgICB1cmwgKz0gb3B0aW9ucy5oYXNoO1xuICB9IC8vIFNob3VsZCB1cmwgYmUgd3JhcHBlZD9cbiAgLy8gU2VlIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtdmFsdWVzLTMvI3VybHNcblxuXG4gIGlmICgvW1wiJygpIFxcdFxcbl18KCUyMCkvLnRlc3QodXJsKSB8fCBvcHRpb25zLm5lZWRRdW90ZXMpIHtcbiAgICByZXR1cm4gXCJcXFwiXCIuY29uY2F0KHVybC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIiksIFwiXFxcIlwiKTtcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICByZXR1cm4gXCIvKiMgc291cmNlVVJMPVwiLmNvbmNhdChjc3NNYXBwaW5nLnNvdXJjZVJvb3QgfHwgXCJcIikuY29uY2F0KHNvdXJjZSwgXCIgKi9cIik7XG4gICAgfSk7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuXG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL21haW4uY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9tYWluLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcblxuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG5cbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG5cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuXG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuXG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB1cGRhdGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuXG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuXG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuXG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuXG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTsgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuXG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuXG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuXG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcblxuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG5cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG5cbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuXG4gIGNzcyArPSBvYmouY3NzO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfSAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG5cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjXG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkgc2NyaXB0VXJsID0gc2NyaXB0c1tzY3JpcHRzLmxlbmd0aCAtIDFdLnNyY1xuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmIgPSBkb2N1bWVudC5iYXNlVVJJIHx8IHNlbGYubG9jYXRpb24uaHJlZjtcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuLy8gbm8gb24gY2h1bmtzIGxvYWRlZFxuXG4vLyBubyBqc29ucCBmdW5jdGlvbiIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IFwiLi4vc3R5bGVzL21haW4uY3NzXCI7XG5cbmltcG9ydCBNYWluTW9kZWwgZnJvbSBcIi4vbW9kZWxzL21haW5Nb2RlbFwiO1xuaW1wb3J0IE1haW5WaWV3IGZyb20gXCIuL3ZpZXdzL21haW5WaWV3XCI7XG5pbXBvcnQgTWFpbkNvbnRyb2xsZXIgZnJvbSBcIi4vY29udHJvbGxlcnMvbWFpbkNvbnRyb2xsZXJcIjtcblxuY29uc3QgbW9kZWwgPSBuZXcgTWFpbk1vZGVsKCk7XG5jb25zdCB2aWV3ID0gbmV3IE1haW5WaWV3KCk7XG5jb25zdCBjb250cm9sbGVyID0gbmV3IE1haW5Db250cm9sbGVyKG1vZGVsLCB2aWV3KTtcbiJdLCJuYW1lcyI6WyJNYWluQ29udHJvbGxlciIsImNvbnN0cnVjdG9yIiwibW9kZWwiLCJ2aWV3IiwiY2l0eSIsInVuaXQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJsb2FkUGFnZSIsInZhbHVlIiwiY2hlY2tJZkVudGVyIiwid2luZG93IiwiY2hhbmdlVGVtcGVyYXR1cmUiLCJwbGF5YmFja1JhdGUiLCJjaXR5SW5mbyIsImdldENpdHlJbmZvIiwiY3VycmVudFdlYXRoZXIiLCJnZXRDdXJyZW50V2VhdGhlciIsImZvcmVjYXN0V2VhdGhlciIsImdldEZvcmVjYXN0V2VhdGhlciIsImFwcGVuZENpdHlJbmZvIiwiYXBwZW5kQ3VycmVudFdlYXRoZXIiLCJhcHBlbmRGb3JlY2FzdFdlYXRoZXIiLCJrZXkiLCJibHVyIiwiY3VycmVudFRhcmdldCIsImNoZWNrZWQiLCJjaGFuZ2VVbml0VGVtcCIsImNhbGxGdW5jIiwiQVBJcyIsInVybEdlbmVyYXRvciIsIlVybEdlbmVyYXRvciIsImdldEdlb0Nvb3JkaW5hdGVzIiwidXJsIiwiZ2VuZXJhdGVHZW9Db29yZHNVcmwiLCJyZXNwb25zZSIsImZldGNoIiwibW9kZSIsImdlb2NvZGluZ0RhdGEiLCJqc29uIiwibGF0IiwibG9uIiwic3R5bGUiLCJkaXNwbGF5IiwiZXJyIiwiY29uc29sZSIsImxvZyIsImdldEN1cnJlbnRXZWF0aGVyRGF0YSIsImdlbmVyYXRlQ3VycmVudFdlYXRoZXJVcmwiLCJ3ZWF0aGVyRGF0YSIsImdldEZvcmVjYXN0V2VhdGhlckRhdGEiLCJnZW5lcmF0ZUZvcmVjYXN0V2VhdGhlclVybCIsImZvcmVjYXN0RGF0YSIsImFwcElkIiwiYmFzZVVybCIsIkNpdHlJbmZvIiwiQXBpRGF0YSIsImNpdHlEZXNjcmlwdGlvbiIsImNyZWF0ZUNpdHlEZXNjcmlwdGlvbiIsImRhdGVEZXNjcmlwdGlvbiIsImNyZWF0ZURhdGVEZXNjcmlwdGlvbiIsIm5hbWUiLCJjb3VudHJ5Iiwic3lzIiwiZGF5IiwiZ2V0RGF5IiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwid2Vla2RheSIsImQiLCJEYXRlIiwibW9udGhOYW1lcyIsIkN1cnJlbnRXZWF0aGVyIiwiY3VycmVudFdlYXRoZXJEYXRhIiwidGVtcGVyYXR1cmUiLCJnZXRUZW1wZXJhdHVyZSIsIk1hdGgiLCJyb3VuZCIsIm1haW4iLCJ0ZW1wIiwiZmVlbHNMaWtlVGVtcCIsImZlZWxzX2xpa2UiLCJodW1pZGl0eSIsIndpbmRTcGVlZCIsIndpbmQiLCJzcGVlZCIsInByZXNzdXJlIiwic3VucmlzZSIsImNvbnZlcnRUb1NlYXJjaGVkQ2l0eVRpbWUiLCJ0aW1lem9uZSIsInN1bnNldCIsIndlYXRoZXJDb25kaXRpb25EZXNjIiwid2VhdGhlciIsImRlc2NyaXB0aW9uIiwid2VhdGhlckNvbmRpdGlvbkltZyIsImdldFdlYXRoZXJDb25kaXRpb25JbWciLCJiYWNrZ3JvdW5kVmlkZW8iLCJnZXRCYWNrZ3JvdW5kVmlkZW9MaW5rIiwiZGVncmVlIiwiY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZSIsInVuaXhUaW1lIiwibG9jYWxEYXRlIiwidXRjVW5peFRpbWUiLCJnZXRUaW1lIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJ1bml4VGltZUluU2VhcmNoZWRDaXR5IiwiZGF0ZUluU2VhcmNoZWRDaXR5IiwiaG91cnMiLCJnZXRIb3VycyIsIm1pbnV0ZXMiLCJnZXRNaW51dGVzIiwiZm9ybWF0dGVkVGltZSIsInN1YnN0ciIsInN1bnJpc2VVbml4Iiwic3Vuc2V0VW5peCIsIm1pc3RFcXVpdmFsZW50ZXMiLCJpbmNsdWRlcyIsImN1cnJlbnREYXRlIiwic3VucmlzZURhdGUiLCJzdW5zZXREYXRlIiwid2VhdGhlckNvbmRpdGlvbiIsInZpZGVvTGlua3MiLCJDbGVhckRheSIsIkNsZWFyTmlnaHQiLCJDbG91ZHMiLCJNaXN0IiwiUmFpbiIsIlNub3ciLCJUaHVuZGVyc3Rvcm0iLCJGb3JlY2FzdFdlYXRoZXIiLCJmb3JlY2FzdFdlYXRoZXJEYXRhIiwidGVtcGVyYXR1cmVzIiwiZ2V0VGVtcGVyYXR1cmVzIiwiZ2V0V2VhdGhlckNvbmRpdGlvbnMiLCJ0aW1lIiwiZ2V0VGltZXMiLCJsaXN0IiwiZm9yRWFjaCIsIml0ZW0iLCJ0ZW1wV2l0aFVuaXQiLCJnZXRUZW1wZXJhdHVyZVVuaXQiLCJwdXNoIiwiY3VycmVudEhvdXIiLCJzdW5yaXNlSG91ciIsInN1bnNldEhvdXIiLCJjb25kIiwiZHQiLCJ0aW1lcyIsIk1haW5Nb2RlbCIsImRhdGEiLCJDaXR5SW5mb1ZpZXciLCJlbGVtZW50IiwiY2l0eUluZm9Nb2RlbCIsInF1ZXJ5U2VsZWN0b3IiLCJ0ZXh0Q29udGVudCIsIkN1cnJlbnRXZWF0aGVyVmlldyIsImN1cnJlbnRXZWF0aGVyTW9kZWwiLCJub3dXZWF0aGVyQ29uZGl0aW9uIiwibm93VGVtcGVyYXR1cmUiLCJzcmMiLCJmb3JlY2FzdFdlYXRoZXJWaWV3IiwiZm9yZWNhc3RXZWF0aGVyTW9kZWwiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaSIsImxlbmd0aCIsIkZvcmVjYXN0V2VhdGhlclZpZXciLCJNYWluVmlldyIsImNvbG9yIiwiY29udHJvbGxlciJdLCJzb3VyY2VSb290IjoiIn0=
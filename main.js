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
___CSS_LOADER_EXPORT___.push([module.id, ":root {\n  --clr-neutral: hsl(0, 0%, 100%);\n  --clr-neutral-transp: rgba(255, 255, 255, 0.171);\n  --ff-primary: \"Poppins\", sans-serif;\n  --fw-300: 300;\n  --fw-400: 400;\n  --fw-500: 500;\n  --fw-600: 600;\n  --fw-700: 700;\n}\n\n*,\n*::before,\n*::after {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  text-shadow: 2px 2px 8px #000000;\n}\n\nbody {\n  width: 100vw;\n  min-height: 100vh;\n  background-color: rgb(212, 207, 207);\n  font-family: var(--ff-primary);\n  color: var(--clr-neutral);\n}\n\nmain {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n  position: relative;\n  width: 100vw;\n  height: 100vh;\n  padding: 4rem 2rem;\n  overflow: hidden;\n}\n\n.video-container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  z-index: -5;\n}\n\nvideo {\n  width: 100vw;\n  height: 100vh;\n  object-fit: cover;\n}\n\n.unitC,\n.unitF {\n  font-size: 0.85rem;\n  height: 16px;\n  width: 16px;\n  border-radius: 8px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  color: black;\n  z-index: 20;\n  pointer-events: none;\n  text-shadow: none;\n}\n\n.unitF {\n  color: white;\n}\n\n.checkbox-container {\n  position: absolute;\n  top: 3rem;\n  right: 3rem;\n}\n\n.checkbox {\n  opacity: 0;\n  position: absolute;\n}\n\n.label {\n  background-color: #111;\n  border-radius: 50px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 5px;\n  position: relative;\n  height: 26px;\n  width: 50px;\n  transform: scale(1.5);\n}\n\n.label .ball {\n  background-color: #fff;\n  border-radius: 50%;\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  height: 22px;\n  width: 22px;\n  transform: translateX(0px);\n  transition: transform 0.2s linear;\n}\n\n.checkbox:checked + .label .ball {\n  transform: translateX(24px);\n}\n\n.search-wrapper {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 10px;\n}\n\n.search-wrapper input {\n  width: 40%;\n  padding: 10px 10px 10px 40px;\n  border-radius: 2rem;\n  border: none;\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n  background-repeat: no-repeat;\n  background-position: 10px center;\n  background-size: calc(1rem + 0.5vw);\n  background-color: white;\n  text-shadow: none;\n}\n\n#error {\n  display: none;\n}\n\n.city-info h1 {\n  margin: 0.3rem 0;\n  letter-spacing: 0.1rem;\n  font-weight: var(--fw-600);\n  font-size: 2.5rem;\n}\n\nh2 {\n  font-size: 1.1rem;\n  font-weight: var(--fw-300);\n}\n\n.current-weather {\n  display: flex;\n  justify-content: space-around;\n}\n\n.current-weather_cointainer {\n  display: flex;\n}\n\n.current-weather_cointainer img {\n  width: calc(10rem + 10vw);\n}\n\n.current-weather_cointainer h1 {\n  margin: 0.3rem 0;\n  font-size: 4rem;\n  font-weight: var(--fw-400);\n}\n\n.current-weather_temp {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n.current-weather__details {\n  display: flex;\n  align-items: center;\n  align-self: center;\n  height: max-content;\n  padding: 2rem 4rem;\n  gap: 4rem;\n  border-radius: 0.5rem;\n  background-color: var(--clr-neutral-transp);\n}\n\n.current-weather__item {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 1rem;\n}\n\n.current-weather__item img {\n  width: calc(1rem + 1vw);\n}\n\n.current-weather__details__column {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n\n.forecast {\n  display: flex;\n  justify-content: space-around;\n  width: 100%;\n  padding: 1rem 2rem;\n  border-radius: 0.5rem;\n  background-color: var(--clr-neutral-transp);\n}\n\n.forecast__item {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.forecast__item img {\n  width: calc(2rem + 3vw);\n}\n", "",{"version":3,"sources":["webpack://./src/styles/main.css"],"names":[],"mappings":"AAEA;EACE,+BAA+B;EAC/B,gDAAgD;EAChD,mCAAmC;EACnC,aAAa;EACb,aAAa;EACb,aAAa;EACb,aAAa;EACb,aAAa;AACf;;AAEA;;;EAGE,SAAS;EACT,UAAU;EACV,sBAAsB;EACtB,gCAAgC;AAClC;;AAEA;EACE,YAAY;EACZ,iBAAiB;EACjB,oCAAoC;EACpC,8BAA8B;EAC9B,yBAAyB;AAC3B;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,6BAA6B;EAC7B,kBAAkB;EAClB,YAAY;EACZ,aAAa;EACb,kBAAkB;EAClB,gBAAgB;AAClB;;AAEA;EACE,kBAAkB;EAClB,MAAM;EACN,OAAO;EACP,YAAY;EACZ,aAAa;EACb,WAAW;AACb;;AAEA;EACE,YAAY;EACZ,aAAa;EACb,iBAAiB;AACnB;;AAEA;;EAEE,kBAAkB;EAClB,YAAY;EACZ,WAAW;EACX,kBAAkB;EAClB,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,YAAY;EACZ,WAAW;EACX,oBAAoB;EACpB,iBAAiB;AACnB;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,kBAAkB;EAClB,SAAS;EACT,WAAW;AACb;;AAEA;EACE,UAAU;EACV,kBAAkB;AACpB;;AAEA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,8BAA8B;EAC9B,YAAY;EACZ,kBAAkB;EAClB,YAAY;EACZ,WAAW;EACX,qBAAqB;AACvB;;AAEA;EACE,sBAAsB;EACtB,kBAAkB;EAClB,kBAAkB;EAClB,QAAQ;EACR,SAAS;EACT,YAAY;EACZ,WAAW;EACX,0BAA0B;EAC1B,iCAAiC;AACnC;;AAEA;EACE,2BAA2B;AAC7B;;AAEA;EACE,kBAAkB;EAClB,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,SAAS;AACX;;AAEA;EACE,UAAU;EACV,4BAA4B;EAC5B,mBAAmB;EACnB,YAAY;EACZ,yDAA4C;EAC5C,4BAA4B;EAC5B,gCAAgC;EAChC,mCAAmC;EACnC,uBAAuB;EACvB,iBAAiB;AACnB;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,gBAAgB;EAChB,sBAAsB;EACtB,0BAA0B;EAC1B,iBAAiB;AACnB;;AAEA;EACE,iBAAiB;EACjB,0BAA0B;AAC5B;;AAEA;EACE,aAAa;EACb,6BAA6B;AAC/B;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,gBAAgB;EAChB,eAAe;EACf,0BAA0B;AAC5B;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,uBAAuB;AACzB;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,kBAAkB;EAClB,mBAAmB;EACnB,kBAAkB;EAClB,SAAS;EACT,qBAAqB;EACrB,2CAA2C;AAC7C;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,WAAW;EACX,eAAe;AACjB;;AAEA;EACE,uBAAuB;AACzB;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,SAAS;AACX;;AAEA;EACE,aAAa;EACb,6BAA6B;EAC7B,WAAW;EACX,kBAAkB;EAClB,qBAAqB;EACrB,2CAA2C;AAC7C;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;AACrB;;AAEA;EACE,uBAAuB;AACzB","sourcesContent":["@import url(./normalize.css);\n\n:root {\n  --clr-neutral: hsl(0, 0%, 100%);\n  --clr-neutral-transp: rgba(255, 255, 255, 0.171);\n  --ff-primary: \"Poppins\", sans-serif;\n  --fw-300: 300;\n  --fw-400: 400;\n  --fw-500: 500;\n  --fw-600: 600;\n  --fw-700: 700;\n}\n\n*,\n*::before,\n*::after {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  text-shadow: 2px 2px 8px #000000;\n}\n\nbody {\n  width: 100vw;\n  min-height: 100vh;\n  background-color: rgb(212, 207, 207);\n  font-family: var(--ff-primary);\n  color: var(--clr-neutral);\n}\n\nmain {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n  position: relative;\n  width: 100vw;\n  height: 100vh;\n  padding: 4rem 2rem;\n  overflow: hidden;\n}\n\n.video-container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  z-index: -5;\n}\n\nvideo {\n  width: 100vw;\n  height: 100vh;\n  object-fit: cover;\n}\n\n.unitC,\n.unitF {\n  font-size: 0.85rem;\n  height: 16px;\n  width: 16px;\n  border-radius: 8px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  color: black;\n  z-index: 20;\n  pointer-events: none;\n  text-shadow: none;\n}\n\n.unitF {\n  color: white;\n}\n\n.checkbox-container {\n  position: absolute;\n  top: 3rem;\n  right: 3rem;\n}\n\n.checkbox {\n  opacity: 0;\n  position: absolute;\n}\n\n.label {\n  background-color: #111;\n  border-radius: 50px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 5px;\n  position: relative;\n  height: 26px;\n  width: 50px;\n  transform: scale(1.5);\n}\n\n.label .ball {\n  background-color: #fff;\n  border-radius: 50%;\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  height: 22px;\n  width: 22px;\n  transform: translateX(0px);\n  transition: transform 0.2s linear;\n}\n\n.checkbox:checked + .label .ball {\n  transform: translateX(24px);\n}\n\n.search-wrapper {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 10px;\n}\n\n.search-wrapper input {\n  width: 40%;\n  padding: 10px 10px 10px 40px;\n  border-radius: 2rem;\n  border: none;\n  background-image: url(../images/magnify.png);\n  background-repeat: no-repeat;\n  background-position: 10px center;\n  background-size: calc(1rem + 0.5vw);\n  background-color: white;\n  text-shadow: none;\n}\n\n#error {\n  display: none;\n}\n\n.city-info h1 {\n  margin: 0.3rem 0;\n  letter-spacing: 0.1rem;\n  font-weight: var(--fw-600);\n  font-size: 2.5rem;\n}\n\nh2 {\n  font-size: 1.1rem;\n  font-weight: var(--fw-300);\n}\n\n.current-weather {\n  display: flex;\n  justify-content: space-around;\n}\n\n.current-weather_cointainer {\n  display: flex;\n}\n\n.current-weather_cointainer img {\n  width: calc(10rem + 10vw);\n}\n\n.current-weather_cointainer h1 {\n  margin: 0.3rem 0;\n  font-size: 4rem;\n  font-weight: var(--fw-400);\n}\n\n.current-weather_temp {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n.current-weather__details {\n  display: flex;\n  align-items: center;\n  align-self: center;\n  height: max-content;\n  padding: 2rem 4rem;\n  gap: 4rem;\n  border-radius: 0.5rem;\n  background-color: var(--clr-neutral-transp);\n}\n\n.current-weather__item {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 1rem;\n}\n\n.current-weather__item img {\n  width: calc(1rem + 1vw);\n}\n\n.current-weather__details__column {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n\n.forecast {\n  display: flex;\n  justify-content: space-around;\n  width: 100%;\n  padding: 1rem 2rem;\n  border-radius: 0.5rem;\n  background-color: var(--clr-neutral-transp);\n}\n\n.forecast__item {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.forecast__item img {\n  width: calc(2rem + 3vw);\n}\n"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NmQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7Ozs7O1dDckJBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBLE1BQU16SyxLQUFLLEdBQUcsSUFBSXNKLHlEQUFKLEVBQWQ7QUFDQSxNQUFNckosSUFBSSxHQUFHLElBQUl1Syx1REFBSixFQUFiO0FBQ0EsTUFBTUUsVUFBVSxHQUFHLElBQUk1SyxtRUFBSixDQUFtQkUsS0FBbkIsRUFBMEJDLElBQTFCLENBQW5CLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc2NyaXB0cy9jb250cm9sbGVycy9tYWluQ29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc2NyaXB0cy9tb2RlbHMvQVBJcy5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc2NyaXB0cy9tb2RlbHMvY2l0eUluZm8uanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3NjcmlwdHMvbW9kZWxzL2N1cnJlbnRXZWF0aGVyLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL3NyYy9zY3JpcHRzL21vZGVscy9mb3JlY2FzdFdlYXRoZXIuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3NjcmlwdHMvbW9kZWxzL21haW5Nb2RlbC5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc2NyaXB0cy92aWV3cy9jaXR5SW5mb1ZpZXcuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3NjcmlwdHMvdmlld3MvY3VycmVudFdlYXRoZXJWaWV3LmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL3NyYy9zY3JpcHRzL3ZpZXdzL2ZvcmVjYXN0V2VhdGhlclZpZXcuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3NjcmlwdHMvdmlld3MvbWFpblZpZXcuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3N0eWxlcy9tYWluLmNzcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc3R5bGVzL25vcm1hbGl6ZS5jc3MiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL3NyYy9zdHlsZXMvbWFpbi5jc3M/ZTgwYSIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3NjcmlwdHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFpbkNvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3Rvcihtb2RlbCwgdmlldykge1xuICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgIHRoaXMuY2l0eSA9IHt9O1xuICAgIHRoaXMudW5pdCA9IFwibWV0cmljXCI7XG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaFwiKS5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoZSkgPT4gdGhpcy5sb2FkUGFnZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaFwiKS52YWx1ZSkpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCAoZSkgPT4gdGhpcy5jaGVja0lmRW50ZXIoZSkpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB0aGlzLmxvYWRQYWdlKFwibmV3IHlvcmtcIikpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hlY2tib3gtdW5pdFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB0aGlzLmNoYW5nZVRlbXBlcmF0dXJlKGUpKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRQYWdlKGNpdHkpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZpZGVvXCIpLnBsYXliYWNrUmF0ZSA9IDAuNTtcblxuICAgIHRoaXMuY2l0eSA9IGNpdHk7XG5cbiAgICBjb25zdCBjaXR5SW5mbyA9IGF3YWl0IHRoaXMubW9kZWwuZ2V0Q2l0eUluZm8oY2l0eSwgdGhpcy51bml0KTtcbiAgICBjb25zdCBjdXJyZW50V2VhdGhlciA9IGF3YWl0IHRoaXMubW9kZWwuZ2V0Q3VycmVudFdlYXRoZXIoY2l0eSwgdGhpcy51bml0KTtcbiAgICBjb25zdCBmb3JlY2FzdFdlYXRoZXIgPSBhd2FpdCB0aGlzLm1vZGVsLmdldEZvcmVjYXN0V2VhdGhlcihjaXR5LCB0aGlzLnVuaXQpO1xuXG4gICAgdGhpcy52aWV3LmFwcGVuZENpdHlJbmZvKGNpdHlJbmZvKTtcbiAgICB0aGlzLnZpZXcuYXBwZW5kQ3VycmVudFdlYXRoZXIoY3VycmVudFdlYXRoZXIpO1xuICAgIHRoaXMudmlldy5hcHBlbmRGb3JlY2FzdFdlYXRoZXIoZm9yZWNhc3RXZWF0aGVyKTtcbiAgfVxuXG4gIGNoZWNrSWZFbnRlcihlKSB7XG4gICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIpIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoXCIpLmJsdXIoKTtcbiAgfVxuXG4gIGNoYW5nZVRlbXBlcmF0dXJlKGUpIHtcbiAgICBjb25zdCB1bml0ID0gZS5jdXJyZW50VGFyZ2V0LmNoZWNrZWQgPyBcImltcGVyaWFsXCIgOiBcIm1ldHJpY1wiO1xuICAgIHRoaXMudmlldy5jaGFuZ2VVbml0VGVtcCh1bml0KTtcbiAgICB0aGlzLnVuaXQgPSB1bml0O1xuICAgIHRoaXMuY2FsbEZ1bmModGhpcy5jaXR5KTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQVBJcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudXJsR2VuZXJhdG9yID0gbmV3IFVybEdlbmVyYXRvcihcImU1MjMyMGI5ODQwNDAxODVlNjA0MGExZTY3ZjI1NGUwXCIpO1xuICB9XG5cbiAgYXN5bmMgZ2V0R2VvQ29vcmRpbmF0ZXMoY2l0eSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB1cmwgPSB0aGlzLnVybEdlbmVyYXRvci5nZW5lcmF0ZUdlb0Nvb3Jkc1VybChjaXR5KTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xuICAgICAgY29uc3QgZ2VvY29kaW5nRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIGNvbnN0IHsgbGF0LCBsb24gfSA9IGdlb2NvZGluZ0RhdGFbMF07XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIHJldHVybiB7IGxhdCwgbG9uIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZ2V0Q3VycmVudFdlYXRoZXJEYXRhKGNpdHksIHVuaXQpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBsYXQsIGxvbiB9ID0gYXdhaXQgdGhpcy5nZXRHZW9Db29yZGluYXRlcyhjaXR5KTtcbiAgICAgIGNvbnN0IHVybCA9IHRoaXMudXJsR2VuZXJhdG9yLmdlbmVyYXRlQ3VycmVudFdlYXRoZXJVcmwobGF0LCBsb24sIHVuaXQpO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbW9kZTogXCJjb3JzXCIgfSk7XG4gICAgICBjb25zdCB3ZWF0aGVyRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgcmV0dXJuIHdlYXRoZXJEYXRhO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGdldEZvcmVjYXN0V2VhdGhlckRhdGEoY2l0eSwgdW5pdCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IGxhdCwgbG9uIH0gPSBhd2FpdCB0aGlzLmdldEdlb0Nvb3JkaW5hdGVzKGNpdHkpO1xuICAgICAgY29uc3QgdXJsID0gdGhpcy51cmxHZW5lcmF0b3IuZ2VuZXJhdGVGb3JlY2FzdFdlYXRoZXJVcmwobGF0LCBsb24sIHVuaXQpO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbW9kZTogXCJjb3JzXCIgfSk7XG4gICAgICBjb25zdCBmb3JlY2FzdERhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIHJldHVybiBmb3JlY2FzdERhdGE7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFVybEdlbmVyYXRvciB7XG4gIGNvbnN0cnVjdG9yKGFwcElkKSB7XG4gICAgdGhpcy5iYXNlVXJsID0gXCJodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmdcIjtcbiAgICB0aGlzLmFwcElkID0gYXBwSWQ7XG4gIH1cblxuICBnZW5lcmF0ZUdlb0Nvb3Jkc1VybChjaXR5KSB7XG4gICAgcmV0dXJuIGAke3RoaXMuYmFzZVVybH0vZ2VvLzEuMC9kaXJlY3Q/cT0ke2NpdHl9JmFwcGlkPSR7dGhpcy5hcHBJZH1gO1xuICB9XG5cbiAgZ2VuZXJhdGVDdXJyZW50V2VhdGhlclVybChsYXQsIGxvbiwgdW5pdCkge1xuICAgIHJldHVybiBgJHt0aGlzLmJhc2VVcmx9L2RhdGEvMi41L3dlYXRoZXI/bGF0PSR7bGF0fSZsb249JHtsb259JmFwcGlkPSR7dGhpcy5hcHBJZH0mdW5pdHM9JHt1bml0fWA7XG4gIH1cblxuICBnZW5lcmF0ZUZvcmVjYXN0V2VhdGhlclVybChsYXQsIGxvbiwgdW5pdCkge1xuICAgIHJldHVybiBgJHt0aGlzLmJhc2VVcmx9L2RhdGEvMi41L2ZvcmVjYXN0P2xhdD0ke2xhdH0mbG9uPSR7bG9ufSZjbnQ9OCZhcHBpZD0ke3RoaXMuYXBwSWR9JnVuaXRzPSR7dW5pdH1gO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDaXR5SW5mbyB7XG4gIGNvbnN0cnVjdG9yKEFwaURhdGEpIHtcbiAgICB0aGlzLmNpdHlEZXNjcmlwdGlvbiA9IHRoaXMuY3JlYXRlQ2l0eURlc2NyaXB0aW9uKEFwaURhdGEpO1xuICAgIHRoaXMuZGF0ZURlc2NyaXB0aW9uID0gdGhpcy5jcmVhdGVEYXRlRGVzY3JpcHRpb24oQXBpRGF0YSk7XG4gIH1cblxuICBjcmVhdGVDaXR5RGVzY3JpcHRpb24oQXBpRGF0YSkge1xuICAgIGNvbnN0IGNpdHkgPSBBcGlEYXRhLm5hbWU7XG4gICAgY29uc3QgeyBjb3VudHJ5IH0gPSBBcGlEYXRhLnN5cztcbiAgICByZXR1cm4gYCR7Y2l0eX0sICR7Y291bnRyeX1gO1xuICB9XG5cbiAgY3JlYXRlRGF0ZURlc2NyaXB0aW9uKEFwaURhdGEpIHtcbiAgICBjb25zdCBkYXkgPSB0aGlzLmdldERheSgpO1xuICAgIGNvbnN0IG1vbnRoID0gdGhpcy5nZXRNb250aCgpO1xuICAgIGNvbnN0IGRhdGUgPSB0aGlzLmdldERhdGUoKTtcbiAgICByZXR1cm4gYCR7ZGF5fSwgJHttb250aH0gJHtkYXRlfWA7XG4gIH1cblxuICBnZXREYXkoKSB7XG4gICAgY29uc3Qgd2Vla2RheSA9IFtcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCJdO1xuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGRheSA9IHdlZWtkYXlbZC5nZXREYXkoKV07XG4gICAgcmV0dXJuIGRheTtcbiAgfVxuXG4gIGdldE1vbnRoKCkge1xuICAgIGNvbnN0IG1vbnRoTmFtZXMgPSBbXG4gICAgICBcIkphbnVhcnlcIixcbiAgICAgIFwiRmVicnVhcnlcIixcbiAgICAgIFwiTWFyY2hcIixcbiAgICAgIFwiQXByaWxcIixcbiAgICAgIFwiTWF5XCIsXG4gICAgICBcIkp1bmVcIixcbiAgICAgIFwiSnVseVwiLFxuICAgICAgXCJBdWd1c3RcIixcbiAgICAgIFwiU2VwdGVtYmVyXCIsXG4gICAgICBcIk9jdG9iZXJcIixcbiAgICAgIFwiTm92ZW1iZXJcIixcbiAgICAgIFwiRGVjZW1iZXJcIixcbiAgICBdO1xuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IG1vbnRoID0gbW9udGhOYW1lc1tkLmdldE1vbnRoKCldO1xuICAgIHJldHVybiBtb250aDtcbiAgfVxuXG4gIGdldERhdGUoKSB7XG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgZGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuICAgIHJldHVybiBkYXRlO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDdXJyZW50V2VhdGhlciB7XG4gIGNvbnN0cnVjdG9yKGN1cnJlbnRXZWF0aGVyRGF0YSwgdW5pdCkge1xuICAgIHRoaXMudGVtcGVyYXR1cmUgPSB0aGlzLmdldFRlbXBlcmF0dXJlKE1hdGgucm91bmQoY3VycmVudFdlYXRoZXJEYXRhLm1haW4udGVtcCksIHVuaXQpO1xuICAgIHRoaXMuZmVlbHNMaWtlVGVtcCA9IHRoaXMuZ2V0VGVtcGVyYXR1cmUoTWF0aC5yb3VuZChjdXJyZW50V2VhdGhlckRhdGEubWFpbi5mZWVsc19saWtlKSwgdW5pdCk7XG4gICAgdGhpcy5odW1pZGl0eSA9IGAke2N1cnJlbnRXZWF0aGVyRGF0YS5tYWluLmh1bWlkaXR5fSVgO1xuICAgIHRoaXMud2luZFNwZWVkID0gYCR7Y3VycmVudFdlYXRoZXJEYXRhLndpbmQuc3BlZWR9IG0vc2A7XG4gICAgdGhpcy5wcmVzc3VyZSA9IGAke2N1cnJlbnRXZWF0aGVyRGF0YS5tYWluLnByZXNzdXJlfSBoUGFgO1xuICAgIHRoaXMuc3VucmlzZSA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5VGltZShjdXJyZW50V2VhdGhlckRhdGEuc3lzLnN1bnJpc2UsIGN1cnJlbnRXZWF0aGVyRGF0YS50aW1lem9uZSk7XG4gICAgdGhpcy5zdW5zZXQgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eVRpbWUoY3VycmVudFdlYXRoZXJEYXRhLnN5cy5zdW5zZXQsIGN1cnJlbnRXZWF0aGVyRGF0YS50aW1lem9uZSk7XG4gICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uRGVzYyA9IGN1cnJlbnRXZWF0aGVyRGF0YS53ZWF0aGVyWzBdLmRlc2NyaXB0aW9uO1xuICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbkltZyA9IHRoaXMuZ2V0V2VhdGhlckNvbmRpdGlvbkltZyhcbiAgICAgIGN1cnJlbnRXZWF0aGVyRGF0YS53ZWF0aGVyWzBdLm1haW4sXG4gICAgICBjdXJyZW50V2VhdGhlckRhdGEuc3lzLnN1bnJpc2UsXG4gICAgICBjdXJyZW50V2VhdGhlckRhdGEuc3lzLnN1bnNldCxcbiAgICAgIGN1cnJlbnRXZWF0aGVyRGF0YS50aW1lem9uZVxuICAgICk7XG4gICAgdGhpcy5iYWNrZ3JvdW5kVmlkZW8gPSB0aGlzLmdldEJhY2tncm91bmRWaWRlb0xpbmsodGhpcy53ZWF0aGVyQ29uZGl0aW9uSW1nKTtcbiAgfVxuXG4gIGdldFRlbXBlcmF0dXJlKGRlZ3JlZSwgdW5pdCkge1xuICAgIHJldHVybiB1bml0ID09PSBcIm1ldHJpY1wiID8gYCR7ZGVncmVlfeKEg2AgOiBgJHtkZWdyZWV94oSJYDtcbiAgfVxuXG4gIGNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUodW5peFRpbWUsIHRpbWV6b25lKSB7XG4gICAgY29uc3QgbG9jYWxEYXRlID0gdW5peFRpbWUgPT09IDAgPyBuZXcgRGF0ZSgpIDogbmV3IERhdGUodW5peFRpbWUgKiAxMDAwKTtcbiAgICBjb25zdCB1dGNVbml4VGltZSA9IGxvY2FsRGF0ZS5nZXRUaW1lKCkgKyBsb2NhbERhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSAqIDYwMDAwO1xuICAgIGNvbnN0IHVuaXhUaW1lSW5TZWFyY2hlZENpdHkgPSB1dGNVbml4VGltZSArIHRpbWV6b25lICogMTAwMDtcbiAgICBjb25zdCBkYXRlSW5TZWFyY2hlZENpdHkgPSBuZXcgRGF0ZSh1bml4VGltZUluU2VhcmNoZWRDaXR5KTtcbiAgICByZXR1cm4gZGF0ZUluU2VhcmNoZWRDaXR5O1xuICB9XG5cbiAgY29udmVydFRvU2VhcmNoZWRDaXR5VGltZSh1bml4VGltZSwgdGltZXpvbmUpIHtcbiAgICBjb25zdCBkYXRlSW5TZWFyY2hlZENpdHkgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUodW5peFRpbWUsIHRpbWV6b25lKTtcbiAgICBjb25zdCBob3VycyA9IGRhdGVJblNlYXJjaGVkQ2l0eS5nZXRIb3VycygpO1xuICAgIGNvbnN0IG1pbnV0ZXMgPSBgMCR7ZGF0ZUluU2VhcmNoZWRDaXR5LmdldE1pbnV0ZXMoKX1gO1xuICAgIGNvbnN0IGZvcm1hdHRlZFRpbWUgPSBgJHtob3Vyc306JHttaW51dGVzLnN1YnN0cigtMil9YDtcbiAgICByZXR1cm4gZm9ybWF0dGVkVGltZTtcbiAgfVxuXG4gIGdldFdlYXRoZXJDb25kaXRpb25JbWcodmFsdWUsIHN1bnJpc2VVbml4LCBzdW5zZXRVbml4LCB0aW1lem9uZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gXCJEcml6emxlXCIpIHJldHVybiBcIlJhaW5cIjtcbiAgICBjb25zdCBtaXN0RXF1aXZhbGVudGVzID0gW1wiU21va2VcIiwgXCJIYXplXCIsIFwiRHVzdFwiLCBcIkZvZ1wiLCBcIlNhbmRcIiwgXCJEdXN0XCIsIFwiQXNoXCIsIFwiU3F1YWxsXCIsIFwiVG9ybmFkb1wiXTtcbiAgICBpZiAobWlzdEVxdWl2YWxlbnRlcy5pbmNsdWRlcyh2YWx1ZSkpIHJldHVybiBcIk1pc3RcIjtcbiAgICBpZiAodmFsdWUgIT09IFwiQ2xlYXJcIikgcmV0dXJuIHZhbHVlO1xuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKDAsIHRpbWV6b25lKTtcbiAgICBjb25zdCBzdW5yaXNlRGF0ZSA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZShzdW5yaXNlVW5peCwgdGltZXpvbmUpO1xuICAgIGNvbnN0IHN1bnNldERhdGUgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoc3Vuc2V0VW5peCwgdGltZXpvbmUpO1xuICAgIHJldHVybiBjdXJyZW50RGF0ZSA+IHN1bnJpc2VEYXRlICYmIGN1cnJlbnREYXRlIDwgc3Vuc2V0RGF0ZSA/IGAke3ZhbHVlfURheWAgOiBgJHt2YWx1ZX1OaWdodGA7XG4gIH1cblxuICBnZXRCYWNrZ3JvdW5kVmlkZW9MaW5rKHdlYXRoZXJDb25kaXRpb24pIHtcbiAgICBjb25zdCB2aWRlb0xpbmtzID0ge1xuICAgICAgQ2xlYXJEYXk6XG4gICAgICAgIFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzM0NTgwNTE1MC5oZC5tcDQ/cz0zNmM0ZTU5NmI0ODBlZjBlODA0OTM3MGJlY2JhZjI2MWIzOTg5YTAxJnByb2ZpbGVfaWQ9MTcwJm9hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MVwiLFxuICAgICAgQ2xlYXJOaWdodDpcbiAgICAgICAgXCJodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvNDY5MzA3OTUwLmhkLm1wND9zPTJlNjdhYTAyYTIxZDVjNjRjNjU3OTA0M2E3OGYwOTcyM2ViYzVkZGImcHJvZmlsZV9pZD0xNzUmb2F1dGgyX3Rva2VuX2lkPTU3NDQ3NzYxXCIsXG4gICAgICBDbG91ZHM6XG4gICAgICAgIFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzQ0NDIxMjY3NC5oZC5tcDQ/cz00MDcxOTgxMjY0ZDllNzhhY2YwOWEwNDAwZTQ2Mzg0MzI0OTVjNGYwJnByb2ZpbGVfaWQ9MTc1Jm9hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MVwiLFxuICAgICAgTWlzdDogXCJodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvMzQzNzMyMTMyLmhkLm1wND9zPTViZmRlMjNmMTdlMzg1OGRiZGMxNDBhZmU3YTM1YjZhOWVmMTEyN2QmcHJvZmlsZV9pZD0xNzUmb2F1dGgyX3Rva2VuX2lkPTU3NDQ3NzYxXCIsXG4gICAgICBSYWluOiBcImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9leHRlcm5hbC81NjkyMTc2MDIuaGQubXA0P3M9OWE5NjE3OGM5MWZlMTlhNjMxN2VkNTk0Nzg1ZjJlMzY4Y2QxZWFkZSZwcm9maWxlX2lkPTE3NCZvYXV0aDJfdG9rZW5faWQ9NTc0NDc3NjFcIixcbiAgICAgIFNub3c6IFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzUxMDgzMTE2OS5oZC5tcDQ/cz1kOTAwNDk1NTliNzZmMGI5ZTBiZGExMDJlYThhNzQyMWQ3YTY0ZDgxJnByb2ZpbGVfaWQ9MTc1Jm9hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MVwiLFxuICAgICAgVGh1bmRlcnN0b3JtOlxuICAgICAgICBcImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9leHRlcm5hbC80ODAyMjM4OTYuaGQubXA0P3M9ZTRiOTRmMGI1NzAwYmZhNjhjYjZmMDJiNDFmOTRlY2NhOTEyNDJlOSZwcm9maWxlX2lkPTE2OSZvYXV0aDJfdG9rZW5faWQ9NTc0NDc3NjFcIixcbiAgICB9O1xuICAgIHJldHVybiB2aWRlb0xpbmtzW3dlYXRoZXJDb25kaXRpb25dO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBGb3JlY2FzdFdlYXRoZXIge1xuICBjb25zdHJ1Y3Rvcihmb3JlY2FzdFdlYXRoZXJEYXRhLCB1bml0KSB7XG4gICAgdGhpcy50ZW1wZXJhdHVyZXMgPSB0aGlzLmdldFRlbXBlcmF0dXJlcyhmb3JlY2FzdFdlYXRoZXJEYXRhLCB1bml0KTtcbiAgICB0aGlzLndlYXRoZXJDb25kaXRpb24gPSB0aGlzLmdldFdlYXRoZXJDb25kaXRpb25zKGZvcmVjYXN0V2VhdGhlckRhdGEpO1xuICAgIHRoaXMudGltZSA9IHRoaXMuZ2V0VGltZXMoZm9yZWNhc3RXZWF0aGVyRGF0YSk7XG4gIH1cblxuICBnZXRUZW1wZXJhdHVyZXMoZm9yZWNhc3RXZWF0aGVyRGF0YSwgdW5pdCkge1xuICAgIGNvbnN0IHRlbXBlcmF0dXJlcyA9IFtdO1xuICAgIGZvcmVjYXN0V2VhdGhlckRhdGEubGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCB0ZW1wID0gTWF0aC5yb3VuZChpdGVtLm1haW4udGVtcCk7XG4gICAgICBjb25zdCB0ZW1wV2l0aFVuaXQgPSB0aGlzLmdldFRlbXBlcmF0dXJlVW5pdCh0ZW1wLCB1bml0KTtcbiAgICAgIHRlbXBlcmF0dXJlcy5wdXNoKHRlbXBXaXRoVW5pdCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRlbXBlcmF0dXJlcztcbiAgfVxuXG4gIGdldFRlbXBlcmF0dXJlVW5pdChkZWdyZWUsIHVuaXQpIHtcbiAgICByZXR1cm4gdW5pdCA9PT0gXCJtZXRyaWNcIiA/IGAke2RlZ3JlZX3ihINgIDogYCR7ZGVncmVlfeKEiWA7XG4gIH1cblxuICBjb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKHVuaXhUaW1lLCB0aW1lem9uZSkge1xuICAgIGNvbnN0IGxvY2FsRGF0ZSA9IG5ldyBEYXRlKHVuaXhUaW1lICogMTAwMCk7XG4gICAgY29uc3QgdXRjVW5peFRpbWUgPSBsb2NhbERhdGUuZ2V0VGltZSgpICsgbG9jYWxEYXRlLmdldFRpbWV6b25lT2Zmc2V0KCkgKiA2MDAwMDtcbiAgICBjb25zdCB1bml4VGltZUluU2VhcmNoZWRDaXR5ID0gdXRjVW5peFRpbWUgKyB0aW1lem9uZSAqIDEwMDA7XG4gICAgY29uc3QgZGF0ZUluU2VhcmNoZWRDaXR5ID0gbmV3IERhdGUodW5peFRpbWVJblNlYXJjaGVkQ2l0eSk7XG4gICAgcmV0dXJuIGRhdGVJblNlYXJjaGVkQ2l0eTtcbiAgfVxuXG4gIGdldFdlYXRoZXJDb25kaXRpb25JbWcodmFsdWUsIHRpbWUsIHN1bnJpc2VVbml4LCBzdW5zZXRVbml4LCB0aW1lem9uZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gXCJDbGVhclwiKSByZXR1cm4gdmFsdWU7XG4gICAgY29uc3QgY3VycmVudEhvdXIgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUodGltZSwgdGltZXpvbmUpLmdldEhvdXJzKCk7XG4gICAgY29uc3Qgc3VucmlzZUhvdXIgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoc3VucmlzZVVuaXgsIHRpbWV6b25lKS5nZXRIb3VycygpO1xuICAgIGNvbnN0IHN1bnNldEhvdXIgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoc3Vuc2V0VW5peCwgdGltZXpvbmUpLmdldEhvdXJzKCk7XG4gICAgcmV0dXJuIGN1cnJlbnRIb3VyID4gc3VucmlzZUhvdXIgJiYgY3VycmVudEhvdXIgPCBzdW5zZXRIb3VyID8gYCR7dmFsdWV9RGF5YCA6IGAke3ZhbHVlfU5pZ2h0YDtcbiAgfVxuXG4gIGdldFdlYXRoZXJDb25kaXRpb25zKGZvcmVjYXN0V2VhdGhlckRhdGEpIHtcbiAgICBjb25zdCB3ZWF0aGVyQ29uZGl0aW9uID0gW107XG4gICAgY29uc3Qgc3VucmlzZVVuaXggPSBmb3JlY2FzdFdlYXRoZXJEYXRhLmNpdHkuc3VucmlzZTtcbiAgICBjb25zdCBzdW5zZXRVbml4ID0gZm9yZWNhc3RXZWF0aGVyRGF0YS5jaXR5LnN1bnNldDtcbiAgICBjb25zdCB7IHRpbWV6b25lIH0gPSBmb3JlY2FzdFdlYXRoZXJEYXRhLmNpdHk7XG4gICAgZm9yZWNhc3RXZWF0aGVyRGF0YS5saXN0LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGNvbmQgPSB0aGlzLmdldFdlYXRoZXJDb25kaXRpb25JbWcoaXRlbS53ZWF0aGVyWzBdLm1haW4sIGl0ZW0uZHQsIHN1bnJpc2VVbml4LCBzdW5zZXRVbml4LCB0aW1lem9uZSk7XG4gICAgICB3ZWF0aGVyQ29uZGl0aW9uLnB1c2goY29uZCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHdlYXRoZXJDb25kaXRpb247XG4gIH1cblxuICBnZXRUaW1lcyhmb3JlY2FzdFdlYXRoZXJEYXRhKSB7XG4gICAgY29uc3QgdGltZXMgPSBbXTtcbiAgICBjb25zdCB7IHRpbWV6b25lIH0gPSBmb3JlY2FzdFdlYXRoZXJEYXRhLmNpdHk7XG4gICAgZm9yZWNhc3RXZWF0aGVyRGF0YS5saXN0LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eVRpbWUoaXRlbSwgdGltZXpvbmUpO1xuICAgICAgdGltZXMucHVzaCh0aW1lKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGltZXM7XG4gIH1cblxuICBjb252ZXJ0VG9TZWFyY2hlZENpdHlUaW1lKHVuaXhUaW1lLCB0aW1lem9uZSkge1xuICAgIGNvbnN0IGxvY2FsRGF0ZSA9IG5ldyBEYXRlKHVuaXhUaW1lLmR0ICogMTAwMCk7XG4gICAgY29uc3QgdXRjVW5peFRpbWUgPSBsb2NhbERhdGUuZ2V0VGltZSgpICsgbG9jYWxEYXRlLmdldFRpbWV6b25lT2Zmc2V0KCkgKiA2MDAwMDtcbiAgICBjb25zdCB1bml4VGltZUluU2VhcmNoZWRDaXR5ID0gdXRjVW5peFRpbWUgKyB0aW1lem9uZSAqIDEwMDA7XG4gICAgY29uc3QgZGF0ZUluU2VhcmNoZWRDaXR5ID0gbmV3IERhdGUodW5peFRpbWVJblNlYXJjaGVkQ2l0eSk7XG4gICAgY29uc3QgaG91cnMgPSBkYXRlSW5TZWFyY2hlZENpdHkuZ2V0SG91cnMoKTtcbiAgICBjb25zdCB0aW1lID0gYCR7aG91cnN9OjAwYDtcbiAgICByZXR1cm4gdGltZTtcbiAgfVxufVxuIiwiaW1wb3J0IEN1cnJlbnRXZWF0aGVyIGZyb20gXCIuL2N1cnJlbnRXZWF0aGVyXCI7XG5pbXBvcnQgRm9yZWNhc3RXZWF0aGVyIGZyb20gXCIuL2ZvcmVjYXN0V2VhdGhlclwiO1xuaW1wb3J0IENpdHlJbmZvIGZyb20gXCIuL2NpdHlJbmZvXCI7XG5pbXBvcnQgQVBJcyBmcm9tIFwiLi9BUElzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1haW5Nb2RlbCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZGF0YSA9IHt9O1xuICAgIHRoaXMuQVBJcyA9IG5ldyBBUElzKCk7XG4gIH1cblxuICBhc3luYyBnZXRDaXR5SW5mbyhjaXR5LCB1bml0KSB7XG4gICAgY29uc3QgQXBpRGF0YSA9IGF3YWl0IHRoaXMuQVBJcy5nZXRDdXJyZW50V2VhdGhlckRhdGEoY2l0eSwgdW5pdCk7XG4gICAgY29uc3QgY2l0eUluZm8gPSBuZXcgQ2l0eUluZm8oQXBpRGF0YSk7XG4gICAgcmV0dXJuIGNpdHlJbmZvO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q3VycmVudFdlYXRoZXIoY2l0eSwgdW5pdCkge1xuICAgIGNvbnN0IGN1cnJlbnRXZWF0aGVyRGF0YSA9IGF3YWl0IHRoaXMuQVBJcy5nZXRDdXJyZW50V2VhdGhlckRhdGEoY2l0eSwgdW5pdCk7XG4gICAgY29uc3QgY3VycmVudFdlYXRoZXIgPSBuZXcgQ3VycmVudFdlYXRoZXIoY3VycmVudFdlYXRoZXJEYXRhLCB1bml0KTtcbiAgICByZXR1cm4gY3VycmVudFdlYXRoZXI7XG4gIH1cblxuICBhc3luYyBnZXRGb3JlY2FzdFdlYXRoZXIoY2l0eSwgdW5pdCkge1xuICAgIGNvbnN0IGZvcmVjYXN0V2VhdGhlckRhdGEgPSBhd2FpdCB0aGlzLkFQSXMuZ2V0Rm9yZWNhc3RXZWF0aGVyRGF0YShjaXR5LCB1bml0KTtcbiAgICBjb25zdCBmb3JlY2FzdFdlYXRoZXIgPSBuZXcgRm9yZWNhc3RXZWF0aGVyKGZvcmVjYXN0V2VhdGhlckRhdGEsIHVuaXQpO1xuICAgIHJldHVybiBmb3JlY2FzdFdlYXRoZXI7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENpdHlJbmZvVmlldyB7XG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGNpdHlJbmZvTW9kZWwpIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMubW9kZWwgPSBjaXR5SW5mb01vZGVsO1xuICAgIHRoaXMuY2l0eSA9IGNpdHlJbmZvTW9kZWwuY2l0eURlc2NyaXB0aW9uO1xuICAgIHRoaXMuZGF0ZSA9IGNpdHlJbmZvTW9kZWwuZGF0ZURlc2NyaXB0aW9uO1xuICB9XG5cbiAgZ2V0IGNpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDFcIik7XG4gIH1cblxuICBzZXQgY2l0eSh2YWx1ZSkge1xuICAgIHRoaXMuY2l0eS50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDJcIik7XG4gIH1cblxuICBzZXQgZGF0ZSh2YWx1ZSkge1xuICAgIHRoaXMuZGF0ZS50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDdXJyZW50V2VhdGhlclZpZXcge1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBjdXJyZW50V2VhdGhlck1vZGVsKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLm1vZGVsID0gY3VycmVudFdlYXRoZXJNb2RlbDtcbiAgICB0aGlzLndlYXRoZXJDb25kaXRpb25JbWcgPSBjdXJyZW50V2VhdGhlck1vZGVsLndlYXRoZXJDb25kaXRpb25JbWc7XG4gICAgdGhpcy50ZW1wZXJhdHVyZSA9IGN1cnJlbnRXZWF0aGVyTW9kZWwudGVtcGVyYXR1cmU7XG4gICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uRGVzYyA9IGN1cnJlbnRXZWF0aGVyTW9kZWwud2VhdGhlckNvbmRpdGlvbkRlc2M7XG4gICAgdGhpcy5mZWVsc0xpa2VUZW1wID0gY3VycmVudFdlYXRoZXJNb2RlbC5mZWVsc0xpa2VUZW1wO1xuICAgIHRoaXMuc3VucmlzZSA9IGN1cnJlbnRXZWF0aGVyTW9kZWwuc3VucmlzZTtcbiAgICB0aGlzLnN1bnNldCA9IGN1cnJlbnRXZWF0aGVyTW9kZWwuc3Vuc2V0O1xuICAgIHRoaXMuaHVtaWRpdHkgPSBjdXJyZW50V2VhdGhlck1vZGVsLmh1bWlkaXR5O1xuICAgIHRoaXMud2luZFNwZWVkID0gY3VycmVudFdlYXRoZXJNb2RlbC53aW5kU3BlZWQ7XG4gICAgdGhpcy5wcmVzc3VyZSA9IGN1cnJlbnRXZWF0aGVyTW9kZWwucHJlc3N1cmU7XG4gICAgdGhpcy5ub3dXZWF0aGVyQ29uZGl0aW9uID0gY3VycmVudFdlYXRoZXJNb2RlbC53ZWF0aGVyQ29uZGl0aW9uSW1nO1xuICAgIHRoaXMubm93VGVtcGVyYXR1cmUgPSBjdXJyZW50V2VhdGhlck1vZGVsLnRlbXBlcmF0dXJlO1xuICAgIHRoaXMuYmFja2dyb3VuZFZpZGVvID0gY3VycmVudFdlYXRoZXJNb2RlbC5iYWNrZ3JvdW5kVmlkZW87XG4gIH1cblxuICBnZXQgd2VhdGhlckNvbmRpdGlvbkltZygpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIik7XG4gIH1cblxuICBzZXQgd2VhdGhlckNvbmRpdGlvbkltZyh2YWx1ZSkge1xuICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbkltZy5zcmMgPSBgaW1hZ2VzLyR7dmFsdWV9LnBuZ2A7XG4gIH1cblxuICBnZXQgdGVtcGVyYXR1cmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDFcIik7XG4gIH1cblxuICBzZXQgdGVtcGVyYXR1cmUodmFsdWUpIHtcbiAgICB0aGlzLnRlbXBlcmF0dXJlLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgd2VhdGhlckNvbmRpdGlvbkRlc2MoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDJcIik7XG4gIH1cblxuICBzZXQgd2VhdGhlckNvbmRpdGlvbkRlc2ModmFsdWUpIHtcbiAgICB0aGlzLndlYXRoZXJDb25kaXRpb25EZXNjLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZmVlbHNMaWtlVGVtcCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmVlbHMtbGlrZVwiKTtcbiAgfVxuXG4gIHNldCBmZWVsc0xpa2VUZW1wKHZhbHVlKSB7XG4gICAgdGhpcy5mZWVsc0xpa2VUZW1wLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc3VucmlzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3VucmlzZVwiKTtcbiAgfVxuXG4gIHNldCBzdW5yaXNlKHZhbHVlKSB7XG4gICAgdGhpcy5zdW5yaXNlLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc3Vuc2V0KCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdW5zZXRcIik7XG4gIH1cblxuICBzZXQgc3Vuc2V0KHZhbHVlKSB7XG4gICAgdGhpcy5zdW5zZXQudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBodW1pZGl0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaHVtaWRpdHlcIik7XG4gIH1cblxuICBzZXQgaHVtaWRpdHkodmFsdWUpIHtcbiAgICB0aGlzLmh1bWlkaXR5LnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgd2luZFNwZWVkKCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5kLXNwZWVkXCIpO1xuICB9XG5cbiAgc2V0IHdpbmRTcGVlZCh2YWx1ZSkge1xuICAgIHRoaXMud2luZFNwZWVkLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgcHJlc3N1cmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnByZXNzdXJlXCIpO1xuICB9XG5cbiAgc2V0IHByZXNzdXJlKHZhbHVlKSB7XG4gICAgdGhpcy5wcmVzc3VyZS50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IG5vd1dlYXRoZXJDb25kaXRpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9yZWNhc3RfX2l0ZW1fX2N1cnJlbnQtY29uZGl0aW9uXCIpO1xuICB9XG5cbiAgc2V0IG5vd1dlYXRoZXJDb25kaXRpb24odmFsdWUpIHtcbiAgICB0aGlzLm5vd1dlYXRoZXJDb25kaXRpb24uc3JjID0gYGltYWdlcy8ke3ZhbHVlfS5wbmdgO1xuICB9XG5cbiAgZ2V0IG5vd1RlbXBlcmF0dXJlKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvcmVjYXN0X19pdGVtX19jdXJlbnQtdGVtcFwiKTtcbiAgfVxuXG4gIHNldCBub3dUZW1wZXJhdHVyZSh2YWx1ZSkge1xuICAgIHRoaXMubm93VGVtcGVyYXR1cmUudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBiYWNrZ3JvdW5kVmlkZW8oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidmlkZW9cIik7XG4gIH1cblxuICBzZXQgYmFja2dyb3VuZFZpZGVvKHZhbHVlKSB7XG4gICAgdGhpcy5iYWNrZ3JvdW5kVmlkZW8uc3JjID0gdmFsdWU7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIGZvcmVjYXN0V2VhdGhlclZpZXcge1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBmb3JlY2FzdFdlYXRoZXJNb2RlbCkge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5tb2RlbCA9IGZvcmVjYXN0V2VhdGhlck1vZGVsO1xuICAgIHRoaXMudGltZSA9IGZvcmVjYXN0V2VhdGhlck1vZGVsLnRpbWU7XG4gICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uID0gZm9yZWNhc3RXZWF0aGVyTW9kZWwud2VhdGhlckNvbmRpdGlvbjtcbiAgICB0aGlzLnRlbXBlcmF0dXJlcyA9IGZvcmVjYXN0V2VhdGhlck1vZGVsLnRlbXBlcmF0dXJlcztcbiAgfVxuXG4gIGdldCB0aW1lKCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5mb3JlY2FzdF9faXRlbV9fdGltZVwiKTtcbiAgfVxuXG4gIHNldCB0aW1lKHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRpbWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMudGltZVtpXS50ZXh0Q29udGVudCA9IHZhbHVlW2ldO1xuICAgIH1cbiAgfVxuXG4gIGdldCB3ZWF0aGVyQ29uZGl0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKTtcbiAgfVxuXG4gIHNldCB3ZWF0aGVyQ29uZGl0aW9uKHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLndlYXRoZXJDb25kaXRpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbltpXS5zcmMgPSBgaW1hZ2VzLyR7dmFsdWVbaSAtIDFdfS5wbmdgO1xuICAgIH1cbiAgfVxuXG4gIGdldCB0ZW1wZXJhdHVyZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZvcmVjYXN0X19pdGVtX190ZW1wZXJhdHVyZVwiKTtcbiAgfVxuXG4gIHNldCB0ZW1wZXJhdHVyZXModmFsdWUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGltZS5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy50ZW1wZXJhdHVyZXNbaV0udGV4dENvbnRlbnQgPSB2YWx1ZVtpXTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBDaXR5SW5mb1ZpZXcgZnJvbSBcIi4vY2l0eUluZm9WaWV3XCI7XG5pbXBvcnQgQ3VycmVudFdlYXRoZXJWaWV3IGZyb20gXCIuL2N1cnJlbnRXZWF0aGVyVmlld1wiO1xuaW1wb3J0IEZvcmVjYXN0V2VhdGhlclZpZXcgZnJvbSBcIi4vZm9yZWNhc3RXZWF0aGVyVmlld1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYWluVmlldyB7XG4gIGFwcGVuZENpdHlJbmZvKGNpdHlJbmZvKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eS1pbmZvXCIpO1xuICAgIG5ldyBDaXR5SW5mb1ZpZXcoZWxlbWVudCwgY2l0eUluZm8pO1xuICB9XG5cbiAgYXBwZW5kQ3VycmVudFdlYXRoZXIoY3VycmVudFdlYXRoZXIpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdXJyZW50LXdlYXRoZXJcIik7XG4gICAgbmV3IEN1cnJlbnRXZWF0aGVyVmlldyhlbGVtZW50LCBjdXJyZW50V2VhdGhlcik7XG4gIH1cblxuICBhcHBlbmRGb3JlY2FzdFdlYXRoZXIoZm9yZWNhc3RXZWF0aGVyKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9yZWNhc3RcIik7XG4gICAgbmV3IEZvcmVjYXN0V2VhdGhlclZpZXcoZWxlbWVudCwgZm9yZWNhc3RXZWF0aGVyKTtcbiAgfVxuXG4gIGNoYW5nZVVuaXRUZW1wKHVuaXQpIHtcbiAgICBpZiAodW5pdCA9PT0gXCJpbXBlcmlhbFwiKSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnVuaXRDXCIpLnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51bml0RlwiKS5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51bml0RlwiKS5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudW5pdENcIikuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XG4gICAgfVxuICB9XG59XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzBfX18gZnJvbSBcIi0hLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9ub3JtYWxpemUuY3NzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fID0gbmV3IFVSTChcIi4uL2ltYWdlcy9tYWduaWZ5LnBuZ1wiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18uaShfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzBfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIjpyb290IHtcXG4gIC0tY2xyLW5ldXRyYWw6IGhzbCgwLCAwJSwgMTAwJSk7XFxuICAtLWNsci1uZXV0cmFsLXRyYW5zcDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE3MSk7XFxuICAtLWZmLXByaW1hcnk6IFxcXCJQb3BwaW5zXFxcIiwgc2Fucy1zZXJpZjtcXG4gIC0tZnctMzAwOiAzMDA7XFxuICAtLWZ3LTQwMDogNDAwO1xcbiAgLS1mdy01MDA6IDUwMDtcXG4gIC0tZnctNjAwOiA2MDA7XFxuICAtLWZ3LTcwMDogNzAwO1xcbn1cXG5cXG4qLFxcbio6OmJlZm9yZSxcXG4qOjphZnRlciB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIHRleHQtc2hhZG93OiAycHggMnB4IDhweCAjMDAwMDAwO1xcbn1cXG5cXG5ib2R5IHtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIxMiwgMjA3LCAyMDcpO1xcbiAgZm9udC1mYW1pbHk6IHZhcigtLWZmLXByaW1hcnkpO1xcbiAgY29sb3I6IHZhcigtLWNsci1uZXV0cmFsKTtcXG59XFxuXFxubWFpbiB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgd2lkdGg6IDEwMHZ3O1xcbiAgaGVpZ2h0OiAxMDB2aDtcXG4gIHBhZGRpbmc6IDRyZW0gMnJlbTtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxufVxcblxcbi52aWRlby1jb250YWluZXIge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIGhlaWdodDogMTAwdmg7XFxuICB6LWluZGV4OiAtNTtcXG59XFxuXFxudmlkZW8ge1xcbiAgd2lkdGg6IDEwMHZ3O1xcbiAgaGVpZ2h0OiAxMDB2aDtcXG4gIG9iamVjdC1maXQ6IGNvdmVyO1xcbn1cXG5cXG4udW5pdEMsXFxuLnVuaXRGIHtcXG4gIGZvbnQtc2l6ZTogMC44NXJlbTtcXG4gIGhlaWdodDogMTZweDtcXG4gIHdpZHRoOiAxNnB4O1xcbiAgYm9yZGVyLXJhZGl1czogOHB4O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGNvbG9yOiBibGFjaztcXG4gIHotaW5kZXg6IDIwO1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICB0ZXh0LXNoYWRvdzogbm9uZTtcXG59XFxuXFxuLnVuaXRGIHtcXG4gIGNvbG9yOiB3aGl0ZTtcXG59XFxuXFxuLmNoZWNrYm94LWNvbnRhaW5lciB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDNyZW07XFxuICByaWdodDogM3JlbTtcXG59XFxuXFxuLmNoZWNrYm94IHtcXG4gIG9wYWNpdHk6IDA7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxufVxcblxcbi5sYWJlbCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMTExO1xcbiAgYm9yZGVyLXJhZGl1czogNTBweDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbiAgcGFkZGluZzogNXB4O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgaGVpZ2h0OiAyNnB4O1xcbiAgd2lkdGg6IDUwcHg7XFxuICB0cmFuc2Zvcm06IHNjYWxlKDEuNSk7XFxufVxcblxcbi5sYWJlbCAuYmFsbCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAycHg7XFxuICBsZWZ0OiAycHg7XFxuICBoZWlnaHQ6IDIycHg7XFxuICB3aWR0aDogMjJweDtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwcHgpO1xcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMnMgbGluZWFyO1xcbn1cXG5cXG4uY2hlY2tib3g6Y2hlY2tlZCArIC5sYWJlbCAuYmFsbCB7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMjRweCk7XFxufVxcblxcbi5zZWFyY2gtd3JhcHBlciB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBnYXA6IDEwcHg7XFxufVxcblxcbi5zZWFyY2gtd3JhcHBlciBpbnB1dCB7XFxuICB3aWR0aDogNDAlO1xcbiAgcGFkZGluZzogMTBweCAxMHB4IDEwcHggNDBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDJyZW07XFxuICBib3JkZXI6IG5vbmU7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCIgKyBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19fICsgXCIpO1xcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDEwcHggY2VudGVyO1xcbiAgYmFja2dyb3VuZC1zaXplOiBjYWxjKDFyZW0gKyAwLjV2dyk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gIHRleHQtc2hhZG93OiBub25lO1xcbn1cXG5cXG4jZXJyb3Ige1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLmNpdHktaW5mbyBoMSB7XFxuICBtYXJnaW46IDAuM3JlbSAwO1xcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy02MDApO1xcbiAgZm9udC1zaXplOiAyLjVyZW07XFxufVxcblxcbmgyIHtcXG4gIGZvbnQtc2l6ZTogMS4xcmVtO1xcbiAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTMwMCk7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX2NvaW50YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9jb2ludGFpbmVyIGltZyB7XFxuICB3aWR0aDogY2FsYygxMHJlbSArIDEwdncpO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX2NvaW50YWluZXIgaDEge1xcbiAgbWFyZ2luOiAwLjNyZW0gMDtcXG4gIGZvbnQtc2l6ZTogNHJlbTtcXG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy00MDApO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX3RlbXAge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9fZGV0YWlscyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGFsaWduLXNlbGY6IGNlbnRlcjtcXG4gIGhlaWdodDogbWF4LWNvbnRlbnQ7XFxuICBwYWRkaW5nOiAycmVtIDRyZW07XFxuICBnYXA6IDRyZW07XFxuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbC10cmFuc3ApO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19pdGVtIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgZ2FwOiAwLjVyZW07XFxuICBmb250LXNpemU6IDFyZW07XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfX2l0ZW0gaW1nIHtcXG4gIHdpZHRoOiBjYWxjKDFyZW0gKyAxdncpO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19kZXRhaWxzX19jb2x1bW4ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBnYXA6IDFyZW07XFxufVxcblxcbi5mb3JlY2FzdCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuICB3aWR0aDogMTAwJTtcXG4gIHBhZGRpbmc6IDFyZW0gMnJlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNsci1uZXV0cmFsLXRyYW5zcCk7XFxufVxcblxcbi5mb3JlY2FzdF9faXRlbSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5mb3JlY2FzdF9faXRlbSBpbWcge1xcbiAgd2lkdGg6IGNhbGMoMnJlbSArIDN2dyk7XFxufVxcblwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvbWFpbi5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBRUE7RUFDRSwrQkFBK0I7RUFDL0IsZ0RBQWdEO0VBQ2hELG1DQUFtQztFQUNuQyxhQUFhO0VBQ2IsYUFBYTtFQUNiLGFBQWE7RUFDYixhQUFhO0VBQ2IsYUFBYTtBQUNmOztBQUVBOzs7RUFHRSxTQUFTO0VBQ1QsVUFBVTtFQUNWLHNCQUFzQjtFQUN0QixnQ0FBZ0M7QUFDbEM7O0FBRUE7RUFDRSxZQUFZO0VBQ1osaUJBQWlCO0VBQ2pCLG9DQUFvQztFQUNwQyw4QkFBOEI7RUFDOUIseUJBQXlCO0FBQzNCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0Qiw2QkFBNkI7RUFDN0Isa0JBQWtCO0VBQ2xCLFlBQVk7RUFDWixhQUFhO0VBQ2Isa0JBQWtCO0VBQ2xCLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixNQUFNO0VBQ04sT0FBTztFQUNQLFlBQVk7RUFDWixhQUFhO0VBQ2IsV0FBVztBQUNiOztBQUVBO0VBQ0UsWUFBWTtFQUNaLGFBQWE7RUFDYixpQkFBaUI7QUFDbkI7O0FBRUE7O0VBRUUsa0JBQWtCO0VBQ2xCLFlBQVk7RUFDWixXQUFXO0VBQ1gsa0JBQWtCO0VBQ2xCLGFBQWE7RUFDYix1QkFBdUI7RUFDdkIsbUJBQW1CO0VBQ25CLFlBQVk7RUFDWixXQUFXO0VBQ1gsb0JBQW9CO0VBQ3BCLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLFlBQVk7QUFDZDs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixTQUFTO0VBQ1QsV0FBVztBQUNiOztBQUVBO0VBQ0UsVUFBVTtFQUNWLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLHNCQUFzQjtFQUN0QixtQkFBbUI7RUFDbkIsZUFBZTtFQUNmLGFBQWE7RUFDYixtQkFBbUI7RUFDbkIsOEJBQThCO0VBQzlCLFlBQVk7RUFDWixrQkFBa0I7RUFDbEIsWUFBWTtFQUNaLFdBQVc7RUFDWCxxQkFBcUI7QUFDdkI7O0FBRUE7RUFDRSxzQkFBc0I7RUFDdEIsa0JBQWtCO0VBQ2xCLGtCQUFrQjtFQUNsQixRQUFRO0VBQ1IsU0FBUztFQUNULFlBQVk7RUFDWixXQUFXO0VBQ1gsMEJBQTBCO0VBQzFCLGlDQUFpQztBQUNuQzs7QUFFQTtFQUNFLDJCQUEyQjtBQUM3Qjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG1CQUFtQjtFQUNuQixTQUFTO0FBQ1g7O0FBRUE7RUFDRSxVQUFVO0VBQ1YsNEJBQTRCO0VBQzVCLG1CQUFtQjtFQUNuQixZQUFZO0VBQ1oseURBQTRDO0VBQzVDLDRCQUE0QjtFQUM1QixnQ0FBZ0M7RUFDaEMsbUNBQW1DO0VBQ25DLHVCQUF1QjtFQUN2QixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxhQUFhO0FBQ2Y7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIsc0JBQXNCO0VBQ3RCLDBCQUEwQjtFQUMxQixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsMEJBQTBCO0FBQzVCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLDZCQUE2QjtBQUMvQjs7QUFFQTtFQUNFLGFBQWE7QUFDZjs7QUFFQTtFQUNFLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixlQUFlO0VBQ2YsMEJBQTBCO0FBQzVCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0Qix1QkFBdUI7QUFDekI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLGtCQUFrQjtFQUNsQixtQkFBbUI7RUFDbkIsa0JBQWtCO0VBQ2xCLFNBQVM7RUFDVCxxQkFBcUI7RUFDckIsMkNBQTJDO0FBQzdDOztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQixXQUFXO0VBQ1gsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLHVCQUF1QjtBQUN6Qjs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsU0FBUztBQUNYOztBQUVBO0VBQ0UsYUFBYTtFQUNiLDZCQUE2QjtFQUM3QixXQUFXO0VBQ1gsa0JBQWtCO0VBQ2xCLHFCQUFxQjtFQUNyQiwyQ0FBMkM7QUFDN0M7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLHVCQUF1QjtBQUN6QlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAaW1wb3J0IHVybCguL25vcm1hbGl6ZS5jc3MpO1xcblxcbjpyb290IHtcXG4gIC0tY2xyLW5ldXRyYWw6IGhzbCgwLCAwJSwgMTAwJSk7XFxuICAtLWNsci1uZXV0cmFsLXRyYW5zcDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE3MSk7XFxuICAtLWZmLXByaW1hcnk6IFxcXCJQb3BwaW5zXFxcIiwgc2Fucy1zZXJpZjtcXG4gIC0tZnctMzAwOiAzMDA7XFxuICAtLWZ3LTQwMDogNDAwO1xcbiAgLS1mdy01MDA6IDUwMDtcXG4gIC0tZnctNjAwOiA2MDA7XFxuICAtLWZ3LTcwMDogNzAwO1xcbn1cXG5cXG4qLFxcbio6OmJlZm9yZSxcXG4qOjphZnRlciB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIHRleHQtc2hhZG93OiAycHggMnB4IDhweCAjMDAwMDAwO1xcbn1cXG5cXG5ib2R5IHtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIxMiwgMjA3LCAyMDcpO1xcbiAgZm9udC1mYW1pbHk6IHZhcigtLWZmLXByaW1hcnkpO1xcbiAgY29sb3I6IHZhcigtLWNsci1uZXV0cmFsKTtcXG59XFxuXFxubWFpbiB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgd2lkdGg6IDEwMHZ3O1xcbiAgaGVpZ2h0OiAxMDB2aDtcXG4gIHBhZGRpbmc6IDRyZW0gMnJlbTtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxufVxcblxcbi52aWRlby1jb250YWluZXIge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIGhlaWdodDogMTAwdmg7XFxuICB6LWluZGV4OiAtNTtcXG59XFxuXFxudmlkZW8ge1xcbiAgd2lkdGg6IDEwMHZ3O1xcbiAgaGVpZ2h0OiAxMDB2aDtcXG4gIG9iamVjdC1maXQ6IGNvdmVyO1xcbn1cXG5cXG4udW5pdEMsXFxuLnVuaXRGIHtcXG4gIGZvbnQtc2l6ZTogMC44NXJlbTtcXG4gIGhlaWdodDogMTZweDtcXG4gIHdpZHRoOiAxNnB4O1xcbiAgYm9yZGVyLXJhZGl1czogOHB4O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGNvbG9yOiBibGFjaztcXG4gIHotaW5kZXg6IDIwO1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICB0ZXh0LXNoYWRvdzogbm9uZTtcXG59XFxuXFxuLnVuaXRGIHtcXG4gIGNvbG9yOiB3aGl0ZTtcXG59XFxuXFxuLmNoZWNrYm94LWNvbnRhaW5lciB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDNyZW07XFxuICByaWdodDogM3JlbTtcXG59XFxuXFxuLmNoZWNrYm94IHtcXG4gIG9wYWNpdHk6IDA7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxufVxcblxcbi5sYWJlbCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMTExO1xcbiAgYm9yZGVyLXJhZGl1czogNTBweDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbiAgcGFkZGluZzogNXB4O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgaGVpZ2h0OiAyNnB4O1xcbiAgd2lkdGg6IDUwcHg7XFxuICB0cmFuc2Zvcm06IHNjYWxlKDEuNSk7XFxufVxcblxcbi5sYWJlbCAuYmFsbCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAycHg7XFxuICBsZWZ0OiAycHg7XFxuICBoZWlnaHQ6IDIycHg7XFxuICB3aWR0aDogMjJweDtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwcHgpO1xcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMnMgbGluZWFyO1xcbn1cXG5cXG4uY2hlY2tib3g6Y2hlY2tlZCArIC5sYWJlbCAuYmFsbCB7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMjRweCk7XFxufVxcblxcbi5zZWFyY2gtd3JhcHBlciB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBnYXA6IDEwcHg7XFxufVxcblxcbi5zZWFyY2gtd3JhcHBlciBpbnB1dCB7XFxuICB3aWR0aDogNDAlO1xcbiAgcGFkZGluZzogMTBweCAxMHB4IDEwcHggNDBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDJyZW07XFxuICBib3JkZXI6IG5vbmU7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoLi4vaW1hZ2VzL21hZ25pZnkucG5nKTtcXG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAxMHB4IGNlbnRlcjtcXG4gIGJhY2tncm91bmQtc2l6ZTogY2FsYygxcmVtICsgMC41dncpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICB0ZXh0LXNoYWRvdzogbm9uZTtcXG59XFxuXFxuI2Vycm9yIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi5jaXR5LWluZm8gaDEge1xcbiAgbWFyZ2luOiAwLjNyZW0gMDtcXG4gIGxldHRlci1zcGFjaW5nOiAwLjFyZW07XFxuICBmb250LXdlaWdodDogdmFyKC0tZnctNjAwKTtcXG4gIGZvbnQtc2l6ZTogMi41cmVtO1xcbn1cXG5cXG5oMiB7XFxuICBmb250LXNpemU6IDEuMXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy0zMDApO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9jb2ludGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfY29pbnRhaW5lciBpbWcge1xcbiAgd2lkdGg6IGNhbGMoMTByZW0gKyAxMHZ3KTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9jb2ludGFpbmVyIGgxIHtcXG4gIG1hcmdpbjogMC4zcmVtIDA7XFxuICBmb250LXNpemU6IDRyZW07XFxuICBmb250LXdlaWdodDogdmFyKC0tZnctNDAwKTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl90ZW1wIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfX2RldGFpbHMge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBhbGlnbi1zZWxmOiBjZW50ZXI7XFxuICBoZWlnaHQ6IG1heC1jb250ZW50O1xcbiAgcGFkZGluZzogMnJlbSA0cmVtO1xcbiAgZ2FwOiA0cmVtO1xcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY2xyLW5ldXRyYWwtdHJhbnNwKTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9faXRlbSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGdhcDogMC41cmVtO1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19pdGVtIGltZyB7XFxuICB3aWR0aDogY2FsYygxcmVtICsgMXZ3KTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9fZGV0YWlsc19fY29sdW1uIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgZ2FwOiAxcmVtO1xcbn1cXG5cXG4uZm9yZWNhc3Qge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBwYWRkaW5nOiAxcmVtIDJyZW07XFxuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbC10cmFuc3ApO1xcbn1cXG5cXG4uZm9yZWNhc3RfX2l0ZW0ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4uZm9yZWNhc3RfX2l0ZW0gaW1nIHtcXG4gIHdpZHRoOiBjYWxjKDJyZW0gKyAzdncpO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCIvKiEgbm9ybWFsaXplLmNzcyB2OC4wLjEgfCBNSVQgTGljZW5zZSB8IGdpdGh1Yi5jb20vbmVjb2xhcy9ub3JtYWxpemUuY3NzICovXFxuXFxuLyogRG9jdW1lbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBQcmV2ZW50IGFkanVzdG1lbnRzIG9mIGZvbnQgc2l6ZSBhZnRlciBvcmllbnRhdGlvbiBjaGFuZ2VzIGluIGlPUy5cXG4gKi9cXG5cXG4gaHRtbCB7XFxuICAgIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuICAgIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKiBTZWN0aW9uc1xcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgYm9keSB7XFxuICAgIG1hcmdpbjogMDtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW5kZXIgdGhlIGBtYWluYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cXG4gICAqL1xcbiAgXFxuICBtYWluIHtcXG4gICAgZGlzcGxheTogYmxvY2s7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gYGgxYCBlbGVtZW50cyB3aXRoaW4gYHNlY3Rpb25gIGFuZFxcbiAgICogYGFydGljbGVgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBoMSB7XFxuICAgIGZvbnQtc2l6ZTogMmVtO1xcbiAgICBtYXJnaW46IDAuNjdlbSAwO1xcbiAgfVxcbiAgXFxuICAvKiBHcm91cGluZyBjb250ZW50XFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXFxuICAgKiAyLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlIGFuZCBJRS5cXG4gICAqL1xcbiAgXFxuICBociB7XFxuICAgIGJveC1zaXppbmc6IGNvbnRlbnQtYm94OyAvKiAxICovXFxuICAgIGhlaWdodDogMDsgLyogMSAqL1xcbiAgICBvdmVyZmxvdzogdmlzaWJsZTsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgcHJlIHtcXG4gICAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxuICAgIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qIFRleHQtbGV2ZWwgc2VtYW50aWNzXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgZ3JheSBiYWNrZ3JvdW5kIG9uIGFjdGl2ZSBsaW5rcyBpbiBJRSAxMC5cXG4gICAqL1xcbiAgXFxuICBhIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gUmVtb3ZlIHRoZSBib3R0b20gYm9yZGVyIGluIENocm9tZSA1Ny1cXG4gICAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgYWJiclt0aXRsZV0ge1xcbiAgICBib3JkZXItYm90dG9tOiBub25lOyAvKiAxICovXFxuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyAvKiAyICovXFxuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgYixcXG4gIHN0cm9uZyB7XFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkZXI7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gICAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBjb2RlLFxcbiAga2JkLFxcbiAgc2FtcCB7XFxuICAgIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xcbiAgICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIHNtYWxsIHtcXG4gICAgZm9udC1zaXplOiA4MCU7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUHJldmVudCBgc3ViYCBhbmQgYHN1cGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXFxuICAgKiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgc3ViLFxcbiAgc3VwIHtcXG4gICAgZm9udC1zaXplOiA3NSU7XFxuICAgIGxpbmUtaGVpZ2h0OiAwO1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG4gIH1cXG4gIFxcbiAgc3ViIHtcXG4gICAgYm90dG9tOiAtMC4yNWVtO1xcbiAgfVxcbiAgXFxuICBzdXAge1xcbiAgICB0b3A6IC0wLjVlbTtcXG4gIH1cXG4gIFxcbiAgLyogRW1iZWRkZWQgY29udGVudFxcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGJvcmRlciBvbiBpbWFnZXMgaW5zaWRlIGxpbmtzIGluIElFIDEwLlxcbiAgICovXFxuICBcXG4gIGltZyB7XFxuICAgIGJvcmRlci1zdHlsZTogbm9uZTtcXG4gIH1cXG4gIFxcbiAgLyogRm9ybXNcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ2hhbmdlIHRoZSBmb250IHN0eWxlcyBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKiAyLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgYnV0dG9uLFxcbiAgaW5wdXQsXFxuICBvcHRncm91cCxcXG4gIHNlbGVjdCxcXG4gIHRleHRhcmVhIHtcXG4gICAgZm9udC1mYW1pbHk6IGluaGVyaXQ7IC8qIDEgKi9cXG4gICAgZm9udC1zaXplOiAxMDAlOyAvKiAxICovXFxuICAgIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuICAgIG1hcmdpbjogMDsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxcbiAgICogMS4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZS5cXG4gICAqL1xcbiAgXFxuICBidXR0b24sXFxuICBpbnB1dCB7IC8qIDEgKi9cXG4gICAgb3ZlcmZsb3c6IHZpc2libGU7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBFZGdlLCBGaXJlZm94LCBhbmQgSUUuXFxuICAgKiAxLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXFxuICAgKi9cXG4gIFxcbiAgYnV0dG9uLFxcbiAgc2VsZWN0IHsgLyogMSAqL1xcbiAgICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbixcXG4gIFt0eXBlPVxcXCJidXR0b25cXFwiXSxcXG4gIFt0eXBlPVxcXCJyZXNldFxcXCJdLFxcbiAgW3R5cGU9XFxcInN1Ym1pdFxcXCJdIHtcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gICAqL1xcbiAgXFxuICBidXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXFxuICBbdHlwZT1cXFwiYnV0dG9uXFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuICBbdHlwZT1cXFwicmVzZXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lcixcXG4gIFt0eXBlPVxcXCJzdWJtaXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lciB7XFxuICAgIGJvcmRlci1zdHlsZTogbm9uZTtcXG4gICAgcGFkZGluZzogMDtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZXN0b3JlIHRoZSBmb2N1cyBzdHlsZXMgdW5zZXQgYnkgdGhlIHByZXZpb3VzIHJ1bGUuXFxuICAgKi9cXG4gIFxcbiAgYnV0dG9uOi1tb3otZm9jdXNyaW5nLFxcbiAgW3R5cGU9XFxcImJ1dHRvblxcXCJdOi1tb3otZm9jdXNyaW5nLFxcbiAgW3R5cGU9XFxcInJlc2V0XFxcIl06LW1vei1mb2N1c3JpbmcsXFxuICBbdHlwZT1cXFwic3VibWl0XFxcIl06LW1vei1mb2N1c3Jpbmcge1xcbiAgICBvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQ29ycmVjdCB0aGUgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAgICovXFxuICBcXG4gIGZpZWxkc2V0IHtcXG4gICAgcGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIHRleHQgd3JhcHBpbmcgaW4gRWRnZSBhbmQgSUUuXFxuICAgKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gSUUuXFxuICAgKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XFxuICAgKiAgICBgZmllbGRzZXRgIGVsZW1lbnRzIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBsZWdlbmQge1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuICAgIGNvbG9yOiBpbmhlcml0OyAvKiAyICovXFxuICAgIGRpc3BsYXk6IHRhYmxlOyAvKiAxICovXFxuICAgIG1heC13aWR0aDogMTAwJTsgLyogMSAqL1xcbiAgICBwYWRkaW5nOiAwOyAvKiAzICovXFxuICAgIHdoaXRlLXNwYWNlOiBub3JtYWw7IC8qIDEgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgdmVydGljYWwgYWxpZ25tZW50IGluIENocm9tZSwgRmlyZWZveCwgYW5kIE9wZXJhLlxcbiAgICovXFxuICBcXG4gIHByb2dyZXNzIHtcXG4gICAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgZGVmYXVsdCB2ZXJ0aWNhbCBzY3JvbGxiYXIgaW4gSUUgMTArLlxcbiAgICovXFxuICBcXG4gIHRleHRhcmVhIHtcXG4gICAgb3ZlcmZsb3c6IGF1dG87XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gSUUgMTAuXFxuICAgKiAyLiBSZW1vdmUgdGhlIHBhZGRpbmcgaW4gSUUgMTAuXFxuICAgKi9cXG4gIFxcbiAgW3R5cGU9XFxcImNoZWNrYm94XFxcIl0sXFxuICBbdHlwZT1cXFwicmFkaW9cXFwiXSB7XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cXG4gICAgcGFkZGluZzogMDsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIENvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIENocm9tZS5cXG4gICAqL1xcbiAgXFxuICBbdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXFxuICBbdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xcbiAgICBoZWlnaHQ6IGF1dG87XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXFxuICAgKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBbdHlwZT1cXFwic2VhcmNoXFxcIl0ge1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IHRleHRmaWVsZDsgLyogMSAqL1xcbiAgICBvdXRsaW5lLW9mZnNldDogLTJweDsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgaW5uZXIgcGFkZGluZyBpbiBDaHJvbWUgYW5kIFNhZmFyaSBvbiBtYWNPUy5cXG4gICAqL1xcbiAgXFxuICBbdHlwZT1cXFwic2VhcmNoXFxcIl06Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24ge1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4gICAqIDIuIENoYW5nZSBmb250IHByb3BlcnRpZXMgdG8gYGluaGVyaXRgIGluIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICA6Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247IC8qIDEgKi9cXG4gICAgZm9udDogaW5oZXJpdDsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKiBJbnRlcmFjdGl2ZVxcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLypcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFIDEwKywgYW5kIEZpcmVmb3guXFxuICAgKi9cXG4gIFxcbiAgZGV0YWlscyB7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgfVxcbiAgXFxuICAvKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIHN1bW1hcnkge1xcbiAgICBkaXNwbGF5OiBsaXN0LWl0ZW07XFxuICB9XFxuICBcXG4gIC8qIE1pc2NcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTArLlxcbiAgICovXFxuICBcXG4gIHRlbXBsYXRlIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMC5cXG4gICAqL1xcbiAgXFxuICBbaGlkZGVuXSB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICB9XCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlcy9ub3JtYWxpemUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBLDJFQUEyRTs7QUFFM0U7K0VBQytFOztBQUUvRTs7O0VBR0U7O0NBRUQ7SUFDRyxpQkFBaUIsRUFBRSxNQUFNO0lBQ3pCLDhCQUE4QixFQUFFLE1BQU07RUFDeEM7O0VBRUE7aUZBQytFOztFQUUvRTs7SUFFRTs7RUFFRjtJQUNFLFNBQVM7RUFDWDs7RUFFQTs7SUFFRTs7RUFFRjtJQUNFLGNBQWM7RUFDaEI7O0VBRUE7OztJQUdFOztFQUVGO0lBQ0UsY0FBYztJQUNkLGdCQUFnQjtFQUNsQjs7RUFFQTtpRkFDK0U7O0VBRS9FOzs7SUFHRTs7RUFFRjtJQUNFLHVCQUF1QixFQUFFLE1BQU07SUFDL0IsU0FBUyxFQUFFLE1BQU07SUFDakIsaUJBQWlCLEVBQUUsTUFBTTtFQUMzQjs7RUFFQTs7O0lBR0U7O0VBRUY7SUFDRSxpQ0FBaUMsRUFBRSxNQUFNO0lBQ3pDLGNBQWMsRUFBRSxNQUFNO0VBQ3hCOztFQUVBO2lGQUMrRTs7RUFFL0U7O0lBRUU7O0VBRUY7SUFDRSw2QkFBNkI7RUFDL0I7O0VBRUE7OztJQUdFOztFQUVGO0lBQ0UsbUJBQW1CLEVBQUUsTUFBTTtJQUMzQiwwQkFBMEIsRUFBRSxNQUFNO0lBQ2xDLGlDQUFpQyxFQUFFLE1BQU07RUFDM0M7O0VBRUE7O0lBRUU7O0VBRUY7O0lBRUUsbUJBQW1CO0VBQ3JCOztFQUVBOzs7SUFHRTs7RUFFRjs7O0lBR0UsaUNBQWlDLEVBQUUsTUFBTTtJQUN6QyxjQUFjLEVBQUUsTUFBTTtFQUN4Qjs7RUFFQTs7SUFFRTs7RUFFRjtJQUNFLGNBQWM7RUFDaEI7O0VBRUE7OztJQUdFOztFQUVGOztJQUVFLGNBQWM7SUFDZCxjQUFjO0lBQ2Qsa0JBQWtCO0lBQ2xCLHdCQUF3QjtFQUMxQjs7RUFFQTtJQUNFLGVBQWU7RUFDakI7O0VBRUE7SUFDRSxXQUFXO0VBQ2I7O0VBRUE7aUZBQytFOztFQUUvRTs7SUFFRTs7RUFFRjtJQUNFLGtCQUFrQjtFQUNwQjs7RUFFQTtpRkFDK0U7O0VBRS9FOzs7SUFHRTs7RUFFRjs7Ozs7SUFLRSxvQkFBb0IsRUFBRSxNQUFNO0lBQzVCLGVBQWUsRUFBRSxNQUFNO0lBQ3ZCLGlCQUFpQixFQUFFLE1BQU07SUFDekIsU0FBUyxFQUFFLE1BQU07RUFDbkI7O0VBRUE7OztJQUdFOztFQUVGO1VBQ1EsTUFBTTtJQUNaLGlCQUFpQjtFQUNuQjs7RUFFQTs7O0lBR0U7O0VBRUY7V0FDUyxNQUFNO0lBQ2Isb0JBQW9CO0VBQ3RCOztFQUVBOztJQUVFOztFQUVGOzs7O0lBSUUsMEJBQTBCO0VBQzVCOztFQUVBOztJQUVFOztFQUVGOzs7O0lBSUUsa0JBQWtCO0lBQ2xCLFVBQVU7RUFDWjs7RUFFQTs7SUFFRTs7RUFFRjs7OztJQUlFLDhCQUE4QjtFQUNoQzs7RUFFQTs7SUFFRTs7RUFFRjtJQUNFLDhCQUE4QjtFQUNoQzs7RUFFQTs7Ozs7SUFLRTs7RUFFRjtJQUNFLHNCQUFzQixFQUFFLE1BQU07SUFDOUIsY0FBYyxFQUFFLE1BQU07SUFDdEIsY0FBYyxFQUFFLE1BQU07SUFDdEIsZUFBZSxFQUFFLE1BQU07SUFDdkIsVUFBVSxFQUFFLE1BQU07SUFDbEIsbUJBQW1CLEVBQUUsTUFBTTtFQUM3Qjs7RUFFQTs7SUFFRTs7RUFFRjtJQUNFLHdCQUF3QjtFQUMxQjs7RUFFQTs7SUFFRTs7RUFFRjtJQUNFLGNBQWM7RUFDaEI7O0VBRUE7OztJQUdFOztFQUVGOztJQUVFLHNCQUFzQixFQUFFLE1BQU07SUFDOUIsVUFBVSxFQUFFLE1BQU07RUFDcEI7O0VBRUE7O0lBRUU7O0VBRUY7O0lBRUUsWUFBWTtFQUNkOztFQUVBOzs7SUFHRTs7RUFFRjtJQUNFLDZCQUE2QixFQUFFLE1BQU07SUFDckMsb0JBQW9CLEVBQUUsTUFBTTtFQUM5Qjs7RUFFQTs7SUFFRTs7RUFFRjtJQUNFLHdCQUF3QjtFQUMxQjs7RUFFQTs7O0lBR0U7O0VBRUY7SUFDRSwwQkFBMEIsRUFBRSxNQUFNO0lBQ2xDLGFBQWEsRUFBRSxNQUFNO0VBQ3ZCOztFQUVBO2lGQUMrRTs7RUFFL0U7O0lBRUU7O0VBRUY7SUFDRSxjQUFjO0VBQ2hCOztFQUVBOztJQUVFOztFQUVGO0lBQ0Usa0JBQWtCO0VBQ3BCOztFQUVBO2lGQUMrRTs7RUFFL0U7O0lBRUU7O0VBRUY7SUFDRSxhQUFhO0VBQ2Y7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSxhQUFhO0VBQ2ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLyohIG5vcm1hbGl6ZS5jc3MgdjguMC4xIHwgTUlUIExpY2Vuc2UgfCBnaXRodWIuY29tL25lY29sYXMvbm9ybWFsaXplLmNzcyAqL1xcblxcbi8qIERvY3VtZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXFxuICovXFxuXFxuIGh0bWwge1xcbiAgICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcbiAgICAtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IDEwMCU7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyogU2VjdGlvbnNcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIGJvZHkge1xcbiAgICBtYXJnaW46IDA7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVuZGVyIHRoZSBgbWFpbmAgZWxlbWVudCBjb25zaXN0ZW50bHkgaW4gSUUuXFxuICAgKi9cXG4gIFxcbiAgbWFpbiB7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIGBoMWAgZWxlbWVudHMgd2l0aGluIGBzZWN0aW9uYCBhbmRcXG4gICAqIGBhcnRpY2xlYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgaDEge1xcbiAgICBmb250LXNpemU6IDJlbTtcXG4gICAgbWFyZ2luOiAwLjY3ZW0gMDtcXG4gIH1cXG4gIFxcbiAgLyogR3JvdXBpbmcgY29udGVudFxcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxcbiAgICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXFxuICAgKi9cXG4gIFxcbiAgaHIge1xcbiAgICBib3gtc2l6aW5nOiBjb250ZW50LWJveDsgLyogMSAqL1xcbiAgICBoZWlnaHQ6IDA7IC8qIDEgKi9cXG4gICAgb3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIHByZSB7XFxuICAgIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xcbiAgICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKiBUZXh0LWxldmVsIHNlbWFudGljc1xcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBvbiBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXFxuICAgKi9cXG4gIFxcbiAgYSB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIFJlbW92ZSB0aGUgYm90dG9tIGJvcmRlciBpbiBDaHJvbWUgNTctXFxuICAgKiAyLiBBZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgSUUsIE9wZXJhLCBhbmQgU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIGFiYnJbdGl0bGVdIHtcXG4gICAgYm9yZGVyLWJvdHRvbTogbm9uZTsgLyogMSAqL1xcbiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgLyogMiAqL1xcbiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIGIsXFxuICBzdHJvbmcge1xcbiAgICBmb250LXdlaWdodDogYm9sZGVyO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgY29kZSxcXG4gIGtiZCxcXG4gIHNhbXAge1xcbiAgICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG4gICAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBzbWFsbCB7XFxuICAgIGZvbnQtc2l6ZTogODAlO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFByZXZlbnQgYHN1YmAgYW5kIGBzdXBgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxcbiAgICogYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIHN1YixcXG4gIHN1cCB7XFxuICAgIGZvbnQtc2l6ZTogNzUlO1xcbiAgICBsaW5lLWhlaWdodDogMDtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxuICB9XFxuICBcXG4gIHN1YiB7XFxuICAgIGJvdHRvbTogLTAuMjVlbTtcXG4gIH1cXG4gIFxcbiAgc3VwIHtcXG4gICAgdG9wOiAtMC41ZW07XFxuICB9XFxuICBcXG4gIC8qIEVtYmVkZGVkIGNvbnRlbnRcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC5cXG4gICAqL1xcbiAgXFxuICBpbWcge1xcbiAgICBib3JkZXItc3R5bGU6IG5vbmU7XFxuICB9XFxuICBcXG4gIC8qIEZvcm1zXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICogMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbixcXG4gIGlucHV0LFxcbiAgb3B0Z3JvdXAsXFxuICBzZWxlY3QsXFxuICB0ZXh0YXJlYSB7XFxuICAgIGZvbnQtZmFtaWx5OiBpbmhlcml0OyAvKiAxICovXFxuICAgIGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xcbiAgICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcbiAgICBtYXJnaW46IDA7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cXG4gICAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXFxuICAgKi9cXG4gIFxcbiAgYnV0dG9uLFxcbiAgaW5wdXQgeyAvKiAxICovXFxuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxcbiAgICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbixcXG4gIHNlbGVjdCB7IC8qIDEgKi9cXG4gICAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBidXR0b24sXFxuICBbdHlwZT1cXFwiYnV0dG9uXFxcIl0sXFxuICBbdHlwZT1cXFwicmVzZXRcXFwiXSxcXG4gIFt0eXBlPVxcXCJzdWJtaXRcXFwiXSB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXFxuICAgKi9cXG4gIFxcbiAgYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxcbiAgW3R5cGU9XFxcImJ1dHRvblxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcbiAgW3R5cGU9XFxcInJlc2V0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuICBbdHlwZT1cXFwic3VibWl0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIge1xcbiAgICBib3JkZXItc3R5bGU6IG5vbmU7XFxuICAgIHBhZGRpbmc6IDA7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbjotbW96LWZvY3VzcmluZyxcXG4gIFt0eXBlPVxcXCJidXR0b25cXFwiXTotbW96LWZvY3VzcmluZyxcXG4gIFt0eXBlPVxcXCJyZXNldFxcXCJdOi1tb3otZm9jdXNyaW5nLFxcbiAgW3R5cGU9XFxcInN1Ym1pdFxcXCJdOi1tb3otZm9jdXNyaW5nIHtcXG4gICAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gICAqL1xcbiAgXFxuICBmaWVsZHNldCB7XFxuICAgIHBhZGRpbmc6IDAuMzVlbSAwLjc1ZW0gMC42MjVlbTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxcbiAgICogMi4gQ29ycmVjdCB0aGUgY29sb3IgaW5oZXJpdGFuY2UgZnJvbSBgZmllbGRzZXRgIGVsZW1lbnRzIGluIElFLlxcbiAgICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxcbiAgICogICAgYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgbGVnZW5kIHtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xcbiAgICBjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xcbiAgICBkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xcbiAgICBtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cXG4gICAgcGFkZGluZzogMDsgLyogMyAqL1xcbiAgICB3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cXG4gICAqL1xcbiAgXFxuICBwcm9ncmVzcyB7XFxuICAgIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cXG4gICAqL1xcbiAgXFxuICB0ZXh0YXJlYSB7XFxuICAgIG92ZXJmbG93OiBhdXRvO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxcbiAgICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxcbiAgICovXFxuICBcXG4gIFt0eXBlPVxcXCJjaGVja2JveFxcXCJdLFxcbiAgW3R5cGU9XFxcInJhZGlvXFxcIl0ge1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuICAgIHBhZGRpbmc6IDA7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXFxuICAgKi9cXG4gIFxcbiAgW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxcbiAgW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXG4gICAgaGVpZ2h0OiBhdXRvO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxcbiAgICogMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgW3R5cGU9XFxcInNlYXJjaFxcXCJdIHtcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi9cXG4gICAgb3V0bGluZS1vZmZzZXQ6IC0ycHg7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXFxuICAgKi9cXG4gIFxcbiAgW3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICAgKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIGBpbmhlcml0YCBpbiBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXFxuICAgIGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyogSW50ZXJhY3RpdmVcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxcbiAgICovXFxuICBcXG4gIGRldGFpbHMge1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG4gIH1cXG4gIFxcbiAgLypcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBzdW1tYXJ5IHtcXG4gICAgZGlzcGxheTogbGlzdC1pdGVtO1xcbiAgfVxcbiAgXFxuICAvKiBNaXNjXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cXG4gICAqL1xcbiAgXFxuICB0ZW1wbGF0ZSB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXFxuICAgKi9cXG4gIFxcbiAgW2hpZGRlbl0ge1xcbiAgICBkaXNwbGF5OiBub25lO1xcbiAgfVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTsgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcblxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cblxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuXG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07IC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cblxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuXG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblxuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuXG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG5cbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICBpZiAoIXVybCkge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICB1cmwgPSBTdHJpbmcodXJsLl9fZXNNb2R1bGUgPyB1cmwuZGVmYXVsdCA6IHVybCk7IC8vIElmIHVybCBpcyBhbHJlYWR5IHdyYXBwZWQgaW4gcXVvdGVzLCByZW1vdmUgdGhlbVxuXG4gIGlmICgvXlsnXCJdLipbJ1wiXSQvLnRlc3QodXJsKSkge1xuICAgIHVybCA9IHVybC5zbGljZSgxLCAtMSk7XG4gIH1cblxuICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgdXJsICs9IG9wdGlvbnMuaGFzaDtcbiAgfSAvLyBTaG91bGQgdXJsIGJlIHdyYXBwZWQ/XG4gIC8vIFNlZSBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXZhbHVlcy0zLyN1cmxzXG5cblxuICBpZiAoL1tcIicoKSBcXHRcXG5dfCglMjApLy50ZXN0KHVybCkgfHwgb3B0aW9ucy5uZWVkUXVvdGVzKSB7XG4gICAgcmV0dXJuIFwiXFxcIlwiLmNvbmNhdCh1cmwucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpLnJlcGxhY2UoL1xcbi9nLCBcIlxcXFxuXCIpLCBcIlxcXCJcIik7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblxuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICB2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgcmV0dXJuIFwiLyojIHNvdXJjZVVSTD1cIi5jb25jYXQoY3NzTWFwcGluZy5zb3VyY2VSb290IHx8IFwiXCIpLmNvbmNhdChzb3VyY2UsIFwiICovXCIpO1xuICAgIH0pO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9tYWluLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbWFpbi5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5cbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuXG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuXG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cblxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcblxuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gdXBkYXRlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cblxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG5cbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcblxuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcblxuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcblxuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7IC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG5cbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cblxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cblxuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcblxuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cblxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG5cbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcblxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuXG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuXG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cblxuICBjc3MgKz0gb2JqLmNzcztcblxuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH0gLy8gRm9yIG9sZCBJRVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cblxuXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyY1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5iID0gZG9jdW1lbnQuYmFzZVVSSSB8fCBzZWxmLmxvY2F0aW9uLmhyZWY7XG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8ganNvbnAgZnVuY3Rpb24iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCBcIi4uL3N0eWxlcy9tYWluLmNzc1wiO1xuXG5pbXBvcnQgTWFpbk1vZGVsIGZyb20gXCIuL21vZGVscy9tYWluTW9kZWxcIjtcbmltcG9ydCBNYWluVmlldyBmcm9tIFwiLi92aWV3cy9tYWluVmlld1wiO1xuaW1wb3J0IE1haW5Db250cm9sbGVyIGZyb20gXCIuL2NvbnRyb2xsZXJzL21haW5Db250cm9sbGVyXCI7XG5cbmNvbnN0IG1vZGVsID0gbmV3IE1haW5Nb2RlbCgpO1xuY29uc3QgdmlldyA9IG5ldyBNYWluVmlldygpO1xuY29uc3QgY29udHJvbGxlciA9IG5ldyBNYWluQ29udHJvbGxlcihtb2RlbCwgdmlldyk7XG4iXSwibmFtZXMiOlsiTWFpbkNvbnRyb2xsZXIiLCJjb25zdHJ1Y3RvciIsIm1vZGVsIiwidmlldyIsImNpdHkiLCJ1bml0IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwibG9hZFBhZ2UiLCJ2YWx1ZSIsImNoZWNrSWZFbnRlciIsIndpbmRvdyIsImNoYW5nZVRlbXBlcmF0dXJlIiwicGxheWJhY2tSYXRlIiwiY2l0eUluZm8iLCJnZXRDaXR5SW5mbyIsImN1cnJlbnRXZWF0aGVyIiwiZ2V0Q3VycmVudFdlYXRoZXIiLCJmb3JlY2FzdFdlYXRoZXIiLCJnZXRGb3JlY2FzdFdlYXRoZXIiLCJhcHBlbmRDaXR5SW5mbyIsImFwcGVuZEN1cnJlbnRXZWF0aGVyIiwiYXBwZW5kRm9yZWNhc3RXZWF0aGVyIiwia2V5IiwiYmx1ciIsImN1cnJlbnRUYXJnZXQiLCJjaGVja2VkIiwiY2hhbmdlVW5pdFRlbXAiLCJjYWxsRnVuYyIsIkFQSXMiLCJ1cmxHZW5lcmF0b3IiLCJVcmxHZW5lcmF0b3IiLCJnZXRHZW9Db29yZGluYXRlcyIsInVybCIsImdlbmVyYXRlR2VvQ29vcmRzVXJsIiwicmVzcG9uc2UiLCJmZXRjaCIsIm1vZGUiLCJnZW9jb2RpbmdEYXRhIiwianNvbiIsImxhdCIsImxvbiIsInN0eWxlIiwiZGlzcGxheSIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJnZXRDdXJyZW50V2VhdGhlckRhdGEiLCJnZW5lcmF0ZUN1cnJlbnRXZWF0aGVyVXJsIiwid2VhdGhlckRhdGEiLCJnZXRGb3JlY2FzdFdlYXRoZXJEYXRhIiwiZ2VuZXJhdGVGb3JlY2FzdFdlYXRoZXJVcmwiLCJmb3JlY2FzdERhdGEiLCJhcHBJZCIsImJhc2VVcmwiLCJDaXR5SW5mbyIsIkFwaURhdGEiLCJjaXR5RGVzY3JpcHRpb24iLCJjcmVhdGVDaXR5RGVzY3JpcHRpb24iLCJkYXRlRGVzY3JpcHRpb24iLCJjcmVhdGVEYXRlRGVzY3JpcHRpb24iLCJuYW1lIiwiY291bnRyeSIsInN5cyIsImRheSIsImdldERheSIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsIndlZWtkYXkiLCJkIiwiRGF0ZSIsIm1vbnRoTmFtZXMiLCJDdXJyZW50V2VhdGhlciIsImN1cnJlbnRXZWF0aGVyRGF0YSIsInRlbXBlcmF0dXJlIiwiZ2V0VGVtcGVyYXR1cmUiLCJNYXRoIiwicm91bmQiLCJtYWluIiwidGVtcCIsImZlZWxzTGlrZVRlbXAiLCJmZWVsc19saWtlIiwiaHVtaWRpdHkiLCJ3aW5kU3BlZWQiLCJ3aW5kIiwic3BlZWQiLCJwcmVzc3VyZSIsInN1bnJpc2UiLCJjb252ZXJ0VG9TZWFyY2hlZENpdHlUaW1lIiwidGltZXpvbmUiLCJzdW5zZXQiLCJ3ZWF0aGVyQ29uZGl0aW9uRGVzYyIsIndlYXRoZXIiLCJkZXNjcmlwdGlvbiIsIndlYXRoZXJDb25kaXRpb25JbWciLCJnZXRXZWF0aGVyQ29uZGl0aW9uSW1nIiwiYmFja2dyb3VuZFZpZGVvIiwiZ2V0QmFja2dyb3VuZFZpZGVvTGluayIsImRlZ3JlZSIsImNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUiLCJ1bml4VGltZSIsImxvY2FsRGF0ZSIsInV0Y1VuaXhUaW1lIiwiZ2V0VGltZSIsImdldFRpbWV6b25lT2Zmc2V0IiwidW5peFRpbWVJblNlYXJjaGVkQ2l0eSIsImRhdGVJblNlYXJjaGVkQ2l0eSIsImhvdXJzIiwiZ2V0SG91cnMiLCJtaW51dGVzIiwiZ2V0TWludXRlcyIsImZvcm1hdHRlZFRpbWUiLCJzdWJzdHIiLCJzdW5yaXNlVW5peCIsInN1bnNldFVuaXgiLCJtaXN0RXF1aXZhbGVudGVzIiwiaW5jbHVkZXMiLCJjdXJyZW50RGF0ZSIsInN1bnJpc2VEYXRlIiwic3Vuc2V0RGF0ZSIsIndlYXRoZXJDb25kaXRpb24iLCJ2aWRlb0xpbmtzIiwiQ2xlYXJEYXkiLCJDbGVhck5pZ2h0IiwiQ2xvdWRzIiwiTWlzdCIsIlJhaW4iLCJTbm93IiwiVGh1bmRlcnN0b3JtIiwiRm9yZWNhc3RXZWF0aGVyIiwiZm9yZWNhc3RXZWF0aGVyRGF0YSIsInRlbXBlcmF0dXJlcyIsImdldFRlbXBlcmF0dXJlcyIsImdldFdlYXRoZXJDb25kaXRpb25zIiwidGltZSIsImdldFRpbWVzIiwibGlzdCIsImZvckVhY2giLCJpdGVtIiwidGVtcFdpdGhVbml0IiwiZ2V0VGVtcGVyYXR1cmVVbml0IiwicHVzaCIsImN1cnJlbnRIb3VyIiwic3VucmlzZUhvdXIiLCJzdW5zZXRIb3VyIiwiY29uZCIsImR0IiwidGltZXMiLCJNYWluTW9kZWwiLCJkYXRhIiwiQ2l0eUluZm9WaWV3IiwiZWxlbWVudCIsImNpdHlJbmZvTW9kZWwiLCJxdWVyeVNlbGVjdG9yIiwidGV4dENvbnRlbnQiLCJDdXJyZW50V2VhdGhlclZpZXciLCJjdXJyZW50V2VhdGhlck1vZGVsIiwibm93V2VhdGhlckNvbmRpdGlvbiIsIm5vd1RlbXBlcmF0dXJlIiwic3JjIiwiZm9yZWNhc3RXZWF0aGVyVmlldyIsImZvcmVjYXN0V2VhdGhlck1vZGVsIiwicXVlcnlTZWxlY3RvckFsbCIsImkiLCJsZW5ndGgiLCJGb3JlY2FzdFdlYXRoZXJWaWV3IiwiTWFpblZpZXciLCJjb2xvciIsImNvbnRyb2xsZXIiXSwic291cmNlUm9vdCI6IiJ9
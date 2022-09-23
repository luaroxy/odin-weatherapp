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
    document.getElementById("search").addEventListener("blur", e => this.callFunc(document.getElementById("search").value));
    document.getElementById("search").addEventListener("keypress", e => this.checkIfEnter(e));
    window.addEventListener("load", () => this.callFunc("new york"));
    document.getElementById("checkbox-unit").addEventListener("change", e => this.changeTemperature(e));
  }

  async callFunc(city) {
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
    const url = this.urlGenerator.generateGeoCoordsUrl(city);
    const response = await fetch(url, {
      mode: "cors"
    });
    const geocodingData = await response.json();
    const {
      lat,
      lon
    } = geocodingData[0];
    return {
      lat,
      lon
    };
  }

  async getCurrentWeatherData(city, unit) {
    const {
      lat,
      lon
    } = await this.getGeoCoordinates(city);
    const url = this.urlGenerator.generateCurrentWeatherUrl(lat, lon, unit);
    const response = await fetch(url, {
      mode: "cors"
    });
    const weatherData = await response.json();
    return weatherData;
  }

  async getForecastWeatherData(city, unit) {
    const {
      lat,
      lon
    } = await this.getGeoCoordinates(city);
    const url = this.urlGenerator.generateForecastWeatherUrl(lat, lon, unit);
    const response = await fetch(url, {
      mode: "cors"
    });
    const forecastData = await response.json();
    return forecastData;
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
___CSS_LOADER_EXPORT___.push([module.id, ":root {\n  --clr-neutral: hsl(0, 0%, 100%);\n  --clr-neutral-transp: rgba(255, 255, 255, 0.171);\n  --ff-primary: \"Poppins\", sans-serif;\n  --fw-300: 300;\n  --fw-400: 400;\n  --fw-500: 500;\n  --fw-600: 600;\n  --fw-700: 700;\n}\n\n*,\n*::before,\n*::after {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  text-shadow: 2px 2px 8px #000000;\n}\n\nbody {\n  width: 100vw;\n  min-height: 100vh;\n  background-color: rgb(212, 207, 207);\n  font-family: var(--ff-primary);\n  color: var(--clr-neutral);\n}\n\nmain {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n  position: relative;\n  width: 100vw;\n  min-height: 100vh;\n  padding: 4rem 2rem;\n  overflow: hidden;\n}\n\n.video-container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  z-index: -5;\n}\n\nvideo {\n  width: 100vw;\n  height: 100vh;\n  object-fit: cover;\n}\n\n.unitC,\n.unitF {\n  font-size: 0.85rem;\n  height: 16px;\n  width: 16px;\n  border-radius: 8px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  color: black;\n  z-index: 20;\n  pointer-events: none;\n  text-shadow: none;\n}\n\n.unitF {\n  color: white;\n}\n\n.checkbox-container {\n  position: absolute;\n  top: 3rem;\n  right: 3rem;\n}\n\n.checkbox {\n  opacity: 0;\n  position: absolute;\n}\n\n.label {\n  background-color: #111;\n  border-radius: 50px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 5px;\n  position: relative;\n  height: 26px;\n  width: 50px;\n  transform: scale(1.5);\n}\n\n.label .ball {\n  background-color: #fff;\n  border-radius: 50%;\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  height: 22px;\n  width: 22px;\n  transform: translateX(0px);\n  transition: transform 0.2s linear;\n}\n\n.checkbox:checked + .label .ball {\n  transform: translateX(24px);\n}\n\n.search-wrapper {\n  position: relative;\n  display: flex;\n  justify-content: center;\n}\n\n.search-wrapper input {\n  width: 40%;\n  padding: 10px 10px 10px 40px;\n  border-radius: 2rem;\n  border: none;\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n  background-repeat: no-repeat;\n  background-position: 10px center;\n  background-size: calc(1rem + 0.5vw);\n  background-color: white;\n  text-shadow: none;\n}\n\n.city-info h1 {\n  margin: 0.3rem 0;\n  letter-spacing: 0.1rem;\n  font-weight: var(--fw-600);\n  font-size: 2.5rem;\n}\n\nh2 {\n  font-size: 1.1rem;\n  font-weight: var(--fw-300);\n}\n\n.current-weather {\n  display: flex;\n  justify-content: space-around;\n}\n\n.current-weather_cointainer {\n  display: flex;\n}\n\n.current-weather_cointainer img {\n  width: calc(10rem + 10vw);\n}\n\n.current-weather_cointainer h1 {\n  margin: 0.3rem 0;\n  font-size: 4rem;\n  font-weight: var(--fw-400);\n}\n\n.current-weather_temp {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n.current-weather__details {\n  display: flex;\n  align-items: center;\n  align-self: center;\n  height: max-content;\n  padding: 2rem 4rem;\n  gap: 4rem;\n  border-radius: 0.5rem;\n  background-color: var(--clr-neutral-transp);\n}\n\n.current-weather__item {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 1rem;\n}\n\n.current-weather__item img {\n  width: calc(1rem + 1vw);\n}\n\n.current-weather__details__column {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n\n.forecast {\n  display: flex;\n  justify-content: space-around;\n  width: 100%;\n  padding: 1rem 2rem;\n  border-radius: 0.5rem;\n  background-color: var(--clr-neutral-transp);\n}\n\n.forecast__item {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.forecast__item img {\n  width: calc(2rem + 3vw);\n}\n", "",{"version":3,"sources":["webpack://./src/styles/main.css"],"names":[],"mappings":"AAEA;EACE,+BAA+B;EAC/B,gDAAgD;EAChD,mCAAmC;EACnC,aAAa;EACb,aAAa;EACb,aAAa;EACb,aAAa;EACb,aAAa;AACf;;AAEA;;;EAGE,SAAS;EACT,UAAU;EACV,sBAAsB;EACtB,gCAAgC;AAClC;;AAEA;EACE,YAAY;EACZ,iBAAiB;EACjB,oCAAoC;EACpC,8BAA8B;EAC9B,yBAAyB;AAC3B;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,6BAA6B;EAC7B,kBAAkB;EAClB,YAAY;EACZ,iBAAiB;EACjB,kBAAkB;EAClB,gBAAgB;AAClB;;AAEA;EACE,kBAAkB;EAClB,MAAM;EACN,OAAO;EACP,YAAY;EACZ,aAAa;EACb,WAAW;AACb;;AAEA;EACE,YAAY;EACZ,aAAa;EACb,iBAAiB;AACnB;;AAEA;;EAEE,kBAAkB;EAClB,YAAY;EACZ,WAAW;EACX,kBAAkB;EAClB,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,YAAY;EACZ,WAAW;EACX,oBAAoB;EACpB,iBAAiB;AACnB;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,kBAAkB;EAClB,SAAS;EACT,WAAW;AACb;;AAEA;EACE,UAAU;EACV,kBAAkB;AACpB;;AAEA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,8BAA8B;EAC9B,YAAY;EACZ,kBAAkB;EAClB,YAAY;EACZ,WAAW;EACX,qBAAqB;AACvB;;AAEA;EACE,sBAAsB;EACtB,kBAAkB;EAClB,kBAAkB;EAClB,QAAQ;EACR,SAAS;EACT,YAAY;EACZ,WAAW;EACX,0BAA0B;EAC1B,iCAAiC;AACnC;;AAEA;EACE,2BAA2B;AAC7B;;AAEA;EACE,kBAAkB;EAClB,aAAa;EACb,uBAAuB;AACzB;;AAEA;EACE,UAAU;EACV,4BAA4B;EAC5B,mBAAmB;EACnB,YAAY;EACZ,yDAA4C;EAC5C,4BAA4B;EAC5B,gCAAgC;EAChC,mCAAmC;EACnC,uBAAuB;EACvB,iBAAiB;AACnB;;AAEA;EACE,gBAAgB;EAChB,sBAAsB;EACtB,0BAA0B;EAC1B,iBAAiB;AACnB;;AAEA;EACE,iBAAiB;EACjB,0BAA0B;AAC5B;;AAEA;EACE,aAAa;EACb,6BAA6B;AAC/B;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,gBAAgB;EAChB,eAAe;EACf,0BAA0B;AAC5B;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,uBAAuB;AACzB;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,kBAAkB;EAClB,mBAAmB;EACnB,kBAAkB;EAClB,SAAS;EACT,qBAAqB;EACrB,2CAA2C;AAC7C;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,WAAW;EACX,eAAe;AACjB;;AAEA;EACE,uBAAuB;AACzB;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,SAAS;AACX;;AAEA;EACE,aAAa;EACb,6BAA6B;EAC7B,WAAW;EACX,kBAAkB;EAClB,qBAAqB;EACrB,2CAA2C;AAC7C;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;AACrB;;AAEA;EACE,uBAAuB;AACzB","sourcesContent":["@import url(./normalize.css);\n\n:root {\n  --clr-neutral: hsl(0, 0%, 100%);\n  --clr-neutral-transp: rgba(255, 255, 255, 0.171);\n  --ff-primary: \"Poppins\", sans-serif;\n  --fw-300: 300;\n  --fw-400: 400;\n  --fw-500: 500;\n  --fw-600: 600;\n  --fw-700: 700;\n}\n\n*,\n*::before,\n*::after {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  text-shadow: 2px 2px 8px #000000;\n}\n\nbody {\n  width: 100vw;\n  min-height: 100vh;\n  background-color: rgb(212, 207, 207);\n  font-family: var(--ff-primary);\n  color: var(--clr-neutral);\n}\n\nmain {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n  position: relative;\n  width: 100vw;\n  min-height: 100vh;\n  padding: 4rem 2rem;\n  overflow: hidden;\n}\n\n.video-container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  z-index: -5;\n}\n\nvideo {\n  width: 100vw;\n  height: 100vh;\n  object-fit: cover;\n}\n\n.unitC,\n.unitF {\n  font-size: 0.85rem;\n  height: 16px;\n  width: 16px;\n  border-radius: 8px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  color: black;\n  z-index: 20;\n  pointer-events: none;\n  text-shadow: none;\n}\n\n.unitF {\n  color: white;\n}\n\n.checkbox-container {\n  position: absolute;\n  top: 3rem;\n  right: 3rem;\n}\n\n.checkbox {\n  opacity: 0;\n  position: absolute;\n}\n\n.label {\n  background-color: #111;\n  border-radius: 50px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 5px;\n  position: relative;\n  height: 26px;\n  width: 50px;\n  transform: scale(1.5);\n}\n\n.label .ball {\n  background-color: #fff;\n  border-radius: 50%;\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  height: 22px;\n  width: 22px;\n  transform: translateX(0px);\n  transition: transform 0.2s linear;\n}\n\n.checkbox:checked + .label .ball {\n  transform: translateX(24px);\n}\n\n.search-wrapper {\n  position: relative;\n  display: flex;\n  justify-content: center;\n}\n\n.search-wrapper input {\n  width: 40%;\n  padding: 10px 10px 10px 40px;\n  border-radius: 2rem;\n  border: none;\n  background-image: url(../images/magnify.png);\n  background-repeat: no-repeat;\n  background-position: 10px center;\n  background-size: calc(1rem + 0.5vw);\n  background-color: white;\n  text-shadow: none;\n}\n\n.city-info h1 {\n  margin: 0.3rem 0;\n  letter-spacing: 0.1rem;\n  font-weight: var(--fw-600);\n  font-size: 2.5rem;\n}\n\nh2 {\n  font-size: 1.1rem;\n  font-weight: var(--fw-300);\n}\n\n.current-weather {\n  display: flex;\n  justify-content: space-around;\n}\n\n.current-weather_cointainer {\n  display: flex;\n}\n\n.current-weather_cointainer img {\n  width: calc(10rem + 10vw);\n}\n\n.current-weather_cointainer h1 {\n  margin: 0.3rem 0;\n  font-size: 4rem;\n  font-weight: var(--fw-400);\n}\n\n.current-weather_temp {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n.current-weather__details {\n  display: flex;\n  align-items: center;\n  align-self: center;\n  height: max-content;\n  padding: 2rem 4rem;\n  gap: 4rem;\n  border-radius: 0.5rem;\n  background-color: var(--clr-neutral-transp);\n}\n\n.current-weather__item {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 1rem;\n}\n\n.current-weather__item img {\n  width: calc(1rem + 1vw);\n}\n\n.current-weather__details__column {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n\n.forecast {\n  display: flex;\n  justify-content: space-around;\n  width: 100%;\n  padding: 1rem 2rem;\n  border-radius: 0.5rem;\n  background-color: var(--clr-neutral-transp);\n}\n\n.forecast__item {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.forecast__item img {\n  width: calc(2rem + 3vw);\n}\n"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFlLE1BQU1BLGNBQU4sQ0FBcUI7RUFDbENDLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRQyxJQUFSLEVBQWM7SUFDdkIsS0FBS0QsS0FBTCxHQUFhQSxLQUFiO0lBQ0EsS0FBS0MsSUFBTCxHQUFZQSxJQUFaO0lBQ0EsS0FBS0MsSUFBTCxHQUFZLEVBQVo7SUFDQSxLQUFLQyxJQUFMLEdBQVksUUFBWjtJQUVBQyxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsUUFBeEIsRUFBa0NDLGdCQUFsQyxDQUFtRCxNQUFuRCxFQUE0REMsQ0FBRCxJQUFPLEtBQUtDLFFBQUwsQ0FBY0osUUFBUSxDQUFDQyxjQUFULENBQXdCLFFBQXhCLEVBQWtDSSxLQUFoRCxDQUFsRTtJQUNBTCxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsUUFBeEIsRUFBa0NDLGdCQUFsQyxDQUFtRCxVQUFuRCxFQUFnRUMsQ0FBRCxJQUFPLEtBQUtHLFlBQUwsQ0FBa0JILENBQWxCLENBQXRFO0lBQ0FJLE1BQU0sQ0FBQ0wsZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsTUFBTSxLQUFLRSxRQUFMLENBQWMsVUFBZCxDQUF0QztJQUNBSixRQUFRLENBQUNDLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUNDLGdCQUF6QyxDQUEwRCxRQUExRCxFQUFxRUMsQ0FBRCxJQUFPLEtBQUtLLGlCQUFMLENBQXVCTCxDQUF2QixDQUEzRTtFQUNEOztFQUVhLE1BQVJDLFFBQVEsQ0FBQ04sSUFBRCxFQUFPO0lBQ25CRSxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsT0FBeEIsRUFBaUNRLFlBQWpDLEdBQWdELEdBQWhEO0lBRUEsS0FBS1gsSUFBTCxHQUFZQSxJQUFaO0lBRUEsTUFBTVksUUFBUSxHQUFHLE1BQU0sS0FBS2QsS0FBTCxDQUFXZSxXQUFYLENBQXVCYixJQUF2QixFQUE2QixLQUFLQyxJQUFsQyxDQUF2QjtJQUNBLE1BQU1hLGNBQWMsR0FBRyxNQUFNLEtBQUtoQixLQUFMLENBQVdpQixpQkFBWCxDQUE2QmYsSUFBN0IsRUFBbUMsS0FBS0MsSUFBeEMsQ0FBN0I7SUFDQSxNQUFNZSxlQUFlLEdBQUcsTUFBTSxLQUFLbEIsS0FBTCxDQUFXbUIsa0JBQVgsQ0FBOEJqQixJQUE5QixFQUFvQyxLQUFLQyxJQUF6QyxDQUE5QjtJQUVBLEtBQUtGLElBQUwsQ0FBVW1CLGNBQVYsQ0FBeUJOLFFBQXpCO0lBQ0EsS0FBS2IsSUFBTCxDQUFVb0Isb0JBQVYsQ0FBK0JMLGNBQS9CO0lBQ0EsS0FBS2YsSUFBTCxDQUFVcUIscUJBQVYsQ0FBZ0NKLGVBQWhDO0VBQ0Q7O0VBRURSLFlBQVksQ0FBQ0gsQ0FBRCxFQUFJO0lBQ2QsSUFBSUEsQ0FBQyxDQUFDZ0IsR0FBRixLQUFVLE9BQWQsRUFBdUJuQixRQUFRLENBQUNDLGNBQVQsQ0FBd0IsUUFBeEIsRUFBa0NtQixJQUFsQztFQUN4Qjs7RUFFRFosaUJBQWlCLENBQUNMLENBQUQsRUFBSTtJQUNuQixNQUFNSixJQUFJLEdBQUdJLENBQUMsQ0FBQ2tCLGFBQUYsQ0FBZ0JDLE9BQWhCLEdBQTBCLFVBQTFCLEdBQXVDLFFBQXBEO0lBQ0EsS0FBS3pCLElBQUwsQ0FBVTBCLGNBQVYsQ0FBeUJ4QixJQUF6QjtJQUNBLEtBQUtBLElBQUwsR0FBWUEsSUFBWjtJQUNBLEtBQUtLLFFBQUwsQ0FBYyxLQUFLTixJQUFuQjtFQUNEOztBQXBDaUM7Ozs7Ozs7Ozs7Ozs7O0FDQXJCLE1BQU0wQixJQUFOLENBQVc7RUFDeEI3QixXQUFXLEdBQUc7SUFDWixLQUFLOEIsWUFBTCxHQUFvQixJQUFJQyxZQUFKLENBQWlCLGtDQUFqQixDQUFwQjtFQUNEOztFQUVzQixNQUFqQkMsaUJBQWlCLENBQUM3QixJQUFELEVBQU87SUFDNUIsTUFBTThCLEdBQUcsR0FBRyxLQUFLSCxZQUFMLENBQWtCSSxvQkFBbEIsQ0FBdUMvQixJQUF2QyxDQUFaO0lBQ0EsTUFBTWdDLFFBQVEsR0FBRyxNQUFNQyxLQUFLLENBQUNILEdBQUQsRUFBTTtNQUFFSSxJQUFJLEVBQUU7SUFBUixDQUFOLENBQTVCO0lBQ0EsTUFBTUMsYUFBYSxHQUFHLE1BQU1ILFFBQVEsQ0FBQ0ksSUFBVCxFQUE1QjtJQUVBLE1BQU07TUFBRUMsR0FBRjtNQUFPQztJQUFQLElBQWVILGFBQWEsQ0FBQyxDQUFELENBQWxDO0lBRUEsT0FBTztNQUFFRSxHQUFGO01BQU9DO0lBQVAsQ0FBUDtFQUNEOztFQUUwQixNQUFyQkMscUJBQXFCLENBQUN2QyxJQUFELEVBQU9DLElBQVAsRUFBYTtJQUN0QyxNQUFNO01BQUVvQyxHQUFGO01BQU9DO0lBQVAsSUFBZSxNQUFNLEtBQUtULGlCQUFMLENBQXVCN0IsSUFBdkIsQ0FBM0I7SUFDQSxNQUFNOEIsR0FBRyxHQUFHLEtBQUtILFlBQUwsQ0FBa0JhLHlCQUFsQixDQUE0Q0gsR0FBNUMsRUFBaURDLEdBQWpELEVBQXNEckMsSUFBdEQsQ0FBWjtJQUNBLE1BQU0rQixRQUFRLEdBQUcsTUFBTUMsS0FBSyxDQUFDSCxHQUFELEVBQU07TUFBRUksSUFBSSxFQUFFO0lBQVIsQ0FBTixDQUE1QjtJQUNBLE1BQU1PLFdBQVcsR0FBRyxNQUFNVCxRQUFRLENBQUNJLElBQVQsRUFBMUI7SUFDQSxPQUFPSyxXQUFQO0VBQ0Q7O0VBRTJCLE1BQXRCQyxzQkFBc0IsQ0FBQzFDLElBQUQsRUFBT0MsSUFBUCxFQUFhO0lBQ3ZDLE1BQU07TUFBRW9DLEdBQUY7TUFBT0M7SUFBUCxJQUFlLE1BQU0sS0FBS1QsaUJBQUwsQ0FBdUI3QixJQUF2QixDQUEzQjtJQUNBLE1BQU04QixHQUFHLEdBQUcsS0FBS0gsWUFBTCxDQUFrQmdCLDBCQUFsQixDQUE2Q04sR0FBN0MsRUFBa0RDLEdBQWxELEVBQXVEckMsSUFBdkQsQ0FBWjtJQUNBLE1BQU0rQixRQUFRLEdBQUcsTUFBTUMsS0FBSyxDQUFDSCxHQUFELEVBQU07TUFBRUksSUFBSSxFQUFFO0lBQVIsQ0FBTixDQUE1QjtJQUNBLE1BQU1VLFlBQVksR0FBRyxNQUFNWixRQUFRLENBQUNJLElBQVQsRUFBM0I7SUFDQSxPQUFPUSxZQUFQO0VBQ0Q7O0FBN0J1Qjs7QUFnQzFCLE1BQU1oQixZQUFOLENBQW1CO0VBQ2pCL0IsV0FBVyxDQUFDZ0QsS0FBRCxFQUFRO0lBQ2pCLEtBQUtDLE9BQUwsR0FBZSxnQ0FBZjtJQUNBLEtBQUtELEtBQUwsR0FBYUEsS0FBYjtFQUNEOztFQUVEZCxvQkFBb0IsQ0FBQy9CLElBQUQsRUFBTztJQUN6QixPQUFRLEdBQUUsS0FBSzhDLE9BQVEscUJBQW9COUMsSUFBSyxVQUFTLEtBQUs2QyxLQUFNLEVBQXBFO0VBQ0Q7O0VBRURMLHlCQUF5QixDQUFDSCxHQUFELEVBQU1DLEdBQU4sRUFBV3JDLElBQVgsRUFBaUI7SUFDeEMsT0FBUSxHQUFFLEtBQUs2QyxPQUFRLHlCQUF3QlQsR0FBSSxRQUFPQyxHQUFJLFVBQVMsS0FBS08sS0FBTSxVQUFTNUMsSUFBSyxFQUFoRztFQUNEOztFQUVEMEMsMEJBQTBCLENBQUNOLEdBQUQsRUFBTUMsR0FBTixFQUFXckMsSUFBWCxFQUFpQjtJQUN6QyxPQUFRLEdBQUUsS0FBSzZDLE9BQVEsMEJBQXlCVCxHQUFJLFFBQU9DLEdBQUksZ0JBQWUsS0FBS08sS0FBTSxVQUFTNUMsSUFBSyxFQUF2RztFQUNEOztBQWhCZ0I7Ozs7Ozs7Ozs7Ozs7O0FDaENKLE1BQU04QyxRQUFOLENBQWU7RUFDNUJsRCxXQUFXLENBQUNtRCxPQUFELEVBQVU7SUFDbkIsS0FBS0MsZUFBTCxHQUF1QixLQUFLQyxxQkFBTCxDQUEyQkYsT0FBM0IsQ0FBdkI7SUFDQSxLQUFLRyxlQUFMLEdBQXVCLEtBQUtDLHFCQUFMLENBQTJCSixPQUEzQixDQUF2QjtFQUNEOztFQUVERSxxQkFBcUIsQ0FBQ0YsT0FBRCxFQUFVO0lBQzdCLE1BQU1oRCxJQUFJLEdBQUdnRCxPQUFPLENBQUNLLElBQXJCO0lBQ0EsTUFBTTtNQUFFQztJQUFGLElBQWNOLE9BQU8sQ0FBQ08sR0FBNUI7SUFDQSxPQUFRLEdBQUV2RCxJQUFLLEtBQUlzRCxPQUFRLEVBQTNCO0VBQ0Q7O0VBRURGLHFCQUFxQixDQUFDSixPQUFELEVBQVU7SUFDN0IsTUFBTVEsR0FBRyxHQUFHLEtBQUtDLE1BQUwsRUFBWjtJQUNBLE1BQU1DLEtBQUssR0FBRyxLQUFLQyxRQUFMLEVBQWQ7SUFDQSxNQUFNQyxJQUFJLEdBQUcsS0FBS0MsT0FBTCxFQUFiO0lBQ0EsT0FBUSxHQUFFTCxHQUFJLEtBQUlFLEtBQU0sSUFBR0UsSUFBSyxFQUFoQztFQUNEOztFQUVESCxNQUFNLEdBQUc7SUFDUCxNQUFNSyxPQUFPLEdBQUcsQ0FBQyxRQUFELEVBQVcsUUFBWCxFQUFxQixTQUFyQixFQUFnQyxXQUFoQyxFQUE2QyxVQUE3QyxFQUF5RCxRQUF6RCxFQUFtRSxVQUFuRSxDQUFoQjtJQUNBLE1BQU1DLENBQUMsR0FBRyxJQUFJQyxJQUFKLEVBQVY7SUFDQSxNQUFNUixHQUFHLEdBQUdNLE9BQU8sQ0FBQ0MsQ0FBQyxDQUFDTixNQUFGLEVBQUQsQ0FBbkI7SUFDQSxPQUFPRCxHQUFQO0VBQ0Q7O0VBRURHLFFBQVEsR0FBRztJQUNULE1BQU1NLFVBQVUsR0FBRyxDQUNqQixTQURpQixFQUVqQixVQUZpQixFQUdqQixPQUhpQixFQUlqQixPQUppQixFQUtqQixLQUxpQixFQU1qQixNQU5pQixFQU9qQixNQVBpQixFQVFqQixRQVJpQixFQVNqQixXQVRpQixFQVVqQixTQVZpQixFQVdqQixVQVhpQixFQVlqQixVQVppQixDQUFuQjtJQWNBLE1BQU1GLENBQUMsR0FBRyxJQUFJQyxJQUFKLEVBQVY7SUFDQSxNQUFNTixLQUFLLEdBQUdPLFVBQVUsQ0FBQ0YsQ0FBQyxDQUFDSixRQUFGLEVBQUQsQ0FBeEI7SUFDQSxPQUFPRCxLQUFQO0VBQ0Q7O0VBRURHLE9BQU8sR0FBRztJQUNSLE1BQU1FLENBQUMsR0FBRyxJQUFJQyxJQUFKLEVBQVY7SUFDQSxNQUFNSixJQUFJLEdBQUdHLENBQUMsQ0FBQ0YsT0FBRixFQUFiO0lBQ0EsT0FBT0QsSUFBUDtFQUNEOztBQWxEMkI7Ozs7Ozs7Ozs7Ozs7O0FDQWYsTUFBTU0sY0FBTixDQUFxQjtFQUNsQ3JFLFdBQVcsQ0FBQ3NFLGtCQUFELEVBQXFCbEUsSUFBckIsRUFBMkI7SUFDcEMsS0FBS21FLFdBQUwsR0FBbUIsS0FBS0MsY0FBTCxDQUFvQkMsSUFBSSxDQUFDQyxLQUFMLENBQVdKLGtCQUFrQixDQUFDSyxJQUFuQixDQUF3QkMsSUFBbkMsQ0FBcEIsRUFBOER4RSxJQUE5RCxDQUFuQjtJQUNBLEtBQUt5RSxhQUFMLEdBQXFCLEtBQUtMLGNBQUwsQ0FBb0JDLElBQUksQ0FBQ0MsS0FBTCxDQUFXSixrQkFBa0IsQ0FBQ0ssSUFBbkIsQ0FBd0JHLFVBQW5DLENBQXBCLEVBQW9FMUUsSUFBcEUsQ0FBckI7SUFDQSxLQUFLMkUsUUFBTCxHQUFpQixHQUFFVCxrQkFBa0IsQ0FBQ0ssSUFBbkIsQ0FBd0JJLFFBQVMsR0FBcEQ7SUFDQSxLQUFLQyxTQUFMLEdBQWtCLEdBQUVWLGtCQUFrQixDQUFDVyxJQUFuQixDQUF3QkMsS0FBTSxNQUFsRDtJQUNBLEtBQUtDLFFBQUwsR0FBaUIsR0FBRWIsa0JBQWtCLENBQUNLLElBQW5CLENBQXdCUSxRQUFTLE1BQXBEO0lBQ0EsS0FBS0MsT0FBTCxHQUFlLEtBQUtDLHlCQUFMLENBQStCZixrQkFBa0IsQ0FBQ1osR0FBbkIsQ0FBdUIwQixPQUF0RCxFQUErRGQsa0JBQWtCLENBQUNnQixRQUFsRixDQUFmO0lBQ0EsS0FBS0MsTUFBTCxHQUFjLEtBQUtGLHlCQUFMLENBQStCZixrQkFBa0IsQ0FBQ1osR0FBbkIsQ0FBdUI2QixNQUF0RCxFQUE4RGpCLGtCQUFrQixDQUFDZ0IsUUFBakYsQ0FBZDtJQUNBLEtBQUtFLG9CQUFMLEdBQTRCbEIsa0JBQWtCLENBQUNtQixPQUFuQixDQUEyQixDQUEzQixFQUE4QkMsV0FBMUQ7SUFDQSxLQUFLQyxtQkFBTCxHQUEyQixLQUFLQyxzQkFBTCxDQUN6QnRCLGtCQUFrQixDQUFDbUIsT0FBbkIsQ0FBMkIsQ0FBM0IsRUFBOEJkLElBREwsRUFFekJMLGtCQUFrQixDQUFDWixHQUFuQixDQUF1QjBCLE9BRkUsRUFHekJkLGtCQUFrQixDQUFDWixHQUFuQixDQUF1QjZCLE1BSEUsRUFJekJqQixrQkFBa0IsQ0FBQ2dCLFFBSk0sQ0FBM0I7SUFNQSxLQUFLTyxlQUFMLEdBQXVCLEtBQUtDLHNCQUFMLENBQTRCLEtBQUtILG1CQUFqQyxDQUF2QjtFQUNEOztFQUVEbkIsY0FBYyxDQUFDdUIsTUFBRCxFQUFTM0YsSUFBVCxFQUFlO0lBQzNCLE9BQU9BLElBQUksS0FBSyxRQUFULEdBQXFCLEdBQUUyRixNQUFPLEdBQTlCLEdBQW9DLEdBQUVBLE1BQU8sR0FBcEQ7RUFDRDs7RUFFREMseUJBQXlCLENBQUNDLFFBQUQsRUFBV1gsUUFBWCxFQUFxQjtJQUM1QyxNQUFNWSxTQUFTLEdBQUdELFFBQVEsS0FBSyxDQUFiLEdBQWlCLElBQUk5QixJQUFKLEVBQWpCLEdBQThCLElBQUlBLElBQUosQ0FBUzhCLFFBQVEsR0FBRyxJQUFwQixDQUFoRDtJQUNBLE1BQU1FLFdBQVcsR0FBR0QsU0FBUyxDQUFDRSxPQUFWLEtBQXNCRixTQUFTLENBQUNHLGlCQUFWLEtBQWdDLEtBQTFFO0lBQ0EsTUFBTUMsc0JBQXNCLEdBQUdILFdBQVcsR0FBR2IsUUFBUSxHQUFHLElBQXhEO0lBQ0EsTUFBTWlCLGtCQUFrQixHQUFHLElBQUlwQyxJQUFKLENBQVNtQyxzQkFBVCxDQUEzQjtJQUNBLE9BQU9DLGtCQUFQO0VBQ0Q7O0VBRURsQix5QkFBeUIsQ0FBQ1ksUUFBRCxFQUFXWCxRQUFYLEVBQXFCO0lBQzVDLE1BQU1pQixrQkFBa0IsR0FBRyxLQUFLUCx5QkFBTCxDQUErQkMsUUFBL0IsRUFBeUNYLFFBQXpDLENBQTNCO0lBQ0EsTUFBTWtCLEtBQUssR0FBR0Qsa0JBQWtCLENBQUNFLFFBQW5CLEVBQWQ7SUFDQSxNQUFNQyxPQUFPLEdBQUksSUFBR0gsa0JBQWtCLENBQUNJLFVBQW5CLEVBQWdDLEVBQXBEO0lBQ0EsTUFBTUMsYUFBYSxHQUFJLEdBQUVKLEtBQU0sSUFBR0UsT0FBTyxDQUFDRyxNQUFSLENBQWUsQ0FBQyxDQUFoQixDQUFtQixFQUFyRDtJQUNBLE9BQU9ELGFBQVA7RUFDRDs7RUFFRGhCLHNCQUFzQixDQUFDbEYsS0FBRCxFQUFRb0csV0FBUixFQUFxQkMsVUFBckIsRUFBaUN6QixRQUFqQyxFQUEyQztJQUMvRCxJQUFJNUUsS0FBSyxLQUFLLFNBQWQsRUFBeUIsT0FBTyxNQUFQO0lBQ3pCLE1BQU1zRyxnQkFBZ0IsR0FBRyxDQUFDLE9BQUQsRUFBVSxNQUFWLEVBQWtCLE1BQWxCLEVBQTBCLEtBQTFCLEVBQWlDLE1BQWpDLEVBQXlDLE1BQXpDLEVBQWlELEtBQWpELEVBQXdELFFBQXhELEVBQWtFLFNBQWxFLENBQXpCO0lBQ0EsSUFBSUEsZ0JBQWdCLENBQUNDLFFBQWpCLENBQTBCdkcsS0FBMUIsQ0FBSixFQUFzQyxPQUFPLE1BQVA7SUFDdEMsSUFBSUEsS0FBSyxLQUFLLE9BQWQsRUFBdUIsT0FBT0EsS0FBUDtJQUN2QixNQUFNd0csV0FBVyxHQUFHLEtBQUtsQix5QkFBTCxDQUErQixDQUEvQixFQUFrQ1YsUUFBbEMsQ0FBcEI7SUFDQSxNQUFNNkIsV0FBVyxHQUFHLEtBQUtuQix5QkFBTCxDQUErQmMsV0FBL0IsRUFBNEN4QixRQUE1QyxDQUFwQjtJQUNBLE1BQU04QixVQUFVLEdBQUcsS0FBS3BCLHlCQUFMLENBQStCZSxVQUEvQixFQUEyQ3pCLFFBQTNDLENBQW5CO0lBQ0EsT0FBTzRCLFdBQVcsR0FBR0MsV0FBZCxJQUE2QkQsV0FBVyxHQUFHRSxVQUEzQyxHQUF5RCxHQUFFMUcsS0FBTSxLQUFqRSxHQUF5RSxHQUFFQSxLQUFNLE9BQXhGO0VBQ0Q7O0VBRURvRixzQkFBc0IsQ0FBQ3VCLGdCQUFELEVBQW1CO0lBQ3ZDLE1BQU1DLFVBQVUsR0FBRztNQUNqQkMsUUFBUSxFQUNOLHVJQUZlO01BR2pCQyxVQUFVLEVBQ1IsdUlBSmU7TUFLakJDLE1BQU0sRUFDSix1SUFOZTtNQU9qQkMsSUFBSSxFQUFFLHVJQVBXO01BUWpCQyxJQUFJLEVBQUUsdUlBUlc7TUFTakJDLElBQUksRUFBRSx1SUFUVztNQVVqQkMsWUFBWSxFQUNWO0lBWGUsQ0FBbkI7SUFhQSxPQUFPUCxVQUFVLENBQUNELGdCQUFELENBQWpCO0VBQ0Q7O0FBakVpQzs7Ozs7Ozs7Ozs7Ozs7QUNBckIsTUFBTVMsZUFBTixDQUFzQjtFQUNuQzlILFdBQVcsQ0FBQytILG1CQUFELEVBQXNCM0gsSUFBdEIsRUFBNEI7SUFDckMsS0FBSzRILFlBQUwsR0FBb0IsS0FBS0MsZUFBTCxDQUFxQkYsbUJBQXJCLEVBQTBDM0gsSUFBMUMsQ0FBcEI7SUFDQSxLQUFLaUgsZ0JBQUwsR0FBd0IsS0FBS2Esb0JBQUwsQ0FBMEJILG1CQUExQixDQUF4QjtJQUNBLEtBQUtJLElBQUwsR0FBWSxLQUFLQyxRQUFMLENBQWNMLG1CQUFkLENBQVo7RUFDRDs7RUFFREUsZUFBZSxDQUFDRixtQkFBRCxFQUFzQjNILElBQXRCLEVBQTRCO0lBQ3pDLE1BQU00SCxZQUFZLEdBQUcsRUFBckI7SUFDQUQsbUJBQW1CLENBQUNNLElBQXBCLENBQXlCQyxPQUF6QixDQUFrQ0MsSUFBRCxJQUFVO01BQ3pDLE1BQU0zRCxJQUFJLEdBQUdILElBQUksQ0FBQ0MsS0FBTCxDQUFXNkQsSUFBSSxDQUFDNUQsSUFBTCxDQUFVQyxJQUFyQixDQUFiO01BQ0EsTUFBTTRELFlBQVksR0FBRyxLQUFLQyxrQkFBTCxDQUF3QjdELElBQXhCLEVBQThCeEUsSUFBOUIsQ0FBckI7TUFDQTRILFlBQVksQ0FBQ1UsSUFBYixDQUFrQkYsWUFBbEI7SUFDRCxDQUpEO0lBS0EsT0FBT1IsWUFBUDtFQUNEOztFQUVEUyxrQkFBa0IsQ0FBQzFDLE1BQUQsRUFBUzNGLElBQVQsRUFBZTtJQUMvQixPQUFPQSxJQUFJLEtBQUssUUFBVCxHQUFxQixHQUFFMkYsTUFBTyxHQUE5QixHQUFvQyxHQUFFQSxNQUFPLEdBQXBEO0VBQ0Q7O0VBRURDLHlCQUF5QixDQUFDQyxRQUFELEVBQVdYLFFBQVgsRUFBcUI7SUFDNUMsTUFBTVksU0FBUyxHQUFHLElBQUkvQixJQUFKLENBQVM4QixRQUFRLEdBQUcsSUFBcEIsQ0FBbEI7SUFDQSxNQUFNRSxXQUFXLEdBQUdELFNBQVMsQ0FBQ0UsT0FBVixLQUFzQkYsU0FBUyxDQUFDRyxpQkFBVixLQUFnQyxLQUExRTtJQUNBLE1BQU1DLHNCQUFzQixHQUFHSCxXQUFXLEdBQUdiLFFBQVEsR0FBRyxJQUF4RDtJQUNBLE1BQU1pQixrQkFBa0IsR0FBRyxJQUFJcEMsSUFBSixDQUFTbUMsc0JBQVQsQ0FBM0I7SUFDQSxPQUFPQyxrQkFBUDtFQUNEOztFQUVEWCxzQkFBc0IsQ0FBQ2xGLEtBQUQsRUFBUXlILElBQVIsRUFBY3JCLFdBQWQsRUFBMkJDLFVBQTNCLEVBQXVDekIsUUFBdkMsRUFBaUQ7SUFDckUsSUFBSTVFLEtBQUssS0FBSyxPQUFkLEVBQXVCLE9BQU9BLEtBQVA7SUFDdkIsTUFBTWlJLFdBQVcsR0FBRyxLQUFLM0MseUJBQUwsQ0FBK0JtQyxJQUEvQixFQUFxQzdDLFFBQXJDLEVBQStDbUIsUUFBL0MsRUFBcEI7SUFDQSxNQUFNbUMsV0FBVyxHQUFHLEtBQUs1Qyx5QkFBTCxDQUErQmMsV0FBL0IsRUFBNEN4QixRQUE1QyxFQUFzRG1CLFFBQXRELEVBQXBCO0lBQ0EsTUFBTW9DLFVBQVUsR0FBRyxLQUFLN0MseUJBQUwsQ0FBK0JlLFVBQS9CLEVBQTJDekIsUUFBM0MsRUFBcURtQixRQUFyRCxFQUFuQjtJQUNBLE9BQU9rQyxXQUFXLEdBQUdDLFdBQWQsSUFBNkJELFdBQVcsR0FBR0UsVUFBM0MsR0FBeUQsR0FBRW5JLEtBQU0sS0FBakUsR0FBeUUsR0FBRUEsS0FBTSxPQUF4RjtFQUNEOztFQUVEd0gsb0JBQW9CLENBQUNILG1CQUFELEVBQXNCO0lBQ3hDLE1BQU1WLGdCQUFnQixHQUFHLEVBQXpCO0lBQ0EsTUFBTVAsV0FBVyxHQUFHaUIsbUJBQW1CLENBQUM1SCxJQUFwQixDQUF5QmlGLE9BQTdDO0lBQ0EsTUFBTTJCLFVBQVUsR0FBR2dCLG1CQUFtQixDQUFDNUgsSUFBcEIsQ0FBeUJvRixNQUE1QztJQUNBLE1BQU07TUFBRUQ7SUFBRixJQUFleUMsbUJBQW1CLENBQUM1SCxJQUF6QztJQUNBNEgsbUJBQW1CLENBQUNNLElBQXBCLENBQXlCQyxPQUF6QixDQUFrQ0MsSUFBRCxJQUFVO01BQ3pDLE1BQU1PLElBQUksR0FBRyxLQUFLbEQsc0JBQUwsQ0FBNEIyQyxJQUFJLENBQUM5QyxPQUFMLENBQWEsQ0FBYixFQUFnQmQsSUFBNUMsRUFBa0Q0RCxJQUFJLENBQUNRLEVBQXZELEVBQTJEakMsV0FBM0QsRUFBd0VDLFVBQXhFLEVBQW9GekIsUUFBcEYsQ0FBYjtNQUNBK0IsZ0JBQWdCLENBQUNxQixJQUFqQixDQUFzQkksSUFBdEI7SUFDRCxDQUhEO0lBSUEsT0FBT3pCLGdCQUFQO0VBQ0Q7O0VBRURlLFFBQVEsQ0FBQ0wsbUJBQUQsRUFBc0I7SUFDNUIsTUFBTWlCLEtBQUssR0FBRyxFQUFkO0lBQ0EsTUFBTTtNQUFFMUQ7SUFBRixJQUFleUMsbUJBQW1CLENBQUM1SCxJQUF6QztJQUNBNEgsbUJBQW1CLENBQUNNLElBQXBCLENBQXlCQyxPQUF6QixDQUFrQ0MsSUFBRCxJQUFVO01BQ3pDLE1BQU1KLElBQUksR0FBRyxLQUFLOUMseUJBQUwsQ0FBK0JrRCxJQUEvQixFQUFxQ2pELFFBQXJDLENBQWI7TUFDQTBELEtBQUssQ0FBQ04sSUFBTixDQUFXUCxJQUFYO0lBQ0QsQ0FIRDtJQUlBLE9BQU9hLEtBQVA7RUFDRDs7RUFFRDNELHlCQUF5QixDQUFDWSxRQUFELEVBQVdYLFFBQVgsRUFBcUI7SUFDNUMsTUFBTVksU0FBUyxHQUFHLElBQUkvQixJQUFKLENBQVM4QixRQUFRLENBQUM4QyxFQUFULEdBQWMsSUFBdkIsQ0FBbEI7SUFDQSxNQUFNNUMsV0FBVyxHQUFHRCxTQUFTLENBQUNFLE9BQVYsS0FBc0JGLFNBQVMsQ0FBQ0csaUJBQVYsS0FBZ0MsS0FBMUU7SUFDQSxNQUFNQyxzQkFBc0IsR0FBR0gsV0FBVyxHQUFHYixRQUFRLEdBQUcsSUFBeEQ7SUFDQSxNQUFNaUIsa0JBQWtCLEdBQUcsSUFBSXBDLElBQUosQ0FBU21DLHNCQUFULENBQTNCO0lBQ0EsTUFBTUUsS0FBSyxHQUFHRCxrQkFBa0IsQ0FBQ0UsUUFBbkIsRUFBZDtJQUNBLE1BQU0wQixJQUFJLEdBQUksR0FBRTNCLEtBQU0sS0FBdEI7SUFDQSxPQUFPMkIsSUFBUDtFQUNEOztBQW5Fa0M7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FyQztBQUNBO0FBQ0E7QUFDQTtBQUVlLE1BQU1jLFNBQU4sQ0FBZ0I7RUFDN0JqSixXQUFXLEdBQUc7SUFDWixLQUFLa0osSUFBTCxHQUFZLEVBQVo7SUFDQSxLQUFLckgsSUFBTCxHQUFZLElBQUlBLDZDQUFKLEVBQVo7RUFDRDs7RUFFZ0IsTUFBWGIsV0FBVyxDQUFDYixJQUFELEVBQU9DLElBQVAsRUFBYTtJQUM1QixNQUFNK0MsT0FBTyxHQUFHLE1BQU0sS0FBS3RCLElBQUwsQ0FBVWEscUJBQVYsQ0FBZ0N2QyxJQUFoQyxFQUFzQ0MsSUFBdEMsQ0FBdEI7SUFDQSxNQUFNVyxRQUFRLEdBQUcsSUFBSW1DLGlEQUFKLENBQWFDLE9BQWIsQ0FBakI7SUFDQSxPQUFPcEMsUUFBUDtFQUNEOztFQUVzQixNQUFqQkcsaUJBQWlCLENBQUNmLElBQUQsRUFBT0MsSUFBUCxFQUFhO0lBQ2xDLE1BQU1rRSxrQkFBa0IsR0FBRyxNQUFNLEtBQUt6QyxJQUFMLENBQVVhLHFCQUFWLENBQWdDdkMsSUFBaEMsRUFBc0NDLElBQXRDLENBQWpDO0lBQ0EsTUFBTWEsY0FBYyxHQUFHLElBQUlvRCx1REFBSixDQUFtQkMsa0JBQW5CLEVBQXVDbEUsSUFBdkMsQ0FBdkI7SUFDQSxPQUFPYSxjQUFQO0VBQ0Q7O0VBRXVCLE1BQWxCRyxrQkFBa0IsQ0FBQ2pCLElBQUQsRUFBT0MsSUFBUCxFQUFhO0lBQ25DLE1BQU0ySCxtQkFBbUIsR0FBRyxNQUFNLEtBQUtsRyxJQUFMLENBQVVnQixzQkFBVixDQUFpQzFDLElBQWpDLEVBQXVDQyxJQUF2QyxDQUFsQztJQUNBLE1BQU1lLGVBQWUsR0FBRyxJQUFJMkcsd0RBQUosQ0FBb0JDLG1CQUFwQixFQUF5QzNILElBQXpDLENBQXhCO0lBQ0EsT0FBT2UsZUFBUDtFQUNEOztBQXRCNEI7Ozs7Ozs7Ozs7Ozs7O0FDTGhCLE1BQU1nSSxZQUFOLENBQW1CO0VBQ2hDbkosV0FBVyxDQUFDb0osT0FBRCxFQUFVQyxhQUFWLEVBQXlCO0lBQ2xDLEtBQUtELE9BQUwsR0FBZUEsT0FBZjtJQUNBLEtBQUtuSixLQUFMLEdBQWFvSixhQUFiO0lBQ0EsS0FBS2xKLElBQUwsR0FBWWtKLGFBQWEsQ0FBQ2pHLGVBQTFCO0lBQ0EsS0FBS1csSUFBTCxHQUFZc0YsYUFBYSxDQUFDL0YsZUFBMUI7RUFDRDs7RUFFTyxJQUFKbkQsSUFBSSxHQUFHO0lBQ1QsT0FBTyxLQUFLaUosT0FBTCxDQUFhRSxhQUFiLENBQTJCLElBQTNCLENBQVA7RUFDRDs7RUFFTyxJQUFKbkosSUFBSSxDQUFDTyxLQUFELEVBQVE7SUFDZCxLQUFLUCxJQUFMLENBQVVvSixXQUFWLEdBQXdCN0ksS0FBeEI7RUFDRDs7RUFFTyxJQUFKcUQsSUFBSSxHQUFHO0lBQ1QsT0FBTyxLQUFLcUYsT0FBTCxDQUFhRSxhQUFiLENBQTJCLElBQTNCLENBQVA7RUFDRDs7RUFFTyxJQUFKdkYsSUFBSSxDQUFDckQsS0FBRCxFQUFRO0lBQ2QsS0FBS3FELElBQUwsQ0FBVXdGLFdBQVYsR0FBd0I3SSxLQUF4QjtFQUNEOztBQXRCK0I7Ozs7Ozs7Ozs7Ozs7O0FDQW5CLE1BQU04SSxrQkFBTixDQUF5QjtFQUN0Q3hKLFdBQVcsQ0FBQ29KLE9BQUQsRUFBVUssbUJBQVYsRUFBK0I7SUFDeEMsS0FBS0wsT0FBTCxHQUFlQSxPQUFmO0lBQ0EsS0FBS25KLEtBQUwsR0FBYXdKLG1CQUFiO0lBQ0EsS0FBSzlELG1CQUFMLEdBQTJCOEQsbUJBQW1CLENBQUM5RCxtQkFBL0M7SUFDQSxLQUFLcEIsV0FBTCxHQUFtQmtGLG1CQUFtQixDQUFDbEYsV0FBdkM7SUFDQSxLQUFLaUIsb0JBQUwsR0FBNEJpRSxtQkFBbUIsQ0FBQ2pFLG9CQUFoRDtJQUNBLEtBQUtYLGFBQUwsR0FBcUI0RSxtQkFBbUIsQ0FBQzVFLGFBQXpDO0lBQ0EsS0FBS08sT0FBTCxHQUFlcUUsbUJBQW1CLENBQUNyRSxPQUFuQztJQUNBLEtBQUtHLE1BQUwsR0FBY2tFLG1CQUFtQixDQUFDbEUsTUFBbEM7SUFDQSxLQUFLUixRQUFMLEdBQWdCMEUsbUJBQW1CLENBQUMxRSxRQUFwQztJQUNBLEtBQUtDLFNBQUwsR0FBaUJ5RSxtQkFBbUIsQ0FBQ3pFLFNBQXJDO0lBQ0EsS0FBS0csUUFBTCxHQUFnQnNFLG1CQUFtQixDQUFDdEUsUUFBcEM7SUFDQSxLQUFLdUUsbUJBQUwsR0FBMkJELG1CQUFtQixDQUFDOUQsbUJBQS9DO0lBQ0EsS0FBS2dFLGNBQUwsR0FBc0JGLG1CQUFtQixDQUFDbEYsV0FBMUM7SUFDQSxLQUFLc0IsZUFBTCxHQUF1QjRELG1CQUFtQixDQUFDNUQsZUFBM0M7RUFDRDs7RUFFc0IsSUFBbkJGLG1CQUFtQixHQUFHO0lBQ3hCLE9BQU8sS0FBS3lELE9BQUwsQ0FBYUUsYUFBYixDQUEyQixLQUEzQixDQUFQO0VBQ0Q7O0VBRXNCLElBQW5CM0QsbUJBQW1CLENBQUNqRixLQUFELEVBQVE7SUFDN0IsS0FBS2lGLG1CQUFMLENBQXlCaUUsR0FBekIsR0FBZ0MsVUFBU2xKLEtBQU0sTUFBL0M7RUFDRDs7RUFFYyxJQUFYNkQsV0FBVyxHQUFHO0lBQ2hCLE9BQU8sS0FBSzZFLE9BQUwsQ0FBYUUsYUFBYixDQUEyQixJQUEzQixDQUFQO0VBQ0Q7O0VBRWMsSUFBWC9FLFdBQVcsQ0FBQzdELEtBQUQsRUFBUTtJQUNyQixLQUFLNkQsV0FBTCxDQUFpQmdGLFdBQWpCLEdBQStCN0ksS0FBL0I7RUFDRDs7RUFFdUIsSUFBcEI4RSxvQkFBb0IsR0FBRztJQUN6QixPQUFPLEtBQUs0RCxPQUFMLENBQWFFLGFBQWIsQ0FBMkIsSUFBM0IsQ0FBUDtFQUNEOztFQUV1QixJQUFwQjlELG9CQUFvQixDQUFDOUUsS0FBRCxFQUFRO0lBQzlCLEtBQUs4RSxvQkFBTCxDQUEwQitELFdBQTFCLEdBQXdDN0ksS0FBeEM7RUFDRDs7RUFFZ0IsSUFBYm1FLGFBQWEsR0FBRztJQUNsQixPQUFPLEtBQUt1RSxPQUFMLENBQWFFLGFBQWIsQ0FBMkIsYUFBM0IsQ0FBUDtFQUNEOztFQUVnQixJQUFiekUsYUFBYSxDQUFDbkUsS0FBRCxFQUFRO0lBQ3ZCLEtBQUttRSxhQUFMLENBQW1CMEUsV0FBbkIsR0FBaUM3SSxLQUFqQztFQUNEOztFQUVVLElBQVAwRSxPQUFPLEdBQUc7SUFDWixPQUFPLEtBQUtnRSxPQUFMLENBQWFFLGFBQWIsQ0FBMkIsVUFBM0IsQ0FBUDtFQUNEOztFQUVVLElBQVBsRSxPQUFPLENBQUMxRSxLQUFELEVBQVE7SUFDakIsS0FBSzBFLE9BQUwsQ0FBYW1FLFdBQWIsR0FBMkI3SSxLQUEzQjtFQUNEOztFQUVTLElBQU42RSxNQUFNLEdBQUc7SUFDWCxPQUFPLEtBQUs2RCxPQUFMLENBQWFFLGFBQWIsQ0FBMkIsU0FBM0IsQ0FBUDtFQUNEOztFQUVTLElBQU4vRCxNQUFNLENBQUM3RSxLQUFELEVBQVE7SUFDaEIsS0FBSzZFLE1BQUwsQ0FBWWdFLFdBQVosR0FBMEI3SSxLQUExQjtFQUNEOztFQUVXLElBQVJxRSxRQUFRLEdBQUc7SUFDYixPQUFPLEtBQUtxRSxPQUFMLENBQWFFLGFBQWIsQ0FBMkIsV0FBM0IsQ0FBUDtFQUNEOztFQUVXLElBQVJ2RSxRQUFRLENBQUNyRSxLQUFELEVBQVE7SUFDbEIsS0FBS3FFLFFBQUwsQ0FBY3dFLFdBQWQsR0FBNEI3SSxLQUE1QjtFQUNEOztFQUVZLElBQVRzRSxTQUFTLEdBQUc7SUFDZCxPQUFPLEtBQUtvRSxPQUFMLENBQWFFLGFBQWIsQ0FBMkIsYUFBM0IsQ0FBUDtFQUNEOztFQUVZLElBQVR0RSxTQUFTLENBQUN0RSxLQUFELEVBQVE7SUFDbkIsS0FBS3NFLFNBQUwsQ0FBZXVFLFdBQWYsR0FBNkI3SSxLQUE3QjtFQUNEOztFQUVXLElBQVJ5RSxRQUFRLEdBQUc7SUFDYixPQUFPLEtBQUtpRSxPQUFMLENBQWFFLGFBQWIsQ0FBMkIsV0FBM0IsQ0FBUDtFQUNEOztFQUVXLElBQVJuRSxRQUFRLENBQUN6RSxLQUFELEVBQVE7SUFDbEIsS0FBS3lFLFFBQUwsQ0FBY29FLFdBQWQsR0FBNEI3SSxLQUE1QjtFQUNEOztFQUVzQixJQUFuQmdKLG1CQUFtQixHQUFHO0lBQ3hCLE9BQU9ySixRQUFRLENBQUNDLGNBQVQsQ0FBd0IsbUNBQXhCLENBQVA7RUFDRDs7RUFFc0IsSUFBbkJvSixtQkFBbUIsQ0FBQ2hKLEtBQUQsRUFBUTtJQUM3QixLQUFLZ0osbUJBQUwsQ0FBeUJFLEdBQXpCLEdBQWdDLFVBQVNsSixLQUFNLE1BQS9DO0VBQ0Q7O0VBRWlCLElBQWRpSixjQUFjLEdBQUc7SUFDbkIsT0FBT3RKLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3Qiw2QkFBeEIsQ0FBUDtFQUNEOztFQUVpQixJQUFkcUosY0FBYyxDQUFDakosS0FBRCxFQUFRO0lBQ3hCLEtBQUtpSixjQUFMLENBQW9CSixXQUFwQixHQUFrQzdJLEtBQWxDO0VBQ0Q7O0VBRWtCLElBQWZtRixlQUFlLEdBQUc7SUFDcEIsT0FBT3hGLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixPQUF4QixDQUFQO0VBQ0Q7O0VBRWtCLElBQWZ1RixlQUFlLENBQUNuRixLQUFELEVBQVE7SUFDekIsS0FBS21GLGVBQUwsQ0FBcUIrRCxHQUFyQixHQUEyQmxKLEtBQTNCO0VBQ0Q7O0FBaEhxQzs7Ozs7Ozs7Ozs7Ozs7QUNBekIsTUFBTW1KLG1CQUFOLENBQTBCO0VBQ3ZDN0osV0FBVyxDQUFDb0osT0FBRCxFQUFVVSxvQkFBVixFQUFnQztJQUN6QyxLQUFLVixPQUFMLEdBQWVBLE9BQWY7SUFDQSxLQUFLbkosS0FBTCxHQUFhNkosb0JBQWI7SUFDQSxLQUFLM0IsSUFBTCxHQUFZMkIsb0JBQW9CLENBQUMzQixJQUFqQztJQUNBLEtBQUtkLGdCQUFMLEdBQXdCeUMsb0JBQW9CLENBQUN6QyxnQkFBN0M7SUFDQSxLQUFLVyxZQUFMLEdBQW9COEIsb0JBQW9CLENBQUM5QixZQUF6QztFQUNEOztFQUVPLElBQUpHLElBQUksR0FBRztJQUNULE9BQU8sS0FBS2lCLE9BQUwsQ0FBYVcsZ0JBQWIsQ0FBOEIsdUJBQTlCLENBQVA7RUFDRDs7RUFFTyxJQUFKNUIsSUFBSSxDQUFDekgsS0FBRCxFQUFRO0lBQ2QsS0FBSyxJQUFJc0osQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLN0IsSUFBTCxDQUFVOEIsTUFBOUIsRUFBc0NELENBQUMsRUFBdkMsRUFBMkM7TUFDekMsS0FBSzdCLElBQUwsQ0FBVTZCLENBQVYsRUFBYVQsV0FBYixHQUEyQjdJLEtBQUssQ0FBQ3NKLENBQUQsQ0FBaEM7SUFDRDtFQUNGOztFQUVtQixJQUFoQjNDLGdCQUFnQixHQUFHO0lBQ3JCLE9BQU8sS0FBSytCLE9BQUwsQ0FBYVcsZ0JBQWIsQ0FBOEIsS0FBOUIsQ0FBUDtFQUNEOztFQUVtQixJQUFoQjFDLGdCQUFnQixDQUFDM0csS0FBRCxFQUFRO0lBQzFCLEtBQUssSUFBSXNKLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBSzNDLGdCQUFMLENBQXNCNEMsTUFBMUMsRUFBa0RELENBQUMsRUFBbkQsRUFBdUQ7TUFDckQsS0FBSzNDLGdCQUFMLENBQXNCMkMsQ0FBdEIsRUFBeUJKLEdBQXpCLEdBQWdDLFVBQVNsSixLQUFLLENBQUNzSixDQUFDLEdBQUcsQ0FBTCxDQUFRLE1BQXREO0lBQ0Q7RUFDRjs7RUFFZSxJQUFaaEMsWUFBWSxHQUFHO0lBQ2pCLE9BQU8sS0FBS29CLE9BQUwsQ0FBYVcsZ0JBQWIsQ0FBOEIsOEJBQTlCLENBQVA7RUFDRDs7RUFFZSxJQUFaL0IsWUFBWSxDQUFDdEgsS0FBRCxFQUFRO0lBQ3RCLEtBQUssSUFBSXNKLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBSzdCLElBQUwsQ0FBVThCLE1BQTlCLEVBQXNDRCxDQUFDLEVBQXZDLEVBQTJDO01BQ3pDLEtBQUtoQyxZQUFMLENBQWtCZ0MsQ0FBbEIsRUFBcUJULFdBQXJCLEdBQW1DN0ksS0FBSyxDQUFDc0osQ0FBRCxDQUF4QztJQUNEO0VBQ0Y7O0FBckNzQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBekM7QUFDQTtBQUNBO0FBRWUsTUFBTUcsUUFBTixDQUFlO0VBQzVCOUksY0FBYyxDQUFDTixRQUFELEVBQVc7SUFDdkIsTUFBTXFJLE9BQU8sR0FBRy9JLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixXQUF4QixDQUFoQjtJQUNBLElBQUk2SSxxREFBSixDQUFpQkMsT0FBakIsRUFBMEJySSxRQUExQjtFQUNEOztFQUVETyxvQkFBb0IsQ0FBQ0wsY0FBRCxFQUFpQjtJQUNuQyxNQUFNbUksT0FBTyxHQUFHL0ksUUFBUSxDQUFDQyxjQUFULENBQXdCLGlCQUF4QixDQUFoQjtJQUNBLElBQUlrSiwyREFBSixDQUF1QkosT0FBdkIsRUFBZ0NuSSxjQUFoQztFQUNEOztFQUVETSxxQkFBcUIsQ0FBQ0osZUFBRCxFQUFrQjtJQUNyQyxNQUFNaUksT0FBTyxHQUFHL0ksUUFBUSxDQUFDQyxjQUFULENBQXdCLFVBQXhCLENBQWhCO0lBQ0EsSUFBSTRKLDREQUFKLENBQXdCZCxPQUF4QixFQUFpQ2pJLGVBQWpDO0VBQ0Q7O0VBRURTLGNBQWMsQ0FBQ3hCLElBQUQsRUFBTztJQUNuQixJQUFJQSxJQUFJLEtBQUssVUFBYixFQUF5QjtNQUN2QkMsUUFBUSxDQUFDaUosYUFBVCxDQUF1QixRQUF2QixFQUFpQ2MsS0FBakMsQ0FBdUNDLEtBQXZDLEdBQStDLE9BQS9DO01BQ0FoSyxRQUFRLENBQUNpSixhQUFULENBQXVCLFFBQXZCLEVBQWlDYyxLQUFqQyxDQUF1Q0MsS0FBdkMsR0FBK0MsT0FBL0M7SUFDRCxDQUhELE1BR087TUFDTGhLLFFBQVEsQ0FBQ2lKLGFBQVQsQ0FBdUIsUUFBdkIsRUFBaUNjLEtBQWpDLENBQXVDQyxLQUF2QyxHQUErQyxPQUEvQztNQUNBaEssUUFBUSxDQUFDaUosYUFBVCxDQUF1QixRQUF2QixFQUFpQ2MsS0FBakMsQ0FBdUNDLEtBQXZDLEdBQStDLE9BQS9DO0lBQ0Q7RUFDRjs7QUF4QjJCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNKOUI7QUFDNkc7QUFDakI7QUFDZ0I7QUFDVDtBQUNuRyw0Q0FBNEMsc0hBQXdDO0FBQ3BGLDhCQUE4QixtRkFBMkIsQ0FBQyw0RkFBcUM7QUFDL0YsMEJBQTBCLDBGQUFpQztBQUMzRCx5Q0FBeUMsc0ZBQStCO0FBQ3hFO0FBQ0EsaURBQWlELG9DQUFvQyxxREFBcUQsMENBQTBDLGtCQUFrQixrQkFBa0Isa0JBQWtCLGtCQUFrQixrQkFBa0IsR0FBRyw4QkFBOEIsY0FBYyxlQUFlLDJCQUEyQixxQ0FBcUMsR0FBRyxVQUFVLGlCQUFpQixzQkFBc0IseUNBQXlDLG1DQUFtQyw4QkFBOEIsR0FBRyxVQUFVLGtCQUFrQiwyQkFBMkIsa0NBQWtDLHVCQUF1QixpQkFBaUIsc0JBQXNCLHVCQUF1QixxQkFBcUIsR0FBRyxzQkFBc0IsdUJBQXVCLFdBQVcsWUFBWSxpQkFBaUIsa0JBQWtCLGdCQUFnQixHQUFHLFdBQVcsaUJBQWlCLGtCQUFrQixzQkFBc0IsR0FBRyxxQkFBcUIsdUJBQXVCLGlCQUFpQixnQkFBZ0IsdUJBQXVCLGtCQUFrQiw0QkFBNEIsd0JBQXdCLGlCQUFpQixnQkFBZ0IseUJBQXlCLHNCQUFzQixHQUFHLFlBQVksaUJBQWlCLEdBQUcseUJBQXlCLHVCQUF1QixjQUFjLGdCQUFnQixHQUFHLGVBQWUsZUFBZSx1QkFBdUIsR0FBRyxZQUFZLDJCQUEyQix3QkFBd0Isb0JBQW9CLGtCQUFrQix3QkFBd0IsbUNBQW1DLGlCQUFpQix1QkFBdUIsaUJBQWlCLGdCQUFnQiwwQkFBMEIsR0FBRyxrQkFBa0IsMkJBQTJCLHVCQUF1Qix1QkFBdUIsYUFBYSxjQUFjLGlCQUFpQixnQkFBZ0IsK0JBQStCLHNDQUFzQyxHQUFHLHNDQUFzQyxnQ0FBZ0MsR0FBRyxxQkFBcUIsdUJBQXVCLGtCQUFrQiw0QkFBNEIsR0FBRywyQkFBMkIsZUFBZSxpQ0FBaUMsd0JBQXdCLGlCQUFpQixzRUFBc0UsaUNBQWlDLHFDQUFxQyx3Q0FBd0MsNEJBQTRCLHNCQUFzQixHQUFHLG1CQUFtQixxQkFBcUIsMkJBQTJCLCtCQUErQixzQkFBc0IsR0FBRyxRQUFRLHNCQUFzQiwrQkFBK0IsR0FBRyxzQkFBc0Isa0JBQWtCLGtDQUFrQyxHQUFHLGlDQUFpQyxrQkFBa0IsR0FBRyxxQ0FBcUMsOEJBQThCLEdBQUcsb0NBQW9DLHFCQUFxQixvQkFBb0IsK0JBQStCLEdBQUcsMkJBQTJCLGtCQUFrQiwyQkFBMkIsNEJBQTRCLEdBQUcsK0JBQStCLGtCQUFrQix3QkFBd0IsdUJBQXVCLHdCQUF3Qix1QkFBdUIsY0FBYywwQkFBMEIsZ0RBQWdELEdBQUcsNEJBQTRCLGtCQUFrQix3QkFBd0IsZ0JBQWdCLG9CQUFvQixHQUFHLGdDQUFnQyw0QkFBNEIsR0FBRyx1Q0FBdUMsa0JBQWtCLDJCQUEyQixjQUFjLEdBQUcsZUFBZSxrQkFBa0Isa0NBQWtDLGdCQUFnQix1QkFBdUIsMEJBQTBCLGdEQUFnRCxHQUFHLHFCQUFxQixrQkFBa0IsMkJBQTJCLHdCQUF3QixHQUFHLHlCQUF5Qiw0QkFBNEIsR0FBRyxTQUFTLHNGQUFzRixZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsTUFBTSxPQUFPLFVBQVUsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsVUFBVSxVQUFVLFVBQVUsVUFBVSxNQUFNLEtBQUssVUFBVSxVQUFVLFlBQVksT0FBTyxNQUFNLFlBQVksV0FBVyxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxNQUFNLEtBQUssWUFBWSxXQUFXLFVBQVUsTUFBTSxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLFdBQVcsVUFBVSxZQUFZLGFBQWEsV0FBVyxZQUFZLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLE1BQU0sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsTUFBTSxLQUFLLFVBQVUsWUFBWSxXQUFXLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSx1REFBdUQsV0FBVyxvQ0FBb0MscURBQXFELDBDQUEwQyxrQkFBa0Isa0JBQWtCLGtCQUFrQixrQkFBa0Isa0JBQWtCLEdBQUcsOEJBQThCLGNBQWMsZUFBZSwyQkFBMkIscUNBQXFDLEdBQUcsVUFBVSxpQkFBaUIsc0JBQXNCLHlDQUF5QyxtQ0FBbUMsOEJBQThCLEdBQUcsVUFBVSxrQkFBa0IsMkJBQTJCLGtDQUFrQyx1QkFBdUIsaUJBQWlCLHNCQUFzQix1QkFBdUIscUJBQXFCLEdBQUcsc0JBQXNCLHVCQUF1QixXQUFXLFlBQVksaUJBQWlCLGtCQUFrQixnQkFBZ0IsR0FBRyxXQUFXLGlCQUFpQixrQkFBa0Isc0JBQXNCLEdBQUcscUJBQXFCLHVCQUF1QixpQkFBaUIsZ0JBQWdCLHVCQUF1QixrQkFBa0IsNEJBQTRCLHdCQUF3QixpQkFBaUIsZ0JBQWdCLHlCQUF5QixzQkFBc0IsR0FBRyxZQUFZLGlCQUFpQixHQUFHLHlCQUF5Qix1QkFBdUIsY0FBYyxnQkFBZ0IsR0FBRyxlQUFlLGVBQWUsdUJBQXVCLEdBQUcsWUFBWSwyQkFBMkIsd0JBQXdCLG9CQUFvQixrQkFBa0Isd0JBQXdCLG1DQUFtQyxpQkFBaUIsdUJBQXVCLGlCQUFpQixnQkFBZ0IsMEJBQTBCLEdBQUcsa0JBQWtCLDJCQUEyQix1QkFBdUIsdUJBQXVCLGFBQWEsY0FBYyxpQkFBaUIsZ0JBQWdCLCtCQUErQixzQ0FBc0MsR0FBRyxzQ0FBc0MsZ0NBQWdDLEdBQUcscUJBQXFCLHVCQUF1QixrQkFBa0IsNEJBQTRCLEdBQUcsMkJBQTJCLGVBQWUsaUNBQWlDLHdCQUF3QixpQkFBaUIsaURBQWlELGlDQUFpQyxxQ0FBcUMsd0NBQXdDLDRCQUE0QixzQkFBc0IsR0FBRyxtQkFBbUIscUJBQXFCLDJCQUEyQiwrQkFBK0Isc0JBQXNCLEdBQUcsUUFBUSxzQkFBc0IsK0JBQStCLEdBQUcsc0JBQXNCLGtCQUFrQixrQ0FBa0MsR0FBRyxpQ0FBaUMsa0JBQWtCLEdBQUcscUNBQXFDLDhCQUE4QixHQUFHLG9DQUFvQyxxQkFBcUIsb0JBQW9CLCtCQUErQixHQUFHLDJCQUEyQixrQkFBa0IsMkJBQTJCLDRCQUE0QixHQUFHLCtCQUErQixrQkFBa0Isd0JBQXdCLHVCQUF1Qix3QkFBd0IsdUJBQXVCLGNBQWMsMEJBQTBCLGdEQUFnRCxHQUFHLDRCQUE0QixrQkFBa0Isd0JBQXdCLGdCQUFnQixvQkFBb0IsR0FBRyxnQ0FBZ0MsNEJBQTRCLEdBQUcsdUNBQXVDLGtCQUFrQiwyQkFBMkIsY0FBYyxHQUFHLGVBQWUsa0JBQWtCLGtDQUFrQyxnQkFBZ0IsdUJBQXVCLDBCQUEwQixnREFBZ0QsR0FBRyxxQkFBcUIsa0JBQWtCLDJCQUEyQix3QkFBd0IsR0FBRyx5QkFBeUIsNEJBQTRCLEdBQUcscUJBQXFCO0FBQ3AwUztBQUNBLGlFQUFlLHVCQUF1QixFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDWnZDO0FBQzZHO0FBQ2pCO0FBQzVGLDhCQUE4QixtRkFBMkIsQ0FBQyw0RkFBcUM7QUFDL0Y7QUFDQSx3V0FBd1cseUJBQXlCLDZDQUE2QyxZQUFZLGdMQUFnTCxnQkFBZ0IsS0FBSyxvRkFBb0YscUJBQXFCLEtBQUssb0tBQW9LLHFCQUFxQix1QkFBdUIsS0FBSyx3T0FBd08sK0JBQStCLHdCQUF3QixnQ0FBZ0MsWUFBWSxxS0FBcUsseUNBQXlDLDZCQUE2QixZQUFZLDJNQUEyTSxvQ0FBb0MsS0FBSyx3S0FBd0ssMkJBQTJCLHlDQUF5QyxnREFBZ0QsWUFBWSx1R0FBdUcsMEJBQTBCLEtBQUssdUxBQXVMLHlDQUF5Qyw2QkFBNkIsWUFBWSxrRkFBa0YscUJBQXFCLEtBQUssb0lBQW9JLHFCQUFxQixxQkFBcUIseUJBQXlCLCtCQUErQixLQUFLLGFBQWEsc0JBQXNCLEtBQUssYUFBYSxrQkFBa0IsS0FBSyx1TUFBdU0seUJBQXlCLEtBQUssd1JBQXdSLDRCQUE0Qiw4QkFBOEIsZ0NBQWdDLHdCQUF3QixZQUFZLGdIQUFnSCwrQkFBK0IsS0FBSyxxTEFBcUwsa0NBQWtDLEtBQUssMktBQTJLLGlDQUFpQyxLQUFLLGlPQUFpTyx5QkFBeUIsaUJBQWlCLEtBQUssME5BQTBOLHFDQUFxQyxLQUFLLDBFQUEwRSxxQ0FBcUMsS0FBSywwUkFBMFIsOEJBQThCLDZCQUE2Qiw2QkFBNkIsOEJBQThCLHlCQUF5QixrQ0FBa0MsWUFBWSw0R0FBNEcsK0JBQStCLEtBQUssMkZBQTJGLHFCQUFxQixLQUFLLHdKQUF3Siw4QkFBOEIseUJBQXlCLFlBQVksc01BQXNNLG1CQUFtQixLQUFLLHFKQUFxSixxQ0FBcUMsbUNBQW1DLFlBQVksc0lBQXNJLCtCQUErQixLQUFLLDJMQUEyTCxrQ0FBa0MsNEJBQTRCLFlBQVksd01BQXdNLHFCQUFxQixLQUFLLGlGQUFpRix5QkFBeUIsS0FBSyxnTEFBZ0wsb0JBQW9CLEtBQUssNEVBQTRFLG9CQUFvQixLQUFLLE9BQU8sbUdBQW1HLE1BQU0sUUFBUSxRQUFRLE1BQU0sS0FBSyxzQkFBc0IsdUJBQXVCLE9BQU8sS0FBSyxRQUFRLE9BQU8sTUFBTSxLQUFLLFVBQVUsTUFBTSxNQUFNLE1BQU0sS0FBSyxVQUFVLE9BQU8sT0FBTyxNQUFNLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxRQUFRLFFBQVEsTUFBTSxLQUFLLHNCQUFzQixxQkFBcUIsdUJBQXVCLE9BQU8sT0FBTyxNQUFNLEtBQUssc0JBQXNCLHFCQUFxQixPQUFPLEtBQUssUUFBUSxPQUFPLE1BQU0sS0FBSyxZQUFZLE9BQU8sT0FBTyxNQUFNLEtBQUssc0JBQXNCLHVCQUF1Qix1QkFBdUIsT0FBTyxNQUFNLE1BQU0sTUFBTSxZQUFZLE9BQU8sT0FBTyxNQUFNLE9BQU8sc0JBQXNCLHFCQUFxQixPQUFPLE1BQU0sTUFBTSxLQUFLLFVBQVUsT0FBTyxPQUFPLE1BQU0sTUFBTSxVQUFVLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLE9BQU8sS0FBSyxVQUFVLE1BQU0sS0FBSyxRQUFRLE9BQU8sTUFBTSxLQUFLLFlBQVksT0FBTyxLQUFLLFFBQVEsUUFBUSxNQUFNLFNBQVMsc0JBQXNCLHFCQUFxQix1QkFBdUIscUJBQXFCLE9BQU8sT0FBTyxNQUFNLEtBQUssVUFBVSxZQUFZLE9BQU8sT0FBTyxNQUFNLEtBQUssVUFBVSxZQUFZLE9BQU8sTUFBTSxNQUFNLFFBQVEsWUFBWSxPQUFPLE1BQU0sTUFBTSxRQUFRLFlBQVksV0FBVyxNQUFNLE1BQU0sTUFBTSxRQUFRLFlBQVksT0FBTyxNQUFNLE1BQU0sS0FBSyxZQUFZLE9BQU8sU0FBUyxNQUFNLEtBQUssc0JBQXNCLHFCQUFxQixxQkFBcUIscUJBQXFCLHFCQUFxQix1QkFBdUIsT0FBTyxNQUFNLE1BQU0sS0FBSyxZQUFZLE9BQU8sTUFBTSxNQUFNLEtBQUssVUFBVSxPQUFPLE9BQU8sTUFBTSxNQUFNLHNCQUFzQixxQkFBcUIsT0FBTyxNQUFNLE1BQU0sTUFBTSxVQUFVLE1BQU0sT0FBTyxNQUFNLEtBQUssc0JBQXNCLHVCQUF1QixPQUFPLE1BQU0sTUFBTSxLQUFLLFlBQVksT0FBTyxPQUFPLE1BQU0sS0FBSyxzQkFBc0IscUJBQXFCLE9BQU8sS0FBSyxRQUFRLE9BQU8sTUFBTSxLQUFLLFVBQVUsT0FBTyxNQUFNLE1BQU0sS0FBSyxZQUFZLE9BQU8sS0FBSyxRQUFRLE9BQU8sTUFBTSxLQUFLLFVBQVUsTUFBTSxNQUFNLE1BQU0sS0FBSyxVQUFVLHVWQUF1Vix5QkFBeUIs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Q0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ2ZBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7Ozs7V0NyQkE7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBRUE7QUFDQTtBQUNBO0FBRUEsTUFBTXBLLEtBQUssR0FBRyxJQUFJZ0oseURBQUosRUFBZDtBQUNBLE1BQU0vSSxJQUFJLEdBQUcsSUFBSWlLLHVEQUFKLEVBQWI7QUFDQSxNQUFNRyxVQUFVLEdBQUcsSUFBSXZLLG1FQUFKLENBQW1CRSxLQUFuQixFQUEwQkMsSUFBMUIsQ0FBbkIsQyIsInNvdXJjZXMiOlsid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL3NyYy9zY3JpcHRzL2NvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL3NyYy9zY3JpcHRzL21vZGVscy9BUElzLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL3NyYy9zY3JpcHRzL21vZGVscy9jaXR5SW5mby5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc2NyaXB0cy9tb2RlbHMvY3VycmVudFdlYXRoZXIuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3NjcmlwdHMvbW9kZWxzL2ZvcmVjYXN0V2VhdGhlci5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc2NyaXB0cy9tb2RlbHMvbWFpbk1vZGVsLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL3NyYy9zY3JpcHRzL3ZpZXdzL2NpdHlJbmZvVmlldy5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc2NyaXB0cy92aWV3cy9jdXJyZW50V2VhdGhlclZpZXcuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3NjcmlwdHMvdmlld3MvZm9yZWNhc3RXZWF0aGVyVmlldy5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc2NyaXB0cy92aWV3cy9tYWluVmlldy5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc3R5bGVzL21haW4uY3NzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL3NyYy9zdHlsZXMvbm9ybWFsaXplLmNzcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3N0eWxlcy9tYWluLmNzcz9lODBhIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc2NyaXB0cy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBNYWluQ29udHJvbGxlciB7XG4gIGNvbnN0cnVjdG9yKG1vZGVsLCB2aWV3KSB7XG4gICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgdGhpcy5jaXR5ID0ge307XG4gICAgdGhpcy51bml0ID0gXCJtZXRyaWNcIjtcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIChlKSA9PiB0aGlzLmNhbGxGdW5jKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoXCIpLnZhbHVlKSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2hcIikuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIChlKSA9PiB0aGlzLmNoZWNrSWZFbnRlcihlKSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHRoaXMuY2FsbEZ1bmMoXCJuZXcgeW9ya1wiKSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGVja2JveC11bml0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHRoaXMuY2hhbmdlVGVtcGVyYXR1cmUoZSkpO1xuICB9XG5cbiAgYXN5bmMgY2FsbEZ1bmMoY2l0eSkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidmlkZW9cIikucGxheWJhY2tSYXRlID0gMC41O1xuXG4gICAgdGhpcy5jaXR5ID0gY2l0eTtcblxuICAgIGNvbnN0IGNpdHlJbmZvID0gYXdhaXQgdGhpcy5tb2RlbC5nZXRDaXR5SW5mbyhjaXR5LCB0aGlzLnVuaXQpO1xuICAgIGNvbnN0IGN1cnJlbnRXZWF0aGVyID0gYXdhaXQgdGhpcy5tb2RlbC5nZXRDdXJyZW50V2VhdGhlcihjaXR5LCB0aGlzLnVuaXQpO1xuICAgIGNvbnN0IGZvcmVjYXN0V2VhdGhlciA9IGF3YWl0IHRoaXMubW9kZWwuZ2V0Rm9yZWNhc3RXZWF0aGVyKGNpdHksIHRoaXMudW5pdCk7XG5cbiAgICB0aGlzLnZpZXcuYXBwZW5kQ2l0eUluZm8oY2l0eUluZm8pO1xuICAgIHRoaXMudmlldy5hcHBlbmRDdXJyZW50V2VhdGhlcihjdXJyZW50V2VhdGhlcik7XG4gICAgdGhpcy52aWV3LmFwcGVuZEZvcmVjYXN0V2VhdGhlcihmb3JlY2FzdFdlYXRoZXIpO1xuICB9XG5cbiAgY2hlY2tJZkVudGVyKGUpIHtcbiAgICBpZiAoZS5rZXkgPT09IFwiRW50ZXJcIikgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2hcIikuYmx1cigpO1xuICB9XG5cbiAgY2hhbmdlVGVtcGVyYXR1cmUoZSkge1xuICAgIGNvbnN0IHVuaXQgPSBlLmN1cnJlbnRUYXJnZXQuY2hlY2tlZCA/IFwiaW1wZXJpYWxcIiA6IFwibWV0cmljXCI7XG4gICAgdGhpcy52aWV3LmNoYW5nZVVuaXRUZW1wKHVuaXQpO1xuICAgIHRoaXMudW5pdCA9IHVuaXQ7XG4gICAgdGhpcy5jYWxsRnVuYyh0aGlzLmNpdHkpO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBBUElzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy51cmxHZW5lcmF0b3IgPSBuZXcgVXJsR2VuZXJhdG9yKFwiZTUyMzIwYjk4NDA0MDE4NWU2MDQwYTFlNjdmMjU0ZTBcIik7XG4gIH1cblxuICBhc3luYyBnZXRHZW9Db29yZGluYXRlcyhjaXR5KSB7XG4gICAgY29uc3QgdXJsID0gdGhpcy51cmxHZW5lcmF0b3IuZ2VuZXJhdGVHZW9Db29yZHNVcmwoY2l0eSk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbW9kZTogXCJjb3JzXCIgfSk7XG4gICAgY29uc3QgZ2VvY29kaW5nRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgIGNvbnN0IHsgbGF0LCBsb24gfSA9IGdlb2NvZGluZ0RhdGFbMF07XG5cbiAgICByZXR1cm4geyBsYXQsIGxvbiB9O1xuICB9XG5cbiAgYXN5bmMgZ2V0Q3VycmVudFdlYXRoZXJEYXRhKGNpdHksIHVuaXQpIHtcbiAgICBjb25zdCB7IGxhdCwgbG9uIH0gPSBhd2FpdCB0aGlzLmdldEdlb0Nvb3JkaW5hdGVzKGNpdHkpO1xuICAgIGNvbnN0IHVybCA9IHRoaXMudXJsR2VuZXJhdG9yLmdlbmVyYXRlQ3VycmVudFdlYXRoZXJVcmwobGF0LCBsb24sIHVuaXQpO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xuICAgIGNvbnN0IHdlYXRoZXJEYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIHJldHVybiB3ZWF0aGVyRGF0YTtcbiAgfVxuXG4gIGFzeW5jIGdldEZvcmVjYXN0V2VhdGhlckRhdGEoY2l0eSwgdW5pdCkge1xuICAgIGNvbnN0IHsgbGF0LCBsb24gfSA9IGF3YWl0IHRoaXMuZ2V0R2VvQ29vcmRpbmF0ZXMoY2l0eSk7XG4gICAgY29uc3QgdXJsID0gdGhpcy51cmxHZW5lcmF0b3IuZ2VuZXJhdGVGb3JlY2FzdFdlYXRoZXJVcmwobGF0LCBsb24sIHVuaXQpO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xuICAgIGNvbnN0IGZvcmVjYXN0RGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gZm9yZWNhc3REYXRhO1xuICB9XG59XG5cbmNsYXNzIFVybEdlbmVyYXRvciB7XG4gIGNvbnN0cnVjdG9yKGFwcElkKSB7XG4gICAgdGhpcy5iYXNlVXJsID0gXCJodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmdcIjtcbiAgICB0aGlzLmFwcElkID0gYXBwSWQ7XG4gIH1cblxuICBnZW5lcmF0ZUdlb0Nvb3Jkc1VybChjaXR5KSB7XG4gICAgcmV0dXJuIGAke3RoaXMuYmFzZVVybH0vZ2VvLzEuMC9kaXJlY3Q/cT0ke2NpdHl9JmFwcGlkPSR7dGhpcy5hcHBJZH1gO1xuICB9XG5cbiAgZ2VuZXJhdGVDdXJyZW50V2VhdGhlclVybChsYXQsIGxvbiwgdW5pdCkge1xuICAgIHJldHVybiBgJHt0aGlzLmJhc2VVcmx9L2RhdGEvMi41L3dlYXRoZXI/bGF0PSR7bGF0fSZsb249JHtsb259JmFwcGlkPSR7dGhpcy5hcHBJZH0mdW5pdHM9JHt1bml0fWA7XG4gIH1cblxuICBnZW5lcmF0ZUZvcmVjYXN0V2VhdGhlclVybChsYXQsIGxvbiwgdW5pdCkge1xuICAgIHJldHVybiBgJHt0aGlzLmJhc2VVcmx9L2RhdGEvMi41L2ZvcmVjYXN0P2xhdD0ke2xhdH0mbG9uPSR7bG9ufSZjbnQ9OCZhcHBpZD0ke3RoaXMuYXBwSWR9JnVuaXRzPSR7dW5pdH1gO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDaXR5SW5mbyB7XG4gIGNvbnN0cnVjdG9yKEFwaURhdGEpIHtcbiAgICB0aGlzLmNpdHlEZXNjcmlwdGlvbiA9IHRoaXMuY3JlYXRlQ2l0eURlc2NyaXB0aW9uKEFwaURhdGEpO1xuICAgIHRoaXMuZGF0ZURlc2NyaXB0aW9uID0gdGhpcy5jcmVhdGVEYXRlRGVzY3JpcHRpb24oQXBpRGF0YSk7XG4gIH1cblxuICBjcmVhdGVDaXR5RGVzY3JpcHRpb24oQXBpRGF0YSkge1xuICAgIGNvbnN0IGNpdHkgPSBBcGlEYXRhLm5hbWU7XG4gICAgY29uc3QgeyBjb3VudHJ5IH0gPSBBcGlEYXRhLnN5cztcbiAgICByZXR1cm4gYCR7Y2l0eX0sICR7Y291bnRyeX1gO1xuICB9XG5cbiAgY3JlYXRlRGF0ZURlc2NyaXB0aW9uKEFwaURhdGEpIHtcbiAgICBjb25zdCBkYXkgPSB0aGlzLmdldERheSgpO1xuICAgIGNvbnN0IG1vbnRoID0gdGhpcy5nZXRNb250aCgpO1xuICAgIGNvbnN0IGRhdGUgPSB0aGlzLmdldERhdGUoKTtcbiAgICByZXR1cm4gYCR7ZGF5fSwgJHttb250aH0gJHtkYXRlfWA7XG4gIH1cblxuICBnZXREYXkoKSB7XG4gICAgY29uc3Qgd2Vla2RheSA9IFtcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCJdO1xuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGRheSA9IHdlZWtkYXlbZC5nZXREYXkoKV07XG4gICAgcmV0dXJuIGRheTtcbiAgfVxuXG4gIGdldE1vbnRoKCkge1xuICAgIGNvbnN0IG1vbnRoTmFtZXMgPSBbXG4gICAgICBcIkphbnVhcnlcIixcbiAgICAgIFwiRmVicnVhcnlcIixcbiAgICAgIFwiTWFyY2hcIixcbiAgICAgIFwiQXByaWxcIixcbiAgICAgIFwiTWF5XCIsXG4gICAgICBcIkp1bmVcIixcbiAgICAgIFwiSnVseVwiLFxuICAgICAgXCJBdWd1c3RcIixcbiAgICAgIFwiU2VwdGVtYmVyXCIsXG4gICAgICBcIk9jdG9iZXJcIixcbiAgICAgIFwiTm92ZW1iZXJcIixcbiAgICAgIFwiRGVjZW1iZXJcIixcbiAgICBdO1xuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IG1vbnRoID0gbW9udGhOYW1lc1tkLmdldE1vbnRoKCldO1xuICAgIHJldHVybiBtb250aDtcbiAgfVxuXG4gIGdldERhdGUoKSB7XG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgZGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuICAgIHJldHVybiBkYXRlO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDdXJyZW50V2VhdGhlciB7XG4gIGNvbnN0cnVjdG9yKGN1cnJlbnRXZWF0aGVyRGF0YSwgdW5pdCkge1xuICAgIHRoaXMudGVtcGVyYXR1cmUgPSB0aGlzLmdldFRlbXBlcmF0dXJlKE1hdGgucm91bmQoY3VycmVudFdlYXRoZXJEYXRhLm1haW4udGVtcCksIHVuaXQpO1xuICAgIHRoaXMuZmVlbHNMaWtlVGVtcCA9IHRoaXMuZ2V0VGVtcGVyYXR1cmUoTWF0aC5yb3VuZChjdXJyZW50V2VhdGhlckRhdGEubWFpbi5mZWVsc19saWtlKSwgdW5pdCk7XG4gICAgdGhpcy5odW1pZGl0eSA9IGAke2N1cnJlbnRXZWF0aGVyRGF0YS5tYWluLmh1bWlkaXR5fSVgO1xuICAgIHRoaXMud2luZFNwZWVkID0gYCR7Y3VycmVudFdlYXRoZXJEYXRhLndpbmQuc3BlZWR9IG0vc2A7XG4gICAgdGhpcy5wcmVzc3VyZSA9IGAke2N1cnJlbnRXZWF0aGVyRGF0YS5tYWluLnByZXNzdXJlfSBoUGFgO1xuICAgIHRoaXMuc3VucmlzZSA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5VGltZShjdXJyZW50V2VhdGhlckRhdGEuc3lzLnN1bnJpc2UsIGN1cnJlbnRXZWF0aGVyRGF0YS50aW1lem9uZSk7XG4gICAgdGhpcy5zdW5zZXQgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eVRpbWUoY3VycmVudFdlYXRoZXJEYXRhLnN5cy5zdW5zZXQsIGN1cnJlbnRXZWF0aGVyRGF0YS50aW1lem9uZSk7XG4gICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uRGVzYyA9IGN1cnJlbnRXZWF0aGVyRGF0YS53ZWF0aGVyWzBdLmRlc2NyaXB0aW9uO1xuICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbkltZyA9IHRoaXMuZ2V0V2VhdGhlckNvbmRpdGlvbkltZyhcbiAgICAgIGN1cnJlbnRXZWF0aGVyRGF0YS53ZWF0aGVyWzBdLm1haW4sXG4gICAgICBjdXJyZW50V2VhdGhlckRhdGEuc3lzLnN1bnJpc2UsXG4gICAgICBjdXJyZW50V2VhdGhlckRhdGEuc3lzLnN1bnNldCxcbiAgICAgIGN1cnJlbnRXZWF0aGVyRGF0YS50aW1lem9uZVxuICAgICk7XG4gICAgdGhpcy5iYWNrZ3JvdW5kVmlkZW8gPSB0aGlzLmdldEJhY2tncm91bmRWaWRlb0xpbmsodGhpcy53ZWF0aGVyQ29uZGl0aW9uSW1nKTtcbiAgfVxuXG4gIGdldFRlbXBlcmF0dXJlKGRlZ3JlZSwgdW5pdCkge1xuICAgIHJldHVybiB1bml0ID09PSBcIm1ldHJpY1wiID8gYCR7ZGVncmVlfeKEg2AgOiBgJHtkZWdyZWV94oSJYDtcbiAgfVxuXG4gIGNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUodW5peFRpbWUsIHRpbWV6b25lKSB7XG4gICAgY29uc3QgbG9jYWxEYXRlID0gdW5peFRpbWUgPT09IDAgPyBuZXcgRGF0ZSgpIDogbmV3IERhdGUodW5peFRpbWUgKiAxMDAwKTtcbiAgICBjb25zdCB1dGNVbml4VGltZSA9IGxvY2FsRGF0ZS5nZXRUaW1lKCkgKyBsb2NhbERhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSAqIDYwMDAwO1xuICAgIGNvbnN0IHVuaXhUaW1lSW5TZWFyY2hlZENpdHkgPSB1dGNVbml4VGltZSArIHRpbWV6b25lICogMTAwMDtcbiAgICBjb25zdCBkYXRlSW5TZWFyY2hlZENpdHkgPSBuZXcgRGF0ZSh1bml4VGltZUluU2VhcmNoZWRDaXR5KTtcbiAgICByZXR1cm4gZGF0ZUluU2VhcmNoZWRDaXR5O1xuICB9XG5cbiAgY29udmVydFRvU2VhcmNoZWRDaXR5VGltZSh1bml4VGltZSwgdGltZXpvbmUpIHtcbiAgICBjb25zdCBkYXRlSW5TZWFyY2hlZENpdHkgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUodW5peFRpbWUsIHRpbWV6b25lKTtcbiAgICBjb25zdCBob3VycyA9IGRhdGVJblNlYXJjaGVkQ2l0eS5nZXRIb3VycygpO1xuICAgIGNvbnN0IG1pbnV0ZXMgPSBgMCR7ZGF0ZUluU2VhcmNoZWRDaXR5LmdldE1pbnV0ZXMoKX1gO1xuICAgIGNvbnN0IGZvcm1hdHRlZFRpbWUgPSBgJHtob3Vyc306JHttaW51dGVzLnN1YnN0cigtMil9YDtcbiAgICByZXR1cm4gZm9ybWF0dGVkVGltZTtcbiAgfVxuXG4gIGdldFdlYXRoZXJDb25kaXRpb25JbWcodmFsdWUsIHN1bnJpc2VVbml4LCBzdW5zZXRVbml4LCB0aW1lem9uZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gXCJEcml6emxlXCIpIHJldHVybiBcIlJhaW5cIjtcbiAgICBjb25zdCBtaXN0RXF1aXZhbGVudGVzID0gW1wiU21va2VcIiwgXCJIYXplXCIsIFwiRHVzdFwiLCBcIkZvZ1wiLCBcIlNhbmRcIiwgXCJEdXN0XCIsIFwiQXNoXCIsIFwiU3F1YWxsXCIsIFwiVG9ybmFkb1wiXTtcbiAgICBpZiAobWlzdEVxdWl2YWxlbnRlcy5pbmNsdWRlcyh2YWx1ZSkpIHJldHVybiBcIk1pc3RcIjtcbiAgICBpZiAodmFsdWUgIT09IFwiQ2xlYXJcIikgcmV0dXJuIHZhbHVlO1xuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKDAsIHRpbWV6b25lKTtcbiAgICBjb25zdCBzdW5yaXNlRGF0ZSA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZShzdW5yaXNlVW5peCwgdGltZXpvbmUpO1xuICAgIGNvbnN0IHN1bnNldERhdGUgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoc3Vuc2V0VW5peCwgdGltZXpvbmUpO1xuICAgIHJldHVybiBjdXJyZW50RGF0ZSA+IHN1bnJpc2VEYXRlICYmIGN1cnJlbnREYXRlIDwgc3Vuc2V0RGF0ZSA/IGAke3ZhbHVlfURheWAgOiBgJHt2YWx1ZX1OaWdodGA7XG4gIH1cblxuICBnZXRCYWNrZ3JvdW5kVmlkZW9MaW5rKHdlYXRoZXJDb25kaXRpb24pIHtcbiAgICBjb25zdCB2aWRlb0xpbmtzID0ge1xuICAgICAgQ2xlYXJEYXk6XG4gICAgICAgIFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzM0NTgwNTE1MC5oZC5tcDQ/cz0zNmM0ZTU5NmI0ODBlZjBlODA0OTM3MGJlY2JhZjI2MWIzOTg5YTAxJnByb2ZpbGVfaWQ9MTcwJm9hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MVwiLFxuICAgICAgQ2xlYXJOaWdodDpcbiAgICAgICAgXCJodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvNDY5MzA3OTUwLmhkLm1wND9zPTJlNjdhYTAyYTIxZDVjNjRjNjU3OTA0M2E3OGYwOTcyM2ViYzVkZGImcHJvZmlsZV9pZD0xNzUmb2F1dGgyX3Rva2VuX2lkPTU3NDQ3NzYxXCIsXG4gICAgICBDbG91ZHM6XG4gICAgICAgIFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzQ0NDIxMjY3NC5oZC5tcDQ/cz00MDcxOTgxMjY0ZDllNzhhY2YwOWEwNDAwZTQ2Mzg0MzI0OTVjNGYwJnByb2ZpbGVfaWQ9MTc1Jm9hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MVwiLFxuICAgICAgTWlzdDogXCJodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvMzQzNzMyMTMyLmhkLm1wND9zPTViZmRlMjNmMTdlMzg1OGRiZGMxNDBhZmU3YTM1YjZhOWVmMTEyN2QmcHJvZmlsZV9pZD0xNzUmb2F1dGgyX3Rva2VuX2lkPTU3NDQ3NzYxXCIsXG4gICAgICBSYWluOiBcImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9leHRlcm5hbC81NjkyMTc2MDIuaGQubXA0P3M9OWE5NjE3OGM5MWZlMTlhNjMxN2VkNTk0Nzg1ZjJlMzY4Y2QxZWFkZSZwcm9maWxlX2lkPTE3NCZvYXV0aDJfdG9rZW5faWQ9NTc0NDc3NjFcIixcbiAgICAgIFNub3c6IFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzUxMDgzMTE2OS5oZC5tcDQ/cz1kOTAwNDk1NTliNzZmMGI5ZTBiZGExMDJlYThhNzQyMWQ3YTY0ZDgxJnByb2ZpbGVfaWQ9MTc1Jm9hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MVwiLFxuICAgICAgVGh1bmRlcnN0b3JtOlxuICAgICAgICBcImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9leHRlcm5hbC80ODAyMjM4OTYuaGQubXA0P3M9ZTRiOTRmMGI1NzAwYmZhNjhjYjZmMDJiNDFmOTRlY2NhOTEyNDJlOSZwcm9maWxlX2lkPTE2OSZvYXV0aDJfdG9rZW5faWQ9NTc0NDc3NjFcIixcbiAgICB9O1xuICAgIHJldHVybiB2aWRlb0xpbmtzW3dlYXRoZXJDb25kaXRpb25dO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBGb3JlY2FzdFdlYXRoZXIge1xuICBjb25zdHJ1Y3Rvcihmb3JlY2FzdFdlYXRoZXJEYXRhLCB1bml0KSB7XG4gICAgdGhpcy50ZW1wZXJhdHVyZXMgPSB0aGlzLmdldFRlbXBlcmF0dXJlcyhmb3JlY2FzdFdlYXRoZXJEYXRhLCB1bml0KTtcbiAgICB0aGlzLndlYXRoZXJDb25kaXRpb24gPSB0aGlzLmdldFdlYXRoZXJDb25kaXRpb25zKGZvcmVjYXN0V2VhdGhlckRhdGEpO1xuICAgIHRoaXMudGltZSA9IHRoaXMuZ2V0VGltZXMoZm9yZWNhc3RXZWF0aGVyRGF0YSk7XG4gIH1cblxuICBnZXRUZW1wZXJhdHVyZXMoZm9yZWNhc3RXZWF0aGVyRGF0YSwgdW5pdCkge1xuICAgIGNvbnN0IHRlbXBlcmF0dXJlcyA9IFtdO1xuICAgIGZvcmVjYXN0V2VhdGhlckRhdGEubGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCB0ZW1wID0gTWF0aC5yb3VuZChpdGVtLm1haW4udGVtcCk7XG4gICAgICBjb25zdCB0ZW1wV2l0aFVuaXQgPSB0aGlzLmdldFRlbXBlcmF0dXJlVW5pdCh0ZW1wLCB1bml0KTtcbiAgICAgIHRlbXBlcmF0dXJlcy5wdXNoKHRlbXBXaXRoVW5pdCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRlbXBlcmF0dXJlcztcbiAgfVxuXG4gIGdldFRlbXBlcmF0dXJlVW5pdChkZWdyZWUsIHVuaXQpIHtcbiAgICByZXR1cm4gdW5pdCA9PT0gXCJtZXRyaWNcIiA/IGAke2RlZ3JlZX3ihINgIDogYCR7ZGVncmVlfeKEiWA7XG4gIH1cblxuICBjb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKHVuaXhUaW1lLCB0aW1lem9uZSkge1xuICAgIGNvbnN0IGxvY2FsRGF0ZSA9IG5ldyBEYXRlKHVuaXhUaW1lICogMTAwMCk7XG4gICAgY29uc3QgdXRjVW5peFRpbWUgPSBsb2NhbERhdGUuZ2V0VGltZSgpICsgbG9jYWxEYXRlLmdldFRpbWV6b25lT2Zmc2V0KCkgKiA2MDAwMDtcbiAgICBjb25zdCB1bml4VGltZUluU2VhcmNoZWRDaXR5ID0gdXRjVW5peFRpbWUgKyB0aW1lem9uZSAqIDEwMDA7XG4gICAgY29uc3QgZGF0ZUluU2VhcmNoZWRDaXR5ID0gbmV3IERhdGUodW5peFRpbWVJblNlYXJjaGVkQ2l0eSk7XG4gICAgcmV0dXJuIGRhdGVJblNlYXJjaGVkQ2l0eTtcbiAgfVxuXG4gIGdldFdlYXRoZXJDb25kaXRpb25JbWcodmFsdWUsIHRpbWUsIHN1bnJpc2VVbml4LCBzdW5zZXRVbml4LCB0aW1lem9uZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gXCJDbGVhclwiKSByZXR1cm4gdmFsdWU7XG4gICAgY29uc3QgY3VycmVudEhvdXIgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUodGltZSwgdGltZXpvbmUpLmdldEhvdXJzKCk7XG4gICAgY29uc3Qgc3VucmlzZUhvdXIgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoc3VucmlzZVVuaXgsIHRpbWV6b25lKS5nZXRIb3VycygpO1xuICAgIGNvbnN0IHN1bnNldEhvdXIgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoc3Vuc2V0VW5peCwgdGltZXpvbmUpLmdldEhvdXJzKCk7XG4gICAgcmV0dXJuIGN1cnJlbnRIb3VyID4gc3VucmlzZUhvdXIgJiYgY3VycmVudEhvdXIgPCBzdW5zZXRIb3VyID8gYCR7dmFsdWV9RGF5YCA6IGAke3ZhbHVlfU5pZ2h0YDtcbiAgfVxuXG4gIGdldFdlYXRoZXJDb25kaXRpb25zKGZvcmVjYXN0V2VhdGhlckRhdGEpIHtcbiAgICBjb25zdCB3ZWF0aGVyQ29uZGl0aW9uID0gW107XG4gICAgY29uc3Qgc3VucmlzZVVuaXggPSBmb3JlY2FzdFdlYXRoZXJEYXRhLmNpdHkuc3VucmlzZTtcbiAgICBjb25zdCBzdW5zZXRVbml4ID0gZm9yZWNhc3RXZWF0aGVyRGF0YS5jaXR5LnN1bnNldDtcbiAgICBjb25zdCB7IHRpbWV6b25lIH0gPSBmb3JlY2FzdFdlYXRoZXJEYXRhLmNpdHk7XG4gICAgZm9yZWNhc3RXZWF0aGVyRGF0YS5saXN0LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGNvbmQgPSB0aGlzLmdldFdlYXRoZXJDb25kaXRpb25JbWcoaXRlbS53ZWF0aGVyWzBdLm1haW4sIGl0ZW0uZHQsIHN1bnJpc2VVbml4LCBzdW5zZXRVbml4LCB0aW1lem9uZSk7XG4gICAgICB3ZWF0aGVyQ29uZGl0aW9uLnB1c2goY29uZCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHdlYXRoZXJDb25kaXRpb247XG4gIH1cblxuICBnZXRUaW1lcyhmb3JlY2FzdFdlYXRoZXJEYXRhKSB7XG4gICAgY29uc3QgdGltZXMgPSBbXTtcbiAgICBjb25zdCB7IHRpbWV6b25lIH0gPSBmb3JlY2FzdFdlYXRoZXJEYXRhLmNpdHk7XG4gICAgZm9yZWNhc3RXZWF0aGVyRGF0YS5saXN0LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eVRpbWUoaXRlbSwgdGltZXpvbmUpO1xuICAgICAgdGltZXMucHVzaCh0aW1lKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGltZXM7XG4gIH1cblxuICBjb252ZXJ0VG9TZWFyY2hlZENpdHlUaW1lKHVuaXhUaW1lLCB0aW1lem9uZSkge1xuICAgIGNvbnN0IGxvY2FsRGF0ZSA9IG5ldyBEYXRlKHVuaXhUaW1lLmR0ICogMTAwMCk7XG4gICAgY29uc3QgdXRjVW5peFRpbWUgPSBsb2NhbERhdGUuZ2V0VGltZSgpICsgbG9jYWxEYXRlLmdldFRpbWV6b25lT2Zmc2V0KCkgKiA2MDAwMDtcbiAgICBjb25zdCB1bml4VGltZUluU2VhcmNoZWRDaXR5ID0gdXRjVW5peFRpbWUgKyB0aW1lem9uZSAqIDEwMDA7XG4gICAgY29uc3QgZGF0ZUluU2VhcmNoZWRDaXR5ID0gbmV3IERhdGUodW5peFRpbWVJblNlYXJjaGVkQ2l0eSk7XG4gICAgY29uc3QgaG91cnMgPSBkYXRlSW5TZWFyY2hlZENpdHkuZ2V0SG91cnMoKTtcbiAgICBjb25zdCB0aW1lID0gYCR7aG91cnN9OjAwYDtcbiAgICByZXR1cm4gdGltZTtcbiAgfVxufVxuIiwiaW1wb3J0IEN1cnJlbnRXZWF0aGVyIGZyb20gXCIuL2N1cnJlbnRXZWF0aGVyXCI7XG5pbXBvcnQgRm9yZWNhc3RXZWF0aGVyIGZyb20gXCIuL2ZvcmVjYXN0V2VhdGhlclwiO1xuaW1wb3J0IENpdHlJbmZvIGZyb20gXCIuL2NpdHlJbmZvXCI7XG5pbXBvcnQgQVBJcyBmcm9tIFwiLi9BUElzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1haW5Nb2RlbCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZGF0YSA9IHt9O1xuICAgIHRoaXMuQVBJcyA9IG5ldyBBUElzKCk7XG4gIH1cblxuICBhc3luYyBnZXRDaXR5SW5mbyhjaXR5LCB1bml0KSB7XG4gICAgY29uc3QgQXBpRGF0YSA9IGF3YWl0IHRoaXMuQVBJcy5nZXRDdXJyZW50V2VhdGhlckRhdGEoY2l0eSwgdW5pdCk7XG4gICAgY29uc3QgY2l0eUluZm8gPSBuZXcgQ2l0eUluZm8oQXBpRGF0YSk7XG4gICAgcmV0dXJuIGNpdHlJbmZvO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q3VycmVudFdlYXRoZXIoY2l0eSwgdW5pdCkge1xuICAgIGNvbnN0IGN1cnJlbnRXZWF0aGVyRGF0YSA9IGF3YWl0IHRoaXMuQVBJcy5nZXRDdXJyZW50V2VhdGhlckRhdGEoY2l0eSwgdW5pdCk7XG4gICAgY29uc3QgY3VycmVudFdlYXRoZXIgPSBuZXcgQ3VycmVudFdlYXRoZXIoY3VycmVudFdlYXRoZXJEYXRhLCB1bml0KTtcbiAgICByZXR1cm4gY3VycmVudFdlYXRoZXI7XG4gIH1cblxuICBhc3luYyBnZXRGb3JlY2FzdFdlYXRoZXIoY2l0eSwgdW5pdCkge1xuICAgIGNvbnN0IGZvcmVjYXN0V2VhdGhlckRhdGEgPSBhd2FpdCB0aGlzLkFQSXMuZ2V0Rm9yZWNhc3RXZWF0aGVyRGF0YShjaXR5LCB1bml0KTtcbiAgICBjb25zdCBmb3JlY2FzdFdlYXRoZXIgPSBuZXcgRm9yZWNhc3RXZWF0aGVyKGZvcmVjYXN0V2VhdGhlckRhdGEsIHVuaXQpO1xuICAgIHJldHVybiBmb3JlY2FzdFdlYXRoZXI7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENpdHlJbmZvVmlldyB7XG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGNpdHlJbmZvTW9kZWwpIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMubW9kZWwgPSBjaXR5SW5mb01vZGVsO1xuICAgIHRoaXMuY2l0eSA9IGNpdHlJbmZvTW9kZWwuY2l0eURlc2NyaXB0aW9uO1xuICAgIHRoaXMuZGF0ZSA9IGNpdHlJbmZvTW9kZWwuZGF0ZURlc2NyaXB0aW9uO1xuICB9XG5cbiAgZ2V0IGNpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDFcIik7XG4gIH1cblxuICBzZXQgY2l0eSh2YWx1ZSkge1xuICAgIHRoaXMuY2l0eS50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDJcIik7XG4gIH1cblxuICBzZXQgZGF0ZSh2YWx1ZSkge1xuICAgIHRoaXMuZGF0ZS50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDdXJyZW50V2VhdGhlclZpZXcge1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBjdXJyZW50V2VhdGhlck1vZGVsKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLm1vZGVsID0gY3VycmVudFdlYXRoZXJNb2RlbDtcbiAgICB0aGlzLndlYXRoZXJDb25kaXRpb25JbWcgPSBjdXJyZW50V2VhdGhlck1vZGVsLndlYXRoZXJDb25kaXRpb25JbWc7XG4gICAgdGhpcy50ZW1wZXJhdHVyZSA9IGN1cnJlbnRXZWF0aGVyTW9kZWwudGVtcGVyYXR1cmU7XG4gICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uRGVzYyA9IGN1cnJlbnRXZWF0aGVyTW9kZWwud2VhdGhlckNvbmRpdGlvbkRlc2M7XG4gICAgdGhpcy5mZWVsc0xpa2VUZW1wID0gY3VycmVudFdlYXRoZXJNb2RlbC5mZWVsc0xpa2VUZW1wO1xuICAgIHRoaXMuc3VucmlzZSA9IGN1cnJlbnRXZWF0aGVyTW9kZWwuc3VucmlzZTtcbiAgICB0aGlzLnN1bnNldCA9IGN1cnJlbnRXZWF0aGVyTW9kZWwuc3Vuc2V0O1xuICAgIHRoaXMuaHVtaWRpdHkgPSBjdXJyZW50V2VhdGhlck1vZGVsLmh1bWlkaXR5O1xuICAgIHRoaXMud2luZFNwZWVkID0gY3VycmVudFdlYXRoZXJNb2RlbC53aW5kU3BlZWQ7XG4gICAgdGhpcy5wcmVzc3VyZSA9IGN1cnJlbnRXZWF0aGVyTW9kZWwucHJlc3N1cmU7XG4gICAgdGhpcy5ub3dXZWF0aGVyQ29uZGl0aW9uID0gY3VycmVudFdlYXRoZXJNb2RlbC53ZWF0aGVyQ29uZGl0aW9uSW1nO1xuICAgIHRoaXMubm93VGVtcGVyYXR1cmUgPSBjdXJyZW50V2VhdGhlck1vZGVsLnRlbXBlcmF0dXJlO1xuICAgIHRoaXMuYmFja2dyb3VuZFZpZGVvID0gY3VycmVudFdlYXRoZXJNb2RlbC5iYWNrZ3JvdW5kVmlkZW87XG4gIH1cblxuICBnZXQgd2VhdGhlckNvbmRpdGlvbkltZygpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIik7XG4gIH1cblxuICBzZXQgd2VhdGhlckNvbmRpdGlvbkltZyh2YWx1ZSkge1xuICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbkltZy5zcmMgPSBgaW1hZ2VzLyR7dmFsdWV9LnBuZ2A7XG4gIH1cblxuICBnZXQgdGVtcGVyYXR1cmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDFcIik7XG4gIH1cblxuICBzZXQgdGVtcGVyYXR1cmUodmFsdWUpIHtcbiAgICB0aGlzLnRlbXBlcmF0dXJlLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgd2VhdGhlckNvbmRpdGlvbkRlc2MoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDJcIik7XG4gIH1cblxuICBzZXQgd2VhdGhlckNvbmRpdGlvbkRlc2ModmFsdWUpIHtcbiAgICB0aGlzLndlYXRoZXJDb25kaXRpb25EZXNjLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZmVlbHNMaWtlVGVtcCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmVlbHMtbGlrZVwiKTtcbiAgfVxuXG4gIHNldCBmZWVsc0xpa2VUZW1wKHZhbHVlKSB7XG4gICAgdGhpcy5mZWVsc0xpa2VUZW1wLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc3VucmlzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3VucmlzZVwiKTtcbiAgfVxuXG4gIHNldCBzdW5yaXNlKHZhbHVlKSB7XG4gICAgdGhpcy5zdW5yaXNlLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc3Vuc2V0KCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdW5zZXRcIik7XG4gIH1cblxuICBzZXQgc3Vuc2V0KHZhbHVlKSB7XG4gICAgdGhpcy5zdW5zZXQudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBodW1pZGl0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaHVtaWRpdHlcIik7XG4gIH1cblxuICBzZXQgaHVtaWRpdHkodmFsdWUpIHtcbiAgICB0aGlzLmh1bWlkaXR5LnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgd2luZFNwZWVkKCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5kLXNwZWVkXCIpO1xuICB9XG5cbiAgc2V0IHdpbmRTcGVlZCh2YWx1ZSkge1xuICAgIHRoaXMud2luZFNwZWVkLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgcHJlc3N1cmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnByZXNzdXJlXCIpO1xuICB9XG5cbiAgc2V0IHByZXNzdXJlKHZhbHVlKSB7XG4gICAgdGhpcy5wcmVzc3VyZS50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IG5vd1dlYXRoZXJDb25kaXRpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9yZWNhc3RfX2l0ZW1fX2N1cnJlbnQtY29uZGl0aW9uXCIpO1xuICB9XG5cbiAgc2V0IG5vd1dlYXRoZXJDb25kaXRpb24odmFsdWUpIHtcbiAgICB0aGlzLm5vd1dlYXRoZXJDb25kaXRpb24uc3JjID0gYGltYWdlcy8ke3ZhbHVlfS5wbmdgO1xuICB9XG5cbiAgZ2V0IG5vd1RlbXBlcmF0dXJlKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvcmVjYXN0X19pdGVtX19jdXJlbnQtdGVtcFwiKTtcbiAgfVxuXG4gIHNldCBub3dUZW1wZXJhdHVyZSh2YWx1ZSkge1xuICAgIHRoaXMubm93VGVtcGVyYXR1cmUudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBiYWNrZ3JvdW5kVmlkZW8oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidmlkZW9cIik7XG4gIH1cblxuICBzZXQgYmFja2dyb3VuZFZpZGVvKHZhbHVlKSB7XG4gICAgdGhpcy5iYWNrZ3JvdW5kVmlkZW8uc3JjID0gdmFsdWU7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIGZvcmVjYXN0V2VhdGhlclZpZXcge1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBmb3JlY2FzdFdlYXRoZXJNb2RlbCkge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5tb2RlbCA9IGZvcmVjYXN0V2VhdGhlck1vZGVsO1xuICAgIHRoaXMudGltZSA9IGZvcmVjYXN0V2VhdGhlck1vZGVsLnRpbWU7XG4gICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uID0gZm9yZWNhc3RXZWF0aGVyTW9kZWwud2VhdGhlckNvbmRpdGlvbjtcbiAgICB0aGlzLnRlbXBlcmF0dXJlcyA9IGZvcmVjYXN0V2VhdGhlck1vZGVsLnRlbXBlcmF0dXJlcztcbiAgfVxuXG4gIGdldCB0aW1lKCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5mb3JlY2FzdF9faXRlbV9fdGltZVwiKTtcbiAgfVxuXG4gIHNldCB0aW1lKHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRpbWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMudGltZVtpXS50ZXh0Q29udGVudCA9IHZhbHVlW2ldO1xuICAgIH1cbiAgfVxuXG4gIGdldCB3ZWF0aGVyQ29uZGl0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKTtcbiAgfVxuXG4gIHNldCB3ZWF0aGVyQ29uZGl0aW9uKHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLndlYXRoZXJDb25kaXRpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbltpXS5zcmMgPSBgaW1hZ2VzLyR7dmFsdWVbaSAtIDFdfS5wbmdgO1xuICAgIH1cbiAgfVxuXG4gIGdldCB0ZW1wZXJhdHVyZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZvcmVjYXN0X19pdGVtX190ZW1wZXJhdHVyZVwiKTtcbiAgfVxuXG4gIHNldCB0ZW1wZXJhdHVyZXModmFsdWUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGltZS5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy50ZW1wZXJhdHVyZXNbaV0udGV4dENvbnRlbnQgPSB2YWx1ZVtpXTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBDaXR5SW5mb1ZpZXcgZnJvbSBcIi4vY2l0eUluZm9WaWV3XCI7XG5pbXBvcnQgQ3VycmVudFdlYXRoZXJWaWV3IGZyb20gXCIuL2N1cnJlbnRXZWF0aGVyVmlld1wiO1xuaW1wb3J0IEZvcmVjYXN0V2VhdGhlclZpZXcgZnJvbSBcIi4vZm9yZWNhc3RXZWF0aGVyVmlld1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYWluVmlldyB7XG4gIGFwcGVuZENpdHlJbmZvKGNpdHlJbmZvKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eS1pbmZvXCIpO1xuICAgIG5ldyBDaXR5SW5mb1ZpZXcoZWxlbWVudCwgY2l0eUluZm8pO1xuICB9XG5cbiAgYXBwZW5kQ3VycmVudFdlYXRoZXIoY3VycmVudFdlYXRoZXIpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdXJyZW50LXdlYXRoZXJcIik7XG4gICAgbmV3IEN1cnJlbnRXZWF0aGVyVmlldyhlbGVtZW50LCBjdXJyZW50V2VhdGhlcik7XG4gIH1cblxuICBhcHBlbmRGb3JlY2FzdFdlYXRoZXIoZm9yZWNhc3RXZWF0aGVyKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9yZWNhc3RcIik7XG4gICAgbmV3IEZvcmVjYXN0V2VhdGhlclZpZXcoZWxlbWVudCwgZm9yZWNhc3RXZWF0aGVyKTtcbiAgfVxuXG4gIGNoYW5nZVVuaXRUZW1wKHVuaXQpIHtcbiAgICBpZiAodW5pdCA9PT0gXCJpbXBlcmlhbFwiKSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnVuaXRDXCIpLnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51bml0RlwiKS5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51bml0RlwiKS5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudW5pdENcIikuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XG4gICAgfVxuICB9XG59XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzBfX18gZnJvbSBcIi0hLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9ub3JtYWxpemUuY3NzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fID0gbmV3IFVSTChcIi4uL2ltYWdlcy9tYWduaWZ5LnBuZ1wiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18uaShfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzBfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIjpyb290IHtcXG4gIC0tY2xyLW5ldXRyYWw6IGhzbCgwLCAwJSwgMTAwJSk7XFxuICAtLWNsci1uZXV0cmFsLXRyYW5zcDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE3MSk7XFxuICAtLWZmLXByaW1hcnk6IFxcXCJQb3BwaW5zXFxcIiwgc2Fucy1zZXJpZjtcXG4gIC0tZnctMzAwOiAzMDA7XFxuICAtLWZ3LTQwMDogNDAwO1xcbiAgLS1mdy01MDA6IDUwMDtcXG4gIC0tZnctNjAwOiA2MDA7XFxuICAtLWZ3LTcwMDogNzAwO1xcbn1cXG5cXG4qLFxcbio6OmJlZm9yZSxcXG4qOjphZnRlciB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIHRleHQtc2hhZG93OiAycHggMnB4IDhweCAjMDAwMDAwO1xcbn1cXG5cXG5ib2R5IHtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIxMiwgMjA3LCAyMDcpO1xcbiAgZm9udC1mYW1pbHk6IHZhcigtLWZmLXByaW1hcnkpO1xcbiAgY29sb3I6IHZhcigtLWNsci1uZXV0cmFsKTtcXG59XFxuXFxubWFpbiB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgd2lkdGg6IDEwMHZ3O1xcbiAgbWluLWhlaWdodDogMTAwdmg7XFxuICBwYWRkaW5nOiA0cmVtIDJyZW07XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG5cXG4udmlkZW8tY29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICB3aWR0aDogMTAwdnc7XFxuICBoZWlnaHQ6IDEwMHZoO1xcbiAgei1pbmRleDogLTU7XFxufVxcblxcbnZpZGVvIHtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIGhlaWdodDogMTAwdmg7XFxuICBvYmplY3QtZml0OiBjb3ZlcjtcXG59XFxuXFxuLnVuaXRDLFxcbi51bml0RiB7XFxuICBmb250LXNpemU6IDAuODVyZW07XFxuICBoZWlnaHQ6IDE2cHg7XFxuICB3aWR0aDogMTZweDtcXG4gIGJvcmRlci1yYWRpdXM6IDhweDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBjb2xvcjogYmxhY2s7XFxuICB6LWluZGV4OiAyMDtcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbiAgdGV4dC1zaGFkb3c6IG5vbmU7XFxufVxcblxcbi51bml0RiB7XFxuICBjb2xvcjogd2hpdGU7XFxufVxcblxcbi5jaGVja2JveC1jb250YWluZXIge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAzcmVtO1xcbiAgcmlnaHQ6IDNyZW07XFxufVxcblxcbi5jaGVja2JveCB7XFxuICBvcGFjaXR5OiAwO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbn1cXG5cXG4ubGFiZWwge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzExMTtcXG4gIGJvcmRlci1yYWRpdXM6IDUwcHg7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gIHBhZGRpbmc6IDVweDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGhlaWdodDogMjZweDtcXG4gIHdpZHRoOiA1MHB4O1xcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjUpO1xcbn1cXG5cXG4ubGFiZWwgLmJhbGwge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMnB4O1xcbiAgbGVmdDogMnB4O1xcbiAgaGVpZ2h0OiAyMnB4O1xcbiAgd2lkdGg6IDIycHg7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTtcXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjJzIGxpbmVhcjtcXG59XFxuXFxuLmNoZWNrYm94OmNoZWNrZWQgKyAubGFiZWwgLmJhbGwge1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDI0cHgpO1xcbn1cXG5cXG4uc2VhcmNoLXdyYXBwZXIge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4uc2VhcmNoLXdyYXBwZXIgaW5wdXQge1xcbiAgd2lkdGg6IDQwJTtcXG4gIHBhZGRpbmc6IDEwcHggMTBweCAxMHB4IDQwcHg7XFxuICBib3JkZXItcmFkaXVzOiAycmVtO1xcbiAgYm9yZGVyOiBub25lO1xcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiICsgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyArIFwiKTtcXG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAxMHB4IGNlbnRlcjtcXG4gIGJhY2tncm91bmQtc2l6ZTogY2FsYygxcmVtICsgMC41dncpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICB0ZXh0LXNoYWRvdzogbm9uZTtcXG59XFxuXFxuLmNpdHktaW5mbyBoMSB7XFxuICBtYXJnaW46IDAuM3JlbSAwO1xcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy02MDApO1xcbiAgZm9udC1zaXplOiAyLjVyZW07XFxufVxcblxcbmgyIHtcXG4gIGZvbnQtc2l6ZTogMS4xcmVtO1xcbiAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTMwMCk7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX2NvaW50YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9jb2ludGFpbmVyIGltZyB7XFxuICB3aWR0aDogY2FsYygxMHJlbSArIDEwdncpO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX2NvaW50YWluZXIgaDEge1xcbiAgbWFyZ2luOiAwLjNyZW0gMDtcXG4gIGZvbnQtc2l6ZTogNHJlbTtcXG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy00MDApO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX3RlbXAge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9fZGV0YWlscyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGFsaWduLXNlbGY6IGNlbnRlcjtcXG4gIGhlaWdodDogbWF4LWNvbnRlbnQ7XFxuICBwYWRkaW5nOiAycmVtIDRyZW07XFxuICBnYXA6IDRyZW07XFxuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbC10cmFuc3ApO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19pdGVtIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgZ2FwOiAwLjVyZW07XFxuICBmb250LXNpemU6IDFyZW07XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfX2l0ZW0gaW1nIHtcXG4gIHdpZHRoOiBjYWxjKDFyZW0gKyAxdncpO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19kZXRhaWxzX19jb2x1bW4ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBnYXA6IDFyZW07XFxufVxcblxcbi5mb3JlY2FzdCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuICB3aWR0aDogMTAwJTtcXG4gIHBhZGRpbmc6IDFyZW0gMnJlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNsci1uZXV0cmFsLXRyYW5zcCk7XFxufVxcblxcbi5mb3JlY2FzdF9faXRlbSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5mb3JlY2FzdF9faXRlbSBpbWcge1xcbiAgd2lkdGg6IGNhbGMoMnJlbSArIDN2dyk7XFxufVxcblwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvbWFpbi5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBRUE7RUFDRSwrQkFBK0I7RUFDL0IsZ0RBQWdEO0VBQ2hELG1DQUFtQztFQUNuQyxhQUFhO0VBQ2IsYUFBYTtFQUNiLGFBQWE7RUFDYixhQUFhO0VBQ2IsYUFBYTtBQUNmOztBQUVBOzs7RUFHRSxTQUFTO0VBQ1QsVUFBVTtFQUNWLHNCQUFzQjtFQUN0QixnQ0FBZ0M7QUFDbEM7O0FBRUE7RUFDRSxZQUFZO0VBQ1osaUJBQWlCO0VBQ2pCLG9DQUFvQztFQUNwQyw4QkFBOEI7RUFDOUIseUJBQXlCO0FBQzNCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0Qiw2QkFBNkI7RUFDN0Isa0JBQWtCO0VBQ2xCLFlBQVk7RUFDWixpQkFBaUI7RUFDakIsa0JBQWtCO0VBQ2xCLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixNQUFNO0VBQ04sT0FBTztFQUNQLFlBQVk7RUFDWixhQUFhO0VBQ2IsV0FBVztBQUNiOztBQUVBO0VBQ0UsWUFBWTtFQUNaLGFBQWE7RUFDYixpQkFBaUI7QUFDbkI7O0FBRUE7O0VBRUUsa0JBQWtCO0VBQ2xCLFlBQVk7RUFDWixXQUFXO0VBQ1gsa0JBQWtCO0VBQ2xCLGFBQWE7RUFDYix1QkFBdUI7RUFDdkIsbUJBQW1CO0VBQ25CLFlBQVk7RUFDWixXQUFXO0VBQ1gsb0JBQW9CO0VBQ3BCLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLFlBQVk7QUFDZDs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixTQUFTO0VBQ1QsV0FBVztBQUNiOztBQUVBO0VBQ0UsVUFBVTtFQUNWLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLHNCQUFzQjtFQUN0QixtQkFBbUI7RUFDbkIsZUFBZTtFQUNmLGFBQWE7RUFDYixtQkFBbUI7RUFDbkIsOEJBQThCO0VBQzlCLFlBQVk7RUFDWixrQkFBa0I7RUFDbEIsWUFBWTtFQUNaLFdBQVc7RUFDWCxxQkFBcUI7QUFDdkI7O0FBRUE7RUFDRSxzQkFBc0I7RUFDdEIsa0JBQWtCO0VBQ2xCLGtCQUFrQjtFQUNsQixRQUFRO0VBQ1IsU0FBUztFQUNULFlBQVk7RUFDWixXQUFXO0VBQ1gsMEJBQTBCO0VBQzFCLGlDQUFpQztBQUNuQzs7QUFFQTtFQUNFLDJCQUEyQjtBQUM3Qjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixhQUFhO0VBQ2IsdUJBQXVCO0FBQ3pCOztBQUVBO0VBQ0UsVUFBVTtFQUNWLDRCQUE0QjtFQUM1QixtQkFBbUI7RUFDbkIsWUFBWTtFQUNaLHlEQUE0QztFQUM1Qyw0QkFBNEI7RUFDNUIsZ0NBQWdDO0VBQ2hDLG1DQUFtQztFQUNuQyx1QkFBdUI7RUFDdkIsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLHNCQUFzQjtFQUN0QiwwQkFBMEI7RUFDMUIsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsaUJBQWlCO0VBQ2pCLDBCQUEwQjtBQUM1Qjs7QUFFQTtFQUNFLGFBQWE7RUFDYiw2QkFBNkI7QUFDL0I7O0FBRUE7RUFDRSxhQUFhO0FBQ2Y7O0FBRUE7RUFDRSx5QkFBeUI7QUFDM0I7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIsZUFBZTtFQUNmLDBCQUEwQjtBQUM1Qjs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsdUJBQXVCO0FBQ3pCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQixrQkFBa0I7RUFDbEIsbUJBQW1CO0VBQ25CLGtCQUFrQjtFQUNsQixTQUFTO0VBQ1QscUJBQXFCO0VBQ3JCLDJDQUEyQztBQUM3Qzs7QUFFQTtFQUNFLGFBQWE7RUFDYixtQkFBbUI7RUFDbkIsV0FBVztFQUNYLGVBQWU7QUFDakI7O0FBRUE7RUFDRSx1QkFBdUI7QUFDekI7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLFNBQVM7QUFDWDs7QUFFQTtFQUNFLGFBQWE7RUFDYiw2QkFBNkI7RUFDN0IsV0FBVztFQUNYLGtCQUFrQjtFQUNsQixxQkFBcUI7RUFDckIsMkNBQTJDO0FBQzdDOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSx1QkFBdUI7QUFDekJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQGltcG9ydCB1cmwoLi9ub3JtYWxpemUuY3NzKTtcXG5cXG46cm9vdCB7XFxuICAtLWNsci1uZXV0cmFsOiBoc2woMCwgMCUsIDEwMCUpO1xcbiAgLS1jbHItbmV1dHJhbC10cmFuc3A6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xNzEpO1xcbiAgLS1mZi1wcmltYXJ5OiBcXFwiUG9wcGluc1xcXCIsIHNhbnMtc2VyaWY7XFxuICAtLWZ3LTMwMDogMzAwO1xcbiAgLS1mdy00MDA6IDQwMDtcXG4gIC0tZnctNTAwOiA1MDA7XFxuICAtLWZ3LTYwMDogNjAwO1xcbiAgLS1mdy03MDA6IDcwMDtcXG59XFxuXFxuKixcXG4qOjpiZWZvcmUsXFxuKjo6YWZ0ZXIge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICB0ZXh0LXNoYWRvdzogMnB4IDJweCA4cHggIzAwMDAwMDtcXG59XFxuXFxuYm9keSB7XFxuICB3aWR0aDogMTAwdnc7XFxuICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigyMTIsIDIwNywgMjA3KTtcXG4gIGZvbnQtZmFtaWx5OiB2YXIoLS1mZi1wcmltYXJ5KTtcXG4gIGNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbCk7XFxufVxcblxcbm1haW4ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgcGFkZGluZzogNHJlbSAycmVtO1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG59XFxuXFxuLnZpZGVvLWNvbnRhaW5lciB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgd2lkdGg6IDEwMHZ3O1xcbiAgaGVpZ2h0OiAxMDB2aDtcXG4gIHotaW5kZXg6IC01O1xcbn1cXG5cXG52aWRlbyB7XFxuICB3aWR0aDogMTAwdnc7XFxuICBoZWlnaHQ6IDEwMHZoO1xcbiAgb2JqZWN0LWZpdDogY292ZXI7XFxufVxcblxcbi51bml0QyxcXG4udW5pdEYge1xcbiAgZm9udC1zaXplOiAwLjg1cmVtO1xcbiAgaGVpZ2h0OiAxNnB4O1xcbiAgd2lkdGg6IDE2cHg7XFxuICBib3JkZXItcmFkaXVzOiA4cHg7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgY29sb3I6IGJsYWNrO1xcbiAgei1pbmRleDogMjA7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG4gIHRleHQtc2hhZG93OiBub25lO1xcbn1cXG5cXG4udW5pdEYge1xcbiAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG4uY2hlY2tib3gtY29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogM3JlbTtcXG4gIHJpZ2h0OiAzcmVtO1xcbn1cXG5cXG4uY2hlY2tib3gge1xcbiAgb3BhY2l0eTogMDtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG59XFxuXFxuLmxhYmVsIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMxMTE7XFxuICBib3JkZXItcmFkaXVzOiA1MHB4O1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICBwYWRkaW5nOiA1cHg7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBoZWlnaHQ6IDI2cHg7XFxuICB3aWR0aDogNTBweDtcXG4gIHRyYW5zZm9ybTogc2NhbGUoMS41KTtcXG59XFxuXFxuLmxhYmVsIC5iYWxsIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuICBib3JkZXItcmFkaXVzOiA1MCU7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDJweDtcXG4gIGxlZnQ6IDJweDtcXG4gIGhlaWdodDogMjJweDtcXG4gIHdpZHRoOiAyMnB4O1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7XFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4ycyBsaW5lYXI7XFxufVxcblxcbi5jaGVja2JveDpjaGVja2VkICsgLmxhYmVsIC5iYWxsIHtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgyNHB4KTtcXG59XFxuXFxuLnNlYXJjaC13cmFwcGVyIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLnNlYXJjaC13cmFwcGVyIGlucHV0IHtcXG4gIHdpZHRoOiA0MCU7XFxuICBwYWRkaW5nOiAxMHB4IDEwcHggMTBweCA0MHB4O1xcbiAgYm9yZGVyLXJhZGl1czogMnJlbTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCguLi9pbWFnZXMvbWFnbmlmeS5wbmcpO1xcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDEwcHggY2VudGVyO1xcbiAgYmFja2dyb3VuZC1zaXplOiBjYWxjKDFyZW0gKyAwLjV2dyk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gIHRleHQtc2hhZG93OiBub25lO1xcbn1cXG5cXG4uY2l0eS1pbmZvIGgxIHtcXG4gIG1hcmdpbjogMC4zcmVtIDA7XFxuICBsZXR0ZXItc3BhY2luZzogMC4xcmVtO1xcbiAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTYwMCk7XFxuICBmb250LXNpemU6IDIuNXJlbTtcXG59XFxuXFxuaDIge1xcbiAgZm9udC1zaXplOiAxLjFyZW07XFxuICBmb250LXdlaWdodDogdmFyKC0tZnctMzAwKTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfY29pbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX2NvaW50YWluZXIgaW1nIHtcXG4gIHdpZHRoOiBjYWxjKDEwcmVtICsgMTB2dyk7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfY29pbnRhaW5lciBoMSB7XFxuICBtYXJnaW46IDAuM3JlbSAwO1xcbiAgZm9udC1zaXplOiA0cmVtO1xcbiAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTQwMCk7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfdGVtcCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19kZXRhaWxzIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xcbiAgaGVpZ2h0OiBtYXgtY29udGVudDtcXG4gIHBhZGRpbmc6IDJyZW0gNHJlbTtcXG4gIGdhcDogNHJlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNsci1uZXV0cmFsLXRyYW5zcCk7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfX2l0ZW0ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBnYXA6IDAuNXJlbTtcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9faXRlbSBpbWcge1xcbiAgd2lkdGg6IGNhbGMoMXJlbSArIDF2dyk7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfX2RldGFpbHNfX2NvbHVtbiB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuLmZvcmVjYXN0IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgcGFkZGluZzogMXJlbSAycmVtO1xcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY2xyLW5ldXRyYWwtdHJhbnNwKTtcXG59XFxuXFxuLmZvcmVjYXN0X19pdGVtIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLmZvcmVjYXN0X19pdGVtIGltZyB7XFxuICB3aWR0aDogY2FsYygycmVtICsgM3Z3KTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiLyohIG5vcm1hbGl6ZS5jc3MgdjguMC4xIHwgTUlUIExpY2Vuc2UgfCBnaXRodWIuY29tL25lY29sYXMvbm9ybWFsaXplLmNzcyAqL1xcblxcbi8qIERvY3VtZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXFxuICovXFxuXFxuIGh0bWwge1xcbiAgICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcbiAgICAtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IDEwMCU7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyogU2VjdGlvbnNcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIGJvZHkge1xcbiAgICBtYXJnaW46IDA7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVuZGVyIHRoZSBgbWFpbmAgZWxlbWVudCBjb25zaXN0ZW50bHkgaW4gSUUuXFxuICAgKi9cXG4gIFxcbiAgbWFpbiB7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIGBoMWAgZWxlbWVudHMgd2l0aGluIGBzZWN0aW9uYCBhbmRcXG4gICAqIGBhcnRpY2xlYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgaDEge1xcbiAgICBmb250LXNpemU6IDJlbTtcXG4gICAgbWFyZ2luOiAwLjY3ZW0gMDtcXG4gIH1cXG4gIFxcbiAgLyogR3JvdXBpbmcgY29udGVudFxcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxcbiAgICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXFxuICAgKi9cXG4gIFxcbiAgaHIge1xcbiAgICBib3gtc2l6aW5nOiBjb250ZW50LWJveDsgLyogMSAqL1xcbiAgICBoZWlnaHQ6IDA7IC8qIDEgKi9cXG4gICAgb3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIHByZSB7XFxuICAgIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xcbiAgICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKiBUZXh0LWxldmVsIHNlbWFudGljc1xcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBvbiBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXFxuICAgKi9cXG4gIFxcbiAgYSB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIFJlbW92ZSB0aGUgYm90dG9tIGJvcmRlciBpbiBDaHJvbWUgNTctXFxuICAgKiAyLiBBZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgSUUsIE9wZXJhLCBhbmQgU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIGFiYnJbdGl0bGVdIHtcXG4gICAgYm9yZGVyLWJvdHRvbTogbm9uZTsgLyogMSAqL1xcbiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgLyogMiAqL1xcbiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIGIsXFxuICBzdHJvbmcge1xcbiAgICBmb250LXdlaWdodDogYm9sZGVyO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgY29kZSxcXG4gIGtiZCxcXG4gIHNhbXAge1xcbiAgICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG4gICAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBzbWFsbCB7XFxuICAgIGZvbnQtc2l6ZTogODAlO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFByZXZlbnQgYHN1YmAgYW5kIGBzdXBgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxcbiAgICogYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIHN1YixcXG4gIHN1cCB7XFxuICAgIGZvbnQtc2l6ZTogNzUlO1xcbiAgICBsaW5lLWhlaWdodDogMDtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxuICB9XFxuICBcXG4gIHN1YiB7XFxuICAgIGJvdHRvbTogLTAuMjVlbTtcXG4gIH1cXG4gIFxcbiAgc3VwIHtcXG4gICAgdG9wOiAtMC41ZW07XFxuICB9XFxuICBcXG4gIC8qIEVtYmVkZGVkIGNvbnRlbnRcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC5cXG4gICAqL1xcbiAgXFxuICBpbWcge1xcbiAgICBib3JkZXItc3R5bGU6IG5vbmU7XFxuICB9XFxuICBcXG4gIC8qIEZvcm1zXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICogMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbixcXG4gIGlucHV0LFxcbiAgb3B0Z3JvdXAsXFxuICBzZWxlY3QsXFxuICB0ZXh0YXJlYSB7XFxuICAgIGZvbnQtZmFtaWx5OiBpbmhlcml0OyAvKiAxICovXFxuICAgIGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xcbiAgICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcbiAgICBtYXJnaW46IDA7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cXG4gICAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXFxuICAgKi9cXG4gIFxcbiAgYnV0dG9uLFxcbiAgaW5wdXQgeyAvKiAxICovXFxuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxcbiAgICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbixcXG4gIHNlbGVjdCB7IC8qIDEgKi9cXG4gICAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBidXR0b24sXFxuICBbdHlwZT1cXFwiYnV0dG9uXFxcIl0sXFxuICBbdHlwZT1cXFwicmVzZXRcXFwiXSxcXG4gIFt0eXBlPVxcXCJzdWJtaXRcXFwiXSB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXFxuICAgKi9cXG4gIFxcbiAgYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxcbiAgW3R5cGU9XFxcImJ1dHRvblxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcbiAgW3R5cGU9XFxcInJlc2V0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuICBbdHlwZT1cXFwic3VibWl0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIge1xcbiAgICBib3JkZXItc3R5bGU6IG5vbmU7XFxuICAgIHBhZGRpbmc6IDA7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbjotbW96LWZvY3VzcmluZyxcXG4gIFt0eXBlPVxcXCJidXR0b25cXFwiXTotbW96LWZvY3VzcmluZyxcXG4gIFt0eXBlPVxcXCJyZXNldFxcXCJdOi1tb3otZm9jdXNyaW5nLFxcbiAgW3R5cGU9XFxcInN1Ym1pdFxcXCJdOi1tb3otZm9jdXNyaW5nIHtcXG4gICAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gICAqL1xcbiAgXFxuICBmaWVsZHNldCB7XFxuICAgIHBhZGRpbmc6IDAuMzVlbSAwLjc1ZW0gMC42MjVlbTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxcbiAgICogMi4gQ29ycmVjdCB0aGUgY29sb3IgaW5oZXJpdGFuY2UgZnJvbSBgZmllbGRzZXRgIGVsZW1lbnRzIGluIElFLlxcbiAgICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxcbiAgICogICAgYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgbGVnZW5kIHtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xcbiAgICBjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xcbiAgICBkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xcbiAgICBtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cXG4gICAgcGFkZGluZzogMDsgLyogMyAqL1xcbiAgICB3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cXG4gICAqL1xcbiAgXFxuICBwcm9ncmVzcyB7XFxuICAgIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cXG4gICAqL1xcbiAgXFxuICB0ZXh0YXJlYSB7XFxuICAgIG92ZXJmbG93OiBhdXRvO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxcbiAgICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxcbiAgICovXFxuICBcXG4gIFt0eXBlPVxcXCJjaGVja2JveFxcXCJdLFxcbiAgW3R5cGU9XFxcInJhZGlvXFxcIl0ge1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuICAgIHBhZGRpbmc6IDA7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXFxuICAgKi9cXG4gIFxcbiAgW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxcbiAgW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXG4gICAgaGVpZ2h0OiBhdXRvO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxcbiAgICogMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgW3R5cGU9XFxcInNlYXJjaFxcXCJdIHtcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi9cXG4gICAgb3V0bGluZS1vZmZzZXQ6IC0ycHg7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXFxuICAgKi9cXG4gIFxcbiAgW3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICAgKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIGBpbmhlcml0YCBpbiBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXFxuICAgIGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyogSW50ZXJhY3RpdmVcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxcbiAgICovXFxuICBcXG4gIGRldGFpbHMge1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG4gIH1cXG4gIFxcbiAgLypcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBzdW1tYXJ5IHtcXG4gICAgZGlzcGxheTogbGlzdC1pdGVtO1xcbiAgfVxcbiAgXFxuICAvKiBNaXNjXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cXG4gICAqL1xcbiAgXFxuICB0ZW1wbGF0ZSB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXFxuICAgKi9cXG4gIFxcbiAgW2hpZGRlbl0ge1xcbiAgICBkaXNwbGF5OiBub25lO1xcbiAgfVwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvbm9ybWFsaXplLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSwyRUFBMkU7O0FBRTNFOytFQUMrRTs7QUFFL0U7OztFQUdFOztDQUVEO0lBQ0csaUJBQWlCLEVBQUUsTUFBTTtJQUN6Qiw4QkFBOEIsRUFBRSxNQUFNO0VBQ3hDOztFQUVBO2lGQUMrRTs7RUFFL0U7O0lBRUU7O0VBRUY7SUFDRSxTQUFTO0VBQ1g7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSxjQUFjO0VBQ2hCOztFQUVBOzs7SUFHRTs7RUFFRjtJQUNFLGNBQWM7SUFDZCxnQkFBZ0I7RUFDbEI7O0VBRUE7aUZBQytFOztFQUUvRTs7O0lBR0U7O0VBRUY7SUFDRSx1QkFBdUIsRUFBRSxNQUFNO0lBQy9CLFNBQVMsRUFBRSxNQUFNO0lBQ2pCLGlCQUFpQixFQUFFLE1BQU07RUFDM0I7O0VBRUE7OztJQUdFOztFQUVGO0lBQ0UsaUNBQWlDLEVBQUUsTUFBTTtJQUN6QyxjQUFjLEVBQUUsTUFBTTtFQUN4Qjs7RUFFQTtpRkFDK0U7O0VBRS9FOztJQUVFOztFQUVGO0lBQ0UsNkJBQTZCO0VBQy9COztFQUVBOzs7SUFHRTs7RUFFRjtJQUNFLG1CQUFtQixFQUFFLE1BQU07SUFDM0IsMEJBQTBCLEVBQUUsTUFBTTtJQUNsQyxpQ0FBaUMsRUFBRSxNQUFNO0VBQzNDOztFQUVBOztJQUVFOztFQUVGOztJQUVFLG1CQUFtQjtFQUNyQjs7RUFFQTs7O0lBR0U7O0VBRUY7OztJQUdFLGlDQUFpQyxFQUFFLE1BQU07SUFDekMsY0FBYyxFQUFFLE1BQU07RUFDeEI7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSxjQUFjO0VBQ2hCOztFQUVBOzs7SUFHRTs7RUFFRjs7SUFFRSxjQUFjO0lBQ2QsY0FBYztJQUNkLGtCQUFrQjtJQUNsQix3QkFBd0I7RUFDMUI7O0VBRUE7SUFDRSxlQUFlO0VBQ2pCOztFQUVBO0lBQ0UsV0FBVztFQUNiOztFQUVBO2lGQUMrRTs7RUFFL0U7O0lBRUU7O0VBRUY7SUFDRSxrQkFBa0I7RUFDcEI7O0VBRUE7aUZBQytFOztFQUUvRTs7O0lBR0U7O0VBRUY7Ozs7O0lBS0Usb0JBQW9CLEVBQUUsTUFBTTtJQUM1QixlQUFlLEVBQUUsTUFBTTtJQUN2QixpQkFBaUIsRUFBRSxNQUFNO0lBQ3pCLFNBQVMsRUFBRSxNQUFNO0VBQ25COztFQUVBOzs7SUFHRTs7RUFFRjtVQUNRLE1BQU07SUFDWixpQkFBaUI7RUFDbkI7O0VBRUE7OztJQUdFOztFQUVGO1dBQ1MsTUFBTTtJQUNiLG9CQUFvQjtFQUN0Qjs7RUFFQTs7SUFFRTs7RUFFRjs7OztJQUlFLDBCQUEwQjtFQUM1Qjs7RUFFQTs7SUFFRTs7RUFFRjs7OztJQUlFLGtCQUFrQjtJQUNsQixVQUFVO0VBQ1o7O0VBRUE7O0lBRUU7O0VBRUY7Ozs7SUFJRSw4QkFBOEI7RUFDaEM7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSw4QkFBOEI7RUFDaEM7O0VBRUE7Ozs7O0lBS0U7O0VBRUY7SUFDRSxzQkFBc0IsRUFBRSxNQUFNO0lBQzlCLGNBQWMsRUFBRSxNQUFNO0lBQ3RCLGNBQWMsRUFBRSxNQUFNO0lBQ3RCLGVBQWUsRUFBRSxNQUFNO0lBQ3ZCLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLG1CQUFtQixFQUFFLE1BQU07RUFDN0I7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSx3QkFBd0I7RUFDMUI7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSxjQUFjO0VBQ2hCOztFQUVBOzs7SUFHRTs7RUFFRjs7SUFFRSxzQkFBc0IsRUFBRSxNQUFNO0lBQzlCLFVBQVUsRUFBRSxNQUFNO0VBQ3BCOztFQUVBOztJQUVFOztFQUVGOztJQUVFLFlBQVk7RUFDZDs7RUFFQTs7O0lBR0U7O0VBRUY7SUFDRSw2QkFBNkIsRUFBRSxNQUFNO0lBQ3JDLG9CQUFvQixFQUFFLE1BQU07RUFDOUI7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSx3QkFBd0I7RUFDMUI7O0VBRUE7OztJQUdFOztFQUVGO0lBQ0UsMEJBQTBCLEVBQUUsTUFBTTtJQUNsQyxhQUFhLEVBQUUsTUFBTTtFQUN2Qjs7RUFFQTtpRkFDK0U7O0VBRS9FOztJQUVFOztFQUVGO0lBQ0UsY0FBYztFQUNoQjs7RUFFQTs7SUFFRTs7RUFFRjtJQUNFLGtCQUFrQjtFQUNwQjs7RUFFQTtpRkFDK0U7O0VBRS9FOztJQUVFOztFQUVGO0lBQ0UsYUFBYTtFQUNmOztFQUVBOztJQUVFOztFQUVGO0lBQ0UsYUFBYTtFQUNmXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cXG5cXG4vKiBEb2N1bWVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxcbiAqL1xcblxcbiBodG1sIHtcXG4gICAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXG4gICAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qIFNlY3Rpb25zXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBib2R5IHtcXG4gICAgbWFyZ2luOiAwO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlbmRlciB0aGUgYG1haW5gIGVsZW1lbnQgY29uc2lzdGVudGx5IGluIElFLlxcbiAgICovXFxuICBcXG4gIG1haW4ge1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBgaDFgIGVsZW1lbnRzIHdpdGhpbiBgc2VjdGlvbmAgYW5kXFxuICAgKiBgYXJ0aWNsZWAgY29udGV4dHMgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIGgxIHtcXG4gICAgZm9udC1zaXplOiAyZW07XFxuICAgIG1hcmdpbjogMC42N2VtIDA7XFxuICB9XFxuICBcXG4gIC8qIEdyb3VwaW5nIGNvbnRlbnRcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gRmlyZWZveC5cXG4gICAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxcbiAgICovXFxuICBcXG4gIGhyIHtcXG4gICAgYm94LXNpemluZzogY29udGVudC1ib3g7IC8qIDEgKi9cXG4gICAgaGVpZ2h0OiAwOyAvKiAxICovXFxuICAgIG92ZXJmbG93OiB2aXNpYmxlOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gICAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBwcmUge1xcbiAgICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG4gICAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxcbiAgICovXFxuICBcXG4gIGEge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxcbiAgICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBhYmJyW3RpdGxlXSB7XFxuICAgIGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBiLFxcbiAgc3Ryb25nIHtcXG4gICAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIGNvZGUsXFxuICBrYmQsXFxuICBzYW1wIHtcXG4gICAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxuICAgIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgc21hbGwge1xcbiAgICBmb250LXNpemU6IDgwJTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBQcmV2ZW50IGBzdWJgIGFuZCBgc3VwYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cXG4gICAqIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBzdWIsXFxuICBzdXAge1xcbiAgICBmb250LXNpemU6IDc1JTtcXG4gICAgbGluZS1oZWlnaHQ6IDA7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbiAgfVxcbiAgXFxuICBzdWIge1xcbiAgICBib3R0b206IC0wLjI1ZW07XFxuICB9XFxuICBcXG4gIHN1cCB7XFxuICAgIHRvcDogLTAuNWVtO1xcbiAgfVxcbiAgXFxuICAvKiBFbWJlZGRlZCBjb250ZW50XFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXFxuICAgKi9cXG4gIFxcbiAgaW1nIHtcXG4gICAgYm9yZGVyLXN0eWxlOiBub25lO1xcbiAgfVxcbiAgXFxuICAvKiBGb3Jtc1xcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cXG4gICAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBidXR0b24sXFxuICBpbnB1dCxcXG4gIG9wdGdyb3VwLFxcbiAgc2VsZWN0LFxcbiAgdGV4dGFyZWEge1xcbiAgICBmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xcbiAgICBmb250LXNpemU6IDEwMCU7IC8qIDEgKi9cXG4gICAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXG4gICAgbWFyZ2luOiAwOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogU2hvdyB0aGUgb3ZlcmZsb3cgaW4gSUUuXFxuICAgKiAxLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlLlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbixcXG4gIGlucHV0IHsgLyogMSAqL1xcbiAgICBvdmVyZmxvdzogdmlzaWJsZTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cXG4gICAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cXG4gICAqL1xcbiAgXFxuICBidXR0b24sXFxuICBzZWxlY3QgeyAvKiAxICovXFxuICAgIHRleHQtdHJhbnNmb3JtOiBub25lO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgYnV0dG9uLFxcbiAgW3R5cGU9XFxcImJ1dHRvblxcXCJdLFxcbiAgW3R5cGU9XFxcInJlc2V0XFxcIl0sXFxuICBbdHlwZT1cXFwic3VibWl0XFxcIl0ge1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcXG4gIFt0eXBlPVxcXCJidXR0b25cXFwiXTo6LW1vei1mb2N1cy1pbm5lcixcXG4gIFt0eXBlPVxcXCJyZXNldFxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcbiAgW3R5cGU9XFxcInN1Ym1pdFxcXCJdOjotbW96LWZvY3VzLWlubmVyIHtcXG4gICAgYm9yZGVyLXN0eWxlOiBub25lO1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cXG4gICAqL1xcbiAgXFxuICBidXR0b246LW1vei1mb2N1c3JpbmcsXFxuICBbdHlwZT1cXFwiYnV0dG9uXFxcIl06LW1vei1mb2N1c3JpbmcsXFxuICBbdHlwZT1cXFwicmVzZXRcXFwiXTotbW96LWZvY3VzcmluZyxcXG4gIFt0eXBlPVxcXCJzdWJtaXRcXFwiXTotbW96LWZvY3VzcmluZyB7XFxuICAgIG91dGxpbmU6IDFweCBkb3R0ZWQgQnV0dG9uVGV4dDtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXFxuICAgKi9cXG4gIFxcbiAgZmllbGRzZXQge1xcbiAgICBwYWRkaW5nOiAwLjM1ZW0gMC43NWVtIDAuNjI1ZW07XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cXG4gICAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBJRS5cXG4gICAqIDMuIFJlbW92ZSB0aGUgcGFkZGluZyBzbyBkZXZlbG9wZXJzIGFyZSBub3QgY2F1Z2h0IG91dCB3aGVuIHRoZXkgemVybyBvdXRcXG4gICAqICAgIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIGxlZ2VuZCB7XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cXG4gICAgY29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cXG4gICAgZGlzcGxheTogdGFibGU7IC8qIDEgKi9cXG4gICAgbWF4LXdpZHRoOiAxMDAlOyAvKiAxICovXFxuICAgIHBhZGRpbmc6IDA7IC8qIDMgKi9cXG4gICAgd2hpdGUtc3BhY2U6IG5vcm1hbDsgLyogMSAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXFxuICAgKi9cXG4gIFxcbiAgcHJvZ3Jlc3Mge1xcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXFxuICAgKi9cXG4gIFxcbiAgdGV4dGFyZWEge1xcbiAgICBvdmVyZmxvdzogYXV0bztcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cXG4gICAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC5cXG4gICAqL1xcbiAgXFxuICBbdHlwZT1cXFwiY2hlY2tib3hcXFwiXSxcXG4gIFt0eXBlPVxcXCJyYWRpb1xcXCJdIHtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xcbiAgICBwYWRkaW5nOiAwOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxcbiAgICovXFxuICBcXG4gIFt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcXG4gIFt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XFxuICAgIGhlaWdodDogYXV0bztcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cXG4gICAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIFt0eXBlPVxcXCJzZWFyY2hcXFwiXSB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXFxuICAgIG91dGxpbmUtb2Zmc2V0OiAtMnB4OyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxcbiAgICovXFxuICBcXG4gIFt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiAgICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBgaW5oZXJpdGAgaW4gU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIDo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xcbiAgICBmb250OiBpbmhlcml0OyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qIEludGVyYWN0aXZlXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gRWRnZSwgSUUgMTArLCBhbmQgRmlyZWZveC5cXG4gICAqL1xcbiAgXFxuICBkZXRhaWxzIHtcXG4gICAgZGlzcGxheTogYmxvY2s7XFxuICB9XFxuICBcXG4gIC8qXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgc3VtbWFyeSB7XFxuICAgIGRpc3BsYXk6IGxpc3QtaXRlbTtcXG4gIH1cXG4gIFxcbiAgLyogTWlzY1xcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXFxuICAgKi9cXG4gIFxcbiAgdGVtcGxhdGUge1xcbiAgICBkaXNwbGF5OiBub25lO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxcbiAgICovXFxuICBcXG4gIFtoaWRkZW5dIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG4gIH1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107IC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblxuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG5cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG5cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcblxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9OyAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXG5cbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cblxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcblxuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuXG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgaWYgKCF1cmwpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgdXJsID0gU3RyaW5nKHVybC5fX2VzTW9kdWxlID8gdXJsLmRlZmF1bHQgOiB1cmwpOyAvLyBJZiB1cmwgaXMgYWxyZWFkeSB3cmFwcGVkIGluIHF1b3RlcywgcmVtb3ZlIHRoZW1cblxuICBpZiAoL15bJ1wiXS4qWydcIl0kLy50ZXN0KHVybCkpIHtcbiAgICB1cmwgPSB1cmwuc2xpY2UoMSwgLTEpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuaGFzaCkge1xuICAgIHVybCArPSBvcHRpb25zLmhhc2g7XG4gIH0gLy8gU2hvdWxkIHVybCBiZSB3cmFwcGVkP1xuICAvLyBTZWUgaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzcy12YWx1ZXMtMy8jdXJsc1xuXG5cbiAgaWYgKC9bXCInKCkgXFx0XFxuXXwoJTIwKS8udGVzdCh1cmwpIHx8IG9wdGlvbnMubmVlZFF1b3Rlcykge1xuICAgIHJldHVybiBcIlxcXCJcIi5jb25jYXQodXJsLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKS5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKSwgXCJcXFwiXCIpO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgdmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiBcIi8qIyBzb3VyY2VVUkw9XCIuY29uY2F0KGNzc01hcHBpbmcuc291cmNlUm9vdCB8fCBcIlwiKS5jb25jYXQoc291cmNlLCBcIiAqL1wiKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbWFpbi5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL21haW4uY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuXG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcblxuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cblxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG5cbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG5cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG5cbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG5cbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG5cbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpOyAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG5cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG5cbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG5cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuXG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG5cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cblxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cblxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcblxuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG5cbiAgY3NzICs9IG9iai5jc3M7XG5cbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9IC8vIEZvciBvbGQgSUVcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG5cblxuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cblxuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmNcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSBzY3JpcHRVcmwgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV0uc3JjXG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsIl9fd2VicGFja19yZXF1aXJlX18uYiA9IGRvY3VtZW50LmJhc2VVUkkgfHwgc2VsZi5sb2NhdGlvbi5ocmVmO1xuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG4vLyBubyBvbiBjaHVua3MgbG9hZGVkXG5cbi8vIG5vIGpzb25wIGZ1bmN0aW9uIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgXCIuLi9zdHlsZXMvbWFpbi5jc3NcIjtcblxuaW1wb3J0IE1haW5Nb2RlbCBmcm9tIFwiLi9tb2RlbHMvbWFpbk1vZGVsXCI7XG5pbXBvcnQgTWFpblZpZXcgZnJvbSBcIi4vdmlld3MvbWFpblZpZXdcIjtcbmltcG9ydCBNYWluQ29udHJvbGxlciBmcm9tIFwiLi9jb250cm9sbGVycy9tYWluQ29udHJvbGxlclwiO1xuXG5jb25zdCBtb2RlbCA9IG5ldyBNYWluTW9kZWwoKTtcbmNvbnN0IHZpZXcgPSBuZXcgTWFpblZpZXcoKTtcbmNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgTWFpbkNvbnRyb2xsZXIobW9kZWwsIHZpZXcpO1xuIl0sIm5hbWVzIjpbIk1haW5Db250cm9sbGVyIiwiY29uc3RydWN0b3IiLCJtb2RlbCIsInZpZXciLCJjaXR5IiwidW5pdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImNhbGxGdW5jIiwidmFsdWUiLCJjaGVja0lmRW50ZXIiLCJ3aW5kb3ciLCJjaGFuZ2VUZW1wZXJhdHVyZSIsInBsYXliYWNrUmF0ZSIsImNpdHlJbmZvIiwiZ2V0Q2l0eUluZm8iLCJjdXJyZW50V2VhdGhlciIsImdldEN1cnJlbnRXZWF0aGVyIiwiZm9yZWNhc3RXZWF0aGVyIiwiZ2V0Rm9yZWNhc3RXZWF0aGVyIiwiYXBwZW5kQ2l0eUluZm8iLCJhcHBlbmRDdXJyZW50V2VhdGhlciIsImFwcGVuZEZvcmVjYXN0V2VhdGhlciIsImtleSIsImJsdXIiLCJjdXJyZW50VGFyZ2V0IiwiY2hlY2tlZCIsImNoYW5nZVVuaXRUZW1wIiwiQVBJcyIsInVybEdlbmVyYXRvciIsIlVybEdlbmVyYXRvciIsImdldEdlb0Nvb3JkaW5hdGVzIiwidXJsIiwiZ2VuZXJhdGVHZW9Db29yZHNVcmwiLCJyZXNwb25zZSIsImZldGNoIiwibW9kZSIsImdlb2NvZGluZ0RhdGEiLCJqc29uIiwibGF0IiwibG9uIiwiZ2V0Q3VycmVudFdlYXRoZXJEYXRhIiwiZ2VuZXJhdGVDdXJyZW50V2VhdGhlclVybCIsIndlYXRoZXJEYXRhIiwiZ2V0Rm9yZWNhc3RXZWF0aGVyRGF0YSIsImdlbmVyYXRlRm9yZWNhc3RXZWF0aGVyVXJsIiwiZm9yZWNhc3REYXRhIiwiYXBwSWQiLCJiYXNlVXJsIiwiQ2l0eUluZm8iLCJBcGlEYXRhIiwiY2l0eURlc2NyaXB0aW9uIiwiY3JlYXRlQ2l0eURlc2NyaXB0aW9uIiwiZGF0ZURlc2NyaXB0aW9uIiwiY3JlYXRlRGF0ZURlc2NyaXB0aW9uIiwibmFtZSIsImNvdW50cnkiLCJzeXMiLCJkYXkiLCJnZXREYXkiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJ3ZWVrZGF5IiwiZCIsIkRhdGUiLCJtb250aE5hbWVzIiwiQ3VycmVudFdlYXRoZXIiLCJjdXJyZW50V2VhdGhlckRhdGEiLCJ0ZW1wZXJhdHVyZSIsImdldFRlbXBlcmF0dXJlIiwiTWF0aCIsInJvdW5kIiwibWFpbiIsInRlbXAiLCJmZWVsc0xpa2VUZW1wIiwiZmVlbHNfbGlrZSIsImh1bWlkaXR5Iiwid2luZFNwZWVkIiwid2luZCIsInNwZWVkIiwicHJlc3N1cmUiLCJzdW5yaXNlIiwiY29udmVydFRvU2VhcmNoZWRDaXR5VGltZSIsInRpbWV6b25lIiwic3Vuc2V0Iiwid2VhdGhlckNvbmRpdGlvbkRlc2MiLCJ3ZWF0aGVyIiwiZGVzY3JpcHRpb24iLCJ3ZWF0aGVyQ29uZGl0aW9uSW1nIiwiZ2V0V2VhdGhlckNvbmRpdGlvbkltZyIsImJhY2tncm91bmRWaWRlbyIsImdldEJhY2tncm91bmRWaWRlb0xpbmsiLCJkZWdyZWUiLCJjb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlIiwidW5peFRpbWUiLCJsb2NhbERhdGUiLCJ1dGNVbml4VGltZSIsImdldFRpbWUiLCJnZXRUaW1lem9uZU9mZnNldCIsInVuaXhUaW1lSW5TZWFyY2hlZENpdHkiLCJkYXRlSW5TZWFyY2hlZENpdHkiLCJob3VycyIsImdldEhvdXJzIiwibWludXRlcyIsImdldE1pbnV0ZXMiLCJmb3JtYXR0ZWRUaW1lIiwic3Vic3RyIiwic3VucmlzZVVuaXgiLCJzdW5zZXRVbml4IiwibWlzdEVxdWl2YWxlbnRlcyIsImluY2x1ZGVzIiwiY3VycmVudERhdGUiLCJzdW5yaXNlRGF0ZSIsInN1bnNldERhdGUiLCJ3ZWF0aGVyQ29uZGl0aW9uIiwidmlkZW9MaW5rcyIsIkNsZWFyRGF5IiwiQ2xlYXJOaWdodCIsIkNsb3VkcyIsIk1pc3QiLCJSYWluIiwiU25vdyIsIlRodW5kZXJzdG9ybSIsIkZvcmVjYXN0V2VhdGhlciIsImZvcmVjYXN0V2VhdGhlckRhdGEiLCJ0ZW1wZXJhdHVyZXMiLCJnZXRUZW1wZXJhdHVyZXMiLCJnZXRXZWF0aGVyQ29uZGl0aW9ucyIsInRpbWUiLCJnZXRUaW1lcyIsImxpc3QiLCJmb3JFYWNoIiwiaXRlbSIsInRlbXBXaXRoVW5pdCIsImdldFRlbXBlcmF0dXJlVW5pdCIsInB1c2giLCJjdXJyZW50SG91ciIsInN1bnJpc2VIb3VyIiwic3Vuc2V0SG91ciIsImNvbmQiLCJkdCIsInRpbWVzIiwiTWFpbk1vZGVsIiwiZGF0YSIsIkNpdHlJbmZvVmlldyIsImVsZW1lbnQiLCJjaXR5SW5mb01vZGVsIiwicXVlcnlTZWxlY3RvciIsInRleHRDb250ZW50IiwiQ3VycmVudFdlYXRoZXJWaWV3IiwiY3VycmVudFdlYXRoZXJNb2RlbCIsIm5vd1dlYXRoZXJDb25kaXRpb24iLCJub3dUZW1wZXJhdHVyZSIsInNyYyIsImZvcmVjYXN0V2VhdGhlclZpZXciLCJmb3JlY2FzdFdlYXRoZXJNb2RlbCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpIiwibGVuZ3RoIiwiRm9yZWNhc3RXZWF0aGVyVmlldyIsIk1haW5WaWV3Iiwic3R5bGUiLCJjb2xvciIsImNvbnRyb2xsZXIiXSwic291cmNlUm9vdCI6IiJ9
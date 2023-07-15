/*
 * @Descripttion: 本地缓存
 * @version:
 * @Author: lzy
 * @Date: 2023-07-15 20:52:04
 * @LastEditors: lzy
 * @LastEditTime: 2023-07-15 21:00:21
 */
import secure from "./secureUtil";
const isJSON = (str) => {
  if (typeof str == "string") {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
};
/**
 * @name: 获取某日时间戳
 * @param {Number} dayCount 几天后的时间戳
 * @return {*}
 */
const getDateStr = function (dayCount) {
  let dd = new Date();
  dd.setDate(dd.getDate() + dayCount);
  let time = dd.getTime();
  return time;
};

/**
 * 对sessionStorage操作
 */
export const _setSessionStore = (key, value, type) => {
  if (!key) return;
  if (type === "JSONStr") {
    value = JSON.stringify(value);
  }
  sessionStorage.setItem(key, value);
};

export const _getSessionStore = (key, type) => {
  if (!sessionStorage.getItem(key)) {
    return;
  }
  if (type === "JSONStr") {
    return JSON.parse(sessionStorage.getItem(key));
  } else {
    return sessionStorage.getItem(key);
  }
};

export const _removeSessionStore = (key) => {
  if (!key) return;
  sessionStorage.removeItem(key);
};

/**
 * 对localStorage操作
 */
/**
 * @name: 设置localStorage
 * @param {String} key localStorage的key
 * @param {String} value localStorage的value
 * @param {Number} dayCount 设置有效期 默认7天
 * @param {Boolean} isSecure 是否加密
 */
export const _setLocalStore = (key, value, dayCount = 7, isSecure) => {
  if (!key) return;
  let expires = getDateStr(dayCount);
  if (isSecure) {
    value =
      typeof value == "object"
        ? secure.encrypt(JSON.stringify(value))
        : secure.encrypt(value);
  }
  let obj = {
    expires,
    value,
  };
  let setValue = JSON.stringify(obj);

  localStorage.setItem(key, setValue);
};
/**
 * @name: 获取localStorage
 * @param {String} key localStorage的key
 * @param {Boolean} isSecure 是否加密
 * @return {*}
 */
export const _getLocalStore = (key, isSecure) => {
  let storageString = localStorage.getItem(key);
  if (!storageString) {
    return null;
  }
  try {
    let [storageObj, nowTime] = [
      JSON.parse(storageString),
      new Date().getTime(),
    ];
    if (storageObj.expires && storageObj.expires < nowTime) {
      _removeLocalStore(key);
      return null;
    }
    let res = storageObj.value || storageString;
    if (isSecure) {
      res = secure.decrypt(res);
    }
    res = isJSON(res) ? JSON.parse(res) : res;
    return res;
  } catch (error) {
    console.log(error);
    return storageString;
  }
};
export const _removeLocalStore = (key) => {
  if (!key) return;
  localStorage.removeItem(key);
};

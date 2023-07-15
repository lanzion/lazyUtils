/*
 * @Descripttion: 加密
 * @version:
 * @Author: lzy
 * @Date: 2023-07-15 20:55:04
 * @LastEditors: lzy
 * @LastEditTime: 2023-07-15 20:56:04
 */
import CryptoJS from "crypto-js";
const key = CryptoJS.enc.Utf8.parse("1911120914ABCDEF"); //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse("ABCDEF1911120914"); //十六位十六进制数作为密钥偏移量
export default {
  /**
   * @name: 加密
   * @param {String} word 需要加密的的字符串
   * @param {String} keyStr 对加密的秘钥
   * @return {String} 加密的密文
   */
  encrypt(word) {
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString().toUpperCase();
  },
  /**
   * @name: 解密
   * @param {String} word 需要解密的字符串
   * @param {String} keyStr 秘钥
   * @return {String} 解密明文
   */
  decrypt(word) {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  },
};

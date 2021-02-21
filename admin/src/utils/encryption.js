import CryptoJS from 'crypto-js';
/**
 * 加密解密
 *
 * @type {string}
 */
// const key = '*1smurfs*';
const key = 'jgtl99@JGTl20209';
// const key = '1234567890123456';
// 偏移量
const iv = '1234567890123456';

// export function getKey() {
//   //真正的key
//   return CryptoJS.SHA1(CryptoJS.SHA1(key)).toString().substring(0, 32);
// }
export function getKey() {
  // 真正的key
  return CryptoJS.enc.Utf8.parse(key);
}

export function getIv() {
  // 真正的iv
  return CryptoJS.enc.Utf8.parse(iv);
}

export default function encrypt(data) {
  // console.log(getKey(key));
  // let encrypt = CryptoJS.AES.encrypt(data, CryptoJS.enc.Hex.parse(getKey(key)), {
  //   mode: CryptoJS.mode.ECB,
  //   padding: CryptoJS.pad.Pkcs7
  // })
  // const message = CryptoJS.enc.Utf8.parse(data);
  var ciphertext = CryptoJS.AES.encrypt(data, getKey(), {
    iv: getIv(),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return ciphertext.toString();
  // return CryptoJS.AES.encrypt(data, getKey(), { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString();
}

export function decrypt(data) {
  var bytes = CryptoJS.AES.decrypt(data.toString(), getKey(), {
    iv: getIv(),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return bytes.toString(CryptoJS.enc.Utf8);
  // const decrypt = CryptoJS.AES.decrypt(data, getKey(key), {
  //   mode: CryptoJS.mode.ECB,
  //   padding: CryptoJS.pad.Pkcs7
  // });
  // return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

// export function decrypt(data) {
//   let decrypt = CryptoJS.AES.decrypt({
//     ciphertext: CryptoJS.enc.Base64.parse(data)
//   }, CryptoJS.enc.Hex.parse(getKey(key)), {
//     mode: CryptoJS.mode.ECB,
//     padding: CryptoJS.pad.Pkcs7
//   })
//   return decrypt.toString(CryptoJS.enc.Utf8);
// }

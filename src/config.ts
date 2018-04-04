import { ENV } from '@app/env';

const serverUrl = 'http://47.100.16.77:7003/';
console.log('ENV:', ENV.mode);
// if (ENV.mode === 'prod') {
//     serverUrl = 'http://47.100.16.77:7001/';
// } else {
//     serverUrl = 'http://192.168.3.223:7001/';
// }
export const baseUrl = serverUrl;

export const chatSocketUrl = serverUrl + 'chat';
export const tomatoSocketUrl = serverUrl + 'tomatobang';

import { environment } from '@app/env';

console.log('ENV:', environment.mode);
console.log('ENV serverUrl:', environment.serverUrl);
export const baseUrl = environment.serverUrl;
export const qiniuDomain = '';
export const chatSocketUrl = environment.serverUrl + 'chat';
export const tomatoSocketUrl = environment.serverUrl + 'tomatobang';




import { ENV } from '@app/env'

let serverUrl = "http://localhost:7001/";
console.log('ENV:',ENV.mode);
if (ENV.mode === 'prod') {
    serverUrl = "http://47.100.16.77:7001/";
} else {
    serverUrl = "http://47.100.16.77:7001/";
}
export const baseUrl = serverUrl;
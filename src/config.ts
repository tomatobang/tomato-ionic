import { ENV } from '@app/env'

let serverUrl = "http://localhost:7001/";
console.log('ENV:',ENV.mode);
if (ENV.mode === 'prod') {
    serverUrl = "http://115.29.51.196:7001/";
} else {
    serverUrl = "http://localhost:7001/";
}
export const baseUrl = serverUrl;
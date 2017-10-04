import * as jwt from 'jsonwebtoken'
import axios, {AxiosRequestConfig, AxiosInstance} from 'axios'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import {Observable} from 'rxjs'

const makeUrl = segment => `https://api.github.com/${segment}`

export type AuthClient = AxiosInstance;

const createAuthClient = (token:string) => {
  return axios.create({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.machine-man-preview+json'
    }
  });
}

export function getAppClient():Observable<AxiosInstance>{
  return getAppAuthToken()
    .map(createAuthClient);
}

let client:any;

export function getNextPage(linksHeader = '') {
  console.log('linksheader', linksHeader);
  const links = linksHeader.split(/\s*,\s*/);
  const nextPage = links.reduce((nextUrl, link) => {
    if (link.search(/rel="next"/) !== -1) {
      return (link.match(/<(.*)>/) || [])[1];
    }
    return nextUrl;
  }, undefined);

  return nextPage;
}

function generateJWT(key, appId){
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now,
    exp: now + (5 * 60),
    iss: appId
  }
  return jwt.sign(payload, key, { algorithm: 'RS256' });

}

// function createAuthClient(token){
//    console.log('creating auth client with token',token );
//    const client =
//   return {
//     get(url){
//       return client.get(url)

//         .then(res => res.data)
//     },
//     async getAll(url, selectorFn = x => x){
//       const {headers, data} = await client.get(url);
//       let responseData = [];
//       let nextPage = getNextPage(headers.link);
//       while(nextPage){
//         const {headers, data} = await client.get(nextPage);
//         nextPage = getNextPage(headers.link);
//         responseData = Array.prototype.push.apply(responseData, selectorFn(data))
//       }
//       return responseData;
//     },
//     post(url, data){
//       return client.post(url, data).then(res => res.data);
//     }
//   };
// }

export function getAppAuthToken():Observable<string>{
  const key = functions.config().github.key;
  const app_id = functions.config().github.app_id;
  return Observable.of(generateJWT(key, app_id));
}


export function getInstallationClient(installationId):Observable<AuthClient>{
  return getAppClient()
    .switchMap(appClient =>
      appClient.post(makeUrl(`installations/${installationId}/access_tokens`)),
      (req, res) => createAuthClient(res.data.token)
    );
}







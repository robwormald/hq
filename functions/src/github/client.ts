import * as jwt from 'jsonwebtoken'
import axios from 'axios'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

const makeUrl = segment => `https://api.github.com/${segment}`

let client:any;

function getNextPage(linksHeader = '') {
  const links = linksHeader.split(/\s*,\s*/); // splits and strips the urls
  return links.reduce((nextUrl, link) => {
    if (link.search(/rel="next"/) !== -1) {
      return (link.match(/<(.*)>/) || [])[1];
    }
    return nextUrl;
  }, undefined);
}

function generateJWT(key){
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now,
    exp: now + (5 * 60),
    iss: 4270
  }
  return jwt.sign(payload, key, { algorithm: 'RS256' });

}

function createAuthClient(token){
   console.log('creating auth client with token',token );
   const client = axios.create({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.machine-man-preview+json'
    }
  });
  return {
    get(url){
      return client.get(url)

        .then(res => res.data)
    },
    async getAll(url, selectorFn = x => x){
      const {headers, data} = await client.get(url);
      let responseData = [];
      let nextPage = getNextPage(headers.link);
      while(nextPage){
        const {headers, data} = await client.get(nextPage);
        nextPage = getNextPage(headers.link);
        responseData = Array.prototype.push.apply(responseData, selectorFn(data))
      }
      return responseData;
    },
    post(url, data){
      return client.post(url, data).then(res => res.data);
    }
  };
}

export function getGithubAppClient(){
  if(!client){
    const key = functions.config().github.key;
    const token = generateJWT(key);
    client = createAuthClient(token);
  }
  return client;
}


export async function getGithubInstallationClient(installationId){
  const appClient = getGithubAppClient();
  const {token} = await appClient.post(makeUrl(`installations/${installationId}/access_tokens`));
  console.log('install token data', token);
  return createAuthClient(token);
}



import * as jwt from 'jsonwebtoken'
import axios from 'axios'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

const makeUrl = segment => `https://api.github.com/${segment}`

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
  return client;
}

export function getGithubAppClient(){
  const key = functions.config().github.key;
  const token = generateJWT(key);
  return createAuthClient(token);
}


export async function getGithubInstallationClient(installationId){
  const appClient = getGithubAppClient();
  const {data} = await appClient.post(makeUrl(`installations/${installationId}/access_tokens`));
  console.log('install token data', data);
  return createAuthClient(data.token);
}



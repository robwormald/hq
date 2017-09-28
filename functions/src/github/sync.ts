import * as functions from 'firebase-functions'
import * as firebase from 'firebase'
import * as admin from 'firebase-admin'
import {getGithubAppClient, getGithubInstallationClient} from './client'

function syncInstallation(){}

function installApp(ref:admin.database.Reference){
  const client = getGithubAppClient();

  client.get('https://api.github.com/app')
    .then(endpoint => {
      console.log(endpoint.data);
    })
    .catch(err => {
      console.log(err)
    })
}

async function onCreateInstallation(installationRef:functions.database.DeltaSnapshot){
  const installation = installationRef.val();
  const appClient = getGithubAppClient();
  const client = await getGithubInstallationClient(installation.id);
  const installationData = await appClient.get(`https://api.github.com/app/installations/${installation.id}`)
    .then(res => res.data);

  await installationRef.adminRef.set(installationData);

}

export const github_app_install = functions.database.ref('github_app/installations/{id}')
  .onCreate(installationRef => onCreateInstallation(installationRef.data));

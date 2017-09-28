import * as functions from 'firebase-functions'
import * as firebase from 'firebase'
import * as admin from 'firebase-admin'
import {getGithubAppClient, getGithubInstallationClient} from './client'

function syncInstallation(){}

function installApp(ref:admin.database.Reference){
  const client = getGithubAppClient();

  client.get('https://api.github.com/app')
    .then(endpoint => {
      console.log(endpoint);
    })
    .catch(err => {
      console.log(err)
    })
}

async function fetchAll(client, url){

}

async function updateAppData(appClient){
  const appData = await appClient.get(`https://api.github.com/app`);
  console.log(appData);
  return appData;
}

async function onCreateInstallation(installationRef:functions.database.DeltaSnapshot){
  const installation = installationRef.val();
  const appClient = getGithubAppClient();
  const installationClient = await getGithubInstallationClient(installation.id);

  const appData = await updateAppData(appClient);

  const [installationData, installationRepoData] = await Promise.all([
    appClient.get(`https://api.github.com/app/installations/${installation.id}`),
    installationClient.get(`https://api.github.com/installation/repositories`)
  ]);

  const installationAdminRef = installationRef.adminRef

  await installationAdminRef.set(installationData);

  const githubDataRef = installationRef.adminRef.root.child('github_data');

  const reposRef = githubDataRef.child('repository');


  await Promise.all((installationRepoData.repositories as any[]).map(async repo => {
    await installationAdminRef
    .child(`repositories/${repo.id}`)
    .set(true);
    await reposRef
      .child(repo.id)
      .set(repo);
  }));
}

export const github_app_install = functions.database.ref('github_app/installations/{id}')
  .onCreate(installationRef => onCreateInstallation(installationRef.data));

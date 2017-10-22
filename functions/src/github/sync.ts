import * as functions from 'firebase-functions'
import * as firebase from 'firebase'
import * as admin from 'firebase-admin'
import {Observable} from 'rxjs'
import {getInstallationClient, AuthClient, getNextPage} from './client'
import * as PubSub from '@google-cloud/pubsub'

// Instantiates a client
const pubsub = PubSub();
const topic = pubsub.topic('github-events');

const createTopicObserver = (topicId:string) => ({

})


const getAll = (client:AuthClient) => ({nextUrl, data}) =>
  !!nextUrl ? Observable.defer(() => client.get(nextUrl)
    .then(res => ({nextUrl: getNextPage(res.headers.link), data: res.data})))
  : Observable.empty();

const syncInstallation = (id:number, githubDataRef:admin.database.Reference) =>
  (client$:Observable<AuthClient>):Observable<any> =>
    client$.switchMap(client => readInstallationRepos(id, client)
      .concatMap(repo => readRepositoryDetailData(repo, client).retry(1))
      .concatMap(cacheRepo(id, githubDataRef))
)


const readInstallationRepos = (id, client:AuthClient):Observable<{id:string}> =>
  Observable.of({nextUrl: 'https://api.github.com/installation/repositories'})
  .expand(getAll(client))
  .filter(response => (response as any).data)
  .concatMap(({data:{repositories}}) => repositories ? Observable.from(repositories) : Observable.empty());

const readRepositoryDetailData = (repo, client:AuthClient ) => Observable.defer(() => client.get(repo.url).then(res => res.data))

const cacheRepo = (id:number, githubDataRef:admin.database.Reference) => repo => Observable.defer(() => Promise.all([
  githubDataRef.child(`repository/${repo.id}`)
    .set(repo),
  githubDataRef.child(`installation/${id}/repositories/${repo.id}`)
    .update(repo)
])).mapTo(repo);

async function onCreateInstallationRx(installationRef:functions.database.DeltaSnapshot){
  const installation = installationRef.val();
  const githubDataRef = installationRef.adminRef.root.child('github_data');

  return await getInstallationClient(installation.id)
    .let(syncInstallation(installation.id, githubDataRef))
    .forEach(result => {});
}

async function onCreateInstallation(installationRef:functions.database.DeltaSnapshot){
  // const installation = installationRef.val();
  // const appClient = getGithubAppClient();
  // const installationClient = await getGithubInstallationClient(installation.id);

  // const appData = await updateAppData(appClient);

  // const [installationData, installationRepoData] = await Promise.all([
  //   appClient.get(`https://api.github.com/app/installations/${installation.id}`),
  //   installationClient.get(`https://api.github.com/installation/repositories`)
  // ]);

  // const installationAdminRef = installationRef.adminRef

  // await installationAdminRef.set(installationData);

  // const githubDataRef = installationRef.adminRef.root.child('github_data');

  // const repoRef = githubDataRef.child('repository');
  // const reposRef = githubDataRef.child('repos')


  // await Promise.all((installationRepoData.repositories as any[]).map(async repo => {
  //   await installationAdminRef
  //   .child(`repositories/${repo.id}`)
  //   .set(true);
  //   await repoRef
  //     .child(repo.id)
  //     .set(repo);
  //   await reposRef
  //   .child(repo.full_name)
  //   .set(repo);
  //   await repo
  // }));
}

export const github_app_install = functions.database.ref('github_app/installations/{id}')
  .onCreate(installationRef => onCreateInstallationRx(installationRef.data));

export const github_app_sync_repository = functions.pubsub.topic('github-sync-repo')
  .onPublish(handler => {

  })

import * as functions from 'firebase-functions'
import * as firebase from 'firebase'
import * as admin from 'firebase-admin'
import {
  GitHubWebhookEventType,
  GithubWebhookMessage,
  GithubIssueActionPayload
} from './events'

async function processGithubEvent(message:functions.pubsub.Message){

  const action:GithubWebhookMessage = {
     type:message.json.type,
     payload:message.json.payload
  };

  switch(action.type){
    case GitHubWebhookEventType.Issues:
      return await processIssuePayload(action.payload);
    default:
      return Promise.resolve('ok');
  }
}

async function processIssuePayload(payload:GithubIssueActionPayload){
  const githubDataRef = admin.database().ref('github_data');
  return await Promise.all([
    githubDataRef.child(`issue/${payload.issue.id}`)
     .set(payload.issue),
     githubDataRef.child(`repository/${payload.repository.id}`)
     .set(payload.repository)
  ]);
}


export const github_processEvent = functions.pubsub.topic('github-events')
  .onPublish(event => processGithubEvent(event.data))

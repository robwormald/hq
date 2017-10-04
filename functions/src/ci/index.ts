/**
 * Github Webhook API
 */
import * as functions from 'firebase-functions'
import * as firebase from 'firebase'
import * as admin from 'firebase-admin'
import * as PubSub from '@google-cloud/pubsub'

// Instantiates a client
const pubsub = PubSub();
const topic = pubsub.topic('github-events');

function parseRequest(request:functions.Request){
  const action = request.body;
  if(!action.type){
	  return undefined;
  }
  return action;
}

function handleCIWebhookEvent(request:functions.Request, response:functions.Response): void {
  console.log(request.body);

  response.sendStatus(203);
}



export const ci_webhook = functions.https.onRequest(handleCIWebhookEvent);

import * as functions from 'firebase-functions'
import * as firebase from 'firebase'
import * as admin from 'firebase-admin'
import { Observable } from 'rxjs'
import * as PubSub from '@google-cloud/pubsub'
import {Action} from '../action'

export function createPubSubTopicEffect(topicId, selector, handler) {
  const pubsub = PubSub();
	return functions.pubsub.topic(topicId)
		.onPublish(event => {
			return Observable.of(selector(event))
      .let(handler)
      .concatMap(({ type, topic, payload }) =>
        pubsub.topic(topic ? topic : topicId)
          .publish({ type, payload })
          .then(() => ({type, topic, payload}))
      )
      .forEach(({type, topic, payload}) => console.info('published', topic, type))
      .then(() => console.info('complete'))
		});
}



export function createWebhookEffect(handler){
  const pubsub = PubSub();
  function requestHandler(request:functions.Request, response:functions.Response){
    return Observable.of(request)
    .let(handler)
    .forEach((action:Action) => pubsub.topic(action.topic).publish(action))
    .then(() => response.sendStatus(203))
    .catch((err) => {
      console.error(err);
      response.sendStatus(500);
    });
  }

  return functions.https.onRequest(requestHandler);
}

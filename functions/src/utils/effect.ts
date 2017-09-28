import * as functions from 'firebase-functions'
import * as firebase from 'firebase'
import * as admin from 'firebase-admin'
import { Observable } from 'rxjs'
import * as PubSub from '@google-cloud/pubsub'

export function createPubSubTopicEffect(topicId, handler) {
  const pubsub = PubSub();
	return functions.pubsub.topic(topicId)
		.onPublish(event => {
			return Observable.of({
				type: event.data.json.type,
				payload: event.data.json.payload
			})
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

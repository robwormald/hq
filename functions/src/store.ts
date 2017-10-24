import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as PubSub from '@google-cloud/pubsub'
import {Action} from './action'
import {HqTopic} from './topics'
import {Observable} from 'rxjs'

const pubsub = PubSub();

export const enum FirestoreCommand {
  Add = 'FIRESTORE_ADD',
  Set = 'FIRESTORE_SET',
  Delete = 'FIRESTORE_DELETE',
  DeleteField = 'FIRESTORE_DELETE_FIELD'
}

interface FirestoreActionBase extends Action {
  collection:string;
  document?:string;
}

export interface FirestoreAddAction extends FirestoreActionBase {
  type: FirestoreCommand.Add
}

export type FirestoreAction = FirestoreAddAction;

export function storeSelector(
  message:functions.Event<functions.pubsub.Message>
): FirestoreAction {
  return {
    type: message.data.json.type,
    collection: message.data.json.collection,
    topic: HqTopic.FirestoreAction

  }
}

export function storeEffects(action:Observable<FirestoreAction>):Observable<Action>{
  var db = admin.firestore();
  return Observable.empty();
}


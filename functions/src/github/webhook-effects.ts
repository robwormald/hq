import {Observable} from 'rxjs'
import * as functions from 'firebase-functions'
import {GithubWebhookEventTypes, GithubWebhookEvent} from './events'
import {GithubWebhookAction, GithubSyncAction, GithubAction, GithubUpdateIssueAction} from './actions'
import { Action } from '../action';
import {getInstallationClient} from './client'

export function webhookEffectsSelector(
  message:functions.Event<functions.pubsub.Message>
): any {
  return {
    type: message.data.json.type,
    payload: message.data.json.payload,
  }
}


export function webhookEffects(actions$:Observable<GithubWebhookEvent>): Observable<GithubAction>{
  return actions$.concatMap(action => {
    switch (action.type) {

      case GithubWebhookEventTypes.Installation:
      case GithubWebhookEventTypes.InstallationRepositories:
        return Observable.of(new GithubSyncAction(action.payload))

      case GithubWebhookEventTypes.Issues:
        return Observable.of(new GithubUpdateIssueAction(action.payload));
        default:
        return Observable.empty();
    }
  });
}

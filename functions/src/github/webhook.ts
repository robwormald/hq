/**
 * Github Webhook API
 */
import * as functions from 'firebase-functions'
import {Observable} from 'rxjs'
import {GithubWebhookAction} from './actions'
import {GithubWebhookEventTypes} from './events'
import {HqTopic} from '../topics'
import {Action} from '../action'

export function githubWebhookEffect(request$:Observable<functions.Request>):Observable<Action>{
  return request$.map(request => {
    const githubAction:GithubWebhookAction = {
      topic: HqTopic.GithubWebhookEvent,
      type: (request.header('X-GitHub-Event') as GithubWebhookEventTypes),
      payload: request.body
    }
    return githubAction;
  });
}


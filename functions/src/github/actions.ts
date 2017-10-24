import { Action } from '../action';
import { GithubWebhookEventTypes, GithubWebhookBasePayload} from './events'
import { HqTopic } from '../topics'

export interface GithubWebhookAction extends Action {
  type: GithubWebhookEventTypes
  payload: any;
}

export const enum GithubActions {
  Sync = 'GITHUB_SYNC',
  SyncRepository = 'GITHUB_SYNC_REPO',
  UpdateInstall = 'GITHUB_UPDATE_INSTALL',
  UpdateIssue = 'GITHUB_UPDATE_ISSUE'
}

export class GithubSyncAction implements Action {
  type = GithubActions.Sync
  topic = HqTopic.GithubAction
  constructor(public payload:GithubWebhookBasePayload){}
}

export class GithubSyncRepoAction implements Action {
  type = GithubActions.SyncRepository
  topic = HqTopic.GithubAction
  constructor(public payload:GithubWebhookBasePayload){}
}

export class GithubUpdateIssueAction implements Action {
  type = GithubActions.UpdateIssue
  topic = HqTopic.GithubAction
  constructor(public payload:GithubWebhookBasePayload){}
}

export type GithubAction = GithubSyncAction | GithubSyncRepoAction | GithubUpdateIssueAction;




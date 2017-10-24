import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {createPubSubTopicEffect, createWebhookEffect} from './utils/effect'

import {HqTopic} from './topics'

import {storeSelector, storeEffects} from './store'
import {githubSyncEffects} from './github/sync-effects'
import {githubWebhookEffect} from './github/webhook'
import {webhookEffects, webhookEffectsSelector} from './github/webhook-effects'

admin.initializeApp(functions.config().firebase);

//firestore effects to update database
export const firestore_effects = createPubSubTopicEffect(
  HqTopic.FirestoreAction, storeSelector, storeEffects
);

export const github_webhook_effects = createPubSubTopicEffect(
  HqTopic.GithubWebhookEvent, webhookEffectsSelector, webhookEffects
);

export const github_sync_effects = createPubSubTopicEffect(
  HqTopic.GithubAction, webhookEffectsSelector, githubSyncEffects
);


//github webhook handler
export const github_webhook = createWebhookEffect(githubWebhookEffect);

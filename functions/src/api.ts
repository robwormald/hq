import { ping } from './utils/ping'
import {github_processEvent, github_webhook, github_app_install} from './github'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {Observable} from 'rxjs'
// Instantiates a client

admin.initializeApp(functions.config().firebase);
//import { githubEffects } from './github/actions'

export {
	ping,
  github_webhook,
  github_processEvent,
  github_app_install
	//githubEffects
}

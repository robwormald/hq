//ngrx-like actions API
import {HqTopic} from './topics'
import * as functions from 'firebase-functions';

export interface Action {
  type: string;
  topic:HqTopic;
}

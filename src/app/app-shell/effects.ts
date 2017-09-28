import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';
import {Store, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Rx' //TODO(robwormald): dont be lazy
import {AppShellActions} from './actions'

@Injectable()
export class AppShellEffects {
  constructor(private actions:Actions<Action>){}

  @Effect()
  connectionStatus = Observable.merge(
    Observable.fromEvent(window, 'online')
      .mapTo({type: AppShellActions.UPDATE_CONNECTION_STATE, online: true}),
    Observable.fromEvent(window, 'offline')
      .mapTo({type: AppShellActions.UPDATE_CONNECTION_STATE, online: false}),
    Observable.fromEvent(navigator['connection'], 'typechange')
      .map((event:Event) => ({type: AppShellActions.UPDATE_CONNECTION_INFO, networkInfo: event.target}))
  )
  .startWith({type: AppShellActions.UPDATE_CONNECTION_STATE, online: navigator.onLine})
  .startWith({type: AppShellActions.UPDATE_CONNECTION_INFO, networkInfo: navigator['connection']});



}

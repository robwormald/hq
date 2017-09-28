import {AppShellActions} from './actions'

export interface ConnectionState {
  online: boolean;
  networkInfo: any //NetworkInformation
}

export interface AppShellState {
  connectionState:ConnectionState
}

export const appShellInitialState:AppShellState = {
  connectionState: { online: null, networkInfo: null }
}

export function appShell(appShellState = appShellInitialState, action:any):AppShellState{
  switch(action.type){
    case AppShellActions.UPDATE_CONNECTION_INFO: {
      const connectionState = {
        online: appShellState.connectionState.online,
        networkInfo: action.networkInfo
      }
      return {...appShellState, connectionState}
    }

    case AppShellActions.UPDATE_CONNECTION_STATE: {
      const connectionState = {
        online: action.online,
        networkInfo: appShellState.connectionState.networkInfo
      }
      return {...appShellState, connectionState}
    }

  default:
    return appShellState;
 }

}

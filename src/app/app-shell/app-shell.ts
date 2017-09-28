import {NgModule, ApplicationRef, ComponentFactoryResolver} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StoreModule, Store} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import {AppShellComponent} from './app-shell.component'
import {AppShellRoutes} from './app-shell.routes'
import {appShell} from './state';
import {AppShellEffects} from './effects'
import {AppShellActions} from './actions'

import {NgHqAppAuth} from '../app-auth'
import {HeaderBarModule} from '../header-bar/header-bar.module'


@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot({appShell}),
    EffectsModule.forRoot([AppShellEffects]),
    RouterModule.forRoot(AppShellRoutes),
    NgHqAppAuth,
    BrowserAnimationsModule,
    HeaderBarModule
  ],
  declarations: [AppShellComponent],
  entryComponents: [AppShellComponent]
})
export class NgHqAppShellModule {
  constructor(public store: Store<any>, public resolver:ComponentFactoryResolver){}

  ngDoBootstrap(applicationRef:ApplicationRef){
    this.store.dispatch({
      type: AppShellActions.WATCH_CONNECTION_STATE
    });

    const appShellFactory = this.resolver.resolveComponentFactory(AppShellComponent);

    applicationRef.bootstrap(appShellFactory);
  }
}

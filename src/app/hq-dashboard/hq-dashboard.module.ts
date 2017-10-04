import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from "@angular/flex-layout";
import {CommonModule} from '@angular/common';
import {AngularFireModule} from 'angularfire2'
import {AngularFireDatabaseModule, AngularFireDatabase} from 'angularfire2/database'

import { StatusComponent } from '../app-status/status.component';

//todo(robwormald) hmm
import * as env from '../../environments/environment'
import {dashboardState} from './hq-dashboard.state'

import {HqDashboardView} from './hq-dashboard-view';
import {HqDashboardRoutes} from './hq-dashboard.routes';

import {HqWidgetModule} from './hq-dashboard-widget/hq-widget.module'

import {HqDashboardWidgetRepo} from './hq-dashboard-widget-repo'
import {HqDashboardWidgetIframe} from './hq-dashboard-widget-iframe';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    HqWidgetModule.forRoot(),
    HqWidgetModule.registerWidget('hq-dashboard-widget-repo', HqDashboardWidgetRepo),
    HqWidgetModule.registerWidget('hq-dashboard-widget-iframe', HqDashboardWidgetIframe),
    RouterModule.forChild(HqDashboardRoutes),
    AngularFireModule.initializeApp(env.environment.firebaseConfig),
    AngularFireDatabaseModule,
    dashboardState
  ],
  declarations: [
    HqDashboardView,
    HqDashboardWidgetRepo,
    HqDashboardWidgetIframe,
    StatusComponent
  ],
})
export class HqDashboardModule {
  constructor(){}
}

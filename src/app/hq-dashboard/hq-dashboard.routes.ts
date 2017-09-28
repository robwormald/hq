import {Route} from '@angular/router';
import {HqDashboardView} from './hq-dashboard-view';

export const HqDashboardRoutes:Route[] = [
  { path: '', pathMatch: 'full', component: HqDashboardView}
]

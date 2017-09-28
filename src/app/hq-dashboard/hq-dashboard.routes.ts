import {Route} from '@angular/router';
import {HqDashboardView} from './hq-dashboard-view';

export const HqDashboardRoutes:Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: HqDashboardView
  },
  {
    path: 'admin',
    pathMatch: 'full',
    loadChildren: './hq-dashboard-admin/index#HqDashboardAdmin'
  },
  {
    path: 'remote',
    pathMatch: 'full',
    loadChildren: './hq-dashboard-remote/index#HqDashboardRemote'
  }
]

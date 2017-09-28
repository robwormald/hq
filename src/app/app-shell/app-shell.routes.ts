import {Route} from '@angular/router';

export const AppShellRoutes:Route[] = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: 'dashboard', loadChildren: 'app/hq-dashboard/hq-dashboard.module#HqDashboardModule'}
]

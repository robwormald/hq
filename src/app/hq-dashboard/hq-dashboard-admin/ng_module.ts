import {NgModule} from '@angular/core'
import {RouterModule} from '@angular/router'
import {CommonModule} from '@angular/common'
import {HqDashboardAdminView} from './hq-dashboard-admin-view'

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([]),
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: HqDashboardAdminView
      }
    ])
  ],
  declarations: [
    HqDashboardAdminView
  ]
})
export class HqDashboardAdmin {
  constructor(){}
}

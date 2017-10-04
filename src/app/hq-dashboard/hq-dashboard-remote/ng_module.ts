import {NgModule} from '@angular/core'
import {RouterModule} from '@angular/router'
import {CommonModule} from '@angular/common'
import {HqDashboardRemoteView} from './hq-dashboard-remote-view'

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: HqDashboardRemoteView
      }
    ])
  ],
  declarations: [
    HqDashboardRemoteView
  ]
})
export class HqDashboardRemote {
  constructor(){}
}

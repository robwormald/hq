import {Component} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {AngularFireDatabase} from 'angularfire2/database'

function resolveDatasources(){
  return {
    repo: 'ok'
  }
}

@Component({
  selector: 'hq-dashboard-view',
  templateUrl: './hq-dashboard-view.html',
  styleUrls: [
    './hq-dashboard-view.scss'
  ]
})
export class HqDashboardView {
  constructor(public db:AngularFireDatabase){

  }
  widgets = this.db.list('dashboard/widgets')
    .valueChanges()
    .map(widgets => {
      return widgets;
    })
    .do(x => console.log(x));
}

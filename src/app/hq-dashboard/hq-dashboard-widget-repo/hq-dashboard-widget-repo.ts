import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx'

@Component({
  selector: 'hq-dashboard-widget-repo',
  templateUrl: './hq-dashboard-widget-repo.html',
  styleUrls: ['./hq-dashboard-widget-repo.scss']
})
export class HqDashboardWidgetRepo {

  constructor() { }

  @Input() state$:Observable<any>;

  @Input() displayType: string;


}

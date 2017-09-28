import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-dashboard-widget-iframe',
  templateUrl: './hq-dashboard-widget-iframe.html',
  styleUrls: ['./hq-dashboard-widget-iframe.scss']
})
export class HqDashboardWidgetIframe {

  constructor() { }

  @Input() src:any = null;

}

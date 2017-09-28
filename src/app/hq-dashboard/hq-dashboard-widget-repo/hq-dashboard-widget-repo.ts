import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-dashboard-widget-repo',
  templateUrl: './hq-dashboard-widget-repo.html',
  styleUrls: ['./hq-dashboard-widget-repo.scss']
})
export class HqDashboardWidgetRepo implements OnInit {

  constructor() { }

  @Input() repo:any = null;

  ngOnInit() {

  }
  ngOnChanges(){
    console.log('component state', this.repo)
  }

}

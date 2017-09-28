import {NgModule, Inject, InjectionToken, ANALYZE_FOR_ENTRY_COMPONENTS} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HqWidgetComponent} from './hq-widget.component';
import {HQ_WIDGETS, HqWidgetRegistry} from './hq-dashboard-widget.providers'


export function registerWidget(selector, widget){
  return {
    ngModule: HqWidgetModule,
    providers: [
      HqWidgetRegistry,
      {
        provide: ANALYZE_FOR_ENTRY_COMPONENTS,
        useValue: widget,
        multi: true
      },
      {
        provide: HQ_WIDGETS,
        useValue: {selector, widget},
        multi: true
      }
    ]
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [HqWidgetComponent],
  exports: [HqWidgetComponent]
})
export class HqWidgetModule {
  constructor(public registry:HqWidgetRegistry){
    console.log(registry)
  }
  static forRoot(){
    return {
      ngModule: HqWidgetModule,
      providers: [
        {
          provide: ANALYZE_FOR_ENTRY_COMPONENTS,
          useValue: HQ_WIDGETS,
          multi: true
        }
      ]
    }
  }
  static registerWidget(selector, component){
    return registerWidget(selector, component)
  }
}

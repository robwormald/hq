import {NgModule, Inject, Injectable, InjectionToken, ANALYZE_FOR_ENTRY_COMPONENTS, ComponentFactoryResolver} from '@angular/core';
export const HQ_WIDGETS = new InjectionToken('HQ/WIDGETS')

@Injectable()
export class HqWidgetRegistry {
  constructor(@Inject(HQ_WIDGETS) private widgets:any[], private cfr:ComponentFactoryResolver){
    console.log('wdigets',widgets)
  }
  getComponentFactory(selector){
    const type = this.widgets.find(widget => widget.selector === selector);
    console.log(type)
    const factory = this.cfr.resolveComponentFactory(type.widget);
    console.log('factory',factory);
    return factory;

  }
}

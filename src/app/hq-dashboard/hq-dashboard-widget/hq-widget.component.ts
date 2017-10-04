import * as ng from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser'
import {HqWidgetRegistry} from './hq-dashboard-widget.providers'
import {AngularFireDatabase} from 'angularfire2/database'
import {Observable, Subscription} from 'rxjs/Rx';

@ng.Component({
  selector: 'hq-widget',
  templateUrl: './hq-widget.component.html',
  styleUrls: ['./hq-widget.component.scss'],
  changeDetection: ng.ChangeDetectionStrategy.OnPush
})
export class HqWidgetComponent {
  constructor(
    private af:AngularFireDatabase,
    private widgetRegistry:HqWidgetRegistry,
    private injector:ng.Injector,
    private sanitize: DomSanitizer) {}

  @ng.Input() widget:any;

  @ng.ViewChild('target', {read: ng.ViewContainerRef})
  target: ng.ViewContainerRef

  @ng.HostBinding('attr.error-state')
  errorState = null;

  private _activeWidget:ng.ComponentRef<any>;
  private _activeSubscription:Subscription;


  ngOnChanges({widget}:{widget: ng.SimpleChange }){
    if(widget.firstChange){
      this.loadWidget();
      return;
    }
    if(this._activeWidget){
      this._activeWidget.destroy();

    }
    if(this._activeSubscription){
      this._activeSubscription.unsubscribe();
    }
  }

  loadWidget(){
    const selector = this.widget.selector;
    const datasources = this.widget.datasource;
    const datastream = combineLatestObj(Object.keys(datasources)
      .reduce((all, key) => {
        const source = datasources[key];
        if(key === 'src'){
          all[key] = Observable.of(this.sanitize.bypassSecurityTrustResourceUrl(source));
          return all;
        }
        const stream = this.af.object(`/${source}`)
          .valueChanges()
        all[key] = stream;
        return all;
      }, {}));

    const factory = this.widgetRegistry.getComponentFactory(selector);
    this._activeWidget = this.target.createComponent(factory);

    this._activeSubscription = datastream
      .subscribe(currentWidgetState => {
        Object.assign(this._activeWidget.instance, currentWidgetState);
        this._activeWidget.changeDetectorRef.detectChanges();
      });




  }

}


function combineLatestObj(obj) {
  var sources = [];
  var keys = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key.replace(/\$$/, ''));
      sources.push(obj[key]);
    }
  }
  return Observable.combineLatest(sources, function () {
    var argsLength = arguments.length;
    var combination = {};
    for (var i = argsLength - 1; i >= 0; i--) {
      combination[keys[i]] = arguments[i];
    }
    return combination;
  })
}

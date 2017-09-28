import * as ng from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser'
import {HqWidgetRegistry} from './hq-dashboard-widget.providers'
import {AngularFireDatabase} from 'angularfire2/database'
import {Observable} from 'rxjs/Rx';

@ng.Component({
  selector: 'hq-widget',
  templateUrl: './hq-widget.component.html',
  styleUrls: ['./hq-widget.component.scss']
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

  ngOnInit(){
    console.log(this.target);
    console.log(this.widget);
  }

  ngOnChanges({widget}:{widget: ng.SimpleChange }){
    if(widget.firstChange){
      this.loadWidget();
    }
  }

  loadWidget(){
    const selector = this.widget.selector;
    const datasources = this.widget.datasource;
    console.log('sources',datasources)
    const datastream = combineLatestObj(Object.keys(datasources)
      .reduce((all, key) => {
        console.log('key', key)
        const source = datasources[key];
        if(key === 'src'){
          all[key] = Observable.of(this.sanitize.bypassSecurityTrustResourceUrl(source));
          console.log('yes')
          return all;
        }
        const stream = this.af.object(`/${source}`)
          .valueChanges()
          .do(state => console.log('value change', state));
        all[key] = stream;
        return all;
      }, {}));

    const factory = this.widgetRegistry.getComponentFactory(selector);
    const widgetRef = this.target.createComponent(factory);

    datastream
      .forEach(currentWidgetState => {
        Object.assign(widgetRef.instance, currentWidgetState);
        widgetRef.changeDetectorRef.detectChanges();
      })




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

import {NgModule} from '@angular/core'
import {StoreModule} from '@ngrx/store'
import {EffectsModule} from '@ngrx/effects'

import {auth} from './state'

@NgModule({
  imports: [
    StoreModule.forFeature('auth', {status: auth})
  ]
})
export class NgHqAppAuth {

}

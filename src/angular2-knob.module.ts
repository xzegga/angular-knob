import {NgModule} from '@angular/core';
import {Ng2KnobDirective} from './angular2-knob.directive';

@NgModule({
    exports: [Ng2KnobDirective],
    declarations: [Ng2KnobDirective]
})
export class KnobModule { }


import { NgModule } from '@angular/core';
import { Ng2KnobDirective } from './angular2-knob.directive';
var KnobModule = (function () {
    function KnobModule() {
    }
    KnobModule.decorators = [
        { type: NgModule, args: [{
                    exports: [Ng2KnobDirective],
                    declarations: [Ng2KnobDirective]
                },] },
    ];
    /** @nocollapse */
    KnobModule.ctorParameters = function () { return []; };
    return KnobModule;
}());
export { KnobModule };
//# sourceMappingURL=angular2-knob.module.js.map
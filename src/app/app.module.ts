import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { KnobModule } from '@xmlking/ngx-knob';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    KnobModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

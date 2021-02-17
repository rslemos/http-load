import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpLoadModule } from '../../../http-load/src/lib/http-load.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpLoadModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

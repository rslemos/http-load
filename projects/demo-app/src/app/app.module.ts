import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpLoadModule } from '../../../http-load/src/lib/http-load.module';

import { AppComponent } from './app.component';
import { HexPipe } from './hex.pipe';
import { LongtextInterceptor } from './longtext.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HexPipe,
  ],
  imports: [
    BrowserModule,
    HttpLoadModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LongtextInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

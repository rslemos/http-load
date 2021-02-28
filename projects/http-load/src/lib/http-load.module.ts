import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { HttpLoadArrayBufferFromDirective } from './http-load-from.directive';
import { HttpLoadJsonFromDirective } from './http-load-from.directive';
import { HttpLoadTextFromDirective } from './http-load-from.directive';

const components = [
  HttpLoadArrayBufferFromDirective,
  HttpLoadJsonFromDirective,
  HttpLoadTextFromDirective,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [
    HttpClientModule,
  ],
})
export class HttpLoadModule { }

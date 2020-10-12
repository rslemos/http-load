import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { HttpLoadJsonFromDirective } from './http-load-from.directive';
import { HttpLoadTextFromDirective } from './http-load-from.directive';

const components = [
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

import { NgModule } from '@angular/core';

import { HttpLoadJsonFromDirective } from './http-load-from.directive';
import { HttpLoadTextFromDirective } from './http-load-from.directive';

const components = [
  HttpLoadJsonFromDirective,
  HttpLoadTextFromDirective,
];

@NgModule({
  declarations: components,
  exports: components,
})
export class HttpLoadModule { }

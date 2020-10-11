import { NgModule } from '@angular/core';

import { HttpLoadTextFromDirective } from './http-load-from.directive';

const components = [
  HttpLoadTextFromDirective,
];

@NgModule({
  declarations: components,
  exports: components,
})
export class HttpLoadModule { }

import { Directive } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { TemplateRef } from '@angular/core';

export class HttpContentLoadedContext<T> {
  constructor(
    public $implicit: T,
  ) { }
}

@Directive()
abstract class AbstractHttpLoadDirective<T> {
  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<HttpContentLoadedContext<T>>,
  ) { }
}

@Directive({
  selector: '[rlHttpLoad.text]',
})
export class HttpLoadTextFromDirective extends AbstractHttpLoadDirective<string> {
}

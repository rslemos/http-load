import { Directive } from '@angular/core';
import { Input } from '@angular/core';
import { OnChanges } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Nullable } from 'typescript-nullable';

import { Observable } from 'rxjs';

export class HttpContentLoadedContext<T> {
  constructor(
    public $implicit: T,
    public rlHttpLoadFrom: string,
  ) { }
}

@Directive()
abstract class AbstractHttpLoadDirective<T> implements OnChanges {
  protected abstract get from(): Nullable<string>;
  protected abstract load(url: string): Observable<T>;

  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<HttpContentLoadedContext<T>>,
    protected readonly http: HttpClient,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    const url = this.from;
    if (changes.from && Nullable.isSome(url)) {
      this.load(url).subscribe(
        content => {
          this.viewContainerRef.clear();
          this.viewContainerRef.createEmbeddedView(this.templateRef, new HttpContentLoadedContext<T>(content, url));
        },
      );
    }
  }
}

@Directive({
  selector: '[rlHttpLoad.text][rlHttpLoad.textFrom]',
})
export class HttpLoadTextFromDirective extends AbstractHttpLoadDirective<string> {
  @Input('rlHttpLoad.textFrom') from: Nullable<string>;

  protected load(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'text' });
  }
}

@Directive({
  selector: '[rlHttpLoad.json][rlHttpLoad.jsonFrom]',
})
export class HttpLoadJsonFromDirective<T> extends AbstractHttpLoadDirective<T> {
  @Input('rlHttpLoad.jsonFrom') from: Nullable<string>;

  protected load(url: string): Observable<T> {
    return this.http.get<T>(url, { responseType: 'json' });
  }
}

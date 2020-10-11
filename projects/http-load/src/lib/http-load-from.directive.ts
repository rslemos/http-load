import { Directive } from '@angular/core';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnChanges } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Nullable } from 'typescript-nullable';

import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { startWith } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

export class HttpContentLoadedContext<T> {
  constructor(
    public $implicit: T,
    public rlHttpLoadFrom: string,
  ) { }
}

export class HttpContentErrorContext {
  constructor(
    // tslint:disable-next-line: no-any
    public $implicit: any,
    public rlHttpLoadFrom: string,
  ) { }
}

type TupleTemplate<S> = [TemplateRef<S>, S];
type TupleNullableTemplate<S> = [Nullable<TemplateRef<S>>, S];

@Directive()
abstract class AbstractHttpLoadDirective<T> implements OnInit, OnChanges, OnDestroy {
  private readonly from$ = new Subject<Nullable<string>>();
  private readonly destroyed$ = new Subject<boolean>();

  protected abstract get from(): Nullable<string>;
  protected abstract get onError(): Nullable<TemplateRef<HttpContentErrorContext>>;

  protected abstract load(url: string): Observable<T>;

  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<HttpContentLoadedContext<T>>,
    protected readonly http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.from$.pipe(
      startWith(this.from),
      switchMap(url => Nullable.isSome(url)
        ?   this.load(url).pipe(
              map<T, TupleTemplate<HttpContentLoadedContext<T>>>(content =>
                [this.templateRef, new HttpContentLoadedContext<T>(content, url)]),
              catchError(error =>
                of<TupleNullableTemplate<HttpContentErrorContext>>([this.onError, new HttpContentErrorContext(error, url)]),
              ),
            )
        : of<TupleNullableTemplate<null>>([null, null]),
      ),
      tap(() => this.viewContainerRef.clear()),
      filter(([templateRef]) => Nullable.isSome(templateRef)),
      map(<S>(maybetuple: TupleNullableTemplate<S>) => maybetuple as TupleTemplate<S>),
      takeUntil(this.destroyed$),
    ).subscribe(([templateRef, context]) => this.viewContainerRef.createEmbeddedView(templateRef, context));
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.from && !changes.from.firstChange) {
      this.from$.next(this.from);
    }
  }
}

@Directive({
  selector: '[rlHttpLoad.text][rlHttpLoad.textFrom]',
})
export class HttpLoadTextFromDirective extends AbstractHttpLoadDirective<string> {
  @Input('rlHttpLoad.textFrom') from: Nullable<string>;
  @Input('rlHttpLoad.textOnError') onError: Nullable<TemplateRef<HttpContentErrorContext>>;

  protected load(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'text' });
  }
}

@Directive({
  selector: '[rlHttpLoad.json][rlHttpLoad.jsonFrom]',
})
export class HttpLoadJsonFromDirective<T> extends AbstractHttpLoadDirective<T> {
  @Input('rlHttpLoad.jsonFrom') from: Nullable<string>;
  @Input('rlHttpLoad.jsonOnError') onError: Nullable<TemplateRef<HttpContentErrorContext>>;

  protected load(url: string): Observable<T> {
    return this.http.get<T>(url, { responseType: 'json' });
  }
}

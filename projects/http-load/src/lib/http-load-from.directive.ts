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

type TupleTemplate<S> = [TemplateRef<S>, S];

@Directive()
abstract class AbstractHttpLoadDirective<T> implements OnInit, OnChanges, OnDestroy {
  private readonly from$ = new Subject<Nullable<string>>();
  private readonly destroyed$ = new Subject<boolean>();

  protected abstract get from(): Nullable<string>;
  protected abstract load(url: string): Observable<T>;

  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<HttpContentLoadedContext<T>>,
    protected readonly http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.from$.pipe(
      startWith(this.from),
      filter(Nullable.isSome),
      map(Nullable.withDefault('')),
      switchMap(url =>
            this.load(url).pipe(
              map<T, TupleTemplate<HttpContentLoadedContext<T>>>(content =>
                [this.templateRef, new HttpContentLoadedContext<T>(content, url)]),
            ),
      ),
      tap(() => this.viewContainerRef.clear()),
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

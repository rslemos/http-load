import { Directive } from '@angular/core';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnChanges } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

import { Nullable } from 'typescript-nullable';

import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { concat } from 'rxjs';
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
    public rlHttpLoadFrom: string,
    public response: HttpResponse<T>,
  ) { }

  public get $implicit(): Nullable<T> {
    return this.response.body;
  }
}

export class HttpContentErrorContext {
  constructor(
    public rlHttpLoadFrom: string,
    public error: HttpErrorResponse,
  ) { }

  public get $implicit(): HttpErrorResponse {
    return this.error;
  }
}

export class HttpContentLoadingContext<T> {
  constructor(
    public rlHttpLoadFrom: string,
    public progress: Nullable<Exclude<HttpEvent<T>, HttpResponse<T>>>,
  ) { }

  public get $implicit(): Nullable<Exclude<HttpEvent<T>, HttpResponse<T>>> {
    return this.progress;
  }
}

@Directive()
abstract class AbstractHttpLoadDirective<T> implements OnInit, OnChanges, OnDestroy {
  private readonly from$ = new Subject<Nullable<string>>();
  private readonly destroyed$ = new Subject<boolean>();

  protected abstract get from(): Nullable<string>;
  protected abstract get onError(): Nullable<TemplateRef<HttpContentErrorContext>>;
  protected abstract get loading(): Nullable<TemplateRef<HttpContentLoadingContext<T>>>;

  protected abstract load(url: string): Observable<HttpEvent<T>>;

  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<HttpContentLoadedContext<T>>,
    protected readonly http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.from$.pipe(
      startWith(this.from),
      switchMap(url => Nullable.isSome(url)
        ? concat(
            of([this.loading, new HttpContentLoadingContext<T>(url, null)] as const),
            this.load(url).pipe(
              map(event => event.type === HttpEventType.Response
                ? [this.templateRef, new HttpContentLoadedContext<T>(url, event)] as const
                : [this.loading, new HttpContentLoadingContext<T>(url, event)] as const,
              ),
              catchError(error => of([this.onError, new HttpContentErrorContext(url, error)] as const)),
            ),
          )
        : of([null, null] as const),
      ),
      tap(() => this.viewContainerRef.clear()),
      filter(([templateRef]) => Nullable.isSome(templateRef)),
      // tslint:disable-next-line: no-non-null-assertion
      map(([templateRef, context]) => [templateRef!, context] as const),
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
  selector: '[rlHttpLoad.arraybuffer][rlHttpLoad.arraybufferFrom]',
})
export class HttpLoadArrayBufferFromDirective extends AbstractHttpLoadDirective<ArrayBuffer> {
  @Input('rlHttpLoad.arraybufferFrom') from: Nullable<string>;
  @Input('rlHttpLoad.arraybufferOnError') onError: Nullable<TemplateRef<HttpContentErrorContext>>;
  @Input('rlHttpLoad.arraybufferLoading') loading: Nullable<TemplateRef<HttpContentLoadingContext<ArrayBuffer>>>;

  protected load(url: string): Observable<HttpEvent<ArrayBuffer>> {
    return this.http.get(url, { responseType: 'arraybuffer', observe: 'events', reportProgress: true });
  }
}

@Directive({
  selector: '[rlHttpLoad.blob][rlHttpLoad.blobFrom]',
})
export class HttpLoadBlobFromDirective extends AbstractHttpLoadDirective<Blob> {
  @Input('rlHttpLoad.blobFrom') from: Nullable<string>;
  @Input('rlHttpLoad.blobOnError') onError: Nullable<TemplateRef<HttpContentErrorContext>>;
  @Input('rlHttpLoad.blobLoading') loading: Nullable<TemplateRef<HttpContentLoadingContext<Blob>>>;

  protected load(url: string): Observable<HttpEvent<Blob>> {
    return this.http.get(url, { responseType: 'blob', observe: 'events', reportProgress: true });
  }
}

@Directive({
  selector: '[rlHttpLoad.text][rlHttpLoad.textFrom]',
})
export class HttpLoadTextFromDirective extends AbstractHttpLoadDirective<string> {
  @Input('rlHttpLoad.textFrom') from: Nullable<string>;
  @Input('rlHttpLoad.textOnError') onError: Nullable<TemplateRef<HttpContentErrorContext>>;
  @Input('rlHttpLoad.textLoading') loading: Nullable<TemplateRef<HttpContentLoadingContext<string>>>;

  protected load(url: string): Observable<HttpEvent<string>> {
    return this.http.get(url, { responseType: 'text', observe: 'events', reportProgress: true });
  }
}

@Directive({
  selector: '[rlHttpLoad.json][rlHttpLoad.jsonFrom]',
})
export class HttpLoadJsonFromDirective<T> extends AbstractHttpLoadDirective<T> {
  @Input('rlHttpLoad.jsonFrom') from: Nullable<string>;
  @Input('rlHttpLoad.jsonOnError') onError: Nullable<TemplateRef<HttpContentErrorContext>>;
  @Input('rlHttpLoad.jsonLoading') loading: Nullable<TemplateRef<HttpContentLoadingContext<T>>>;

  protected load(url: string): Observable<HttpEvent<T>> {
    return this.http.get<T>(url, { responseType: 'json', observe: 'events', reportProgress: true });
  }
}

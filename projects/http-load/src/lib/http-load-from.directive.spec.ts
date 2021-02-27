import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestRequest } from '@angular/common/http/testing';

import { Component } from '@angular/core';
import { Type } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpRequest } from '@angular/common/http';
import { HttpDownloadProgressEvent } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpHeaderResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Nullable } from 'typescript-nullable';

import { HttpLoadModule } from './http-load.module';
import { HttpLoadTextFromDirective } from './http-load-from.directive';
import { HttpLoadJsonFromDirective } from './http-load-from.directive';

const httpLoadingTemplate = `
  <ng-template #httpLoading let-progress let-url="rlHttpLoadFrom">
    url: {{ url }},<br>
    <ng-container *ngIf="progress">
      type: {{ progress.type }},<br>
      <ng-container *ngIf="progress.type === 2">
        headers (keys): {{ progress.headers.keys().join(', ') }},<br>
        headers['Content-Type']: {{ progress.headers.get('Content-Type') }},<br>
      </ng-container>
      <ng-container *ngIf="progress.type === 3">
        loaded: {{ progress.loaded }},<br>
        total: {{ progress.total }},<br>
        <ng-container *ngIf="progress.partialText !== undefined">
          partialText: {{ progress.partialText }},<br>
        </ng-container>
      </ng-container>
    </ng-container>
  </ng-template>
`;

const httpErrorTemplate = `
  <ng-template #httpError let-errorObject><pre>{{errorObject | json}}</pre></ng-template>
`;

@Component({
  template: `
    ${httpLoadingTemplate}
    ${httpErrorTemplate}
    <ng-container *rlHttpLoad.text="let loadedText from url; loading: httpLoading; onError: httpError">{{loadedText}}</ng-container>
  `,
})
class TestTextComponent {
  public url: string | null = null;
}

@Component({
  template: `
    ${httpLoadingTemplate}
    ${httpErrorTemplate}
    <pre *rlHttpLoad.json="let loadedObject from url; loading: httpLoading; onError: httpError">{{loadedObject | json}}</pre>
  `,
})
class TestJsonComponent {
  public url: string | null = null;
}

const jsonPipe = new JsonPipe();

testAllFeatures(HttpLoadTextFromDirective, TestTextComponent,
  'It is not by muscle, speed, or physical dexterity that great things are achieved, but by reflection, force of character, and judgment.',
);

testAllFeatures(HttpLoadJsonFromDirective, TestJsonComponent, {
    Image: {
      Width: 800,
      Height: 600,
      Title: 'View from 15th Floor',
      Thumbnail: {
        Url: 'http://www.example.com/image/481989943',
        Height: 125,
        Width: 100,
      },
      Animated: false,
      IDs: [116, 943, 234, 38793],
    },
  },
);

const MIMETYPE_BY_RESPONSETYPE = {
  text: 'text/plain',
  json: 'application/json',
};

interface WithURL {
  url: Nullable<string>;
}

function testAllFeatures<D>(
    directiveType: Type<D>,
    testingComponentType: Type<WithURL>,
    response: string | object,
): void {
  describe(directiveType.name, () => {
    let httpTestingController: HttpTestingController;
    let host: ComponentFixture<WithURL>;

    const responseType = (() => {
      if (typeof response === 'string') { return 'text'; }
      return 'json';
    })();

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ testingComponentType ],
        imports: [
          HttpClientTestingModule,
          HttpLoadModule,
        ],
      }).compileComponents();

      httpTestingController = TestBed.inject(HttpTestingController);

      host = TestBed.createComponent(testingComponentType);
      host.detectChanges(); // initial binding
    });

    it('should create', () => {
      const directive = host.debugElement.queryAllNodes(By.directive(directiveType))[0];
      expect(directive).toBeTruthy();
    });

    it('should be initially empty', () => {
      httpTestingController.verify();
      expectTextContent(host, '');
    });

    it('should download from url', () => {
      const url = changeUrl(host, '/any/given.url');
      const req = expectHttpRequest(httpTestingController, url, responseType);
      req.flush(response);
      expectTextContent(host, response);
    });

    it('should abort on url change', () => {
      const url0 = changeUrl(host, '/any/given.url');
      const req0 = expectHttpRequest(httpTestingController, url0, responseType);

      const url1 = changeUrl(host, '/an/other.url');
      const req1 = expectHttpRequest(httpTestingController, url1, responseType);
      req1.flush(response);

      expect(req0.cancelled).toBe(true);

      expectTextContent(host, response);
    });

    it('should abort download on destroy', () => {
      const url = changeUrl(host, '/any/given.url');
      const req = expectHttpRequest(httpTestingController, url, responseType);
      host.destroy();
    });

    it('should abort on url change to null', () => {
      const url = changeUrl(host, '/any/given.url');
      const req = expectHttpRequest(httpTestingController, url, responseType);

      changeUrl(host, null);
      httpTestingController.verify();

      expect(req.cancelled).toBe(true);
    });

    it('should clear view on url change to null', () => {
      const url = changeUrl(host, '/any/given.url');
      const req = expectHttpRequest(httpTestingController, url, responseType);
      req.flush(response);

      changeUrl(host, null);
      httpTestingController.verify();
      expectTextContent(host, '');
    });

    it('should display network error', () => {
      const url = changeUrl(host, '/any/given.url');
      const req = expectHttpRequest(httpTestingController, url, responseType);
      const errorResponse = flushNetworkError(req, url);
      expectTextContent(host, errorResponse);
    });

    it('should display server error', () => {
      const url = changeUrl(host, '/any/given.url');
      const req = expectHttpRequest(httpTestingController, url, responseType);
      const errorResponse = flushServerError(req, url);
      expectTextContent(host, errorResponse);
    });

    it('should show progress', () => {
      const url = changeUrl(host, '/any/given.url');
      const req = expectHttpRequest(httpTestingController, url, responseType);
      expectTextContent(host, `url: ${url}, type: ${HttpEventType.Sent},`);

      sendHeaders(req, 200, 'OK', { 'Content-Type': MIMETYPE_BY_RESPONSETYPE[responseType] });
      expectTextContent(host, `url: ${url}, type: ${HttpEventType.ResponseHeader}, headers (keys): Content-Type, headers['Content-Type']: ${MIMETYPE_BY_RESPONSETYPE[responseType]},`);

      if (typeof response === 'string') {
        sendPartialText(req, response, 30);
        expectTextContent(host, `url: ${url}, type: ${HttpEventType.DownloadProgress}, loaded: 30, total: ${response.length}, partialText: ${response.substring(0, 30)},`);
      } else {
        const sampleData = JSON.stringify(response);
        sendPartialData(req, sampleData, 30);
        expectTextContent(host, `url: ${url}, type: ${HttpEventType.DownloadProgress}, loaded: 30, total: ${sampleData.length},`);
      }

      req.flush(response);
      expectTextContent(host, response);
    });
  });
}

/* utility functions */

function expectTextContent(host: ComponentFixture<unknown>, expected: string | object): void {
  host.detectChanges();
  if (typeof expected !== 'string') {
    expected = jsonPipe.transform(expected);
  }
  expect((host.elementRef.nativeElement as HTMLElement).textContent?.trim()).toBe(expected);
}

function changeUrl<T extends string | null>(host: ComponentFixture<WithURL>, url: T): T {
  host.componentInstance.url = url;
  host.detectChanges();
  return url;
}

function expectHttpRequest<T>(
    httpTestingController: HttpTestingController,
    url: string,
    responseType: HttpRequest<T>['responseType'],
): TestRequest {
  const req = httpTestingController.expectOne(url);
  httpTestingController.verify();
  expect(req.request.method).toEqual('GET');
  expect(req.request.responseType).toEqual(responseType);
  return req;
}

function sendHeaders(req: TestRequest, status: number, statusText: string, headers: { [name: string]: string | string[]; }): void {
  const url = req.request.url;
  req.event(new HttpHeaderResponse({ url, status, statusText, headers: new HttpHeaders(headers) }));
}

function sendPartialText(req: TestRequest, text: string, loaded: number): void {
  const type = HttpEventType.DownloadProgress;
  const total = text.length;
  const partialText = text.substring(0, loaded);
  req.event({ type, total, loaded, partialText } as HttpDownloadProgressEvent);
}

function sendPartialData(req: TestRequest, data: string, loaded: number): void {
  const type = HttpEventType.DownloadProgress;
  const total = data.length;
  req.event({ type, total, loaded } as HttpDownloadProgressEvent);
}

function flushNetworkError(req: TestRequest, url: string): HttpErrorResponse {
  const status = 0;
  const statusText = '';
  const error = new ErrorEvent('it doesn\'t matter');
  req.error(error);
  return new HttpErrorResponse({ error, status, statusText, url });
}

function flushServerError(req: TestRequest, url: string): HttpErrorResponse {
  const status = 410;
  const statusText = 'Gone';
  const error = `${url} is no more`;
  req.flush(error, { status, statusText });
  return new HttpErrorResponse({ error, status, statusText, url });
}

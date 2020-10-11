import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestRequest } from '@angular/common/http/testing';

import { Component } from '@angular/core';
import { Type } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { HttpLoadModule } from './http-load.module';
import { HttpLoadTextFromDirective } from './http-load-from.directive';
import { HttpLoadJsonFromDirective } from './http-load-from.directive';

function setup<T>(component: Type<T>): [HttpTestingController, ComponentFixture<T>] {
  TestBed.configureTestingModule({
    declarations: [ component ],
    imports: [
      HttpClientTestingModule,
      HttpLoadModule,
    ],
  }).compileComponents();

  const httpTestingController = TestBed.inject(HttpTestingController);

  const host = TestBed.createComponent(component);
  host.detectChanges(); // initial binding

  return [ httpTestingController, host ];
}

const jsonPipe = new JsonPipe();

describe('*rlHttpLoad.text', () => {
  let httpTestingController: HttpTestingController;
  let host: ComponentFixture<TestTextComponent>;

  beforeEach(() => [ httpTestingController, host ] = setup(TestTextComponent));

  it('should create', () => {
    const directive = host.debugElement.queryAllNodes(By.directive(HttpLoadTextFromDirective))[0];
    expect(directive).toBeTruthy();
  });

  it('should be initially empty', () => {
    httpTestingController.verify();
    expectTextContent(host, '');
  });

  it('should download from url', () => {
    const url = changeUrl(host, '/text.txt');
    const req = expectHttpRequest(httpTestingController, url, 'text');
    req.flush(sampleText);
    expectTextContent(host, sampleText);
  });

  it('should abort on url change', () => {
    const url0 = changeUrl(host, '/text0.txt');
    const req0 = expectHttpRequest(httpTestingController, url0, 'text');

    const url1 = changeUrl(host, '/text1.txt');
    const req1 = expectHttpRequest(httpTestingController, url1, 'text');
    req1.flush(sampleText);

    flushTooLate(req0);

    expectTextContent(host, sampleText);
  });

  it('should abort download on destroy', () => {
    const url = changeUrl(host, '/text.txt');
    const req = expectHttpRequest(httpTestingController, url, 'text');
    host.destroy();
  });

  it('should abort on url change to null', () => {
    const url = changeUrl(host, '/text.txt');
    const req = expectHttpRequest(httpTestingController, url, 'text');

    changeUrl(host, null);
    httpTestingController.verify();

    flushTooLate(req);
  });

  it('should clear view on url change to null', () => {
    const url = changeUrl(host, '/text.txt');
    const req = expectHttpRequest(httpTestingController, url, 'text');
    req.flush(sampleText);

    changeUrl(host, null);
    httpTestingController.verify();
    expectTextContent(host, '');
  });

  it('should display network error', () => {
    const url = changeUrl(host, '/text.txt');
    const req = expectHttpRequest(httpTestingController, url, 'text');
    const errorResponse = flushNetworkError(req, url);
    expectTextContent(host, errorResponse);
  });

  it('should display server error', () => {
    const url = changeUrl(host, '/text.txt');
    const req = expectHttpRequest(httpTestingController, url, 'text');
    const errorResponse = flushServerError(req, url);
    expectTextContent(host, errorResponse);
  });

  it('should show `loading...`', () => {
    const url = changeUrl(host, '/text.txt');
    expectTextContent(host, `Loading ${url}...`);
    const req = expectHttpRequest(httpTestingController, url, 'text');
    req.flush(sampleText);
    expectTextContent(host, sampleText);
  });

  const sampleText = 'It is not by muscle, speed, or physical dexterity that great things are achieved, but by reflection, force of character, and judgment.';
});

describe('*rlHttpLoad.json', () => {
  let httpTestingController: HttpTestingController;
  let host: ComponentFixture<TestJsonComponent>;

  beforeEach(() => [ httpTestingController, host ] = setup(TestJsonComponent));

  it('should create', () => {
    const directive = host.debugElement.queryAllNodes(By.directive(HttpLoadJsonFromDirective))[0];
    expect(directive).toBeTruthy();
  });

  it('should be initially empty', () => {
    httpTestingController.verify();
    expectTextContent(host, '');
  });

  it('should download from url', () => {
    const url = changeUrl(host, '/object.json');
    const req = expectHttpRequest(httpTestingController, url, 'json');
    req.flush(sampleObject);
    expectTextContent(host, sampleObject);
  });

  it('should abort on url change', () => {
    const url0 = changeUrl(host, '/object0.json');
    const req0 = expectHttpRequest(httpTestingController, url0, 'json');

    const url1 = changeUrl(host, '/object1.json');
    const req1 = expectHttpRequest(httpTestingController, url1, 'json');
    req1.flush(sampleObject);

    flushTooLate(req0);

    expectTextContent(host, sampleObject);
  });

  it('should abort download on destroy', () => {
    const url = changeUrl(host, '/object.json');
    const req = expectHttpRequest(httpTestingController, url, 'json');
    host.destroy();
  });

  it('should abort on url change to null', () => {
    const url = changeUrl(host, '/object.json');
    const req = expectHttpRequest(httpTestingController, url, 'json');

    changeUrl(host, null);
    httpTestingController.verify();

    flushTooLate(req);
  });

  it('should clear view on url change to null', () => {
    const url = changeUrl(host, '/object.json');
    const req = expectHttpRequest(httpTestingController, url, 'json');
    req.flush(sampleObject);

    changeUrl(host, null);
    httpTestingController.verify();
    expectTextContent(host, '');
  });

  it('should display network error', () => {
    const url = changeUrl(host, '/object.json');
    const req = expectHttpRequest(httpTestingController, url, 'json');
    const errorResponse = flushNetworkError(req, url);
    expectTextContent(host, errorResponse);
  });

  it('should display server error', () => {
    const url = changeUrl(host, '/object.json');
    const req = expectHttpRequest(httpTestingController, url, 'json');
    const errorResponse = flushServerError(req, url);
    expectTextContent(host, errorResponse);
  });

  it('should display `loading...`', () => {
    const url = changeUrl(host, '/object.json');
    expectTextContent(host, `Loading ${url}...`);
    const req = expectHttpRequest(httpTestingController, url, 'json');
    req.flush(sampleObject);
    expectTextContent(host, sampleObject);
  });

  const sampleObject = {
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
  };
});

@Component({
  template:
  `
    <ng-template #httpLoading let-url>Loading {{url}}...</ng-template>
    <ng-template #httpError let-errorObject><pre>{{errorObject | json}}</pre></ng-template>
    <ng-container *rlHttpLoad.text="let loadedText from url; loading: httpLoading; onError: httpError">{{loadedText}}</ng-container>
  `,
})
class TestTextComponent {
  public url: string | null = null;
}

@Component({
  template:
  `
    <ng-template #httpLoading let-url>Loading {{url}}...</ng-template>
    <ng-template #httpError let-errorObject><pre>{{errorObject | json}}</pre></ng-template>
    <pre *rlHttpLoad.json="let loadedObject from url; loading: httpLoading; onError: httpError">{{loadedObject | json}}</pre>
  `,
})
class TestJsonComponent {
  public url: string | null = null;
}

/* utility functions */

type TestComponent = TestTextComponent | TestJsonComponent;

function expectTextContent(host: ComponentFixture<unknown>, expected: string | object): void {
  host.detectChanges();
  if (typeof expected !== 'string') {
    expected = jsonPipe.transform(expected);
  }
  expect((host.elementRef.nativeElement as HTMLElement).textContent).toBe(expected);
}

function changeUrl<T extends string | null>(host: ComponentFixture<TestComponent>, url: T): T {
  host.componentInstance.url = url;
  host.detectChanges();
  return url;
}

function expectHttpRequest(httpTestingController: HttpTestingController, url: string, responseType: 'text' | 'json'): TestRequest {
  const req = httpTestingController.expectOne(url);
  httpTestingController.verify();
  expect(req.request.method).toEqual('GET');
  expect(req.request.responseType).toEqual(responseType);
  return req;
}

function flushTooLate(req: TestRequest): void {
  expect(() => req.flush('this text should be ignored')).toThrowError('Cannot flush a cancelled request.');
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

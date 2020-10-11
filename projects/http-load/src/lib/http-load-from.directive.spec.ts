import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Component } from '@angular/core';
import { Type } from '@angular/core';

import { HttpLoadModule } from './http-load.module';
import { HttpLoadTextFromDirective } from './http-load-from.directive';
import { HttpLoadJsonFromDirective } from './http-load-from.directive';

function setup<T>(component: Type<T>): [ComponentFixture<T>] {
  TestBed.configureTestingModule({
    declarations: [ component ],
    imports: [
      HttpLoadModule,
    ],
  }).compileComponents();

  const host = TestBed.createComponent(component);
  host.detectChanges(); // initial binding

  return [ host ];
}

describe('*rlHttpLoad.text', () => {
  let host: ComponentFixture<TestTextComponent>;

  beforeEach(() => [ host ] = setup(TestTextComponent));

  it('should create', () => {
    const directive = host.debugElement.queryAllNodes(By.directive(HttpLoadTextFromDirective))[0];
    expect(directive).toBeTruthy();
  });

  it('should be initially empty', () => {
    expectTextContent(host, '');
  });
});

describe('*rlHttpLoad.json', () => {
  let host: ComponentFixture<TestJsonComponent>;

  beforeEach(() => [ host ] = setup(TestJsonComponent));

  it('should create', () => {
    const directive = host.debugElement.queryAllNodes(By.directive(HttpLoadJsonFromDirective))[0];
    expect(directive).toBeTruthy();
  });

  it('should be initially empty', () => {
    expectTextContent(host, '');
  });
});

@Component({
  template:
  `
    <ng-container *rlHttpLoad.text="loadedText"></ng-container>
  `,
})
class TestTextComponent {
}

@Component({
  template:
  `
    <pre *rlHttpLoad.json="let loadedObject"></pre>
  `,
})
class TestJsonComponent {
}

/* utility functions */

function expectTextContent(host: ComponentFixture<unknown>, expected: string): void {
  expect((host.elementRef.nativeElement as HTMLElement).textContent).toBe(expected);
}

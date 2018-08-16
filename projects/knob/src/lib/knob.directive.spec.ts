import { KnobDirective } from './knob.directive';
import { ElementRef } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';

class MockElementRef implements ElementRef {
  nativeElement = {};
}

describe('KnobDirective', () => {
  beforeEach(() => {
    TestBed
      .configureTestingModule({
        providers: [
          { provide: ElementRef, useClass: MockElementRef }
        ]
      });
  });

  it('should create an instance', inject([ElementRef], (elementRef: ElementRef) => {
    const directive = new KnobDirective(elementRef);
    expect(directive).toBeTruthy();
  }));
});

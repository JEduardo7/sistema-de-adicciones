import { TestBed } from '@angular/core/testing';
import { Caso } from './caso';

describe('Caso', () => {
  let service: Caso;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Caso);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

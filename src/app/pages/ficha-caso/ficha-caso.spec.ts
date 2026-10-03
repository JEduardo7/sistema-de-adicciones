import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FichaCaso } from './ficha-caso';

describe('FichaCaso', () => {
  let component: FichaCaso;
  let fixture: ComponentFixture<FichaCaso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaCaso],
    }).compileComponents();

    fixture = TestBed.createComponent(FichaCaso);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

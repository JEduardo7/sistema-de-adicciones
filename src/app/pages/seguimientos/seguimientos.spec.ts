import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Seguimientos } from './seguimientos';

describe('Seguimientos', () => {
  let component: Seguimientos;
  let fixture: ComponentFixture<Seguimientos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Seguimientos],
    }).compileComponents();

    fixture = TestBed.createComponent(Seguimientos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

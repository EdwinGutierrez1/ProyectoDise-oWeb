import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabanasComponent } from './cabanas.component';

describe('CabanasComponent', () => {
  let component: CabanasComponent;
  let fixture: ComponentFixture<CabanasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabanasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabanasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

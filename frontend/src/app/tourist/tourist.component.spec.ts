import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristComponent } from './tourist.component';

describe('TouristComponent', () => {
  let component: TouristComponent;
  let fixture: ComponentFixture<TouristComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouristComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureTableComponent } from './future-table.component';

describe('FutureTableComponent', () => {
  let component: FutureTableComponent;
  let fixture: ComponentFixture<FutureTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FutureTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FutureTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

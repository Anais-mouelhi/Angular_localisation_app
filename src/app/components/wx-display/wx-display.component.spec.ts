import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WxDisplayComponent } from './wx-display.component';

describe('WxDisplayComponent', () => {
  let component: WxDisplayComponent;
  let fixture: ComponentFixture<WxDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WxDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WxDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

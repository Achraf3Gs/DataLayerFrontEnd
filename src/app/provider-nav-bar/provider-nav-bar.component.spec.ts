import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderNavBarComponent } from './provider-nav-bar.component';

describe('ProviderNavBarComponent', () => {
  let component: ProviderNavBarComponent;
  let fixture: ComponentFixture<ProviderNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderNavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProviderNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

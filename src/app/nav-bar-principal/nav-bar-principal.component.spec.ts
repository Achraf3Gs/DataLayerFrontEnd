import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarPrincipalComponent } from './nav-bar-principal.component';

describe('NavBarPrincipalComponent', () => {
  let component: NavBarPrincipalComponent;
  let fixture: ComponentFixture<NavBarPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarPrincipalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavBarPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

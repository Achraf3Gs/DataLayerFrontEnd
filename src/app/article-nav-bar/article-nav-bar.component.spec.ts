import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleNavBarComponent } from './article-nav-bar.component';

describe('ArticleNavBarComponent', () => {
  let component: ArticleNavBarComponent;
  let fixture: ComponentFixture<ArticleNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleNavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelSearchComponent } from './level-search.component';

describe('LevelSearchComponent', () => {
  let component: LevelSearchComponent;
  let fixture: ComponentFixture<LevelSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LevelSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

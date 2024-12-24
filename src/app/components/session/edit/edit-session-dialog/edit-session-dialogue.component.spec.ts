import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSessionDialogueComponent } from './edit-session-dialogue.component';

describe('EditSessionDialogueComponent', () => {
  let component: EditSessionDialogueComponent;
  let fixture: ComponentFixture<EditSessionDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSessionDialogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSessionDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

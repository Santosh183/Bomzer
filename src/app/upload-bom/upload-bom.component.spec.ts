import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBomComponent } from './upload-bom.component';

describe('UploadBomComponent', () => {
  let component: UploadBomComponent;
  let fixture: ComponentFixture<UploadBomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadBomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadBomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

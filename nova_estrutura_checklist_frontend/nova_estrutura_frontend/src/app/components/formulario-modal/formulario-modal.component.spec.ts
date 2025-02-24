import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioModalComponent } from './formulario-modal.component';

describe('FormularioModalComponent', () => {
  let component: FormularioModalComponent;
  let fixture: ComponentFixture<FormularioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

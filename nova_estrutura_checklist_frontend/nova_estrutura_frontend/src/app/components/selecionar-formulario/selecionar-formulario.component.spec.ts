import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecionarFormularioComponent } from './selecionar-formulario.component';

describe('SelecionarFormularioComponent', () => {
  let component: SelecionarFormularioComponent;
  let fixture: ComponentFixture<SelecionarFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelecionarFormularioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelecionarFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { CriarFormularioService } from './criar-formulario.service';

describe('CriarFormularioService', () => {
  let service: CriarFormularioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CriarFormularioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

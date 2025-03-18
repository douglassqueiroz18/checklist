import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {
  private apiUrlGetSetores = '/api/setores';
  private apiUrlGetUsuarios = '/api/users';
  private formularioSelecionar: any = null;
  constructor(private http: HttpClient) { }
  obterSetores(): Observable<any> {
    return this.http.get(this.apiUrlGetSetores);
  } 
  obterUsuarios(): Observable<any> {
    return this.http.get(this.apiUrlGetUsuarios); // Corrigido para retornar usuários
  }
  
  setFormulario(formulario: any): void {
    this.formularioSelecionar = formulario;
    console.log('Formulário selecionado no serviço:', this.formularioSelecionar);
  }

  // Método para obter o formulário selecionado
  getFormulario(): any {
    return this.formularioSelecionar;
  }

}

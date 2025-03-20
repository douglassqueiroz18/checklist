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
  private novaOpcaoStatusSelecionada: any = null;
  constructor(private http: HttpClient) { }
  obterSetores(): Observable<any> {
    return this.http.get(this.apiUrlGetSetores);
  } 
  obterUsuarios(): Observable<any> {
    return this.http.get(this.apiUrlGetUsuarios); // Corrigido para retornar usuários
  }
  
  setTitulo(formulario: any): void {
    this.formularioSelecionar = formulario;
  }

  // Método para obter o formulário selecionado
  getTitulo(): any {
    return this.formularioSelecionar;
  }

  getStatusPorItem(): any {
    return this.novaOpcaoStatusSelecionada;
  }

  setStatusPorItem(status: any): any {
    this.novaOpcaoStatusSelecionada = status;
    console.log('vendo as opções selecionadas o formulario.service: ',this.novaOpcaoStatusSelecionada);
  }
}

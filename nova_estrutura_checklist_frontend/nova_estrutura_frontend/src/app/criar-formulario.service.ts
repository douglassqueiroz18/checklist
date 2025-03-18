import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CriarFormularioService {
  private apiUrlGetFormulariosCriados = '/api/formularios';
  private apiUrlPostFormulariosCriados = '/api/create_formularios'
  private apiUrlDeleteFormulariosCriados = '/api/delete'
  private apiUrlUpdateFormulariosCriados = '/api/edit'
  private apiUrlPostStatus = '/api/create_status'
  private apiUrlGetStatus = '/api/status'
  private formularioSelecionado = new BehaviorSubject<any>(null);
  private anomalia: any;
  formulario$ = this.formularioSelecionado.asObservable();
  formularioSelecionadoUnico: any;
  
  constructor(private http: HttpClient) { }
  obterFormulariosCriados(): Observable<any> {
    return this.http.get(this.apiUrlGetFormulariosCriados);
  }
  enviarFormulariosCriados(formulariosCriados: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrlPostFormulariosCriados,formulariosCriados, {headers});
  } 
  deletarFormulario(id_formulario: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.delete(`${this.apiUrlDeleteFormulariosCriados}/${id_formulario}`, {headers});
  }
  atualizarFormulario(formulario: any): Observable<any> {
  const formularioAtualizado = {
    id_formulario: formulario.id_formulario,
    nome: formulario.nome,
    status: formulario.status,
    id_status: formulario.id_status,
    id: formulario.id
  };

  return this.http.put(`${this.apiUrlUpdateFormulariosCriados}/${formulario.id_formulario}`, formularioAtualizado, {
    headers: new HttpHeaders({})
  }).pipe(
    tap(response => console.log("Formulário atualizado com sucesso:", response)), // Exibe a resposta no console
    catchError(error => {
      console.error("Erro ao atualizar o formulário:", error);
      return throwError(error);
    })
  );
}
  criarStatus(id_status: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrlPostStatus, id_status, {headers});
  };
  obterStatus(): Observable<any> {
    return this.http.get(this.apiUrlGetStatus);
  }
  formularioSelecionado$ = this.formularioSelecionado.asObservable();

  selecionarFormulario(formulario: any): void {
    this.formularioSelecionado.next(formulario);
  }
  setFormulario(formulario: any) {
    this.formularioSelecionado.next(formulario);  // Atualiza o BehaviorSubject com o novo formulário
    //const anomalia = this.formularioSelecionado.next(formulario);
    const anomalia = this.formularioSelecionado.getValue();
    //console.log('teste douglas', this.formularioSelecionado.getValue());  // Obtém o valor atual
    console.log('teste douglass', anomalia);
  }
  teste(){
    console.log('teste douglass', this.anomalia);
  }
  getFormulario() {
    //return this.formularioSelecionadoUnico;
    return this.formularioSelecionado.getValue();  // Retorna o valor atual do BehaviorSubject

  }
}

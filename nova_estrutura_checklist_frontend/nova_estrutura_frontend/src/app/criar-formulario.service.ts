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
  constructor(private http: HttpClient) { }
  obterFormulariosCriados(): Observable<any> {
    return this.http.get(this.apiUrlGetFormulariosCriados);
  }
  enviarFormulariosCriados(formulariosCriados: any): Observable<any> {
    console.log('Chamando Post no criar-formulario.service.ts para', this.apiUrlPostFormulariosCriados, 'com dados:', formulariosCriados);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrlPostFormulariosCriados,formulariosCriados, {headers});
  } 
  deletarFormulario(id_formulario: string): Observable<any> {
    console.log('Chamando Delete para',`${this.apiUrlDeleteFormulariosCriados}/${id_formulario}`);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.delete(`${this.apiUrlDeleteFormulariosCriados}/${id_formulario}`, {headers});
  }
  atualizarFormulario(formulario: any): Observable<any> {
    console.log("Chamando Put para:",`${this.apiUrlUpdateFormulariosCriados}/${formulario.id_formulario}`,'com dados', formulario);
  const formularioAtualizado = {
    id_formulario: formulario.id_formulario,
    nome: formulario.nome,
    status: formulario.status,
    id_status: formulario.id_status,
    id: formulario.id
  };
  console.log('Dados que serão passados no put', formularioAtualizado);

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
    console.log("Chamando o post para:", this.apiUrlPostStatus, id_status.id_status); // Corrigido o console.log
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
}

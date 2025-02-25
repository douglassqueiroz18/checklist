import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CriarFormularioService {
  private apiUrlGetFormulariosCriados = '/api/formularios';
  private apiUrlPostFormulariosCriados = '/api/create_formularios'
  private apiUrlDeleteFormulariosCriados = '/api/delete'
  private apiUrlUpdateFormulariosCriados = '/api/edit'
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
    status: formulario.status
  };
  return this.http.put(`${this.apiUrlUpdateFormulariosCriados}/${formulario.id_formulario}`, formularioAtualizado,{
    headers: new HttpHeaders({

    })
  });
  }
}

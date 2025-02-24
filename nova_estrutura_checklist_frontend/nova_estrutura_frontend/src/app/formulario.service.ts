import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {
  private apiUrlGetSetores = '/api/setores';
  private apiUrlGetUsuarios = '/api/users';
  constructor(private http: HttpClient) { }
  obterSetores(): Observable<any> {
    return this.http.get(this.apiUrlGetSetores);
  } 
  obterUsuarios(): Observable<any> {
    return this.http.get(this.apiUrlGetUsuarios); // Corrigido para retornar usuários
  }
}

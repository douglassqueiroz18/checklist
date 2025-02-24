import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormularioService } from './formulario.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrlGetUsuarios = '/api/users';
  private apiUrlPostUsuarios = 'api/create_user';
  private apiUrlGetSetores = '/api/setores';
  constructor(private http: HttpClient, formularioService: FormularioService) { }

  obterUsuarios(): Observable<any> {
    return this.http.get(this.apiUrlGetUsuarios);
  }
  enviarUsuarios(usuario: any): Observable<any> {
    console.log('Chamando Post para', this.apiUrlPostUsuarios, 'com dados:',usuario);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrlPostUsuarios, usuario, {headers});
  }
  obterSetores(): Observable<any> {
    return this.http.get(this.apiUrlGetSetores);
  }

}

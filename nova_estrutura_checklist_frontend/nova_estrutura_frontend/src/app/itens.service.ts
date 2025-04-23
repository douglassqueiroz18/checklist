  import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable, tap } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class ItensService {
    private apiUrlPostItens = '/api/create_itens';
    private apiUrlGetItens = '/api/itens';    // URL do backend para obter itens
    private apiUrlDeleteItens = '/api/itens/delete'; // URL do backend para deletar itens
    private apiUrlUpdateItens = '/api/itens/update'; // URL do backend para atualizar itens
    private apiUrlGetItensporId = '/api/itens';
    private apiUrlPostStatus = '/api/create_status'
    constructor(private http: HttpClient) {}

    // Método para enviar um novo item ao backend
    enviarItem(item: any, formulario: any, id_formulario: any, id_status: any): Observable<any> {
      const body = {
        item: typeof item === 'object' ? item.item : item,  // ✅ Agora usa o parâmetro correto
        formulario: formulario,
        id_formulario: id_formulario,
        id_status: item.id_status
      };
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.post(this.apiUrlPostItens, body, { headers });
    }

  // Método para obter a lista de itens do backend
  obterItens(): Observable<any> {
    return this.http.get(this.apiUrlGetItens);
  }
  obterItensPorFormulario(formularioId: number): Observable<any[]> {
    return this.http.get<any[]>(`/api/itens_por_formulario/${formularioId}`);
  }
  // Método para deletar um item pelo ID
// Método para deletar um item pelo ID
deletarItem(itemId: string): Observable<any> {
  console.log('Chamando DELETE para:', `${this.apiUrlDeleteItens}/${itemId}`);
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  return this.http.delete(`${this.apiUrlDeleteItens}/${itemId}`, { headers });
}

deletarItensPorFormulario(formularioId: number): Observable<any> {
  return this.http.delete(`/api/itens/delete/${formularioId}`);
}
atualizarItem(item: any): Observable<any> {
  console.log('Chamando PUT para:', `${this.apiUrlUpdateItens}/${item.id}`, 'com dados:', item.item, 'com id_status:', item.selectedOption);
  console.log('Conteúdo do item:', item);
    // Ajustar para enviar o campo correto para o backend
  const itemAtualizado = {
    id: item.id,
    item: item.item,  // Envia a chave 'item' esperada pelo backend
    id_status: item.selectedOption
  };
  console.log("conteudo que será utilizado para atualizar",itemAtualizado);
  return this.http.put(`${this.apiUrlUpdateItens}/${item.id}`, itemAtualizado, {
    //return this.http.put(`http://localhost:5000/api/itens/update/${item.id}`, item, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  }).pipe(
    tap(
      (response: any) => {
        console.log('Resposta indo ao backend', response);
      },
      (error: HttpErrorResponse) => {
        console.log('Erro ao atualizar', error);
      }
    )
  );
}

obterItemPorId(item: any): Observable<any>{
  const url = `${this.apiUrlGetItensporId}/${item.id}`; // Formata a URL corretamente
  return this.http.get(url);
}
criarStatus(id_status: any): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(this.apiUrlPostStatus, id_status, {headers});
};
}

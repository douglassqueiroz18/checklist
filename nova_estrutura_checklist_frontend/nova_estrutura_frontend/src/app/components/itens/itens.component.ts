import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ItensService } from '../../itens.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-itens',
  templateUrl: './itens.component.html',
  styleUrls: ['./itens.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, CommonModule,MatCardModule ]  // Adicionar CommonModule aqui
})
export class ItensComponent implements OnInit {
  itens: any[] = [];  // Array de itens
  descricao = '';  // A descrição será enviada para o backend
  itemEmEdicao: any | null = null; // Armazena o item que está sendo editado
  sucessoCriacao: boolean = false;  // Variável para controlar a exibição da mensagem de sucesso

  constructor(private itensService: ItensService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.itensService.obterItens().subscribe(
      (data: any[]) => {
        this.itens = data.map(item => ({
          id: item.id || item.itemId || null,  // Ajuste o mapeamento conforme necessário
          descricao: item.item || item.itemDescricao || 'Descrição não encontrada'
        }));
        console.log('Itens recebidos:', data);  // Verifique no console se os itens estão corretos
        this.itens.forEach(item => {
          console.log('Item descricao:', item.descricao);
        });
        this.cdRef.detectChanges();  // Força a atualização da UI

      },
      (error: any) => {
        console.error('Erro ao obter itens:', error);
      }
    );
  }
  editarItem(item: any) {
    console.log('Item a ser editado:', item);
    this.itemEmEdicao = { ...item };  // Copia o item para edição
    this.descricao = item.descricao;  // Preenche o campo de descrição com o valor atual
  }
  salvarItem() {
    console.log('salvarItem foi chamado');  // Verifique se isso aparece no console
    if (this.itemEmEdicao) {
      // Atualiza a descrição do item sendo editado
      this.itemEmEdicao.descricao = this.descricao;
      // Log do objeto antes de enviar
      console.log('Item enviado para atualização:', this.itemEmEdicao);

      this.itensService.atualizarItem(this.itemEmEdicao).subscribe(
        (response: any) => {
          console.log('Resposta do backend:', response);
          const index = this.itens.findIndex(item => item.id === this.itemEmEdicao.id);
          if (index !== -1) {
            this.itens[index] = response;  // Atualiza a lista de itens com o item editado
          }
          this.cancelarEdicao();  // Limpa a edição
        },
        (error: any) => {
          console.error('Erro ao salvar item:', error);
        }
      );
    } else {
      this.criarItem();
    }
  }

  criarItem() {
    console.log('Enviando descrição para o backend:', this.descricao);
    
    const body = {
      item: this.descricao  // Envia 'descricao' como 'item'
      
    };
    
    this.itensService.enviarItem(body).subscribe(
      (response: any) => {
        console.log('Item criado com sucesso:', response);
        const novoItem = { item: response.id, descricao: response.item };  // Supondo que o 'response' tenha a estrutura correta
        this.itens.push(novoItem);
        this.descricao = '';  // Limpa o campo de descrição após o envio
        this.sucessoCriacao = true;  // Ativa a exibição da mensagem de sucesso
        setTimeout(() => {
          this.sucessoCriacao = false;  // Desativa após 3 segundos
        }, 3000);
      },
      (error: any) => {
        console.error('Erro ao criar item: component.ts', error);
      }
    );
  }
  deletarItem(itemId: string): void {
    console.log('Chamando item.component -> deletarItem com ID:', itemId); // Verifique se o ID é o correto
    this.itensService.deletarItem(itemId).subscribe(
      (response) => {
        console.log('Item deletado:', response);
        this.itens = this.itens.filter(item => item.item !== itemId); // Atualiza a lista local
      },
      (error) => {
        console.error('Erro ao deletar item:', error);
      }
    );
  }


  cancelarEdicao() {
    this.itemEmEdicao = null; // Reseta o item em edição
    this.descricao = ''; // Limpa o campo de descrição
  }
}
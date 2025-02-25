import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, NgZone, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ItensService } from '../../itens.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { CriarFormularioService } from '../../criar-formulario.service';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-formulario-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatIconModule,MatListModule ],
  templateUrl: './formulario-modal.component.html',
  styleUrl: './formulario-modal.component.css'
})
export class FormularioModalComponent {
  formulariosCriados: { id_formulario: number | null; nome: string;itens: string[]}[] = [];
  formulariosEmEdicao: any [] = [];
  nome:string= '';
  carregando: boolean = false;
  erro: string | null = null;
  itemPorFormulario: any[] = [];
  formularioTeste: any[] = [];
  itens: any[] = [];
  dadosOriginais: any[] = [];
  titulo: string;
  formulario: any ={};
  itemParaEdicao: any={};
  id: any[]=[];
  @Input() modalAberto: boolean = true;
  //@Input() formulario: any = {}; // Objeto do formulário recebido
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<any>();

constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,  // Recebe os dados passados pelo componente pai
  private ItensService: ItensService,
  private CriarFormularioService: CriarFormularioService,
  private cdRef: ChangeDetectorRef,
  private ngZone: NgZone
)
{
  // Atribuindo os dados recebidos ao título e formulário
  if (data && data.formulario) {
    this.formulario = data.formulario;
  } else {
    console.warn('Nenhum formulário foi recebido!');
  }
  this.titulo = data.titulo || '';  // Atribuindo título
}

ngAfterViewInit() {
  // Força a detecção de mudanças após o componente estar totalmente carregado
  this.cdRef.detectChanges();
}
abrirModalFormulario(){
  this.modalAberto = true;
}
fecharModalFormulario() {
  this.modalAberto = false;
  this.fechar.emit(); // Emite evento para fechar o modal
}

ngOnInit() {
  //this.carregarFormularios();

  this.carregarItens();
  this.ItensService.obterItens().subscribe(
    (data: any[]) => {
      this.itens = data.map(item => ({
        id: item.id || item.itemId || null,  // Ajuste o mapeamento conforme necessário
        descricao: item.item || item.itemDescricao || 'Descrição não encontradaaaaaa',
        formulario: item.formulario || 'Formulario do item não encontrado'
      }));

      this.cdRef.detectChanges();  // Força a atualização da UI
      
    },
    (error: any) => {
      console.error('Erro ao obter itens:', error);
    }
  );
}

carregarItens() {
  if(!this.formulario || !this.formulario.id_formulario){
    console.warn('Nenhum formulário selecionado para carregar os itens.');
    return;
  }
  this.itens = [];

  this.ItensService.obterItensPorFormulario(this.formulario.id_formulario).subscribe(
    (data: any[]) => {
      this.ngZone.run(() => {
        this.dadosOriginais = data;
        this.formularioTeste = data.map(itemPorFormulario => ({
          id: itemPorFormulario.id || itemPorFormulario.Id || null,
          descricao: itemPorFormulario.item || itemPorFormulario.itemDescricao || 'Descrição não encontrada'
        }));
        console.log("teste para saber os itens", this.formularioTeste);
        this.cdRef.detectChanges();
        console.log('Itens recebidos no formulario-modal.component.ts:', this.formularioTeste);
      });
    },
    (error: any) => {
      console.error('Erro ao obter itens no formulario-modal.component.ts:', error);
    }
  );
}


  editarFormularioModal(formularioAtualizar: any) {
    const id_a_ser_editado = this.formulario.id_formulario;
    const formularioParaAtualizar = {
      id_formulario: this.formulario.id_formulario, 
      nome: this.formulario.nome, 
      status: this.formulario.status  // Inclua todos os campos necessários para a atualização
    };
    console.log("Formulario a ser enviado para atualização:", formularioParaAtualizar);
  
    this.CriarFormularioService.atualizarFormulario(formularioParaAtualizar).subscribe(
      () => {

        this.fecharModalFormulario(); // Fecha o modal após salvar
        location.reload();
      },
      (error) => {
        console.error("Erro ao atualizar formulário:", error);
      }
    );
  }
  editarItem(formularioTeste: any){
    console.log("chamando a atualização do item com o item", this.formularioTeste);
    console.log("teste para ver o que está vindo", formularioTeste);
    const itemAtualizado = {
      id: formularioTeste.id,        // Envia o ID do item na URL
      item: formularioTeste.descricao || ''  // Envia a descrição do item ou qualquer outro campo relevante
    };
   this.ItensService.atualizarItem(itemAtualizado).subscribe(
    (updatedItem) => {
      this.itemParaEdicao = updatedItem;
      console.log("Item enviado para edicao no formulario-modal.component", this.itemParaEdicao);
      setTimeout(() => {
        console.log("Item atualizado:", this.itemParaEdicao);
      }, 100); // Espera 1 segundo antes de exibir no console
    },
    (error) => {
      console.error('Erro ao obter item', error);
    }
  );
  }
}
  


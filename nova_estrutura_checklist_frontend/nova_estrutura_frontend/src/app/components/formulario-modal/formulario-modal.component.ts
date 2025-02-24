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
@Component({
  selector: 'app-formulario-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatIconModule, ],
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
  this.titulo = data.titulo;
  this.formulario = data.formulario;
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
  this.itens=[];
  this.ItensService.obterItensPorFormulario(this.formulario.id_formulario).subscribe(
    (data: any[]) => {
      this.ngZone.run(() => {
        this.dadosOriginais = data;
        this.formularioTeste = data.map(itemPorFormulario => ({
          id: itemPorFormulario.id || itemPorFormulario.Id || null,
          descricao: itemPorFormulario.item || itemPorFormulario.itemDescricao || 'Descrição não encontrada'
          
        }));
        this.cdRef.detectChanges();
        console.log('Itens recebidos no formulario-modal.component.ts:', this.formularioTeste);
      });
    },
      (error: any) => {
        console.error('Erro ao obter itens no formulario-modal.component.ts:', error);
      }
    );
  }
/*
carregarFormularios(): void {
  this.carregando = true;
  this.erro = null;

  this.CriarFormularioService.obterFormulariosCriados().subscribe(
    (data: any[]) => {
      this.carregando = false;
      if (data && Array.isArray(data)) {
        this.formulariosCriados = data.map((formularioCriado) => ({
          id_formulario: formularioCriado.id_formulario,
          nome: formularioCriado.nome,
          itens: formularioCriado.itens || []  // Garante que 'itens' sempre exista
        }));
      } else{
        this.formulariosCriados = [];  // Retorna uma lista vazia se data for null ou não for um array
      }
      console.log("Formulários carregados:", this.formulariosCriados);
      this.cdRef.detectChanges();
    },
    (error: any) => {
      this.carregando = false;
      this.erro = 'Erro ao carregar os formulários. Por favor, tente novamente.';
    }
  );
}*/
  editarFormularioModal(formulariosCriados: any) {
    console.log("teste douglas1", this.formulariosCriados.map(formulario => formulario.id_formulario));

    var formularioASerEditado = this.formulariosCriados[0];  // ou outro índice, ou uma lógica para pegar o formulário desejado

    console.log("teste douglas1", formularioASerEditado);
    
    this.CriarFormularioService.atualizarFormulario(formularioASerEditado).subscribe(
      (res) => {
        console.log("Formulário atualizado com sucesso:", res);
        this.fecharModalFormulario(); // Fecha o modal após salvar
        location.reload();
      },
      (error) => {
        console.error("Erro ao atualizar formulário:", error);
      }
    );
  }
  editarItem(id: any){
    console.log('Editando item com ID:', id);

   this.ItensService.atualizarItem(id).subscribe(
    (updatedItem)=> {
      this.itemParaEdicao = updatedItem;
      console.log('Item para edição', updatedItem);
    },
    (error) => {
      console.error('Erro ao obter item', error);
    }
  );
  }
   
}
  


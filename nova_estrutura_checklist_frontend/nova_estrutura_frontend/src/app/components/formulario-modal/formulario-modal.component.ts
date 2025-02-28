import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, NgZone, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ItensService } from '../../itens.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { CriarFormularioService } from '../../criar-formulario.service';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-formulario-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatIconModule, MatListModule,MatSelectModule ],
  templateUrl: './formulario-modal.component.html',
  styleUrl: './formulario-modal.component.css'
})
export class FormularioModalComponent {
  formulariosCriados: { id_formulario: number | null; nome: string;itens: string[]}[] = [];
  formulariosEmEdicao: any [] = [];
  nome:string= '';
  carregando: boolean = false;
  sucessoCriacao: boolean = false; // Controla a exibição da mensagem de sucesso
  erro: string | null = null;
  itemPorFormulario: any[] = [];
  formularioTeste: any[] = [];
  itens: any[] = [];
  descricao = '';  // A descrição será enviada para o backend
  novoFormulario: { id_formulario: number | null; nome: string; itens:string[] } = { id_formulario: null, nome: '', itens: [] }; // Para o formulário atual
  dadosOriginais: any[] = [];
  titulo: string;
  formulario: any ={};
  itemParaEdicao: any={};
  id: any[]=[];
  descricao_status: any[]=[];
  selectedStatus: string = ''; // Armazena a opção selecionada
  selectedOption: string = ''; // Define a propriedade para armazenar a opção selecionada
  novaOpcaoStatusSelecionada: string = ''; // Para armazenar a opção selecionada

  options: any[] = []; // Armazena as opções do select
  @Input() modalAberto: boolean = true;
  //@Input() formulario: any = {}; // Objeto do formulário recebido
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<any>();

constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,  // Recebe os dados passados pelo componente pai
  private ItensService: ItensService,
  private dialogRef: MatDialogRef<FormularioModalComponent>, // Adicionar referência ao dialog
  private CriarFormularioService: CriarFormularioService,
  private cdRef: ChangeDetectorRef,
  private ngZone: NgZone,
  private cdr: ChangeDetectorRef
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
  this.dialogRef.close(); // Fechar modal corretamente

  //this.fechar.emit(); // Emite evento para fechar o modal
}

ngOnInit() {
  //this.carregarFormularios();
  this.carregarStatus();
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
          descricao: itemPorFormulario.item || itemPorFormulario.itemDescricao || 'Descrição não encontrada',
          id_status: itemPorFormulario.id_status
        }));
        console.log('dados do carregarItens ',this.dadosOriginais);
        this.cdRef.detectChanges();
      });
    },
    (error: any) => {
      console.error('Erro ao obter itens no formulario-modal.component.ts:', error);
    }
  );
}


  editarFormularioModal(formularioAtualizar: any) {
    const id_a_ser_editado = this.formulario.id_formulario;
    const primeiroItem = this.formularioTeste.length > 0 ? this.formularioTeste[0] : null;

    const formularioParaAtualizar = {
      id_formulario: this.formulario.id_formulario, 
      nome: this.formulario.nome, 
      status: this.formulario.status,
      id_status: primeiroItem ? primeiroItem.id_status : null  // Evita erro de acesso a array vazio
    };
  
    this.CriarFormularioService.atualizarFormulario(formularioParaAtualizar).subscribe(
      (response) => {
        console.log("Atualização concluída com sucesso:", response);
        alert("Formulário atualizado com sucesso!"); // Exibe um alerta de sucesso
        this.fecharModalFormulario(); // Fecha o modal após salvar
        //location.reload();
      },
      (error) => {
        console.error("Erro ao atualizar formulário:", error);
      }
    );
  }
  editarItem(formularioTeste: any){
    console.log('Item selecionado para edição:', formularioTeste);
    console.log('Opção escolhida:', formularioTeste.id_status); // Mostra a opção escolhida do item específico
      const itemAtualizado = {
      id: formularioTeste.id,        // Envia o ID do item na URL
      item: formularioTeste.descricao || '',  // Envia a descrição do item ou qualquer outro campo relevante
      selectedOption: formularioTeste.id_status, // Enviando a opção junto para conferência
    };
   this.ItensService.atualizarItem(itemAtualizado).subscribe(
    (updatedItem) => {
      this.itemParaEdicao = updatedItem;
      setTimeout(() => {
        console.log("Item atualizado:", this.itemParaEdicao);
      }, 100); // Espera 1 segundo antes de exibir no console
    },
    (error) => {
      console.error('Erro ao obter item', error);

    }
  );
  }
  criarItem() {
    console.log('dados que estão indo dentro do criar item variavel descricao', this.descricao);
    console.log('dados que estão indo dentro do criar item variavel formulario', this.formulario);

    if (!this.descricao.trim()) {
      console.error('A descrição do item não pode estar vazia.');
      return;
    }
    const body = {
      item: this.descricao,
      formulario: this.novoFormulario.nome,
      id_formulario: this.novoFormulario.id_formulario
    };
    console.log('corpo de criar item',body);
    this.ItensService.enviarItem(body, this.formulario.nome, this.formulario.id_formulario, this.formulario.id_status).subscribe(
      (response: any) => {
        const novoItem = { item: response.id_formulario, descricao: response.descricao, formulario: response.formulario, id_formulario: response.id_formulario };  // Supondo que o 'response' tenha a estrutura correta
        this.itens.push(novoItem);
        // Agora limpa o campo 'descricao' após a requisição ser bem-sucedida
        this.descricao = '';  // Limpa a variável de descrição após o envio
        this.sucessoCriacao = true;  // Ativa a exibição da mensagem de sucesso
  
        setTimeout(() => {
          this.sucessoCriacao = false;  // Desativa após 3 segundos
        }, 3000); 
      },
      (error: any) => {
        console.error('Erro ao criar item:', error);
      }
    );
  }
  deletarItem(itemId: string) {
    this.formularioTeste = this.formularioTeste.filter(item => item.id !== itemId);
    console.log('testando o deletar item',this.formularioTeste);
    this.ItensService.deletarItem(itemId).subscribe({
      next: () => {
        console.log('Item deletado com sucesso!');
        alert('Item deletado com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao deletar item:', err);
        alert('Erro ao deletar item.');
      }
    });
  }
  carregarStatus() {
    this.CriarFormularioService.obterStatus().subscribe(
      (data: any[]) => {
        this.ngZone.run(() => {
          this.options = data.map(item => ({
            value: item.id_status ?? null,  // Evita valores undefined
            label: item.descricao_status ?? 'Sem descrição'
          }));
          this.cdRef.detectChanges();
        });
      },
      (error: any) => {
        console.error('Erro ao obter status no formulario-modal.component.ts:', error);
      }
    );
  }
  criarStatus(){
    if (!this.descricao_status) {
      console.error('A descricao do status não pode ser vazia.');
      return;
    }
    const body = {
      descricao_status: this.descricao_status
    };
    this.CriarFormularioService.criarStatus(body).subscribe({
      next: (response) => {
        console.log('Status criado com sucesso:', response);
      },
      error: (error) => {
        console.error('Erro ao criar status:', error);
      }
    });
  };
  onOptionSelected(event: any) {
    this.novaOpcaoStatusSelecionada = event.value;
    this.cdr.detectChanges(); // Força atualização da interface
    console.log('Opção realmente salva:', this.novaOpcaoStatusSelecionada);  }
}
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CriarFormularioService } from '../../criar-formulario.service';
import { MatCardHeader, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ItensService } from '../../itens.service';
import { FormularioModalComponent } from '../formulario-modal/formulario-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-criar-formulario',
  templateUrl: './criar-formulario.component.html',
  styleUrls: ['./criar-formulario.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, CommonModule, MatCardModule, MatCardHeader,MatSelectModule, MatIconModule, ReactiveFormsModule],
})
export class CriarFormularioComponent implements OnInit {
  formulariosEmEdicao: any | null = null;
  formulariosCriados: { id_formulario: number | null; nome: string;itens: string[], id_status: number}[] = [];
  formulariosEditados: {  id_formulario: number | null; nome: string;itens: string[]}[] = [];
  carregando: boolean = false;
  erro: string | null = null;
  sucessoCriacao: boolean = false; // Controla a exibição da mensagem de sucesso
  novoFormulario: { id_formulario: number | null; nome: string; itens:string[],id_status: number | null } = { id_formulario: null, nome: '', itens: [], id_status:null }; // Para o formulário atual
  modalAberto: boolean = false;
  itens: any[] = [];
  nome:string= '';
  dadosOriginais: any[] = [];
  descricao_status: any[]=[];
  selectedStatus: string = ''; // Armazena a opção selecionada
  selectedOption: string = ''; // Define a propriedade para armazenar a opção selecionada
  descricao = '';  // A descrição será enviada para o backend
  itemEmEdicao: any | null = null; // Armazena o item que está sendo editado
  novaOpcaoStatusSelecionada: string = ''; // Para armazenar a opção selecionada
  options: any[] = []; // Armazena as opções do select
  statusForm: FormGroup;
  mostrarCampoNovoStatus: boolean = false; // Inicialmente escondido
  novoStatus: any;

  constructor(
    private criarFormularioService: CriarFormularioService,
    private cdRef: ChangeDetectorRef,
    private ItensService: ItensService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private fb: FormBuilder
  ) {
    this.statusForm = this.fb.group({
      descricao_status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.carregarStatus();
    this.carregarFormularios();
    this.carregarItens1;
  }
  carregarItens() {
    console.log('carregando items');
    this.ItensService.obterItens().subscribe(
      (data: any[]) => {
        this.dadosOriginais = data;  // Armazena o "data" completo
        this.itens = data.map(item => ({
          id: item.id || item.itemId || null,
          descricao: item.item || item.itemDescricao || 'Descrição não encontrada'
        }));
        this.cdRef.detectChanges();
      },
      (error: any) => {
        console.error('Erro ao obter itens no criar-formulario.component.ts:', error);
      }
    );
  }
  carregarItens1(formularioId: number) {
    this.ItensService.obterItensPorFormulario(formularioId).subscribe(
      (data: any[]) => {
        this.dadosOriginais = data;  // Armazena o "data" completo
        this.itens = data.map(item => ({
          id: item.id || item.itemId || null,
          descricao: item.descricao || item.itemDescricao || 'Descrição não encontrada'
        }));
        this.cdRef.detectChanges();
      },
      (error: any) => {
        console.error(`Erro ao obter itens do formulário ${formularioId} no criar-formulario.component.ts:`, error);
      }
    );
  }
  ngOnInit1() {
    this.ItensService.obterItens().subscribe(
      (data: any[]) => {

        this.itens = data.map(item => ({
          id: item.id || item.itemId || null,  // Ajuste o mapeamento conforme necessário
          descricao: item.item || item.itemDescricao || 'Descrição não encontrada',
          formulario: item.formulario || 'Formulario do item não encontrado'
        }));
        this.itens.forEach(item => {
          console.log('Item descricao:', item.descricao);

        });
        this.cdRef.detectChanges();  // Força a atualização da UI

      },
      (error: any) => {
        console.error('Erro ao obter itens:', error);
      }
    )
  }
  abrirNovoStatus() {
    this.mostrarCampoNovoStatus = true; // Exibe o campo ao clicar
  }
  abrirModal(): void {
    this.modalAberto = true;
    // Se for um novo formulário, cria um ID temporário, mas NÃO chama carregarItens()
    if (!this.novoFormulario.id_formulario) {
      this.novoFormulario = {
        id_formulario: Date.now(), // ID temporário único
        nome: '',
        itens: [], // Começa vazio, sem buscar do backend
        id_status: null
      }
    }
  }

  carregarFormularios(): void {
    this.carregando = true;
    this.erro = null;

    this.criarFormularioService.obterFormulariosCriados().subscribe(
      (data: any[]) => {
        this.carregando = false;
        if (data && Array.isArray(data)) {
          this.formulariosCriados = data.map((formularioCriado) => ({
            id_formulario: formularioCriado.id_formulario,
            nome: formularioCriado.nome,
            itens: formularioCriado.itens || [],  // Garante que 'itens' sempre exista
            id_status: formularioCriado.id_status
          }));
        } else{
          this.formulariosCriados = [];  // Retorna uma lista vazia se data for null ou não for um array
        }
        this.cdRef.detectChanges();
      },
      (error: any) => {
        this.carregando = false;
        this.erro = 'Erro ao carregar os formulários. Por favor, tente novamente.';
      }
    )
  }
  fecharModal(): void {
    this.modalAberto = false;
    this.novoFormulario = { id_formulario: null, nome: '', itens: [], id_status: null}; // Limpa os dados do formulário
    this.itens = []; // Garante que os itens sejam limpos ao fechar o modal
  }
  

  recarregar(): void {
    this.carregarFormularios();
  }

  criarFormulario(): void {
    console.log('testando criar formulario');
    if (!this.novoFormulario.nome.trim()) {
      this.erro = 'O nome do formulário não pode estar vazio.';
      return;
    }
    const idStatusSelecionado = this.novaOpcaoStatusSelecionada || this.novoStatus?.id_status

    this.criarFormularioService.enviarFormulariosCriados(this.novoFormulario).subscribe(
      (response: any) => {

        // Adiciona o novo formulário à lista
        this.formulariosCriados.push({
          id_formulario: response.id_formulario,
          nome: response.nome,
          itens: response.itens || [], // Garante que itens seja um array vazio, se estiver ausente
          id_status: idStatusSelecionado || response.id_status
        });
        // Reseta os valores para o próximo formulário
        this.novoFormulario = { id_formulario: null, nome: '', itens: [], id_status: null };
        location.reload();

        this.sucessoCriacao = true;
        window.location.reload();

        console.log('teste dos dados do fomrulariosCriados', this.novoFormulario);

        // Remove a mensagem de sucesso após alguns segundos
        setTimeout(() => {
          location.reload();
          this.sucessoCriacao = true;
        }, 3000);
        
      },
      (error: any) => {
        console.error('Erro ao criar o formulário:', error);
        this.erro = 'Erro ao criar o formulário. Por favor, tente novamente.';
      }
    ) 
  }
  salvarFormulario(): void {
    console.log('chamando o salvar formulario');
    this.novoFormulario.id_status = this.novoFormulario.id_status || this.novaOpcaoStatusSelecionada || this.novoStatus?.id_status;

    console.log('Dados do novo formulário antes de enviar:', this.novoFormulario);

    if (!this.novoFormulario.nome.trim()) {
      this.novoFormulario.id_formulario = Date.now(); // Gera o ID temporário
      this.erro = 'O nome do formulário não pode estar vazio.';
      return; // Não envia o formulário se o nome estiver vazio
    }
    this.criarFormularioService.enviarFormulariosCriados(this.novoFormulario).subscribe(
      (response) => {
      // Agora, você tem o id_formulario da resposta
      const idFormularioSalvo = this.novoFormulario;  // Supondo que o ID venha na resposta
      // Passa o id_formulario ao salvar os itens
      const idStatus = this.novoFormulario.id_status; // Armazena o id_status antes de resetar
      this.novoFormulario.itens.forEach(item => {
        this.ItensService.enviarItem(item, this.novoFormulario, idFormularioSalvo, idStatus).subscribe(
          
          (itemResponse) => {
            console.log('Item salvo:', itemResponse);
            // Aqui você pode adicionar o item salvo na lista ou realizar outra ação
          },
          (error) => {
            console.error('Erro ao salvar item:', error);
          }
        );
      })
        this.formulariosCriados.push(response);
        this.fecharModal();
        console.log('testando o console');

      },
      (error) => {
        console.error('Erro ao salvar formulário:', error);
      }
    )
  }
 
  abrirModalFormulario(formulario?: any): void {
    const dialogRef = this.dialog.open(FormularioModalComponent,{
      width: '600px',
      data: {
        formulario: formulario // Passa o título do formulário
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        console.log('Formulario salvo:', result);
        this.carregarFormularios();
      }
    });
  }
  
  criarItem() {
    if (!this.descricao.trim()) {
      console.error('A descrição do item não pode estar vazia.');
      return;
    }
    if (!this.novoFormulario?.id_formulario) {
      console.error('Erro: ID do formulário não está definido.');
      return;
    }
    const idStatusSelecionado = this.novaOpcaoStatusSelecionada || this.novoStatus?.id_status

    const body = {
      item: this.descricao,
      formulario: this.novoFormulario.nome,
      id_formulario: this.novoFormulario.id_formulario,
      id_status: idStatusSelecionado
    };
    console.log('Testando o item que está sendo criado',body);
    this.ItensService.enviarItem(body, this.novoFormulario.nome, this.novoFormulario.id_formulario, this.novoFormulario.id_status).subscribe(
      (response: any) => {
        const novoItem = { item: response.id_formulario, descricao: response.descricao, formulario: response.formulario, id_formulario: response.id_formulario, id_status: response.id_status };  // Supondo que o 'response' tenha a estrutura correta
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
  
  deletarFormulariosCriados(formularioId: number | null): void {
    if (formularioId === null) {
      console.error('ID do formulário não pode ser nulo');
      return;  // Evita tentar deletar um formulário com ID nulo
    }
      
    // Primeiro, vamos carregar os formulários para encontrar o ID correto
    this.carregarFormularios();
    
    // Após os formulários serem carregados, seguimos com a exclusão do formulário
    const formularioIdNumber = Number(formularioId);
    const formulario = this.formulariosCriados.find(formulario => formulario.id_formulario === formularioIdNumber);
    
    this.criarFormularioService.deletarFormulario(String(formularioId)).subscribe(
      () => {
        console.log("Formulário deletado com sucesso!");
        
        // Atualizar a lista de formulários criados após a exclusão
        this.formulariosCriados = this.formulariosCriados.filter(formulario => formulario.id_formulario !== formularioIdNumber);
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Erro ao deletar formulário:', error);
      }
    );
  }
  carregarStatus() {
    this.criarFormularioService.obterStatus().subscribe(
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
  criarStatus() {
    if (this.statusForm.invalid) {
      console.error('A descrição do status não pode ser vazia.');
      return;
    }
    const novoStatus = {
      id_status: Date.now(), // Usa o timestamp atual como ID único temporário
      descricao_status: this.statusForm.value.descricao_status
    };
  
    this.criarFormularioService.criarStatus(novoStatus).subscribe({
      next: (response) => {
        console.log('Status criado com sucesso:', response);
        this.statusForm.reset(); // Limpa o formulário após salvar
              // Atualiza `this.novoStatus` com o ID real retornado pelo backend
        this.novoStatus = {
          id_status: response.id_status, // Usa o ID correto do backend
          descricao_status: response.descricao_status
        };

      },
      error: (error) => {
        console.error('Erro ao criar status:', error);
      }
    });
  }
  onOptionSelected(event: any) {
    this.novaOpcaoStatusSelecionada = event.value;
    this.novoFormulario.id_status = event.value; // Atualiza o id_status diretamente no objeto correto
    this.cdr.detectChanges(); // Força atualização da interface
    console.log('Opção realmente salva:', this.novaOpcaoStatusSelecionada);  
  }

}
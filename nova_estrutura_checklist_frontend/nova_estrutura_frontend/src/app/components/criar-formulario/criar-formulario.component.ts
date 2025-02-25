import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CriarFormularioService } from '../../criar-formulario.service';
import { MatCardHeader, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ItensService } from '../../itens.service';
import { FormularioModalComponent } from '../formulario-modal/formulario-modal.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-criar-formulario',
  templateUrl: './criar-formulario.component.html',
  styleUrls: ['./criar-formulario.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, CommonModule, MatCardModule, MatCardHeader],
})
export class CriarFormularioComponent implements OnInit {
  formulariosEmEdicao: any | null = null;
  formulariosCriados: { id_formulario: number | null; nome: string;itens: string[]}[] = [];
  formulariosEditados: {  id_formulario: number | null; nome: string;itens: string[]}[] = [];
  carregando: boolean = false;
  erro: string | null = null;
  sucessoCriacao: boolean = false; // Controla a exibição da mensagem de sucesso
  novoFormulario: { id_formulario: number | null; nome: string; itens:string[] } = { id_formulario: null, nome: '', itens: [] }; // Para o formulário atual
  modalAberto: boolean = false;
  itens: any[] = [];
  nome:string= '';
  dadosOriginais: any[] = [];
  descricao = '';  // A descrição será enviada para o backend
  itemEmEdicao: any | null = null; // Armazena o item que está sendo editado
  constructor(
    private criarFormularioService: CriarFormularioService,
    private cdRef: ChangeDetectorRef,
    private ItensService: ItensService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregarFormularios();
    this.carregarItens1;
  }
  carregarItens() {
    this.ItensService.obterItens().subscribe(
      (data: any[]) => {
        this.dadosOriginais = data;  // Armazena o "data" completo
        this.itens = data.map(item => ({
          id: item.id || item.itemId || null,
          descricao: item.item || item.itemDescricao || 'Descrição não encontrada'
        }));
        console.log('Itens recebidos no criar-formulario.component.ts:', data);
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
        console.log(`Itens do formulário ${formularioId} recebidos no criar-formulario.component.ts:`, data);
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
    );
  }
  abrirModal(): void {
    this.modalAberto = true;
    console.log("abrindo o modal do para criar formulario");
    // Se for um novo formulário, cria um ID temporário, mas NÃO chama carregarItens()
    if (!this.novoFormulario.id_formulario) {
      this.novoFormulario = {
        id_formulario: Date.now(), // ID temporário único
        nome: '',
        itens: [] // Começa vazio, sem buscar do backend
      };
    }// else {
      // Se já existe, então carregamos os itens
    //  this.carregarItens();
    //}
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
  fecharModal(): void {
    this.modalAberto = false;
    this.novoFormulario = { id_formulario: null, nome: '', itens: []}; // Limpa os dados do formulário
    this.itens = []; // Garante que os itens sejam limpos ao fechar o modal
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
            itens: formularioCriado.itens || []  // Garante que 'itens' sempre exista

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
    );
  }

  recarregar(): void {
    this.carregarFormularios();
  }

  criarFormulario(): void {
    if (!this.novoFormulario.nome.trim()) {
      this.erro = 'O nome do formulário não pode estar vazio.';
      return;
    }

    console.log('Novo formulário antes de enviar:', this.novoFormulario);

    this.criarFormularioService.enviarFormulariosCriados(this.novoFormulario).subscribe(
      (response: any) => {

        // Adiciona o novo formulário à lista
        this.formulariosCriados.push({
          id_formulario: response.id_formulario,
          nome: response.nome,
          itens: response.itens || [] // Garante que itens seja um array vazio, se estiver ausente

        });

        // Reseta os valores para o próximo formulário
        this.novoFormulario = { id_formulario: null, nome: '', itens: []};
        this.sucessoCriacao = true;

        // Remove a mensagem de sucesso após alguns segundos
        setTimeout(() => {
          window.location.reload();
          this.sucessoCriacao = false;
        }, 3000);
      },
      (error: any) => {
        console.error('Erro ao criar o formulário:', error);
        this.erro = 'Erro ao criar o formulário. Por favor, tente novamente.';
      }
    ); 
  }
  criarItem() {
    if (!this.descricao.trim()) {
      console.error('A descrição do item não pode estar vazia.');
      return;
    }
  
    console.log('Enviando descrição  de item para o backend:', this.descricao);
    // Não limpe ainda a variável 'descricao'
    console.log('ID do formulário antes de enviar:', this.novoFormulario?.id_formulario);
    if (!this.novoFormulario?.id_formulario) {
      console.error('Erro: ID do formulário não está definido.');
      return;
    }
    const body = {
      item: this.descricao,
      formulario: this.novoFormulario.nome,
      id_formulario: this.novoFormulario.id_formulario
    };
    this.ItensService.enviarItem(body, this.novoFormulario.nome, this.novoFormulario.id_formulario).subscribe(
      (response: any) => {
        console.log("iniciando o processamento da resposta no criar item criar-formulario.component.ts");
        console.log('Item criado com sucesso no criar-formulario.component:', response);
        const novoItem = { item: response.id_formulario, descricao: response.descricao, formulario: response.formulario, id_formulario: response.id_formulario };  // Supondo que o 'response' tenha a estrutura correta
        console.log("teste douglas", novoItem);
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
  salvarFormulario(): void {
    console.log("Executando o 'salvarFormulario no criar-formulario.component.ts'")
    if (!this.novoFormulario.nome.trim()) {
      this.novoFormulario.id_formulario = Date.now(); // Gera o ID temporário
      this.erro = 'O nome do formulário não pode estar vazio.';
      return; // Não envia o formulário se o nome estiver vazio
    }
    
    console.log('Novo formulário enviado:', this.novoFormulario);
    this.criarFormularioService.enviarFormulariosCriados(this.novoFormulario).subscribe(
      (response) => {
        
         // Agora, você tem o id_formulario da resposta
      const idFormularioSalvo = this.novoFormulario;  // Supondo que o ID venha na resposta
      console.log('Testando o ID:', idFormularioSalvo);

      // Passa o id_formulario ao salvar os itens
      this.novoFormulario.itens.forEach(item => {
        this.ItensService.enviarItem(item, this.novoFormulario, idFormularioSalvo).subscribe(
          (itemResponse) => {
            console.log('Item salvo:', itemResponse);
            // Aqui você pode adicionar o item salvo na lista ou realizar outra ação
          },
          (error) => {
            console.error('Erro ao salvar item:', error);
          }
        );
      });
        this.formulariosCriados.push(response);
        this.fecharModal();
      },
      (error) => {
        console.error('Erro ao salvar formulário:', error);
      }
    );
  }
 
  deletarFormulariosCriados(formularioId: number | null): void {
    if (formularioId === null) {
      console.error('ID do formulário não pode ser nulo');
      return;  // Evita tentar deletar um formulário com ID nulo
    }
  
    console.log('ID do formulário a ser deletado:', formularioId);
    
    // Primeiro, vamos carregar os formulários para encontrar o ID correto
    this.carregarFormularios();
    
    // Após os formulários serem carregados, seguimos com a exclusão do formulário
    const formularioIdNumber = Number(formularioId);
    console.log("debugando o formulairoIDNumber: ", formularioIdNumber);
    const formulario = this.formulariosCriados.find(formulario => formulario.id_formulario === formularioIdNumber);
    console.log("debugnado o formulario:", formulario);
    
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

  
 
}
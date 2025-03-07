import { ChangeDetectorRef, Component, EventEmitter, NgZone, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'; // Corrigido para incluir FormGroup
import { ItensService } from '../../itens.service';
import { FormularioService } from '../../formulario.service';
import { CriarFormularioService } from '../../criar-formulario.service';

@Component({
  selector: 'app-selecionar-formulario',
  standalone: false,
  templateUrl: './selecionar-formulario.component.html',
  styleUrls: ['./selecionar-formulario.component.css'] // Corrigido para plural
})
export class SelecionarFormularioComponent {
  shoesControl = new FormControl();
  setores: any[] = []; // Lista para armazenar os setores
  usuarios: any[] = []; // Lista para usuários
  usuario: any; // Variável para o usuário selecionado
  carregando: boolean = false;
  erro: string | null = null;
  formulariosCriados: { id_formulario: number | null; nome: string; itens: string[] }[] = [];
  novaOpcaoStatusSelecionada: string = ''; // Para armazenar a opção selecionada
  options: any[] = []; // Armazena as opções do select
  formularioTeste: any[] = [];
  formulario: any = {}; // Formulário selecionado
  itens: any[] = [];
  dadosOriginais: any[] = [];
  form: FormGroup; // Adicionando a declaração de FormGroup corretamente
  @Output() formularioSelecionado = new EventEmitter<any>();  // Emite o evento

  constructor(
    private formularioService: FormularioService, // Injeção do serviço
    private cdRef: ChangeDetectorRef, // Para forçar atualização da interface
    private criarFormularioService: CriarFormularioService,
    private ngZone: NgZone,
    private itensService: ItensService // Corrigindo o nome do serviço para camelCase
  ) {
    this.form = new FormGroup({
      clothes: this.shoesControl,
    });
  }

  ngOnInit(): void {
    this.carregarFormularios();

    // Subscrição ao serviço para obter setores
    this.formularioService.obterSetores().subscribe(
      (data: any[]) => {
        // Mapeia os setores retornados para o formato esperado
        this.setores = data.map((setor) => ({
          id: setor.id || setor.setorId || null, // Ajustar os campos conforme sua API
          descricao: setor.setor || setor.setorDescricao || 'Descrição não encontrada',
        }));
        this.cdRef.detectChanges(); // Atualiza a UI se necessário
      },
      (error: any) => {
        console.error('Erro ao obter setores:', error); // Log para erros
      }
    );

    this.formularioService.obterUsuarios().subscribe(
      (data: any[]) => {
        this.usuarios = data; // Preencher a lista de usuários
      },
      (error) => {
        console.error('Erro ao obter usuários:', error);
      }
    );
  }

  carregarFormularios(): void {
    this.carregando = true;
    this.erro = null;

    this.criarFormularioService.obterFormulariosCriados().subscribe(
      (data: any[]) => {
        this.carregando = false;
        console.log('Formulários carregados:', data);

        if (data && Array.isArray(data)) {
          this.formulariosCriados = data.map((formularioCriado) => ({
            id_formulario: formularioCriado.id_formulario,
            nome: formularioCriado.nome,
            itens: formularioCriado.itens || [],
          }));

          // Definindo o primeiro formulário como o formulário selecionado
          if (this.formulariosCriados.length > 0) {
            this.formulario = this.formulariosCriados[0]; // Lógica de seleção do primeiro formulário
            this.onFormularioSelecionado(this.formulario); // Chama o método para printar

          }
        } else {
          this.formulariosCriados = [];
        }

        this.cdRef.detectChanges();
      },
      (error: any) => {
        this.carregando = false;
        this.erro = 'Erro ao carregar os formulários. Por favor, tente novamente.';
      }
    );
  }
  onFormularioSelecionado(formulario: any): void {
    this.formularioSelecionado.emit(formulario);  // Envia o formulário para o pai
    console.log('Formulário selecionado no componente filho:', formulario);

  }
  
}

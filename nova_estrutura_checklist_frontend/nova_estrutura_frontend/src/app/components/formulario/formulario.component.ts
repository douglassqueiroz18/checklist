import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { FormularioService } from '../../formulario.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CriarFormularioService } from '../../criar-formulario.service';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { ItensService } from '../../itens.service';
import { SelecionarFormularioComponent } from '../selecionar-formulario/selecionar-formulario.component';
import { ActivatedRoute } from '@angular/router';
interface Shoes {
  value: string;
  name: string;
}
@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'], // Corrigido o nome da propriedade para styleUrls
  standalone: true,
  imports: [CommonModule,MatFormFieldModule, MatInputModule, FormsModule, CommonModule,MatCardModule, MatGridListModule, MatListModule, ReactiveFormsModule,MatSelectModule ]
})

export class FormularioComponent implements OnInit {
  
  form: FormGroup;
  shoes: Shoes[] = [
    {value: 'boots', name: 'Boots'},
    {value: 'clogs', name: 'Clogs'},
    {value: 'loafers', name: 'Loafers'},
    {value: 'moccasins', name: 'Moccasins'},
    {value: 'sneakers', name: 'Sneakers'},
  ];
  shoesControl = new FormControl();
  setores: any[] = []; // Lista para armazenar os setores
  usuarios: any[] = []; // Lista para usuarios
  usuario: any;         // Variável para o usuário selecionado
  carregando: boolean = false;
  erro: string | null = null;
  formulariosCriados: { id_formulario: number | null; nome: string;itens: string[]}[] = [];
  novaOpcaoStatusSelecionada: string = ''; // Para armazenar a opção selecionada
  options: any[] = []; // Armazena as opções do select
  formularioTeste: any[] = [];
  formulario: any ={};
  itens: any[] = [];
  dadosOriginais: any[] = [];
  @ViewChild(SelecionarFormularioComponent) selecionarFormularioComponent!: SelecionarFormularioComponent;
  formularioSelecionadoId: any;

  constructor(
    private formularioService: FormularioService, // Injeção do serviço corretamente
    private cdRef: ChangeDetectorRef, // Para forçar atualização da interface
    private criarFormularioService: CriarFormularioService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private ItensService: ItensService,
    private route: ActivatedRoute
  ) {
    this.form = new FormGroup({
      clothes: this.shoesControl,
    });
  }
  ngOnInit(): void {
    this.carregarStatus();
    this.carregarFormularios();
    this.carregarItens();
    this.route.paramMap.subscribe(params => {
      this.formularioSelecionadoId = params.get('id');
    });
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
        console.log('teste dos formularios', data);
        if (data && Array.isArray(data)) {
          this.formulariosCriados = data.map((formularioCriado) => ({
            id_formulario: formularioCriado.id_formulario,
            nome: formularioCriado.nome,
            itens: formularioCriado.itens || []
          }));
          
        // Definindo o primeiro formulário como o formulário selecionado
        if (this.formulariosCriados.length > 0) {
          this.formulario = this.formulariosCriados[0]; // Aqui você pode ajustar para qualquer lógica de seleção
          this.carregarItens(); // Carregar os itens após carregar o formulário
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
  recarregar(): void {
    this.carregarFormularios();
  }
  carregarStatus() {
    this.criarFormularioService.obterStatus().subscribe(
      (data: any[]) => {
        this.ngZone.run(() => {
          console.log('meu teste dos status',data);
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
  onOptionSelected(event: any) {
    this.novaOpcaoStatusSelecionada = event.value;
    this.cdr.detectChanges(); // Força atualização da interface
    console.log('Opção realmente salva:', this.novaOpcaoStatusSelecionada);  
  }
  
  carregarItens() {
    if (this.formulariosCriados.length > 0) {
      console.log('Recebendo os dados dos formulariosCriados', this.formulariosCriados);
    }
  
    // Certifique-se de que há pelo menos um formulário antes de tentar acessar
    if (this.formulariosCriados.length > 0 && this.formulariosCriados[0].id_formulario) {
      this.itens = [];
      
      this.ItensService.obterItensPorFormulario(this.formulariosCriados[0].id_formulario).subscribe(
        (data: any[]) => {
          // Manipulação dos dados obtidos
          console.log('Itens carregados', data);
          this.itens = data;
          this.cdRef.detectChanges();
        },
        (error: any) => {
          console.error('Erro ao obter itens:', error);
        }
      );
    }
  }
  onFormularioSelecionado(formulario: any): void {
    this.formulario = formulario; // Atualiza o formulário selecionado
    console.log('Formulário selecionado:', formulario);
  }
  ngAfterViewInit() {
    // Agora você pode acessar o método ou propriedade do filho
    console.log(this.selecionarFormularioComponent.formulario);  // Corrigir o nome da propriedade aqui também
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormularioService } from '../../formulario.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CriarFormularioService } from '../../criar-formulario.service';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
interface Shoes {
  value: string;
  name: string;
}
@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'], // Corrigido o nome da propriedade para styleUrls
  standalone: true,
  imports: [CommonModule,MatFormFieldModule, MatInputModule, FormsModule, CommonModule,MatCardModule, MatGridListModule, MatListModule, ReactiveFormsModule,]
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

  constructor(
    private formularioService: FormularioService, // Injeção do serviço corretamente
    private cdRef: ChangeDetectorRef, // Para forçar atualização da interface
    private criarFormularioService: CriarFormularioService,
    
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
  carregarFormularios(): void{
    this.carregando = true;
    this.erro = null;
    
    this.criarFormularioService.obterFormulariosCriados().subscribe(
      (data: any[]) => {
        this.carregando = false;
        console.log('teste dos formularios',data);
        if (data && Array.isArray(data)) {
          this.formulariosCriados = data.map((formularioCriado) => ({
            id_formulario: formularioCriado.id_formulario,
            nome: formularioCriado.nome,
            itens: formularioCriado.itens || []
          }));
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
}

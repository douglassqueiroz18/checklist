import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormularioService } from '../../formulario.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'], // Corrigido o nome da propriedade para styleUrls
  standalone: true,
  imports: [CommonModule,MatFormFieldModule, MatInputModule, FormsModule, CommonModule,MatCardModule]
})
export class FormularioComponent implements OnInit {
  setores: any[] = []; // Lista para armazenar os setores
  usuarios: any[] = []; // Lista para usuarios
  usuario: any;         // Variável para o usuário selecionado
  constructor(
    private formularioService: FormularioService, // Injeção do serviço corretamente
    private cdRef: ChangeDetectorRef // Para forçar atualização da interface
  ) {}

  ngOnInit(): void {
    // Subscrição ao serviço para obter setores
    this.formularioService.obterSetores().subscribe(
      (data: any[]) => {
        // Mapeia os setores retornados para o formato esperado
        this.setores = data.map((setor) => ({
          id: setor.id || setor.setorId || null, // Ajustar os campos conforme sua API
          descricao: setor.setor || setor.setorDescricao || 'Descrição não encontrada',
        }));

        console.log('Setores recebidos:', data); // Log para verificar os itens recebidos
        this.setores.forEach((setor) => {
          console.log('Setor descrição:', setor.descricao);
        });

        this.cdRef.detectChanges(); // Atualiza a UI se necessário
      },
      (error: any) => {
        console.error('Erro ao obter setores:', error); // Log para erros
      }
    );
    this.formularioService.obterUsuarios().subscribe(
      (data: any[]) => {
        console.log('Usuários recebidos:', data);
        this.usuarios = data; // Preencher a lista de usuários
        data.forEach((usuario, index) => {
          console.log(`Usuario ${index + 1}:`, JSON.stringify(usuario, null, 2));
        });
      },
      (error) => {
        console.error('Erro ao obter usuários:', error);
      }
    );
  }
}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../usuario.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-usuario',
  standalone: false,
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
})
export class UsuarioComponent implements OnInit {
  setores: any[] = [];
  usuarios: any[] = []; // Lista de usuários
  novoUsuario = { name: '', email: '', senha: '', setor: { id: null, descricao: '' } }; 
  senhaVisivel: boolean = false;
  erroCarregamento: string | null = null; // Controle de erro
  sucessoCriacao: boolean = false;
  constructor(
    private usuarioService: UsuarioService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Chamar o serviço para obter os usuários
    this.usuarioService.obterUsuarios().subscribe(
      (data: any[]) => {
        console.log("chamando obterUsuarios no component.ts");
        console.log("Dados recebidos do backend:", JSON.stringify(data, null, 2)); // Formata os dados para visualização mais clara
        console.log("Quantidade de usuários recebidos:", data.length);
        data.forEach((usuario, index) => {
          console.log(`Usuário ${index + 1}:`, JSON.stringify(usuario, null, 2)); // Mostra cada usuário formatado
        });
        this.usuarios = data.map(item => ({
          id: item.id || item.usuarioId || null, // Ajuste o mapeamento conforme o backend
          name: item.name || 'Nome não encontrado',
          email: item.email || 'Email não encontrado',
          setor: item.setor || 'Setor não informado'  // Adicionando o campo setor
        }));
        console.log('Usuários carregados:', this.usuarios);
        this.cdRef.detectChanges(); // Força a atualização da UI
      },
      (error: any) => {
        console.error('Erro ao carregar usuários:', error);
        this.erroCarregamento = 'Erro ao carregar usuários. Tente novamente mais tarde.';
      }
    );
  
    // Subscrição ao serviço para obter setores
    this.usuarioService.obterSetores().subscribe(
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
  }
    criarUsuario(): void {
      console.log('Enviando novo usuário para o backend:');
      console.log('Nome:', this.novoUsuario.name);
      console.log('Email:', this.novoUsuario.email);
      console.log('Senha:', this.novoUsuario.senha);

      if (this.novoUsuario.setor && typeof this.novoUsuario.setor === 'object') {
        console.log('Setor:', this.novoUsuario.setor.descricao); // Exibe a descrição do setor
      } else {
        console.log('Setor:', this.novoUsuario.setor); // Caso seja apenas um ID ou outro valor
      }
  
    const body = {
      name: this.novoUsuario.name,
      email: this.novoUsuario.email,
      senha: this.novoUsuario.senha, // Envia a senha ao backend
      setor: this.novoUsuario.setor.descricao, // Apenas a descrição será enviada
    };

    this.usuarioService.enviarUsuarios(body).subscribe(
      (response: any) => {
        console.log('Usuário criado com sucesso no usuario.component.ts', response);
        const novoUsuario = {
          id: response.id,
          name: response.name,
          email: response.email,
          setor: this.novoUsuario.setor.descricao, // Envia o nome do setor
        };
        this.usuarios.push(novoUsuario); // Adiciona o novo usuário à lista
        this.novoUsuario = { name: '', email: '', senha: '', setor: { id: null, descricao: '' } }; // Limpa o formulário
        this.sucessoCriacao = true; // Exibe a mensagem de sucesso
        setTimeout(() => {
          this.sucessoCriacao = false; // Remove a mensagem de sucesso após 3 segundos
        }, 3000);
      },
      (error: any) => {
        console.error('Erro ao criar usuário no usuario.component.ts', error);
      }
    );

  }
  toggleSenhaVisivel(): void {
    this.senhaVisivel = !this.senhaVisivel;
  }
}
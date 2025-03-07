import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { ItensComponent } from './components/itens/itens.component';
import { FormularioComponent } from './components/formulario/formulario.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { CriarFormularioComponent } from './components/criar-formulario/criar-formulario.component';
import { SelecionarFormularioComponent } from './components/selecionar-formulario/selecionar-formulario.component';

const routes: Routes = [
  //{path:'itens', component: ItensComponent},
  {path:'formulario/:id', component: FormularioComponent},
  {path:'usuario', component: UsuarioComponent},
  {path:'criar_formulario',component: CriarFormularioComponent},
  {path:'selecionar_formulario', component: SelecionarFormularioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

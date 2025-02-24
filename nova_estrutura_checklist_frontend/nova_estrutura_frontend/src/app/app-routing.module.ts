import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { ItensComponent } from './components/itens/itens.component';
import { FormularioComponent } from './components/formulario/formulario.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { CriarFormularioComponent } from './components/criar-formulario/criar-formulario.component';

const routes: Routes = [
  //{path:'itens', component: ItensComponent},
  {path:'formulario', component: FormularioComponent},
  {path:'usuario', component: UsuarioComponent},
  {path:'criar_formulario',component: CriarFormularioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

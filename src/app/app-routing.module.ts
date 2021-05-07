import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BomboModule } from './pages/bombo/bombo.module';
import { CartonModule } from './pages/carton/carton.module';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'bombo',
    loadChildren: () => import('./pages/bombo/bombo.module').then(m => m.BomboModule)
  },
  {
    path: 'carton',
    loadChildren: () => import('./pages/carton/carton.module').then(m => m.CartonModule)
  },
  { path: '**', redirectTo: '' },
  { path: '', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

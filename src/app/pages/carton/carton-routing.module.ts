import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartonComponent } from './carton.component';


const routes: Routes = [
  {
    path: '',
    component: CartonComponent,
    children: [
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartonRoutingModule { }

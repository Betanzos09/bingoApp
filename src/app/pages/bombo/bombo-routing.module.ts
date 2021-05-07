import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BomboComponent } from './bombo.component';


const routes: Routes = [
  {
    path: '',
    component: BomboComponent,
    children: [
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BomboRoutingModule { }

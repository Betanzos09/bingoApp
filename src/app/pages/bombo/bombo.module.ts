import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BomboRoutingModule } from './bombo-routing.module';
import { BomboComponent } from './bombo.component';


@NgModule({
  declarations: [BomboComponent],
  imports: [
    CommonModule,
    BomboRoutingModule
  ]
})
export class BomboModule { }

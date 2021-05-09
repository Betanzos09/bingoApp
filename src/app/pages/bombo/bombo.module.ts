import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BomboRoutingModule } from './bombo-routing.module';
import { BomboComponent } from './bombo.component';
import { HeaderModule } from '../../shared/header/header.module';


@NgModule({
  declarations: [BomboComponent],
  imports: [
    CommonModule,
    BomboRoutingModule,
    HeaderModule
  ]
})
export class BomboModule { }

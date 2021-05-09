import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartonRoutingModule } from './carton-routing.module';
import { CartonComponent } from './carton.component';
import { HeaderModule } from '../../shared/header/header.module';


@NgModule({
  declarations: [CartonComponent],
  imports: [
    CommonModule,
    CartonRoutingModule,
    HeaderModule
  ]
})
export class CartonModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartonRoutingModule } from './carton-routing.module';
import { CartonComponent } from './carton.component';


@NgModule({
  declarations: [CartonComponent],
  imports: [
    CommonModule,
    CartonRoutingModule
  ]
})
export class CartonModule { }

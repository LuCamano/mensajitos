import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LandingPageRoutingModule } from './landing-routing.module';

import { LandingPage } from './landing.page';
import { ChatsComponent } from "./chats/chats.component";
import { ContactosComponent } from './contactos/contactos.component';
import { PerfilComponent } from './perfil/perfil.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LandingPageRoutingModule
],
  declarations: [
    LandingPage,
    ChatsComponent,
    ContactosComponent,
    PerfilComponent
  ]
})
export class LandingPageModule {}

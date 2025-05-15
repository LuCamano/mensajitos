import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingPage } from './landing.page';

const routes: Routes = [
  {
    path: 'landing',
        component: LandingPage, 
        children: [
          {
            path: 'perfil',
            loadChildren: () =>
              import('../landing/perfil/perfil.module').then(m => m.PerfilPageModule),
          },
          {
            path: 'chats',
            loadChildren: () =>
              import('../landing/chats/chats.module').then(m => m.ChatsPageModule),
          },
          {
            path: 'contactos',
            loadChildren: () =>
              import('../landing/contactos/contactos.module').then(m => m.ContactosPageModule),
          },
          {
            path: '',
            redirectTo: 'contactos',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: '',
        redirectTo: '/landing',
        pathMatch: 'full',
      },
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule {}

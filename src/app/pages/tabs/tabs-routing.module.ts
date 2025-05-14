import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage, 
    children: [
      {
        path: 'perfil',
        loadChildren: () =>
          import('./perfil/perfil.module').then(m => m.PerfilPageModule),
      },
      {
        path: 'landing',
        loadChildren: () =>
          import('./landing/landing.module').then(m => m.LandingPageModule),
      },
      {
        path: 'chats',
        loadChildren: () =>
          import('./chats/chats.module').then(m => m.ChatsPageModule),
      },
      {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs',
    pathMatch: 'full',
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: false
})
export class PerfilComponent implements OnInit {

  user: string = '';
  email: string = '';

  constructor() { }

  ngOnInit() {
    const usuario = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = usuario.displayName || 'Usuario';
    this.email = usuario.email || '';
  }
}

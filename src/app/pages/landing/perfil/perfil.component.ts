import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: false
})
export class PerfilComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  user = 'Usuario de Ejemplo';
  email = '8Bk6U@example.com'; 

}

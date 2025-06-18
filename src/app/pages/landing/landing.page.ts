import { Component, OnInit, ViewChild } from '@angular/core';
import { Contacto } from 'src/app/models/contacto.models';
import { FireService } from 'src/app/services/fire.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: false
})
export class LandingPage implements OnInit {
  constructor(private fireService: FireService) { }
  ngOnInit() {
  }

  logout() {
    this.fireService.signOut();
  }

  @ViewChild('segment') segment!: HTMLIonSegmentElement;

  contactoActual: Contacto | undefined;

  abrirChat(contacto: Contacto) {

    // Actualizar el contacto actual
    this.contactoActual = contacto;

    // Cambiar la vista al segmento "chats"
    this.segment.value = 'chats';
  }
}

import { Component, OnInit } from '@angular/core';

import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: false
})
export class LandingPage implements OnInit {

  constructor() { 

    addIcons({ add });
  }

  ngOnInit() {
  }

}

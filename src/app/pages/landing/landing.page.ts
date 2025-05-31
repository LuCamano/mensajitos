import { Component, OnInit } from '@angular/core';
import { FireService } from 'src/app/services/fire.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: false
})
export class LandingPage implements OnInit {
    constructor(private fireService: FireService) {}
  ngOnInit() {
  }

  logout() {
    this.fireService.signOut();
  }

}

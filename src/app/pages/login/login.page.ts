import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  user = {
    email: '',
    password: '',
    rememberMe: false
  };

  ngOnInit() {
  }


  onSubmit(_t23: NgForm) {
    console.log('Form submitted:', _t23.value);
  }
}

import { inject, Injectable } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, NavController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private navCtrl = inject(NavController);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);
  private alertController = inject(AlertController);

  saveInLocalStorage(key: string, value: any){
    return localStorage.setItem(key, JSON.stringify(value));
  }

  getFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key)!);
  }

  async presentToast(opts: ToastOptions){
    const toast = await this.toastController.create(opts);
    toast.present();
    return toast;
  }

  async presentLoading(){
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'crescent'
    });
    loading.present();
    return loading;
  }

  async presentAlert(opts: AlertOptions){
    const alert = await this.alertController.create(opts);
    alert.present();
    return alert;
  }

  navigateForwardTo(route: string, extras?: NavigationExtras){
    this.navCtrl.navigateForward(route, extras);
  }

  navigateBack(){
    this.navCtrl.back();
  }

  navigateRoot(route: string, extras?: NavigationExtras){
    this.navCtrl.navigateRoot(route, extras);
  }
}

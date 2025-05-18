import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { FireService } from '../services/fire.service';
import { UtilsService } from '../services/utils.service';

export const authGuard: CanActivateFn = (route, state) => {
  const fireSvc = inject(FireService);
  const utils = inject(UtilsService);

  let user = utils.getFromLocalStorage('user');

  return new Promise( (resolve, reject) => {
    fireSvc.getAuthInstance().onAuthStateChanged( auth => {
      if (auth && user) {
        resolve(true);
      } else {
        utils.navigateRoot('/login');
        resolve(false);
      }
    })
  });
};

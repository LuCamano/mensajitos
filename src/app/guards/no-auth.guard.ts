import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { FireService } from '../services/fire.service';
import { UtilsService } from '../services/utils.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const fireSvc = inject(FireService);
  const utils = inject(UtilsService);

  return new Promise( (resolve, reject) => {
    fireSvc.getAuthInstance().onAuthStateChanged( auth => {
      if (!auth) {
        resolve(true);
      } else {
        utils.navigateRoot('/');
        resolve(false);
      }
    });
  });
};

import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../Services/Auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const user = auth.getUser();

  if (user.username && user.role) {
    return true;
  } else {
    return false;
  }
};

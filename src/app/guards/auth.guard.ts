import { inject } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { ModalService } from '../shared/services/modal/modal.service';

export const AuthGuard: () => Promise<boolean> = async () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const modalService = inject(ModalService);

  return await authService
    .isLoggedIn()
    .then((res) => {
      const loggedIn = res.success && (res.data ?? false);
      if (!loggedIn) {
        logoutFlow(router, authService, modalService);
      }

      return loggedIn;
    })
    .catch(() => {
      logoutFlow(router, authService, modalService);
      return false;
    });
};

function logoutFlow(
  router: Router,
  authService: AuthenticationService,
  modalService: ModalService
) {
  router.navigate(['/login']);
  authService.RemoveLoggedUser();
  modalService.logoutModal();
}

import { Component, EventEmitter, Output } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { LoginData } from '../../services/authentication/models/login.response';
import { ModalService } from '../../services/modal/modal.service';
import { Router } from '@angular/router';
import { CollaboratorService } from '../../services/collaborator/collaborator.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() menuToggleEvent = new EventEmitter<boolean>();

  constructor(
    public authService: AuthenticationService,
    public modalService: ModalService,
    private router: Router,
    private collaboratorService: CollaboratorService
  ) {}

  user: LoginData | null = null;
  userImage: string | null = null;

  profileOpened = false;

  async ngOnInit() {
    if (await this.authService.isLoggedIn()) {
      this.user = this.authService.GetLoggedUser();
      this.getProfilePictureUrl();
    }

    this.collaboratorService.ProfileImageChangedEvent.subscribe(() => {
      this.getProfilePictureUrl();
    });
  }

  getProfilePictureUrl() {
    if (this.user != null) {
      this.collaboratorService
        .GetProfilePictureUrl(this.user.id)
        .then((res) => {
          if (res.success) {
            this.userImage = res.data ?? '';
          }
        });
    }
  }

  toggleSideMenu(opened: boolean) {
    this.menuToggleEvent.emit(opened);
  }

  toggleProfile() {
    this.profileOpened = !this.profileOpened;
  }

  logout() {
    this.authService.Logout();
  }

  navigateHome() {
    this.router.navigate(['/app']);
  }

  getMaxContent(max: number, text: string) {
    return text.length > max ? text.slice(0, max) + '...' : text;
  }
}

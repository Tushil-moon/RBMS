import { Component, inject, Renderer2, signal } from '@angular/core';
import { AuthService } from '../../../../Services/Auth/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../Services/Notification/notification.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  private notification = inject(NotificationService);
  private render = inject(Renderer2);
  private translate = inject(TranslateService);

  /**
   * Hold dark mode status value.
   */
  isDark = signal<boolean>(JSON.parse(localStorage.getItem('dark-theme') || 'false'));

  /**
   * Hold selected language
   */
  selectedLang = signal<string | null>(localStorage.getItem('Language') ? localStorage.getItem('Language') : 'en');

  /**
   * Handle user logout.
   */
  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
    this.notification.info('Logout successfully!');
  }

  /**
   * Handle Dark mode.
   */
  toggleDarkMode(): void {
    localStorage.setItem('dark-theme',JSON.stringify(!this.isDark()))
    this.isDark.set(!this.isDark());
    this.isDark()
      ? this.render.setAttribute(document.body, 'data-bs-theme', 'dark')
      : this.render.removeAttribute(document.body, 'data-bs-theme');
  }

  /**
   * Handle language change
   * 
   * @param event language
   */
  changeLanguage(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const language = selectElement.value;

    if (language) {
      this.selectedLang.set(language);
      localStorage.setItem('Language',language)
      this.translate.use(language);
    }
  }
}

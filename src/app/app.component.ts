import { Component, inject, Renderer2, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgToastModule } from 'ng-angular-popup';
import { ToasterPosition } from 'ng-toasty';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgToastModule, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  public translate = inject(TranslateService);
  private render = inject(Renderer2);

  /**
   * Hold Toasterpostion enum
   */
  ToasterPosition = signal(ToasterPosition);

  /**
   * Behaviour subject to trigger language
   */
  $constructor_ = new BehaviorSubject<boolean>(false);

  /**
   * Take Behaviour subject as observable
   */
  $constructor = this.$constructor_.asObservable();

  /**
   * Handle dark mode and default language in app intialization
   */
  language = toSignal(
    this.$constructor_.pipe(
      tap(() => {
        const language = localStorage.getItem('Language');
        const browserLang = language
          ? language
          : this.translate.getBrowserLang();
        this.translate.use(browserLang?.match(/en|ro|de/) ? browserLang : 'en');

        const isDark = JSON.parse(
          localStorage.getItem('dark-theme') || 'false'
        );
        if (isDark) {
          this.render.setAttribute(document.body, 'data-bs-theme', 'dark');
        } else {
          this.render.removeAttribute(document.body, 'data-bs-theme');
        }
      })
    )
  );
}

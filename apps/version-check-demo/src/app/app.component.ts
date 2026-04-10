import { Component, computed, Signal } from '@angular/core'
import { VersionCheckService } from 'ngx-version-check'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent {
  title = 'ngx-version-check'
  hash: Signal<string> = computed(() => this.versionCheckService.hash())
  version: Signal<string> = computed(() => this.versionCheckService.version())

  constructor(private versionCheckService: VersionCheckService) {}

  ngOnInit() {
    this.versionCheckService.startVersionChecking({ frequency: 30000, notification: this.showNotification })
  }

  showNotification() {
    alert('New Version Available')
  }
}

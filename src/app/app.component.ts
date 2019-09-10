import { Component } from '@angular/core'
import { VersionCheckService } from 'version-check'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngx-version-check'

  constructor(private versionCheckService: VersionCheckService) {}

  ngOnInit() {
    this.versionCheckService.startVersionChecking({ frequency: 30000, notification: this.showNotification })
  }

  showNotification() {
    alert('New Version Available')
  }
}

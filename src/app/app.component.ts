import { Component, OnInit } from '@angular/core'
import { VersionCheckService } from 'version-check'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ngx-version-check'

  constructor(public versionCheckService: VersionCheckService) {}

  ngOnInit() {
    this.versionCheckService.startVersionChecking({ frequency: 20000 })
  }
}

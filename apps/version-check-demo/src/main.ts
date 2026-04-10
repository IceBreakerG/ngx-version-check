// Angular Imports
import { enableProdMode, provideZoneChangeDetection } from '@angular/core'
import { platformBrowser } from '@angular/platform-browser'

// Local Imports
import { AppModule } from './app/app.module'
import { environment } from './environments/environment'

if (environment.production) {
  enableProdMode()
}

platformBrowser()
  .bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()] })
  .catch(err => console.error(err))

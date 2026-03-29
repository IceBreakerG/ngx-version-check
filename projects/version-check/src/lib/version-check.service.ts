/**
 * Author: Henrik Peinar
 * https://blog.nodeswat.com/automagic-reload-for-clients-after-deploy-with-angular-4-8440c9fdd96c
 */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { interval, Subscription } from 'rxjs'

export interface IVersionCheck {
  /** (Optional) The notification method to call from the client if there is a new version available. */
  notification?: any

  /** (Required) The frequency in milliseconds (defaults to 30 minutes). */
  frequency: number
}

@Injectable({
  providedIn: 'root'
})
export class VersionCheckService {
  // These will be replaced by the post-build.js script
  private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}'
  private currentVersion = '{{POST_BUILD_ENTERS_VERSION_HERE}}'

  // Private properties
  private newVersionAvailable: boolean = false
  private versionCheckInterval: Subscription

  constructor(private http: HttpClient) {}

  /** Will do the call and check if the hash has changed or not. */
  public checkVersion(notification: any) {
    // Timestamp these requests to invalidate caches
    this.http.get(`version.json?t=${new Date().getTime()}`).subscribe(
      (response: any) => {
        this.newVersionAvailable =
          this.hasHashChanged(this.currentHash, response.hash) ||
          this.hasVersionChanged(this.currentVersion, response.version)

        // Stop checking for a new version if a new version is already available
        if (this.newVersionAvailable) {
          this.stopVersionChecking()

          // Call the consuming client's notification method if one exists
          if (notification) notification()
        }
      },
      err => {
        console.error(err, 'Error checking version')
      }
    )
  }

  /**
   * Starts the version check interval for the specified frequency.
   * @param config The configuration parameters for the notification function and version check frequency.
   */
  public startVersionChecking(config: IVersionCheck = { notification: null, frequency: 1800000 }) {
    this.versionCheckInterval = interval(config.frequency).subscribe(() => {
      this.checkVersion(config.notification)
    })
  }

  /** Stops the version check interval. */
  public stopVersionChecking() {
    this.versionCheckInterval.unsubscribe()
  }

  /**
   * Checks if the hash has changed.
   * This file has the JS hash, if it is a different one than in the version.json
   * we are dealing with version change
   * @param currentHash The current hash of the application.
   * @param newHash The new application hash from the version.json file.
   * @returns Boolean value determining if the hash has changed between the application and version.json file.
   */
  private hasHashChanged(currentHash, newHash): boolean {
    if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
      return false
    }

    return currentHash !== newHash
  }

  /**
   * Checks if the version value has changed.
   * This file has the JS version, if it is a different one than in the version.json
   * we are dealing with version change.
   * @param currentVersion The current version of the application.
   * @param newVersion The new application version from the version.json file.
   * @returns Boolean value determining if the version has changed between the application and version.json file.
   */
  private hasVersionChanged(currentVersion, newVersion): boolean {
    if (!currentVersion || currentVersion === '{{POST_BUILD_ENTERS_VERSION_HERE}}') {
      return false
    }

    return currentVersion !== newVersion
  }

  /** The current build hash of the application */
  get Hash(): string {
    return this.currentHash
  }

  /** The current version number of the application */
  get Version(): string {
    return this.currentVersion
  }

  /** Flag showing if a new version of the application is available. */
  get NewVersionAvailable(): boolean {
    return this.newVersionAvailable
  }
}

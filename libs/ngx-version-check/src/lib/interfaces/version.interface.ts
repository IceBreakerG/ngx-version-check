export interface Version {
  /** (Required) The frequency in milliseconds (defaults to 30 minutes). */
  frequency: number

  /** (Optional) The notification method to call from the client if there is a new version available. */
  notification?: any
}

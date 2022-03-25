The ngx-version-check service is an injectable Angular 8+ service for monitoring and notifying users of a new application version. The service exposes a boolean property (`NewVersionAvailable`) showing if a new version is available, or can accept a function to call to handle the actual notification. The project was created as another resource for a new framework at work.

To install, use the command:

`npm install --save ngx-version-check`

## About version 1.1.0

Version 1.1.0 of ngx-version-check adds support for Angular 13+ projects. I've tried to maintain compatibility with older projects, but if there are any errors, please add an issue with as much information and details about your project (Angular version, node version, npm version, etc) as possible for troubleshooting.

## Usage Instructions

In your angular.json file, add the library's assets folder to the assets array:

```
"assets": [
  "src/favicon.ico",
  "src/assets",
  {
    "glob": "**/*",
    "input": "./node_modules/ngx-version-check/assets",
    "output": "/"
  }
]
```

In your AppModule, make sure you are importing the `HttpClientModule`.

```
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

In the component you want to use for starting the service, inject the service in the constructor, and start it (with the configuration or with defaults) in the ngOnInit (or another) method:

```
import { VersionCheckService } from 'ngx-version-check'
```

```
constructor(private versionCheckService: VersionCheckService) {}

ngOnInit() {
  this.versionCheckService.startVersionChecking({
    frequency: 300000,
    notification: this.showNotification
  })
}

showNotification() {
  // Handle how you want to display the notification to your users
  // This method will be called by the service when a new version is available
}
```

You can also use the service to display the version and build hash in your application as well. You can do this by making the service injection public, and using the following properties in your template:

**Hash**: The build hash of the application.

**Version**: The version number of the application.

### Available Methods

**checkVersion(notification: any)**: Checks the version of the application manually without an interval, and calls the notification method passed in if a new version is available.

**startVersionChecking()**: Starts the version check service interval with the specified configuration.

**stopVersionChecking()**: Stops the version check service interval.

### Configuration

**frequency**: (Defaults to 1800000 [30mins]) The time (in milliseconds) to wait between checks.

**notification**: (Optional) The method that handles the notification to the user that a new version is available.

## Build Requirements

In order for the version check service to function, a post build script needs to be run after compiling your angular application so that the correct values are available to the service. The library's assets folder contains a file named `version.json` which is what will get read by the service. In your main `package.json` file, you will need a script, prefixed with `post`, to trigger the post build script, followed by an optional parameter, consumer, which is the outputPath directory set in your angular.json file behind `dist`:

```
{
  "name": "consumer",
  "scripts": {
    "build": "ng build --prod",
    "postbuild": "node ./node_modules/ngx-version-check/build/post-build.js consumer"
  }
}
```

Notes:

- The **_outputPath directory parameter_** is now optional as of version 1.0.5. If your `outputPath` property is set to `dist`, leaving out the project name parameter will now use the base `dist` output folder.
- The name of your post build script should be whatever you're using to trigger the build (ie. If your build script was named `buildmyproject`, your post build script would be `postbuildmyproject`).

## Current Limitations

Currently, the version check service only supports displaying date version (ie. year.month.day). There may be plans to change this in the future. Don't worry though, the service uses the build hash to compare versions, not the date.

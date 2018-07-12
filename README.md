# webpack-s3-uploader
Webpack plugin to push assets to s3

#### Usage
In `webpack.config.js`:
```
const WebpackS3Uploader = require('@bbc/webpack-s3-uploader');

{
  ...
  plugins: [
    new WebpackS3Uploader({
      whitelist: ['js', 'css'],
      logger: console,
      basePath: 'webpack/assets',
      directory: './web/assets',
      s3Options: {
        region: 'eu-west-1',
        httpOptions: {
          timeout: 240000,
          connectTimeout: 240000
        }
      },
      s3UploadOptions: {
        ACL: 'public-read',
        CacheControl: 'public, max-age=15552000, immutable',
      }
    })
  ]
}
```

#### Options
- `whitelist`: [Required] An array of extensions to include in the upload. For example - ['js', 'css']
- `directory`: [Required] Provide a directory to upload
- `s3Options`: Provide options for S3 object [s3Config](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property)
- `s3UploadOptions`: Provide upload options [putObject](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property )
- `logger`: A logger object that supports the standard .info, .log, .error, etc API
- `basePath`: Provide the namespace where upload files on S3


#### Commands
- `yarn test` - Run test suite
- `yarn test:coverage` - Run test suite with code coverage
- `yarn build` - Run build
- `yarn lint` - Runs linting over `src/` and `test/`

# webpack-s3-uploader
Webpack plugin to push assets to s3


### Options
- `whitelist`: [Required] An array of extensions to include in the upload. For example - ['js', 'css']
- `directory`: [Required] Provide a directory to upload
- `s3Options`: [Required] Provide keys for upload extention of [s3Config](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property)
- `s3UploadOptions`: [Required] Provide upload options [putObject](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property )
- `logger`: A logger object that supports the standard .info, .log, .error, etc API
- `debug`: A Pattern to match for included content. Behaves the same as the `exclude`.
- `basePath`: Provide the namespace where upload files on S3


#### Commands
- `yarn test` - Run test suite
- `yarn test:coverage` - Run test suite with code coverage
- `yarn build` - Run build
- `yarn lint` - Runs linting over `src/` and `test/`

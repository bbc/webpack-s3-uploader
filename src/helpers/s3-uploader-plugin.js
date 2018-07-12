const S3Uploader = require('./s3-uploader');

/**
 * Webpack plugin for pushing assets up to s3
 */
class S3UploadPlugin {
  constructor(options) {
    this.options = options;
  }

  /**
   * @param {object} compiler - The webpack compiler object
   * Allows us to tap into the compiler events.
   * Used for adding a hook in for after assets are built.
   * We can then push these files up to s3
   * @return bool
   */
  apply(compiler) {
    compiler.plugin('after-emit', (compilation, cb) => {
      console.info('============ Uploading files to S3 ============');
      S3Uploader.upload('./assets', compilation)
        .then(success => {
          console.info('============ Successfully uploaded files ============')
          console.info(success);
          cb();
        })
        .catch(err => {
          compilation.errors.push(new Error(`S3UploadPlugin: ${err.message}`));
          cb();
        });
    });
  }

}

module.exports = S3UploadPlugin;

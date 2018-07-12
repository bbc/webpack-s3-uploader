import * as S3Uploader from './helpers/s3-uploader';

/**
 * Webpack plugin for pushing assets up to s3
 */
class WebpackS3Uploader {

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
      S3Uploader.upload('./web/assets', compilation)
        .then((success) => {
          console.info('============ Successfully uploaded files ============');
          console.info(success);
          cb();
        })
        .catch((err) => {
          compilation.errors.push(new Error(`WebpackS3Uploader: ${err.message}`));
          cb();
        });
    });
  }

}

export default WebpackS3Uploader;

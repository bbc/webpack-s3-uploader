import * as S3Uploader from './helpers/s3-uploader';

/**
 * Webpack plugin for pushing assets up to s3
 */
class WebpackS3Uploader {
  constructor(options = {}) {
    this.options = {
      whitelist: options.whitelist,
      logger: options.logger || null,
      s3Options: {
        ...options.s3Options
      },
      s3UploadOptions: {
        ...options.s3UploadOptions
      },
      basePath: options.basePath || '',
      directory: options.directory
    };
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
      const { logger } = this.options;

      if (logger) {
        logger.info('============ Uploading files to S3 ============');
      }

      S3Uploader.upload(this.options, compilation)
        .then((success) => {
          if (logger) {
            logger.info('============ Successfully uploaded files ============');
            logger.info(success);
          }

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

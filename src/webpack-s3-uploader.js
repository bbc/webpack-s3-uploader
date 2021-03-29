import * as S3Uploader from './helpers/s3-uploader';

/**
 * Webpack plugin for pushing assets up to s3
 */
export class WebpackS3Uploader {

  constructor({
    logger = null,
    s3Options = {
      region: 'eu-west-1'
    },
    s3UploadOptions = {
      ACL: '',
      Bucket: '',
      CacheControl: ''
    },
    keyNamePrefix = '',
    assetsDirectory = '',
    extensions = ['.js', '.css', '.map']
  } = {}) {
    this.options = { logger, s3Options, s3UploadOptions, keyNamePrefix, assetsDirectory, extensions };
  }

  /**
   * @param {object} compiler - The webpack compiler object
   * Allows us to tap into the compiler events.
   * Used for adding a hook in for after assets are built.
   * We can then push these files up to s3
   * @return bool
   */
  apply(compiler) {
    compiler.hooks.afterEmit.tap('Webpack S3 Uploader Plugin', async (compilation) => {
      const { logger } = this.options;

      if (logger) {
        logger.info('============ Uploading files to S3 ============');
      }

      S3Uploader.upload(this.options, compilation).then((success) => {
        if (logger) {
          logger.info('============ Successfully uploaded files ============');
          logger.info(success);
        }
      }).catch((e) => {
        logger.error('============ WITHIN THE CATCH ============');
        compilation.errors.push(new Error(`WebpackS3Uploader: ${e.message}`)); 
      });
    });
  }
}

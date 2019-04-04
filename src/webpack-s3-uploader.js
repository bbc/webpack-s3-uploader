import * as S3Uploader from './helpers/s3-uploader';

/**
 * Webpack plugin for pushing assets up to s3
 */
export default class WebpackS3Uploader {
  constructor(options = {}) {
    this.options = {
      whitelist: options.whitelist || ['js', 'css', 'map'],
      logger: options.logger,
      s3Options: {
        ...options.s3Options
      },
      s3UploadOptions: {
        ...options.s3UploadOptions
      },
      basePath: options.basePath || '',
      directory: options.directory
    };

    if (!this.options.directory) {
      throw new Error('WebpackS3Uploader: `directory` is a required option');
    }

    if (!Array.isArray(this.options.whitelist)) {
      throw new Error('WebpackS3Uploader: `whitelist` must be an array of strings');
    }

    this.options.whitelist = this.options.whitelist.map((e) => e.toLowerCase().trim());
  }

  /**
   * Tap into the compiler event and push the output files to S3
   * after the emit event.
   * @param {object} compiler - The webpack compiler object
   */
  apply(compiler) {
    compiler.hooks.afterEmit.tap('Webpack S3 Uploader Plugin', async (compilation) => {
      const { logger } = this.options;

      if (logger) {
        logger.info('============ Uploading files to S3 ============');
      }

      try {
        const success = await S3Uploader.upload(this.options, compilation);
        if (logger) {
          logger.info('============ Successfully uploaded files ============');
          logger.info(success);
        }
      } catch (e) {
        compilation.errors.push(new Error(`WebpackS3Uploader: ${e.message}`));
      }
    });
  }

}

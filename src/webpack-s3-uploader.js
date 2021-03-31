import * as S3Uploader from './helpers/s3-uploader';

const PLUGIN_NAME = 'WebpackS3Uploader';

/**
 * Webpack plugin for pushing assets up to s3
 */
class WebpackS3Uploader {
  constructor(options = {}) {
    this.options = {
      whitelist: options.whitelist,
      logger: options.logger || undefined,
      s3Options: {
        ...options.s3Options
      },
      s3UploadOptions: {
        ...options.s3UploadOptions
      },
      basePath: options.basePath || '',
      directory: options.directory
    };

    if (!this.options.whitelist) {
      throw new Error(`${PLUGIN_NAME}: "whitelist" is a required option`);
    }

    if (!this.options.directory) {
      throw new Error(`${PLUGIN_NAME}: "directory" is a required option`);
    }
  }

  /**
   * @param {object} compiler - The webpack compiler object
   * Allows us to tap into the compiler events.
   * Used for adding a hook in for after assets are built.
   * We can then push these files up to s3
   * @return bool
   */
  apply(compiler) {
    compiler.hooks.emit.tapAsync(PLUGIN_NAME, (compilation, next) => {
      const logger = compilation.getLogger(PLUGIN_NAME);

      S3Uploader.upload(this.options, compilation).then((success) => {
        logger.info('Successfully uploaded the following files');
        success.forEach(file => logger.info(file));
        next();
      }).catch((error) => {
        const message = `${PLUGIN_NAME}: ${error.message}`;
        logger.error(message);
        compilation.errors.push(new Error(message));
        next();
      });
    });
  }

}

export default WebpackS3Uploader;

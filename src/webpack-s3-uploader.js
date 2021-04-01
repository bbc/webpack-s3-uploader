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
   * It uploads the emitted files to s3
   * @param {object} compiler the webpack compiler object that allows to hook into the webpack events.
   */
  apply(compiler) {
    compiler.hooks.afterEmit.tap(PLUGIN_NAME, (compilation) => {
      const logger = compilation.getLogger(PLUGIN_NAME);

      S3Uploader.upload(this.options, compilation).then((success) => {
        console.log('Successfully uploaded the following files');
        success.forEach((file) => console.log(file));
      }).catch((error) => {
        const message = `${PLUGIN_NAME}: ${error.message}`;
        console.log(message);
        compilation.errors.push(new Error(message));
      });
    });
  }
}

export default WebpackS3Uploader;

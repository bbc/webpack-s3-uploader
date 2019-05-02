import sinon from 'sinon';
import { expect } from 'chai';
import * as S3Uploader from '../src/helpers/s3-uploader';
import WebpackS3Uploader from '../src/webpack-s3-uploader';

const sandbox = sinon.createSandbox();

const options = {
  directory: '/test/path'
};

describe('--- WebpackS3Uploader ---', () => {
  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor', () => {
    it('should throw an error when missing `directory` options', () => {
      expect(() => new WebpackS3Uploader({})).to.throw(
        'WebpackS3Uploader: `directory` is a required option'
      );
    });

    describe('whitelist constraints', () => {
      it('should normalise the whitelist', () => {
        const plugin = new WebpackS3Uploader({
          ...options,
          whitelist: ['Js', '   CsS   ', 'MAP']
        });

        expect(plugin.options.whitelist).to.be.deep.equal(['js', 'css', 'map']);
      });

      it('should throw an error if the whitelist is not an array', () => {
        expect(
          () =>
            new WebpackS3Uploader({
              ...options,
              whitelist: {}
            })
        ).to.throw(
          'WebpackS3Uploader: `whitelist` must be an array of strings'
        );
      });
    });

    it('should set up the default options', () => {
      const plugin = new WebpackS3Uploader(options);

      expect(plugin.options.logger).to.be.undefined;
      expect(plugin.options.basePath).to.be.equal('');
      expect(plugin.options.directory).to.be.equal(options.directory);
      expect(plugin.options.whitelist).to.be.deep.equal(['js', 'css', 'map']);
      expect(plugin.options.s3Options).to.be.empty;
      expect(plugin.options.s3UploadOptions).to.be.empty;
    });
  });

  describe('apply', () => {
    it('adds a callback to the after-emit event', () => {
      const plugin = new WebpackS3Uploader(options);
      const compiler = {
        hooks: {
          afterEmit: {
            tap: sandbox.spy()
          }
        }
      };

      plugin.apply(compiler);

      sandbox.assert.calledOnce(compiler.hooks.afterEmit.tap);
      sandbox.assert.calledWith(
        compiler.hooks.afterEmit.tap,
        'Webpack S3 Uploader Plugin'
      );
    });
  });

  describe('callback', () => {
    it('should upload the files and log success if no error is thrown', async () => {
      const loggerOption = {
        logger: {
          info: sandbox.spy()
        }
      };
      const plugin = new WebpackS3Uploader({
        ...options,
        ...loggerOption
      });
      sandbox.stub(S3Uploader, 'upload').resolves('SUCCESS');

      await plugin.callback({});

      sandbox.assert.calledThrice(loggerOption.logger.info);
      sandbox.assert.calledWith(
        loggerOption.logger.info,
        '============ Uploading files to S3 ============'
      );
      sandbox.assert.calledWith(
        loggerOption.logger.info,
        '============ Successfully uploaded files ============'
      );
      sandbox.assert.calledWith(loggerOption.logger.info, 'SUCCESS');
    });

    it('should not upload the files and log success if an error is thrown', async () => {
      const loggerOption = {
        logger: {
          info: sandbox.spy()
        }
      };
      const plugin = new WebpackS3Uploader({
        ...options,
        ...loggerOption
      });
      const compilation = {
        errors: {
          push: sandbox.spy()
        }
      };
      sandbox.stub(S3Uploader, 'upload').rejects('ERROR');

      await plugin.callback(compilation);

      sandbox.assert.calledOnce(loggerOption.logger.info);
      sandbox.assert.calledWith(
        loggerOption.logger.info,
        '============ Uploading files to S3 ============'
      );
      sandbox.assert.calledOnce(compilation.errors.push);
    });
  });
});

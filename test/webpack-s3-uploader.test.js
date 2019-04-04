import sinon from 'sinon';
import { expect } from 'chai';
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
      expect(() => new WebpackS3Uploader({})).to.throw('WebpackS3Uploader: `directory` is a required option');
    });

    describe('whitelist constraints', () => {
      it('should normalise the whitelist', () => {
        const plugin = new WebpackS3Uploader({
          ...options,
          whitelist: ['Js', '   CsS   ', 'MAP']
        });

        expect(plugin.options.whitelist).to.be.deep.equal(['js', 'css', 'map']);
      });

      it('should throw if the whitelist is not an array', () => {
        expect(() => new WebpackS3Uploader({
          ...options,
          whitelist: {}
        })).to.throw('WebpackS3Uploader: `whitelist` must be an array of strings');
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
      const compilerMock = {
        hooks: {
          afterEmit: {
            tap: sandbox.spy()
          }
        }
      };

      plugin.apply(compilerMock);

      sandbox.assert.calledOnce(compilerMock.hooks.afterEmit.tap);
      sandbox.assert.calledWith(compilerMock.hooks.afterEmit.tap, 'Webpack S3 Uploader Plugin');
    });
  });
});

import sinon from 'sinon';
import { expect } from 'chai';
import WebpackS3Uploader from '../src/webpack-s3-uploader';

const sandbox = sinon.createSandbox();

const defaultOptions = {
  whitelist: ['js', 'css'],
  directory: './web/assets',
  s3Options: {
    region: 'eu-west-1'
  },
  s3UploadOptions: {
    ACL: 'public-read'
  }
};

const options = {
  ...defaultOptions,
  logger: console,
  basePath: 'webpack'
};

describe('--- WebpackS3Uploader ---', () => {

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor', () => {

    it('throws an error when missing `whitelist` options', () => {
      expect(() => new WebpackS3Uploader()).to.throw('WebpackS3Uploader: "whitelist" is a required option');
    });

    it('throws an error when missing `directory` options', () => {
      expect(() => new WebpackS3Uploader({
        whitelist: ['js']
      })).to.throw('WebpackS3Uploader: "directory" is a required option');
    });

    it('set\'s up default options', () => {
      const plugin = new WebpackS3Uploader(defaultOptions);
      expect(plugin.options.logger).to.be.undefined;
      expect(plugin.options.basePath).to.equal('');
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

      expect(compilerMock.hooks.afterEmit.tap.called).to.be.true;
    });

  });

});

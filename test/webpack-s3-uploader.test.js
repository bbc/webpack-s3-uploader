import sinon from 'sinon';
import { expect } from 'chai';
import WebpackS3Uploader from '../src/webpack-s3-uploader';
import * as S3Uploader from '../src/helpers/s3-uploader';

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
      expect(() => new WebpackS3Uploader()).to.throw('WebpackS3Uploader: `whitelist` is a required option');
    });

    it('throws an error when missing `directory` options', () => {
      expect(() => new WebpackS3Uploader({
        whitelist: ['js']
      })).to.throw('WebpackS3Uploader: `directory` is a required option');
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
        plugin: sandbox.spy()
      };

      plugin.apply(compilerMock);

      expect(compilerMock.plugin.called).to.be.true;
      expect(compilerMock.plugin.firstCall.args[0]).to.equal('after-emit');
    });

    it('outputs success message after upload is finished', (done) => {
      const data = {
        files: [],
        message: 'success'
      };

      sandbox.stub(S3Uploader, 'upload').resolves(data);

      // I will change this to spying on logger once we have a logger in place
      sandbox.spy(console, 'info');

      const compilerMock = {
        plugin: (compilation, cb) => cb({ errors: [] }, () => {
          /* eslint-disable no-console */
          expect(console.info.calledThrice).to.be.true;
          expect(console.info.secondCall.args[0]).to.equal('============ Successfully uploaded files ============');
          expect(console.info.thirdCall.args[0]).to.deep.equal(data);
          done();
        })
      };

      const plugin = new WebpackS3Uploader(options);

      plugin.apply(compilerMock);
    });

    it('pushes an error into the compilation if the upload errors', (done) => {
      const errorMessage = 'Upload is a no-go amigo!';

      sandbox.stub(S3Uploader, 'upload').rejects(new Error(errorMessage));

      const compilationMock = {
        errors: {
          push: sandbox.spy()
        }
      };

      const compilerMock = {
        plugin: (compilation, cb) => cb(compilationMock, () => {
          expect(compilationMock.errors.push.calledOnce).to.be.true;
          expect(compilationMock.errors.push.firstCall.args[0].message).to.equal(`WebpackS3Uploader: ${errorMessage}`);
          done();
        })
      };

      const plugin = new WebpackS3Uploader(defaultOptions);

      plugin.apply(compilerMock);
    });

  });

});

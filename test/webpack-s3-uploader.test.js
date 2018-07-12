import sinon from 'sinon';
import { expect } from 'chai';
import WebpackS3Uploader from '../src/webpack-s3-uploader';
import * as S3Uploader from '../src/helpers/s3-uploader';

const sandbox = sinon.createSandbox();

const options = {
  whitelist: ['js'],
  logger: console,
  basePath: 'webpack',
  directory: `${__dirname}/../fixtures`
};

describe('--- WebpackS3Uploader ---', () => {

  afterEach(() => {
    sandbox.restore();
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

      const plugin = new WebpackS3Uploader(options);

      plugin.apply(compilerMock);
    });

  });

});

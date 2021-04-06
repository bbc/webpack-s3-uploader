import sinon from 'sinon';
import AWS from 'aws-sdk';
import fs from 'fs';
import { expect } from 'chai';
import * as S3Uploader from '../../src/helpers/s3-uploader';
import * as FileHelper from '../../src/helpers/file-helper';

const sandbox = sinon.createSandbox();

const compilationMock = {
  assets: {
    'test.js': 'Im valid',
    'test.json': 'Im not valid'
  }
};

const options = {
  whitelist: ['js'],
  logger: console,
  basePath: 'webpack',
  directory: `${__dirname}/../fixtures`
};

describe('--- S3Uploader ---', () => {

  afterEach(() => {
    sandbox.restore();
  });

  describe('.upload()', () => {

    describe('successful uploads', () => {

      beforeEach(() => {
        sandbox.stub(AWS, 'S3').returns({
          putObject: (options, cb) => {
            cb(null);
          }
        });
      });

      it('validates the files before uploading', (done) => {
        sandbox.spy(FileHelper, 'isValidFile');
        S3Uploader.upload(options, compilationMock)
          .then((data) => {
            expect(FileHelper.isValidFile.called).to.be.true;
            expect(data).to.deep.equal(['test.js']);
            done();
          });
      });
    });

    describe('fails to upload', () => {
      const errorMessage = 'Failed to upload';

      beforeEach(() => {
        sandbox.stub(AWS, 'S3').returns({
          putObject: (options, cb) => {
            cb(new Error(errorMessage));
          }
        });
      });

      it('errors when the upload fails', (done) => {
        sandbox.spy(FileHelper, 'isValidFile');
        S3Uploader.upload(options, compilationMock)
          .catch((err) => {
            expect(err.message).to.equal(errorMessage);
            done();
          });
      });

    });

    describe('failed file read', () => {
      const errorMessage = 'Failed to read file';

      beforeEach(() => {
        sandbox.stub(fs, 'readFile').yields(new Error(errorMessage), null);
      });

      it('errors when a file fails to read properly', (done) => {
        S3Uploader.upload(options, compilationMock)
          .catch((err) => {
            expect(err.message).to.equal(errorMessage);
            done();
          });
      });

    });

  });

});

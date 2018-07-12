const FileHelper = require('../../src/helpers/file-helper');
const { expect } = require('chai');

describe('--- FileHelper ---', () => {

  describe('.getExtension()', () => {

    it('returns the correct file extension', function () {
      expect(FileHelper.getExtension('iamafile.png')).to.equal('png');
    });

    it('returns the correct file for multiple dots in filename', function () {
      expect(FileHelper.getExtension('iamafile.whateves.hola.map')).to.equal('map');
    });

    it('returns filename when no file extension', function () {
      expect(FileHelper.getExtension('iamafilewithnoextension')).to.equal('iamafilewithnoextension');
    });

  });

  describe('.isValidFile()', () => {

    it('returns true for a valid file name', function () {
      expect(FileHelper.isValidFile('hello.js')).to.be.true;
    });

    it('returns true for a css file', function () {
      expect(FileHelper.isValidFile('hello.css')).to.be.true;
    });

    it('returns true for a valid file name with multiple dots', function () {
      expect(FileHelper.isValidFile('hello.js.map')).to.be.true;
    });

    it('returns false for an invalid file name', function () {
      expect(FileHelper.isValidFile('hello.json')).to.be.false;
    });

  });

  describe('.getContentType()', () => {

    it('returns the content type for a .js file', function () {
      expect(FileHelper.getContentType('hello.js')).to.equal('application/javascript');
    });

    it('returns the content type for a .css file', function () {
      expect(FileHelper.getContentType('hello.css')).to.equal('text/css');
    });

    it('returns the default content type for any other file', function () {
      expect(FileHelper.getContentType('hello.json')).to.equal('application/octet-stream');
    });

  });

});

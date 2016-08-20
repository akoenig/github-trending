/*
 * github-trending
 *
 * Copyright(c) 2014 André König <andre.koenig@posteo.de>
 * MIT Licensed
 *
 */

/**
 * @author André König <andre.koenig@posteo.de>
 *
 */

'use strict';

const util = require('util');

const expect = require('chai').expect;

const trending = require('../');

describe('The "github-trending" library', function suite () {

    this.timeout(10000);

    it('should be able to fetch the trending repos of all languages', function test (done) {
        trending(function (err, repos) {
            expect(err).to.equal(null);

            expect(util.isArray(repos)).to.equal(true);
            expect(repos.length).to.not.equal(0);

            done();
        });
    });

    it('one repository object should provide specific information', function test (done) {
        trending((err, repos) => {
            const repository = repos[0];

            expect(repository.title).to.not.be.undefined;
            expect(repository.owner).to.not.be.undefined;
            expect(repository.description).to.not.be.undefined;
            expect(repository.url).to.not.be.undefined;
            expect(repository.language).to.not.be.undefined;
            expect(repository.stars).to.not.be.undefined
            expect(repository.stars.count).to.not.be.NaN;

            done();
        });
    });

    it('should be able to fetch the trending repos of a particular language', function test (done) {
        trending({language: 'rust'}, (err, repos) => {
            expect(err).to.equal(null);

            expect(util.isArray(repos)).to.equal(true);
            expect(repos.length).to.not.equal(0);

            done();
        });
    });

    it('should be able to fetch the trending repos of a particular language with a timespan', function test (done) {
        trending({language: 'rust', timespan: 'weekly'}, (err, repos) => {
            expect(err).to.equal(null);

            expect(util.isArray(repos)).to.equal(true);
            expect(repos.length).to.not.equal(0);

            done();
        });
    });

    it('should be able to fetch the languages for which trending repo data is available', function test (done) {
        trending.languages((err, languages) => {
            expect(err).to.equal(null);

            expect(util.isArray(languages)).to.equal(true);
            expect(languages.length).not.to.equal(0);

            done();
        });
    });
});

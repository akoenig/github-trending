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

var util = require('util');

var expect = require('expect.js');

var trending = require('../');

describe('The "github-trending" library', function suite () {

    it('should be able to fetch the trending repos of all languages', function test (done) {
        trending(function (err, repos) {
            expect(err).to.be(null);

            expect(util.isArray(repos)).to.be(true);
            expect(repos.length).not.to.be(0);

            done();
        });
    });

    it('one repository object should provide specific information', function test (done) {
        trending(function (err, repos) {
            var repository = repos[0];

            expect(repository.title).not.to.be(undefined);
            expect(repository.owner).not.to.be(undefined);
            expect(repository.description).not.to.be(undefined);
            expect(repository.url).not.to.be(undefined);
            expect(repository.language).not.to.be(undefined);
            expect(repository.stars).not.to.be(undefined)

            done();
        });
    });

    it('should be able to fetch the trending repos of a particular language', function test (done) {
        trending('rust', function (err, repos) {
            expect(err).to.be(null);

            expect(util.isArray(repos)).to.be(true);
            expect(repos.length).not.to.be(0);

            done();
        });
    });

    it('should be able to fetch the trending repos of a particular language with a timespan', function test (done) {
        trending('rust', 'weekly', function (err, repos) {
            expect(err).to.be(null);

            expect(util.isArray(repos)).to.be(true);
            expect(repos.length).not.to.be(0);

            done();
        });
    });

    it('should be able to fetch the languages for which trending repo data is available', function test (done) {
        trending.languages(function (err, languages) {
            expect(err).to.be(null);

            expect(util.isArray(languages)).to.be(true);
            expect(languages.length).not.to.be(0);

            done();
        });
    });
});

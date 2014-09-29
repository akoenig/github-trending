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

var trending = require('../');

describe('The "github-trending" library', function () {

    it('should be able to fetch the trending repos of all languages', function (done) {
        trending(function (err, repos) {
            expect(err).toBeNull();

            expect(util.isArray(repos)).toBe(true);
            expect(repos.length).not.toBe(0);

            done();
        });
    });
    
    it('should be able to fetch the trending repos of a particular language', function (done) {
        trending('rust', function (err, repos) {
            expect(err).toBeNull();

            expect(util.isArray(repos)).toBe(true);
            expect(repos.length).not.toBe(0);

            done();
        });
    });

    it('should be able to fetch the languages for which trending repo data is available', function (done) {
        trending.languages(function (err, languages) {
            expect(err).toBeNull();

            expect(util.isArray(languages)).toBe(true);
            expect(languages.length).not.toBe(0);

            done();
        });
    });
});

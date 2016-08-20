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

var mandatory = require('mandatory');
var VError = require('verror');

var request = require('./request.js');
var scraper = require('./scraper.js');

var endpoint = 'https://github.com/trending';

/**
 * Grabs the trending repositories of a particular language.
 *
 * @param {string} language
 * The language for which the trending repos should be fetched.
 *
 * @param {function} callback
 * Will be invoked when the trending repository
 * data has been fetched. Invoked as `callback(err, repositories)`.
 *
 */
function trending () {

    var language;
    var timespan;
    var callback;

    if (arguments.length === 3) {
        language = arguments[0];
        timespan = arguments[1];
        callback = arguments[2];
    }
    else if (arguments.length === 2) {
        language = arguments[0];
        callback = arguments[1];
    }
    else {
        callback = arguments[0];
    }

    language = (language || 'all').toLowerCase();
    timespan = timespan || 'daily';

    function onResponse (err, html) {
        var repositories;

        if (err) {
            return callback(new VError(err, 'failed to fetch trending repositories (language: %s).', language));
        }

        repositories = scraper.repositories(html);

        callback(null, repositories);
    }

    mandatory(callback)
        .is('function', 'Please define a proper callback function.');

    request(endpoint, { l: language, since: timespan }, onResponse);
}

/**
 * Fetches the available languages from GitHub. This function will extract the
 * information from GitHub for which languages trending repository data is available.
 *
 * @param {function} callback
 * Will be invoked when the languages has been determined or an error occurred.
 * Invoked as `callback(err, languages)`.
 *
 */
trending.languages = function languages (callback) {

    function onResponse (err, html) {
        var languages;

        if (err) {
            return callback(new VError(err, 'failed to fetch all available languages.'));
        }

        languages = scraper.languages(html);

        callback(null, languages);
    }

    mandatory(callback)
        .is('function', 'Please define a proper callback function.');

    request(endpoint, onResponse);
};

module.exports = trending;

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

const mandatory = require('mandatory');
const moment = require('moment');
const VError = require('verror');

const request = require('./request.js');
const converter = require('./converter.js');

const endpoint = 'https://api.github.com/search/repositories';

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
const trending = (options, callback) => {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    options = options || {};
    options.language = (options.language || 'all').toLowerCase();
    options.timespan = (options.timespan || 'daily').toLowerCase();

    mandatory(callback).is('function', 'Please define a proper callback function.');

    let created = moment();

    switch (options.timespan) {
        case 'monthly': {
            created = moment().subtract(30, 'days');
            break;
        }
        case 'weekly': {
            created = moment().subtract(7, 'days');
            break;
        }
        case 'daily': {
            created = moment().subtract(1, 'days');
            break;
        }
    }

    created = created.format('YYYY-MM-DD');

    request(endpoint, {
        sort: 'starts',
        // daily, weekly, monthly
        q: `created:>${created}&q=language:${options.language}`,
        order: 'desc',
    }, (err, body) => {
        if (err) {
            return callback(new VError(err, 'failed to fetch trending repositories (language: %s).', language));
        }

        try {
            const repositories = converter(JSON.parse(body).items);

            callback(null, repositories);
        } catch (err) {
            callback(err);
        }

    });
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
trending.languages = callback => {
    mandatory(callback).is('function', 'Please define a proper callback function.');

    request(endpoint, (err, html) => {
        if (err) {
            return callback(new VError(err, 'failed to fetch all available languages.'));
        }

        const languages = scraper.languages(html);

        callback(null, languages);
    });
};

module.exports = trending;

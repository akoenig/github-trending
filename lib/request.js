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

const https = require('https');

const mandatory = require('mandatory');
const VError = require('verror');

/**
 * Wrapper around the 'https' module. Performs an ordinary HTTP GET request.
 *
 * @param {string} uri
 * The full URI against which the request should be send.
 *
 * @param {object} query
 * The query object.
 *
 * @param {function} callback
 * Will be invoked if the HTTP response has landed or an error occurred.
 * Invoked as `callback(err, responseBody)`.
 *
 */
const request = (uri, query, callback) => {
    const finalize = (err, body) => {
        if (err) {
            return callback(new VError(err, 'HTTP request failed.'));
        }

        callback(null, body);
    }

    if (typeof query === 'function') {
        callback = query;
        query = undefined;
    }

    mandatory(uri).is('string');
    mandatory(callback).is('function');

    query = query && `?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}` || '';

    console.log(uri+query);

    https.get(uri + query, res => {
        let body = '';

        if (res.statusCode !== 200) {
            return callback(new VError('Received unusual HTTP response code "%s".', res.statusCode));
        }

        res.on('data', chunk => {
            body = body + chunk;
        })
        .on('error', finalize)
        .on('end', () =>
            finalize(null, body)
        );
    });
};

module.exports = request;

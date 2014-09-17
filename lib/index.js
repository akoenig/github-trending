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

var cheerio = require('cheerio');
var request = require('superagent');
var VError = require('verror');

/**
 * Provides the functionality for fetching the trending GitHub repositories.
 *
 */
function Trending () {
    this.$endpoint = 'https://github.com/trending';
}

/**
 * @private
 * 
 * Performs a request against the GitHub endpoint (see constructor) and fetches
 * the raw HTML response.
 * 
 * @param {string} language
 * The language for which the trending repos should be fetched.
 * 
 * @param {function} callback
 * Will be invoked when the raw HTML response has been fetched or an error occurred.
 * Invoked as `callback(err, html)`;
 * 
 */
Trending.prototype.$request = function $request (language, callback) {
    function onRequest (err, res) {
        if (err) {
            return callback(new VError(err, 'failed to send HTTP request.'));
        }
        
        callback(null, res.text);
    }

    request
        .get(this.$endpoint)
        .query({l: language})
        .end(onRequest);
};

/**
 * @private
 * 
 * Scrapes the repository data out of a raw HTML response.
 * 
 * @param {string} html
 * The raw HTML response from which the repositories will be fetched.
 * 
 * @returns {array}
 * The repository data. Example:
 * 
 *     [{ title: 'eholk/Boot2Rust',
 *        owner: 'eholk',
 *        description: 'EFI applications in Rust',
 *        url: 'https://github.com/eholk/Boot2Rust' },
 *     { title: 'miselin/rustic',
 *       owner: 'miselin',
 *       description: 'Rustic Embedded Framework',
 *       url: 'https://github.com/miselin/rustic' }, ... ]
 *
 */
Trending.prototype.$scrape = function $scrape (html) {
    var repositories = [];
    var $ = cheerio.load(html, {
        normalizeWhitespace: true
    });

    $('li.repo-list-item').each(function onEach () {
        var repository = {};
        var $elem = $(this);

        repository.title = $elem.find('.repo-list-name a').attr('href');
        
        // Remove the first slash
        repository.title = repository.title.substring(1, repository.title.length);
        repository.owner = $elem.find('span.prefix').text();
        repository.description = $elem.find('p.repo-list-description').text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        repository.url = 'https://github.com/' + repository.owner + '/' + repository.title.split('/')[1];

        repositories.push(repository);
    });

    return repositories;
};

/**
 * Grabs the trending repositories for a particular language.
 * 
 * @param {string} language
 * The language for which the trending repos should be fetched.
 * 
 * @param {function} callback
 * Will be invoked when the trending repository data has been fetched. Invoked
 * as `callback(err, repositories)`.
 * 
 */
Trending.prototype.fetch = function fetch (language, callback) {
    var self = this;

    function onRequest (err, html) {
        var repositories = [];

        if (err) {
            return callback(new VError(err, 'failed to grab the HTML from GitHub.'));
        }

        repositories = self.$scrape(html);
        
        callback(null, repositories);
    }

    this.$request(language, onRequest);
};

/**
 * Grabs the trending repositories for a particular language.
 *
 * Usage example:
 * 
 * var trending = require('github-trending');
 *
 * trending('javascript', function (err, repos) {
 *     if (err) {
 *         return console.error(err);
 *     }
 *     
 *     console.log(repos);
 * });
 * 
 */
module.exports = function grab (language, callback) {
    var trending = new Trending();
    
    function onFetch (err, repos) {
        if (err) {
            return callback(new VError(err, 'failed to get the current trending repositories from GitHub (language: %s).', language));
        }
        
        callback(null, repos);
    }

    if ('function' === typeof language) {
        callback = language;
        language = undefined;
    }
    
    language = (language || 'all').toLowerCase();

    trending.fetch(language, onFetch);
};
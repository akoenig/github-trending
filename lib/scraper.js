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
var mandatory = require('mandatory');

/**
 * Extracts all repository information from a GitHub trending
 * repository HTML snippet.
 *
 * @param {string} html
 * The GitHub HTML snippet with trending repository information.
 *
 * @returns {array}
 * An array with the extracted repository objects, whereas one repository
 * object will have the following structure:
 *
 *     {
 *         title: 'The repository title (e.g. akoenig/angular-deckgrid),
 *         owner: 'The repository owner (e.g. akoenig),
 *         description: 'The repository description.',
 *         url: 'The full URL to the repository (e.g. http://github.com/akoenig/angular-deckgrid)'
 *     }
 *
 */
exports.repositories = function repositories (html) {
    var repos = [];
    var $;

    mandatory(html).is('string');

    $ = cheerio.load(html, {
        normalizeWhitespace: true
    });

    $('li.repo-list-item').each(function onEach() {
        var repository = {};
        var $elem = $(this);
        var language = $elem.find('.repo-list-meta').text().split('•');
        repository.title = $elem.find('.repo-list-name a').attr('href');

        // Remove the owner name and all slashes
        repository.title = repository.title.split('/')[2];

        repository.owner = $elem.find('span.prefix').text();
        repository.description = $elem.find('p.repo-list-description').text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        repository.url = 'https://github.com/' + repository.owner + '/' + repository.title;
        repository.language = language.length === 3 ? language[0].trim() : '';
        repository.star = language.length === 3 ? language[1].trim() : language[0].trim();
        repos.push(repository);
    });

    return repos;
};

/**
 * Will extract the available languages out of a GitHub trending
 * repository page. The information will be scraped out of the menu
 * in the page.
 *
 * @param {string} html
 * The GitHub HTML snippet.
 *
 * @returns {array}
 * The available language information.
 *
 */
exports.languages = function languages (html) {
    var langs = [];
    var $;

    mandatory(html).is('string');

    $ = cheerio.load(html, {
        normalizeWhitespace: true
    });

    $('.select-menu-item-text.js-select-button-text.js-navigation-open').each(function onEach (index, elem) {
        elem = $(elem);
        langs.push(elem.attr('href').split('=')[1]);
    });

    return langs;
};

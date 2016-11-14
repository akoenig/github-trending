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

    $('.repo-list li').each(function onEach() {
        var repository = {};
        var $elem = $(this);
        var url = $elem.find('h3 a').attr('href');
        var refs = url.split('/');

        repository.owner = refs[1];
        repository.title = refs[2];
        repository.url = 'https://github.com' + url;
        repository.description = $elem.find('div[class="py-1"] p').text();
        repository.language = $elem.find('span[itemprop="programmingLanguage"]').text().trim();

        var star = $elem.find('span[class="float-right"]').text().trim().replace(' stars today', '');
        repository.stars = {
            count: parseInt(star),
            text: star
        };

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
        langs.push(elem.text().trim());
    });

    return langs;
};

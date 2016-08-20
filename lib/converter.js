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

const cheerio = require('cheerio');

const converter = repositories =>
    repositories.map(item => ({
        title: item.name,
        owner: item.owner.login,
        description: item.description,
        url: item.html_url,
        language: item.language,
        starts: item.stargazers_count,
        forks: item.forks
    }));

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
const languages = html => {
    mandatory(html).is('string');

    const $ = cheerio.load(html, {
        normalizeWhitespace: true
    });

    let langs = [];

    $('.select-menu-item-text.js-select-button-text.js-navigation-open').each((index, elem) => {
        elem = $(elem);

        const lang = elem.text().trim();

        langs = [].concat(langs, [lang]);
    });

    return langs;
};

module.exports.converter = converter;
module.exports.languages = languages;

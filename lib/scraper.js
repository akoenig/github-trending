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

function Scraper () {

}

Scraper.prototype.repositories = function repositories () {

};

Scraper.prototype.languages = function languages () {

};

module.exports = function instantiate () {
    var scraper = new Scraper();

    return {
        repositories : scraper.repositories.bind(scraper),
        languages : scraper.languages.bind(scraper)
    };
};

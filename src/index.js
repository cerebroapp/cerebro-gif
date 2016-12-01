const React = require('react');
const Preview = require('./Preview');
const { memoize } = require('cerebro-tools');

/**
 * API key for giphy.com
 * @type {String}
 */
const API_KEY = 'dc6zaTOxFJmzC';

/**
 * Fetch gifs from giphy API
 *
 * @param  {Function} searchTerm
 * @return {Promise}
 */
const fetchGifs = searchTerm => {
  const url = `http://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(searchTerm)}&api_key=${API_KEY}`;
  return fetch(url)
    .then(resp => resp.json())
    .then(resp => resp.data);
};

/**
 * Version of fetchGifs with caching
 *
 * @type {Function}
 */
const cachedFetchGifs = memoize(fetchGifs);

/**
 * Cerebro plugin to find gifs related to something
 *
 * @param  {String} options.term
 * @param  {Function} options.display
 */
const gifPlugin = ({term, display, actions}) => {
  let match = term.match(/^gif\s+(.+)/i);
  match = match || term.match(/(.+)\sgif$/i);
  if (match) {
    cachedFetchGifs(match[1]).then(results => {
      const response = results.map(item => ({
        id: item.id,
        title: item.images.original.url,
        clipboard: item.images.original.url,
        onSelect: () => actions.copyToClipboard(item.images.original.url),
        getPreview: () => <Preview images={item.images} id={item.id}  />
      }));
      display(response);
    })
  }
};

module.exports = {
  name: 'Gif',
  keyword: 'gif',
  fn: gifPlugin,
};

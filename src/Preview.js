const React = require('react');
const styles = require('./styles.css');
const bytesToSize = require('./bytesToSize');

module.exports = ({ images, id }) => {
  const { url } = images.downsized;
  const { width, height, size } = images.original;
  return (
    <div key={id}>
      <img src={url} className={styles.preview} />
      {<div className={styles.details}>{width}x{height}px, {bytesToSize(size)}</div>}
    </div>
  );
};

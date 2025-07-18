
const extractKeywords = (input) => {
  return input
    .toLowerCase()
    .replace(/[^\w\s]/g, '')  // remove punctuation
    .split(/\s+/);            // split by whitespace
};


module.exports = extractKeywords;

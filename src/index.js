const readmemd = require('../README.md');

const mdContainer = window.document.getElementById('md-container');
const { hljs } = window;
mdContainer.innerHTML = readmemd;

if (hljs) {
  hljs.initHighlightingOnLoad();
}

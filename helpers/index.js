const hbs = require('handlebars');

hbs.registerHelper('compilehtml', (templateStr, options) => {
    const template = hbs.compile(templateStr);
    return template();
});
module.exports = hbs;

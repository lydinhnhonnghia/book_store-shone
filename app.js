const createError = require('http-errors');
const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const hbsHelpers = require('./helpers/index');
const indexRouter = require('./routes/index');
const { mongoose } = require('./models/_plugins');

const app = express();
require('./database/config');

// view engine setup
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    partialsDir: `${__dirname}/views`,
    layoutsDir: `${__dirname}/views/admin/layouts/`,
    helpers: hbsHelpers,
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(session({
    secret: 'abcddd',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
    }),
    cookie: { maxAge: 20 * 24 * 60 * 60 * 1000 },
}));
require('./configs/passport').init(app);

app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res) => res.render('404', { layout: false }),
    // next(createError(404));
);

// error handler
app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    return res.render('error');
});

module.exports = app;

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {FileCleaner} = require('./helpers/file_cleaner');

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('body-parser').urlencoded({extended: false}));

app.use('/', indexRouter);

const fileCleaner = new FileCleaner();
fileCleaner.start();

module.exports = app;

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {FileCleaner} = require('./helpers/file');
const indexRouter = require('./routes/index');
const cors = require('cors');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('body-parser').urlencoded({extended: false}));
app.use(cors())

app.use('/', indexRouter);

const fileCleaner = new FileCleaner();
fileCleaner.start();

module.exports = app;

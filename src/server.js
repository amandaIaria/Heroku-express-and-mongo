const express = require('express');
const multer = require('multer');
const multipart = multer();
const cors = require('cors');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../.configs/webpack/webpack.dev.config.js');

const app = express();

let devServerEnabled;

const copy = require('./JSON/copy.json');
const projects = require('./JSON/project.json');
const contact = require('./api/contact');

if (process.env.NODE_ENV !== 'prod') {
  require('dotenv').config();
  devServerEnabled = true;
}

if (devServerEnabled) {
    //reload=true:Enable auto reloading when changing JS files or content
    //timeout=1000:Time from disconnecting from server to reconnecting
    config.entry.app.unshift('webpack-hot-middleware/client?reload=true&timeout=1000');

    //Add HMR plugin
    config.plugins.push(new webpack.HotModuleReplacementPlugin());

    const compiler = webpack(config);

    //Enable "webpack-dev-middleware"
    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath
    }));

    //Enable "webpack-hot-middleware"
    app.use(webpackHotMiddleware(compiler));
}

app.use(express.static('./public'));
app.use(cors({
  origin: process.env.ORIGIN
}));
app.use(require("body-parser").json());

//API
app.post('/api/:type', function (req, res) {
  console.log('post', req.params.type, req.body, process.env.EMAIL);
  if (req.params.type === 'contact') {
    contact.sendMessage(req.body, res, process.env.EMAIL);
  }
  else {
    res.status(500).send('Something broke!');
  }
});

//JSON
app.get('/JSON/:json', function (req, res) {
  const copyBit = req.query.id != '' ? projects[req.query.id] : projects; 
  if (req.params.json === 'copy') {
    res.json(copy);
  }
  else if (req.params.json === 'projects') {
    res.json(copyBit);
  }
  else {
    res.status(404).send('Something broke!');
  }
});

app.listen(process.env.PORT, () => {
  console.log('Server started on port:' + process.env.PORT);
});
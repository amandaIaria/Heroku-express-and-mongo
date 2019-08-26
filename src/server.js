const express = require('express');
const multer = require('multer');
const multipart = multer();

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../.configs/webpack/webpack.dev.config.js');

const app = express();
const port = 8080;

const devServerEnabled = true;

const copy = require('./JSON/copy.json');
const projects = require('./JSON/project.json');

const contact = require('./api/contact.js');

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

//testing
app.get('/', function (req, res) {
  res.send('Hello World!');
})

//API
app.post('/api/:type', multipart.any(), function (req, res) {
  if (req.params.type === 'contact') {
    const c = contact(req.body);

    if(c.pass) {
      res.json(c.response);
    }
    else {
      res.status(404).send('Something broke!');
    }
  }
  else {
    res.status(500).send('Something broke!');
  }
});

//JSON
app.get('/JSON/:json', function (req, res) {
  console.log(req, res);

  if (req.params.json === 'copy') {
    res.json(copy);
  }
  else if (req.params.json === 'projects') {
    res.json(projects);
  }
  else {
    res.status(404).send('Something broke!');
  }
});

app.listen(port, () => {
    console.log('Server started on port:' + port);
});
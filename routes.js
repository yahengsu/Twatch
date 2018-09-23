const routes = require('express').Router();

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected!' });
  });

routes.get('/', (req, res) => {
    res.send('Hello World!');
    res.render('../views/App');
});
routes.get('/graphs/0', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

routes.get('/graphs/1', (req, res) => {
    res.send({

    });
});

routes.get('/graphs/2', (req, res) => {
    res.send({

    });
});

routes.get('/graphs/3', (req, res) => {
    res.send({

    });
});


module.exports = routes;
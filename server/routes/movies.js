const Router = require('express').Router;
const Movie = require('../models/Movie');

const router = Router();

router.get('/', (req, res) => {
  Movie.find().then(data => res.json(data));
});

router.get('/:id', (req, res) => {
  Movie.findOne({Title: req.params.id}).then(data => {
    if(data) res.json(data);
    else res.sendStatus(404);
  }
  );
});

router.post('/', (req, res) => {
  const movie = new Movie(req.body);
  movie.save(req.body)
    .then(movie => res.status(201).json(movie))
    .catch(error => {
      if(error.name === "ValidationError") {
        res.status(400).json(error.errors);
      } else {
        res.sendStatus(500);
      }
    });
});

router.delete('/:id', (req, res) => {
  Movie.deleteOne({Title: req.params.id}).then(() => res.sendStatus(204));
});

router.put('/:id', (req, res)=> {
  Movie.findOneAndUpdate({Title: req.params.id}, req.body).then(data=> { 
    res.json({...data, ...req.body})
  });
});

module.exports = router;

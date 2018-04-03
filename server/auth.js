const router = require('express').Router();
const { User } = require('./db');
module.exports = router;

const userNotFound = next => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
};

router.use('/google', require('./oauth'));

router.get('/me', (req, res, next) => {
  console.log('USER: ', req.user);
  console.log('SESSION: ', req.session);
  if (!req.user) {
    userNotFound(next);
  } else {
    req.user ? res.json(req.user) : userNotFound(next);
  }
});

router.put('/login', (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email,
      password: req.body.password
    }
  })
    .then(user => {
      if (user) {
        req.session.userId = user.id;
        res.json(user);
      } else {
        const err = new Error('Incorrect email or password!');
        err.status = 401;
        next(err);
      }
    })
    .catch(next);
});

router.delete('/logout', (req, res, next) => {
  req.session.destroy();
  res.status(204).end();
});

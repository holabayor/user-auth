const { Router } = require('express');

const router = Router();

router.use('/auth', require('./auth.router'));
router.use('/api/users', require('./user.router'));
router.use('/api/organisations', require('./organisation.router'));

module.exports = router;

const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/messageController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, getMessages);

module.exports = router;





// const express = require('express');
// const router = express.Router();
// const { getMessages } = require('../controllers/messageController');
// const auth = require('../middleware/authMiddleware');

// router.get('/', auth, getMessages);

// module.exports = router;
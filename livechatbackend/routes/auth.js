// const express = require('express');
// const router = express.Router();
// const { register, login } = require('../controllers/authController');

// router.post('/register', register);
// router.post('/login', login);

// module.exports = router;


// uparna code ma jo Add this(nichena) endpoint for fetching users


 

const express = require('express');
const router = express.Router();
const { register, login, getUsers } = require('../controllers/authController');
const User = require('../models/User');

router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers); 
//uparna traney aagal /auth/register ke /auth/login em url banshe karan ke server.js ma /auth aagal lagadelu chhe to aa badha routes ni aagal e lagi jay 

//http://localhost:5000/auth/users karo url etale badha jetala user chhe e mali jay
//dhyan rakhvu ek ahi upar no url chhe e server no url chhe frontend no nahi ..to aapane shu karta hta ke frontend na url upar j aa routes apply karta hta pan evu nathi 



// ✅ GET /auth/users  // jo ahi niche chhe em lakhi shakvi aapane, pan code ne redable banava mare ahi aani upar chhe /users 
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username');
    res.json(users);
  } catch (err) {
    res.status(500).send('Failed to fetch users');
  }
});

module.exports = router; 


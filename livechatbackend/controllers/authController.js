const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = 'your_jwt_secret_key';

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send('User already exists');
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).send('User created');
  } catch (err) {
    res.status(500).send('Registration failed');
  }
};

// exports.login = async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ username });
//      console.log('Full response:', res);                 // 👈 Add this
//     console.log('Token:', res.data.token);               // 👈 This should be defined
//     console.log('User:', res.data.user);   
//     if (!user) return res.status(400).send('User not found');

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).send('Invalid credentials');

//     const token = jwt.sign({ id: user._id }, JWT_SECRET);
//     res.json({ token, user: { username: user.username } });
//   } catch (err) {
//     res.status(500).send('Login failed');
//   }
// };


//ahi niche jetala pan login chhe e badha serverna console ma etale vscode na terminal ma open thashe tya jova aana output...

exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log('Incoming login for:', username); // 👈

  try {
    const user = await User.findOne({ username });
    console.log('User found:', user); // 👈 

    if (!user) return res.status(400).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch); // 👈

    if (!isMatch) return res.status(400).send('Invalid credentials');



// This line needs to be changed when generating the token: (nicheni line)
   const token = jwt.sign(
  { id: user._id, username: user.username },  // 👈 add username here
  JWT_SECRET
);
    console.log('Generated token:', token); // 👈

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    console.error('Login failed due to:', err); // 👈 critical log
    res.status(500).send('Login failed');
  }
};



exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username'); // Only return usernames
    res.json(users);
  } catch (err) {
    res.status(500).send('Failed to get users');
  }
};


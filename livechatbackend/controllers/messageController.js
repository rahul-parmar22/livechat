// const Message = require('../models/Message');

// exports.getMessages = async (req, res) => {
//   try {
//     const messages = await Message.find().sort({ timestamp: 1 });
//     res.json(messages);
//   } catch (err) {
//     res.status(500).send('Failed to fetch messages');
//   }
// };
//personal chat mate aa nicheno code jema receiver pan chhe sender pan chhe evo code..uparno code thi like ek only group ma vato karta hoy evu hatu



const User = require('../models/User'); // agar aapke paas User model hai
const Message = require('../models/Message');



exports.getMessages = async (req, res) => {
  const { with: chattingWith } = req.query; //frontend thi aavo api call thay /messages?with=username   to ahi with ma je username chhe ene aapane query mathi means api mathi destrcuture karie chhe..jem req.params karta hta em

  console.log("Token payload received:", req.user); // 👈 Add this

  const username = req.user.username;

  try {
    let messages;
    if (chattingWith) {
      messages = await Message.find({
        $or: [
          { sender: username, receiver: chattingWith },
          { sender: chattingWith, receiver: username }
        ]
      }).sort({ timestamp: 1 });
    } else {
      messages = await Message.find({ receiver: null }).sort({ timestamp: 1 });
    }
    res.json(messages);
  } catch (err) {
    console.error('Error while fetching messages:', err); // 👈 log full error
    res.status(500).send('Failed to fetch messages');
  }
};



//direct url ma jaine  /message route karvathi kai nahi aave...
//frontend ma /chat thay tyare ek component chalu thay ane e component ma aa /message route chhe....mare /chat evu koi route backend ma nathi ...pan url ma chhe..

// (1) Browser me user gaya → /chat
//           ↓
// (2) React Router ne ChatDesign component render kiya
//           ↓
// (3) ChatDesign ne axios.get('/messages') call kiya
//           ↓
// (4) Axios ne backend (port 5000) pe GET /messages bheja
//           ↓
// (5) Express ne /messages route match kiya → getMessages controller run hua
//           ↓
// (6) DB se messages aaye → response frontend ko mila
//           ↓
// (7) React ne messages state update ki → UI pe messages dikhe



// | Confusion                                                      | Reality / Solution                                                                           |
// | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
// | “Browser me `/chat` likha, backend kaise chal gaya?”           | `/chat` React ka page hai, uske andar se Axios call hoti hai jo backend ko hit karti hai.    |
// | “Server.js me `/chat` likha nahi, phir bhi data mil raha hai?” | Kyunki frontend component Axios se `/messages` call kar raha hai, `/chat` sirf UI route hai. |
// | “/users pe kuch nahi milta”                                    | Server me `/auth` prefix hai → correct URL = `/auth/users`                                   |
// | “Frontend aur backend dono me `/messages` alag kaise?”         | Frontend → Axios call; Backend → Express endpoint; Axios baseURL dono ko connect karta hai.  |
// | “React page reload hone pe data kyun gaya?”                    | `<a href="...">` tags se page reload hota hai; hamesha `<Link to="...">` use karo.           |

💬 Premium Chat App
A real-time chat application built with React + Socket.IO + Node.js featuring typing indicators, message reactions, replies, file sharing, voice notes, and OTP login.
This project is designed to provide a modern premium chat experience similar to WhatsApp/Discord.

🚀 Features
✅ User Login with OTP (Firebase Auth / Phone Number)
✅ Real-time Messaging (Socket.IO)
✅ Typing Indicator → "User is typing…"
✅ Reply to Messages → Click a message to reply inline
✅ Edit / Delete Own Messages
✅ Reactions → 👍 😂 ❤️ 🔥
✅ Message Seen Status → ⌛ Sent, ✅ Delivered, ✅✅ Seen
✅ Avatar Initials in Circle
✅ File Sharing → Send files, images, documents
✅ Voice Notes → Record & send audio messages
✅ Room / Group Support → General, Tech Talk, Gaming, Random
✅ Responsive Premium Dark UI

🛠️ Tech Stack
Frontend (Client)

React.js (with Hooks)
Socket.IO Client
Emoji Picker (emoji-picker-react)
React Icons
CSS (Premium Dark Theme)
Backend (Server)

Node.js + Express
Socket.IO
CORS
In-memory Store (extendable with MongoDB/Firebase)
📂 Project Structure

project-chat-app/
│
├── client/                  # React Frontend
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
├── server/                  # Node.js Backend
│   ├── index.js
│   └── package.json
│
└── README.md

⚡ Setup & Installation
1️⃣ Clone the Repository
git clone https://github.com/your-username/project-chat-app.git
cd project-chat-app
2️⃣ Install Dependencies
Client

cd client
npm install
Server

cd ../server
npm install
3️⃣ Run the Application
Start Backend (Server)

cd server
node index.js
Server runs on → http://localhost:5000

Start Frontend (Client)

cd client
npm start
Client runs on → http://localhost:3000

🔑 Firebase OTP Login Setup (Optional)
Create a Firebase Project → Firebase Console
Enable Phone Authentication in Authentication → Sign-in method
Copy your Firebase config into client/src/firebase.js
Replace dummy login with Firebase Auth flow
🎤 Voice Notes Feature
Uses MediaRecorder API to capture audio
Saves as Blob and sends through Socket.IO
Auto-plays inside chat window
🛡️ Future Enhancements
🔒 End-to-End Encryption (E2EE)
📱 Mobile App (React Native / Flutter)
🌐 Deploy on Heroku + Vercel + Firebase Hosting
🧑‍🤝‍🧑 User Profiles with DP & Status
🤝 Contributing
Contributions are welcome!

Fork this repo
Create a new branch (feature-xyz)
Commit changes
Open a Pull Request
📜 License
This project is MIT Licensed – free to use and modify.


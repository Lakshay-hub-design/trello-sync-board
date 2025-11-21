# Trello Realtime Clone

A real-time collaborative Kanban board built with React, Node.js, Socket.io, Trello API, and Webhooks. Instantly sync cards, lists, colors, and updates across tabs.

---

## Project Structure

trello-realtime-clone/  
│  
├── frontend/        # React board UI (Drag & Drop, list actions, cards, colors)  
│  
├── backend/       # Node.js API + Trello API integration + Webhook listener  
│  
├── postman_collection.json  
├── README.md  
└── .gitignore  

---

## Features
 - Real-time updates using Socket.io

- Trello official webhook integration

- Create, update, move & delete cards

- Rename lists live

- Change list color with live update

- Add lists dynamically (like Trello)

- Auto-sync across browser tabs

- Drag & Drop via @hello-pangea/dnd

- Postman Collection for APIs included

---

## Tech Stack

| Layer      | Technology                                 |
| ---------- | ------------------------------------------ |
| Frontend   | React, @hello-pangea/dnd, Socket.io-client |
| Backend    | Node.js, Express.js, Socket.io             |
| Database   | Trello API (Cloud-hosted)                  |
| Realtime   | Trello Webhooks, Socket.io                 |
| Networking | Cloudflare Tunnel or Ngrok                 |
| Testing    | Postman Collection                         |

---

## Backend Setup

**1. Clone the repo**

git clone https://github.com/yourusername/trello-realtime-clone.git
cd trello-realtime-clone

**2. Move to backend folder**

cd backend  

**3. Install dependencies**

npm install  

**4. Create .env file Use .env.example for guidance:**

TRELLO_KEY=your_trello_key  
TRELLO_TOKEN=your_trello_token  
WEBHOOK_BASE_URL=https://your-tunnel-url/api/webhooks  
BOARD_ID=your_board_id  
PORT=4000  
**also check out the .env.example file**  
Replace:
your_trello_key → Trello API key  
your_trello_token → Trello API token  
your_tunnel_url → Cloudflare or Ngrok URL  
- Fill in your Trello API key and token
- Set a public URL from Cloudflare or Ngrok for webhooks

---

## Getting Trello API Key & Token
**1. Get your API Key:**  
Open this link: https://trello.com/power-ups/admin/

**Copy**  
- Copy your API key  
- Scroll down → "Generate Token"

**2. Generate Token**  
Click: "Generate a Token"  
Give access → Copy token

Set in .env:  
Paste both key and token in .env

---

## Exposing Localhost for Webhooks

Trello requires a public HTTPS webhook URL.  
Recommended (Free): Cloudflare Tunnel

**1. Install Cloudflare tunnel:**  
npm install -g cloudflared  

**2. Run:**  
cloudflared tunnel --url http://localhost:4000  
**You receive a URL like** https://blue-moon-fox.trycloudflare.com  

**Use this for WEBHOOK_BASE_URL in .env:**

WEBHOOK_BASE_URL=https://blue-moon-fox.trycloudflare.com/api/webhooks  

---

## Starting the Backend  

npm start   
Backend runs at http://localhost:4000

---

## Frontend Setup

cd frontend  
npm install  
npm start  
Frontend runs at http://localhost:3000

---

## Register Trello Webhook

**Register the webhook after starting backend & tunnel.**  

**Using Postman (Recommended)**  

Send a POST request to

- http://localhost:4000/api/webhooks/register  
Body:

- json  
    {  
      "boardId": "YOUR_BOARD_ID"  
    }
Example Response:  

json  
{  
  "success": true,  
  "webhook": {  
    "id": "...",  
    "callbackURL": "https://your-tunnel-url/api/webhooks/trello",  
    "active": true  
  }  
}  

**Using cURL**  

curl -X POST http://localhost:4000/api/webhooks/register \
  -H "Content-Type: application/json" \
  -d '{"boardId": "YOUR_BOARD_ID"}' 

---

## Frontend Environment Variables

The frontend needs your Trello board ID to load lists and sync updates.  
Create a file:  
- frontend/.env  
Add:  
- VITE_TRELLO_BOARD_ID=your_board_id_here  
- VITE_API_BASE_URL=http://localhost:4000/api

---

## Required API Endpoints (for evaluation)   

| Method | Endpoint                   | Description             |
| ------ | -------------------------- | ----------------------- |
| POST   | /api/boards                | Create new Trello board |
| GET    | /api/boards/:boardId/lists | Load lists + cards      |
| POST   | /api/tasks                 | Create card             |
| PUT    | /api/tasks/:cardId         | Update or move card     |
| DELETE | /api/tasks/:cardId         | Delete card             |
| POST   | /webhooks/register     | Register webhook        |

All endpoints included in Postman Collection.

---

## Real-Time Events (Socket.io)

| Trello Event | Socket Event | Description    |
| ------------ | ------------ | -------------- |
| createCard   | card:created | New card added |
| updateCard   | card:moved   | Card moved     |
| deleteCard   | card:deleted | Card removed   |
| createList   | list:created | List added     |
| updateList   | list:rename  | List renamed   |

## Testing Real-Time Sync

1. Open two browser tabs at http://localhost:4000  
2. Register webhook once  

3. Try these actions in Tab 1 — see live sync in Tab 2!

- Drag card
- Create list
- Rename list
- Change list color
- Delete card

All updates sync instantly, without refresh

## Live Demo 

Watch the 3–5 min demo here:

➡️ https://youtu.be/CO4If-yIHwk

---

##  Postman Collection

Included in repo as Trello Realtime Clone API.postman_collection.json 
You can import this into Postman to test:

- Create board
- Load lists
- Create task
- Update task
- Delete task
- Register webhook

## Contributing / Issues  
Feel free to open an issue or submit a pull request to improve this project!

Enjoy building with Trello Realtime Clone!

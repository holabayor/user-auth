require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT;
const server = http.createServer(app);

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});

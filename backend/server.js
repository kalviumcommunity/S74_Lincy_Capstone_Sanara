const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const journalRoutes = require('./routes/journalRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err)=>console.error('MongoDB error', err));

app.use('/api/journals', journalRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT||5000;
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`));
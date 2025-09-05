const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(require('cors')());


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/consents', require('./routes/consentRoutes'));
app.use('/api/genome', require('./routes/genomeRoutes'));
app.use('/api/analysis', require('./routes/analysisRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/deletion-logs', require('./routes/deletionLogRoutes'));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

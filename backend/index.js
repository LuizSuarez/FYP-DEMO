const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();
connectDB();


const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.VITE_API_FRONTEND,
    credentials: true,
}));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/consents', require('./routes/consentRoutes'));
app.use('/api/genome', require('./routes/genomeRoutes'));
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/analysis', require('./routes/analysisRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/deletion-logs', require('./routes/deletionLogRoutes'));
app.use('/api/variants', require('./routes/variantRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/doctor-connect', require('./routes/doctorConnectRoutes'));


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

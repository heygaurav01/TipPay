import express, { urlencoded } from 'express';
import { config } from 'dotenv';
import employeeRoute from './src/v1/routes/employee.route.js';
import connection from './src/v1/config/connection.config.js';

config();
connection();
const app = express();
const port = process.env.PORT || 5009;

app.use(express.json());
app.use(express.json({ urlencoded: true }));

employeeRoute(app);

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
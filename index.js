import express, { urlencoded } from 'express';
import { config } from 'dotenv';
import employeeRoute from './src/v1/routes/employee.route.js';
import connection from './src/v1/config/connection.config.js';
import paymentRoute from './src/v1/routes/payment.route.js';
import payoutsRoute from './src/v1/routes/payouts.route.js';
import employerRoute from './src/v1/routes/employer.route.js';  //  New Import

config();
connection();
const app = express();
const port = process.env.PORT || 5009;

app.use(express.json());
app.use(express.json({ urlencoded: true }));

app.get('/test',(req,res)=>{
    console.log('req received');
    res.json({success:'true'})
})

employeeRoute(app);
paymentRoute(app);
payoutsRoute(app);
employerRoute(app);  //  Add employer routes

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
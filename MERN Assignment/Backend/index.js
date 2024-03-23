import express from "express";
import cors from "cors";
import connectDatabase from "./src/config/db.js";
import bodyParser from "body-parser";
import seedTransactionsData from './src/config/seedTrasactionsData.js';
import transactionRoutes from './src/routes/transactionRoutes.js'
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/transactions', transactionRoutes);


// Connect to the database and seed data
(async () => {
  await connectDatabase();
  await seedTransactionsData();

  // Start the server
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
})();

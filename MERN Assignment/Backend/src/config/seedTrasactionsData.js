import axios from "axios";
import transactionModel from "../models/transactionSchema.js";

const seedTransactionsData = async () => {
  try {
    const response = await axios.get(`${process.env.THIRD_PARTY_API_URL}`);
    const transactions = response.data;
    // console.log(transactions, "transactions");

    const res = await transactionModel.insertMany(transactions, { maxTimeMS: 30000 });
    if (res) {
      console.log('Database initialized with seed data.');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default seedTransactionsData;

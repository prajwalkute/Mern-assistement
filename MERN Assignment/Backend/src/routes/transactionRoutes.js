import express from 'express';
import transactionController from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', transactionController.getAllTransactions);
router.get('/statistics', transactionController.getStatistics);
router.get('/bar-chart', transactionController.getBarChartData);
router.get('/pie-chart', transactionController.getPieChartData);
router.get('/combined-data', transactionController.getCombinedData);

export default router;

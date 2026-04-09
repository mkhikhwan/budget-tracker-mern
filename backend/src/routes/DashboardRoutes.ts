import { Router } from "express";
import * as DashboardController from "../controllers/DashboardController";
import Auth from "../middleware/Auth";

const router = Router();

router.get("/latest-transactions", Auth, DashboardController.getLatestTransactions);
router.get("/balance", Auth, DashboardController.getBalanceSummary);
router.get("/expense-breakdown", Auth, DashboardController.getExpenseBreakdown);
router.get("/monthly-expenses", Auth, DashboardController.getMonthlyExpenses);

export default router;
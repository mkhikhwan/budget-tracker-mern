import 'dotenv/config';
import request from "supertest";
import app from "./app";
import { connectDB, disconnectDB, getDb } from "./config/db";

describe("Application Endpoints", () => {
    beforeAll(async () => {
        await connectDB();
    });

    afterEach(async () => {
        const db = getDb();
        const collections = await db.listCollections().toArray();
        for (const collection of collections) {
            if (collection.name === "transaction_categories") continue;
            await db.collection(collection.name).deleteMany({});
        }
    });

    afterAll(async () => {
        await disconnectDB();
    });

    describe("GET /hello", () => {
        it("should return 200 OK", async () => {
            const response = await request(app).get("/hello");
            expect(response.status).toBe(200);
            expect(response.text).toBe("OK");
        });
    });

    describe("Auth Endpoints", () => {
        describe("POST /api/auth/register", () => {
        it("should register a new user successfully", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    name: "John Doe Doe",
                    email: "test@example.com",
                    password: "password123",
                    confirmPassword: "password123",
                    country: "USA"
                });
            expect(response.status).toBe(201);
        });
    });
    
    describe("POST /api/auth/login", () => {
        it("should login the registered user successfully", async () => {
            const userData = {
                name: "John Doe Doe",
                email: "login-test@example.com",
                password: "password123",
                confirmPassword: "password123",
                country: "USA"
            };

            await request(app).post("/api/auth/register").send(userData);

            const response = await request(app)
                .post("/api/auth/login")
                .send({ email: userData.email, password: userData.password });
            expect(response.status).toBe(200);
        });
        });
    });

    describe("Transaction Endpoints", () => {
        let authCookie: string;

        beforeEach(async () => {
            const userData = {
                name: "Transaction User",
                email: "transaction@test.com",
                password: "password123",
                confirmPassword: "password123",
                country: "USA"
            };
            await request(app).post("/api/auth/register").send(userData);
            const loginRes = await request(app)
                .post("/api/auth/login")
                .send({ email: userData.email, password: userData.password });
            
            const cookies = loginRes.get("Set-Cookie");
            if (cookies) {
                authCookie = cookies[0];
            }
        });

        it("should fetch transaction categories", async () => {
            const response = await request(app)
                .get("/api/transaction/categories")
                .set("Cookie", [authCookie]);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("categories");
            expect(Array.isArray(response.body.categories)).toBe(true);
        });

        it("should create a new transaction", async () => {
            const transactionData = {
                type: "expense",
                name: "Lunch",
                amount: 15.5,
                category: "food",
                description: "Work lunch",
                date: new Date().toISOString()
            };

            const response = await request(app)
                .post("/api/transaction/add")
                .set("Cookie", [authCookie])
                .send(transactionData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("transactionId");
        });

        it("should get all transactions", async () => {
            // Create a transaction first since DB is cleared after each test
            await request(app)
                .post("/api/transaction/add")
                .set("Cookie", [authCookie])
                .send({
                    type: "expense",
                    name: "Lunch",
                    amount: 15.5,
                    category: "food",
                    description: "Work lunch",
                    date: new Date().toISOString()
                });

            const response = await request(app)
                .get("/api/transaction")
                .set("Cookie", [authCookie]);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("transactions");
            expect(Array.isArray(response.body.transactions)).toBe(true);
            expect(response.body.transactions.length).toBe(1);
            // Description should be omitted in list view according to DTO logic
            expect(response.body.transactions[0]).not.toHaveProperty("description");
        });

        it("should paginate transactions with ?page parameter", async () => {
            // Create 22 transactions
            for (let i = 1; i <= 22; i++) {
                await request(app)
                    .post("/api/transaction/add")
                    .set("Cookie", [authCookie])
                    .send({
                        type: "expense",
                        name: `Lunch ${i}`,
                        amount: 10 + i,
                        category: "food",
                        description: `Lunch number ${i}`,
                        date: new Date(Date.now() - i * 60000).toISOString()
                    });
            }

            // Get page 1
            const resPage1 = await request(app)
                .get("/api/transaction?page=1")
                .set("Cookie", [authCookie]);
            expect(resPage1.status).toBe(200);
            expect(resPage1.body.transactions.length).toBe(20);

            // Get page 2
            const resPage2 = await request(app)
                .get("/api/transaction?page=2")
                .set("Cookie", [authCookie]);
            expect(resPage2.status).toBe(200);
            expect(resPage2.body.transactions.length).toBe(2);

            // Get page 3
            const resPage3 = await request(app)
                .get("/api/transaction?page=3")
                .set("Cookie", [authCookie]);
            expect(resPage3.status).toBe(200);
            expect(resPage3.body.transactions.length).toBe(0);
        });

        it("should filter transactions by search, type, category, date, and amount", async () => {
            // Let's create a few test transactions
            // 1. Lunch (expense, food, 15.50, "Work lunch", 3 days ago)
            await request(app)
                .post("/api/transaction/add")
                .set("Cookie", [authCookie])
                .send({
                    type: "expense",
                    name: "Lunch",
                    amount: 15.5,
                    category: "food",
                    description: "Work lunch",
                    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
                });

            // 2. Salary (income, work, 3000.00, "Monthly payout", 2 days ago)
            await request(app)
                .post("/api/transaction/add")
                .set("Cookie", [authCookie])
                .send({
                    type: "income",
                    name: "Salary",
                    amount: 3000,
                    category: "work",
                    description: "Monthly payout",
                    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                });

            // 3. Books (expense, education, 50.00, "TypeScript book", 1 day ago)
            await request(app)
                .post("/api/transaction/add")
                .set("Cookie", [authCookie])
                .send({
                    type: "expense",
                    name: "Books",
                    amount: 50,
                    category: "education",
                    description: "TypeScript book",
                    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
                });

            // Test search keyword
            const searchRes = await request(app)
                .get("/api/transaction?search=TypeScript")
                .set("Cookie", [authCookie]);
            expect(searchRes.status).toBe(200);
            expect(searchRes.body.transactions.length).toBe(1);
            expect(searchRes.body.transactions[0].name).toBe("Books");

            // Test filter by type
            const typeRes = await request(app)
                .get("/api/transaction?type=income")
                .set("Cookie", [authCookie]);
            expect(typeRes.status).toBe(200);
            expect(typeRes.body.transactions.length).toBe(1);
            expect(typeRes.body.transactions[0].name).toBe("Salary");

            // Test filter by category
            const categoryRes = await request(app)
                .get("/api/transaction?category=food")
                .set("Cookie", [authCookie]);
            expect(categoryRes.status).toBe(200);
            expect(categoryRes.body.transactions.length).toBe(1);
            expect(categoryRes.body.transactions[0].name).toBe("Lunch");

            // Test filter by date range
            const startDate = new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString();
            const dateRes = await request(app)
                .get(`/api/transaction?startDate=${startDate}`)
                .set("Cookie", [authCookie]);
            expect(dateRes.status).toBe(200);
            // Salary (2 days ago) and Books (1 day ago) are within the range. Lunch (3 days ago) is filtered out.
            expect(dateRes.body.transactions.length).toBe(2);

            // Test filter by amount range
            const amountRes = await request(app)
                .get("/api/transaction?minAmount=20&maxAmount=100")
                .set("Cookie", [authCookie]);
            expect(amountRes.status).toBe(200);
            expect(amountRes.body.transactions.length).toBe(1);
            expect(amountRes.body.transactions[0].name).toBe("Books");
        });

        it("should get transaction details", async () => {
            const createRes = await request(app)
                .post("/api/transaction/add")
                .set("Cookie", [authCookie])
                .send({
                    type: "expense",
                    name: "Lunch",
                    amount: 15.5,
                    category: "food",
                    description: "Work lunch",
                    date: new Date().toISOString()
                });

            const transactionId = createRes.body.transactionId;
            const response = await request(app)
                .get(`/api/transaction/${transactionId}`)
                .set("Cookie", [authCookie]);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("_id", transactionId);
            expect(response.body.name).toBe("Lunch");
            expect(response.body).toHaveProperty("description");
        });

        it("should update transaction details", async () => {
            const createRes = await request(app)
                .post("/api/transaction/add")
                .set("Cookie", [authCookie])
                .send({
                    type: "expense",
                    name: "Old Name",
                    amount: 10,
                    category: "others",
                    description: "Old desc",
                    date: new Date().toISOString()
                });

            const transactionId = createRes.body.transactionId;
            const updateData = {
                _id: transactionId,
                type: "expense",
                name: "Updated Name",
                amount: 20,
                category: "food",
                description: "Updated description",
                date: new Date().toISOString()
            };

            const response = await request(app)
                .put(`/api/transaction/${transactionId}`)
                .set("Cookie", [authCookie])
                .send(updateData);

            expect(response.status).toBe(200);

            const detailRes = await request(app)
                .get(`/api/transaction/${transactionId}`)
                .set("Cookie", [authCookie]);
                
            expect(detailRes.body.name).toBe("Updated Name");
            expect(detailRes.body.amount).toBe(20);
        });

        it("should delete a transaction", async () => {
            const createRes = await request(app)
                .post("/api/transaction/add")
                .set("Cookie", [authCookie])
                .send({
                    type: "expense",
                    name: "To Delete",
                    amount: 10,
                    category: "food",
                    date: new Date().toISOString()
                });

            const transactionId = createRes.body.transactionId;
            const response = await request(app)
                .delete(`/api/transaction/${transactionId}`)
                .set("Cookie", [authCookie]);
            expect(response.status).toBe(200);
        });
    });
});
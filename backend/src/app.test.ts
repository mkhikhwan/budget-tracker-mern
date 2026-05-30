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
import 'dotenv/config';
import request from "supertest";
import app from "./app";
import { connectDB, disconnectDB, getDb } from "./config/db";

describe("Auth Endpoints", () => {
    beforeAll(async () => {
        await connectDB();
    });

    afterEach(async () => {
        const db = getDb();
        const collections = await db.listCollections().toArray();
        for (const collection of collections) {
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
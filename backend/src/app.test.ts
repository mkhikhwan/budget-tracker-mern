import request from "supertest";
import app from "./app";

describe("GET /hello", () => {
    it("should return 200 OK", async () => {
        const response = await request(app).get("/hello");
        expect(response.status).toBe(200);
        expect(response.text).toBe("OK");
    });
});

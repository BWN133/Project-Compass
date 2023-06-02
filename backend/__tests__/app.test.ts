import supertest from "supertest";
import app from "../src/app";

describe("test create folder", ()=> {
  
  test("basic test", async() => {
    const response = await supertest(app).post("api/FF/Folder").send({
      title: "Test Create Folder Test Case 0"
    });
    expect(response.headers.status).toBe(201);
  });

  
})
import supertest , { Request} from "supertest";
import app from "../src/app";
import {connect, disconnect} from "../__helper__/mongodb.memory.test.helper";

beforeAll(connect);

describe("test create folder and delete folders", ()=> {

  it("basic test", async() => {
    const response = await supertest(app).post("/api/FF/Folder").send({
      title: "Test Create Folder Test Case 0",
    });
    expect(response.statusCode).toBe(201);
  });
})


describe("test recieve data", () => {
  it("basic test for recieving home folders", async() => {
    console.log("start retrieving data");
    const response = await supertest(app).get("/api/FF");
    console.log(response.body);
    expect(response.statusCode).toBe(200);
  })

  // it("delete all folders", async() => {
  //   const response  =  await supertest(app).delete("/api/FF");
  //   expect(response.statusCode).toBe(204);
  // })
})

afterAll(disconnect);


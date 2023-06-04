import supertest , { Request} from "supertest";
import app from "../src/app";
import express from "express";
import {connect, disconnect} from "../__helper__/mongodb.memory.test.helper";

beforeAll(connect);

describe("test create folder", ()=> {

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
})

afterAll(disconnect);


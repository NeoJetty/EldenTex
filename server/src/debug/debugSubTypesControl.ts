import { getFilteredTextureBatchControl } from "../control/filteredTexturesControl.js";
import { Request, Response } from "express";
import { connectDB } from "./connectDB.debug.js";
import { Database as TDatabase } from "better-sqlite3";

// Step 1: Define an extended Response type to include 'data'
interface MockResponse extends Response {
  data: any; // Adding 'data' property
}

// Mocking the Request and Response objects with the necessary properties
(async () => {
  try {
    // Step 2: Get the database connection
    const db: TDatabase = connectDB();

    // Step 3: Create mock request object
    const req = {
      params: { user_id: "1", tag_id: "2" }, // Example parameters
      body: {},
      query: {},
    } as unknown as Request; // Casting to Request type

    // Step 4: Create mock response object with the 'data' property
    const res = {
      status: (statusCode: number) => {
        res.statusCode = statusCode;
        return res;
      },
      json: (data: any) => {
        res.data = data;
        return res;
      },
      statusCode: 0,
      data: null, // Initialize 'data' here
      locals: { db: db }, // Injecting the mock database connection
      // Adding some basic methods to avoid missing properties error
      send: () => {},
      sendStatus: () => {},
    } as unknown as MockResponse; // Cast to the extended response type

    // Step 5: Call the controller function with the mock request and response
    await getFilteredTextureBatchControl(req, res);

    // Step 6: Check the response
    if (res.statusCode === 200) {
      console.log("Response Data:", res.data);
    } else {
      console.log("Error:", res.data);
    }
  } catch (err) {
    console.error("Error during test:", (err as Error).message);
  }
})();

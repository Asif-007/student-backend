
const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../server");

const PORT = 3100;
let server;

test.before(async () => {
  server = app.listen(PORT, "127.0.0.1");

  await new Promise(resolve => {
    server.once("listening", resolve);
  });
});

test.after(async () => {
  await new Promise((resolve, reject) => {
    server.close(error => {
      if (error) reject(error);
      else resolve();
    });
  });
});

test("GET / should return welcome message", async () => {
  const response = await fetch(`http://127.0.0.1:${PORT}/`);
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data.technology, "Node.js and Express");
});

test("GET /health should return UP", async () => {
  const response = await fetch(
    `http://127.0.0.1:${PORT}/health`
  );

  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data.status, "UP");
});

test("GET /students should return students", async () => {
  const response = await fetch(
    `http://127.0.0.1:${PORT}/students`
  );

  const data = await response.json();

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(data));
  assert.ok(data.length >= 2);
});

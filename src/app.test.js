const request = require('supertest');
const app = require('../app');  // Import the app

let server;

beforeAll(() => {
  server = app.listen(0);  // Automatically select an available port
});

afterAll(() => {
  server.close();  // Close the server after tests
});

describe('GET /', () => {
  it('should return 200 OK and "Hello, World!"', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, World!');
  });
});

describe('GET /about', () => {
  it('should return 200 OK and "About Us"', async () => {
    const response = await request(server).get('/about');
    expect(response.status).toBe(200);
    expect(response.text).toBe('About Us');
  });
});

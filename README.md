=== Steps to follow when testing =====

Step 3 — Install dependencies
bashnpm install
Then install the missing ts-node execution support for nodemon:
bashnpm install -D nodemon ts-node typescript @types/node

Step 6 — Run the demos (terminal scripts)
Each of these runs independently in the terminal. They fetch real data and print results — no Postman needed for these:
bash# Run callback version
npm run callback

# Run promise version
npm run promise

# Run async/await version
npm run async

Step 7 — Run the Express server
This is what you'll test with Postman:
bashnpm run server
```

You should see:
```
🚀 Server running on http://localhost:3000
Try these endpoints:
- GET  http://localhost:3000/api/sequential
- GET  http://localhost:3000/api/parallel
- POST http://localhost:3000/api/weather-news
Keep this terminal open while testing in Postman.

Step 8 — Postman setup & testing
Download Postman from postman.com if you don't have it.

Request 1 — GET /api/sequential
FieldValueMethodGETURLhttp://localhost:3000/api/sequential

No body needed
Click Send
You'll get weather + news fetched one after the other

Expected response:
json{
  "success": true,
  "weather": { ... },
  "news": { ... },
  "executionTime": 843,
  "pattern": "sequential"
}

Request 2 — GET /api/parallel
FieldValueMethodGETURLhttp://localhost:3000/api/parallel

No body needed
Click Send
Same data as sequential but fetched simultaneously — notice the executionTime is shorter

Expected response:
json{
  "success": true,
  "weather": { ... },
  "news": { ... },
  "executionTime": 412,
  "pattern": "parallel"
}

Request 3 — POST /api/weather-news
FieldValueMethodPOSTURLhttp://localhost:3000/api/weather-news
In Postman:

Click the Body tab
Select raw
Change the dropdown from Text to JSON
Paste this body:

json{
  "lat": -26.2041,
  "lon": 28.0473,
  "newsLimit": 3
}

Those coordinates are Johannesburg — change to any city's lat/lon you like.

Click Send. Expected response:
json{
  "success": true,
  "data": {
    "location": { "lat": -26.2041, "lon": 28.0473 },
    "weather": {
      "temperature": 18.5,
      "windspeed": 12.3,
      "conditions": "Partly cloudy"
    },
    "news": [
      {
        "title": "...",
        "body": "...",
        "tags": ["..."]
      }
    ],
    "executionTime": 380
  }
}

Request 4 — POST with missing fields (test error handling)
FieldValueMethodPOSTURLhttp://localhost:3000/api/weather-news
Body:
json{
  "newsLimit": 3
}
Expected response (400 error):
json{
  "success": false,
  "error": "Latitude and longitude are required"
}

Quick Reference Summary
What to runCommandInstall packagesnpm installRun callback demonpm run callbackRun promise demonpm run promiseRun async/await demonpm run asyncStart server for Postmannpm run serverBuild to JavaScriptnpm run build

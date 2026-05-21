const http = require('http');

// Configuration
const host = 'localhost';
const port = 8081;
const endpoints = [
  '/test/ping',
  '/auth/test',
  '/sessions'
];

// Function to make a GET request
function testEndpoint(endpoint) {
  console.log(`Testing endpoint: ${endpoint}`);
  
  const options = {
    hostname: host,
    port: port,
    path: endpoint,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`RESPONSE: ${data}`);
      console.log('-----------------------------------');
    });
  });

  req.on('error', (e) => {
    console.error(`ERROR: ${e.message}`);
    console.log('-----------------------------------');
  });

  req.end();
}

// Run the tests sequentially with a delay
console.log('Starting API tests...');
console.log('-----------------------------------');

endpoints.forEach((endpoint, index) => {
  setTimeout(() => {
    testEndpoint(endpoint);
  }, index * 1000); // 1 second delay between requests
}); 
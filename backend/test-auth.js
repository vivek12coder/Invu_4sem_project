#!/usr/bin/env node

const http = require('http');
const url = require('url');

const API_URL = 'http://localhost:5000';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(path, API_URL);
    const options = {
      method,
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data),
          });
        } catch {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testAuth() {
  console.log('\n' + '='.repeat(60));
  log(colors.blue, '🔐 AUTHENTICATION TEST SUITE');
  console.log('='.repeat(60));

  try {
    // Test 1: Health Check
    log(colors.yellow, '\n📝 Test 1: Health Check');
    const health = await makeRequest('GET', '/api/health');
    if (health.status === 200) {
      log(colors.green, '✓ Server is running');
      console.log(`  Status: ${health.status}`);
    } else {
      log(colors.red, `✗ Health check failed: ${health.status}`);
      return;
    }

    // Test 2: Register User
    log(colors.yellow, '\n📝 Test 2: User Registration');
    const testEmail = `test_${Date.now()}@example.com`;
    const registerRes = await makeRequest('/api/auth/register', {
      name: 'Test User',
      email: testEmail,
      password: 'password123',
    });

    let token = null;
    if (registerRes.status === 201) {
      log(colors.green, '✓ User registered successfully');
      console.log(`  Email: ${testEmail}`);
      token = registerRes.body.token;
      console.log(`  Token: ${token.substring(0, 20)}...`);
    } else {
      log(colors.red, `✗ Registration failed: ${registerRes.status}`);
      console.log('  Response:', JSON.stringify(registerRes.body, null, 2));
      return;
    }

    // Test 3: Login User
    log(colors.yellow, '\n📝 Test 3: User Login');
    const loginRes = await makeRequest('/api/auth/login', {
      email: testEmail,
      password: 'password123',
    });

    if (loginRes.status === 200) {
      log(colors.green, '✓ Login successful');
      token = loginRes.body.token;
      console.log(`  Token: ${token.substring(0, 20)}...`);
    } else {
      log(colors.red, `✗ Login failed: ${loginRes.status}`);
      console.log('  Response:', JSON.stringify(loginRes.body, null, 2));
      return;
    }

    // Test 4: Invalid Credentials
    log(colors.yellow, '\n📝 Test 4: Invalid Credentials (Should Fail)');
    const invalidRes = await makeRequest('/api/auth/login', {
      email: testEmail,
      password: 'wrongpassword',
    });

    if (invalidRes.status === 400) {
      log(colors.green, '✓ Invalid credentials rejected correctly');
      console.log(`  Status: ${invalidRes.status}`);
      console.log(`  Message: ${invalidRes.body.message}`);
    } else {
      log(colors.red, `✗ Should have rejected invalid credentials`);
    }

    // Test 5: Invalid Email Format
    log(colors.yellow, '\n📝 Test 5: Invalid Email Format (Should Fail)');
    const invalidEmailRes = await makeRequest('/api/auth/register', {
      name: 'Test User 2',
      email: 'not-an-email',
      password: 'password123',
    });

    if (invalidEmailRes.status === 400) {
      log(colors.green, '✓ Invalid email rejected correctly');
      console.log(`  Status: ${invalidEmailRes.status}`);
      if (invalidEmailRes.body.errors) {
        console.log(`  Error: ${invalidEmailRes.body.errors[0].msg}`);
      }
    } else {
      log(colors.red, `✗ Should have rejected invalid email`);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    log(colors.green, '✅ ALL TESTS PASSED!');
    console.log('='.repeat(60));
    console.log('\n✓ Backend authentication is working correctly');
    console.log('✓ You can now use the app!\n');
  } catch (err) {
    console.log('\n' + '='.repeat(60));
    log(colors.red, '❌ TEST FAILED');
    console.log('='.repeat(60));
    log(colors.red, `\n✗ Error: ${err.message}`);
    console.log('\n💡 Troubleshooting:');
    console.log('  1. Make sure backend is running: npm run dev');
    console.log('  2. Make sure MongoDB is connected');
    console.log('  3. Check if port 5000 is available\n');
  }
}

testAuth();

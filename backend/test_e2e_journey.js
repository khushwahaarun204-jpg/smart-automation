const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

const makeRequest = (endpoint, method = 'GET', data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${endpoint}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });

    req.on('error', (e) => reject(e));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const runE2E = async () => {
  try {
    console.log('--- STARTING E2E MULTI-USER JOURNEY TEST ---');

    const employeeEmail = `employee_${Date.now()}@example.com`;
    const managerEmail = `manager_${Date.now()}@example.com`;

    // 1. SIGNUP Users
    console.log('\n[1] Signing up Employee and Manager...');
    await makeRequest('/auth/signup', 'POST', { name: 'E2E Employee', email: employeeEmail, password: 'password123', role: 'employee' });
    await makeRequest('/auth/signup', 'POST', { name: 'E2E Manager', email: managerEmail, password: 'password123', role: 'manager' });
    
    // LOGIN
    const empLogin = await makeRequest('/auth/login', 'POST', { email: employeeEmail, password: 'password123' });
    const mgrLogin = await makeRequest('/auth/login', 'POST', { email: managerEmail, password: 'password123' });
    
    const empToken = empLogin.body.data.token;
    const mgrToken = mgrLogin.body.data.token;
    const empId = empLogin.body.data.user.id;
    const mgrId = mgrLogin.body.data.user.id;
    console.log('✅ Users registered and authenticated.');

    // 2. Employee CREATES WORKFLOW
    console.log('\n[2] Employee creating workflow...');
    const wfRes = await makeRequest('/workflows', 'POST', {
      name: 'Travel Request Workflow',
      description: 'E2E Test',
      status: 'active',
      templateConfig: { allowSelfApproval: false }
    }, empToken);
    const workflowId = wfRes.body.data.id;
    console.log('✅ Workflow created.');

    // 3. Employee CREATES REQUEST (Task)
    console.log('\n[3] Employee initiating request...');
    const taskRes = await makeRequest('/tasks', 'POST', {
      workflowId: workflowId,
      title: 'Flight to NY',
      assignedTo: empId,
      dueDate: new Date().toISOString()
    }, empToken);
    const taskId = taskRes.body.data.id;
    console.log('✅ Request submitted.');

    // 4. Employee CREATES APPROVAL (Assigned to self to attempt bypass)
    console.log('\n[4] Creating approval step (assigned to Employee)...');
    const appRes = await makeRequest('/approvals', 'POST', {
      workflowId: workflowId,
      taskId: taskId,
      approverId: empId,
      stepNumber: 1
    }, empToken);
    const approvalId = appRes.body.data.id;

    // 5. Employee ATTEMPTS TO APPROVE THEIR OWN REQUEST
    console.log('\n[5] Employee attempts to self-approve...');
    const selfApproveRes = await makeRequest(`/approvals/${approvalId}`, 'PUT', { status: 'approved' }, empToken);
    if (selfApproveRes.status === 403) {
      console.log('✅ Correctly prevented employee from self-approving (403 Forbidden).');
    } else {
      throw new Error(`❌ Security Hole: Employee self-approval succeeded or returned unexpected status ${selfApproveRes.status}`);
    }

    // 6. Assign Approval to Manager and Manager Approves
    console.log('\n[6] Reassigning approval to Manager and processing...');
    // Create new approval for manager
    const mgrAppRes = await makeRequest('/approvals', 'POST', {
      workflowId: workflowId,
      taskId: taskId,
      approverId: mgrId,
      stepNumber: 2
    }, empToken); // Employee can create it
    const mgrApprovalId = mgrAppRes.body.data.id;

    const mgrProcessRes = await makeRequest(`/approvals/${mgrApprovalId}`, 'PUT', { status: 'approved' }, mgrToken);
    if (mgrProcessRes.status !== 200) throw new Error(`Manager approval failed: ${JSON.stringify(mgrProcessRes.body)}`);
    console.log('✅ Manager successfully approved the request.');

    // 7. Verify Task Completion
    console.log('\n[7] Verifying Automated Task Update...');
    const getTaskRes = await makeRequest(`/tasks/${taskId}`, 'GET', null, mgrToken);
    if (getTaskRes.body.data.status === 'completed') {
      console.log('✅ Task automatically marked as completed!');
    } else {
      throw new Error('Task was not completed via hook.');
    }

    // 8. Test Reports Export Endpoint
    console.log('\n[8] Verifying Manager PDF/CSV Export endpoints...');
    const csvRes = await makeRequest('/reports/export/csv', 'GET', null, mgrToken);
    const pdfRes = await makeRequest('/reports/export/pdf', 'GET', null, mgrToken);
    
    if (csvRes.status === 200 && csvRes.headers['content-type']?.includes('text/csv')) {
      console.log('✅ CSV Export endpoint returned successfully.');
    } else {
      throw new Error(`CSV Export failed. Headers: ${JSON.stringify(csvRes.headers)}`);
    }

    if (pdfRes.status === 200 && pdfRes.headers['content-type']?.includes('application/pdf')) {
      console.log('✅ PDF Export endpoint returned successfully.');
    } else {
      throw new Error(`PDF Export failed. Headers: ${JSON.stringify(pdfRes.headers)}`);
    }

    console.log('\n--- FINAL E2E TEST COMPLETED SUCCESSFULLY ---');
  } catch (err) {
    console.error('\n❌ E2E TEST FAILED!');
    console.error(err);
  }
};

runE2E();

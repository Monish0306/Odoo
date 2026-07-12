const prisma = require('./services/prisma');
const base = 'http://localhost:5000';
const request = async (path, options = {}) => {
  const { headers: customHeaders, ...restOptions } = options;
  const res = await fetch(base + path, {
    ...restOptions,
    headers: { 'Content-Type': 'application/json', ...(customHeaders || {}) },
  });
  return { status: res.status, body: await res.text() };
};

(async () => {
  console.log('=== Health ===');
  const health = await request('/');
  console.log(health.status, health.body);

  const signupEmail = `audit-${Date.now()}@example.com`;
  console.log('=== Signup valid ===');
  const signup = await request('/auth/signup', { method: 'POST', body: JSON.stringify({ name: 'Audit User', email: signupEmail, password: 'Pass123!', role: 'Admin' }) });
  console.log(signup.status, signup.body);
  console.log('=== Signup duplicate ===');
  const dup = await request('/auth/signup', { method: 'POST', body: JSON.stringify({ name: 'Audit User', email: signupEmail, password: 'Pass123!', role: 'Admin' }) });
  console.log(dup.status, dup.body);
  console.log('=== Login correct ===');
  const login = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email: signupEmail, password: 'Pass123!' }) });
  console.log(login.status, login.body);
  const loginData = JSON.parse(login.body).data;
  console.log('=== Login wrong password ===');
  const badLogin = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email: signupEmail, password: 'wrong' }) });
  console.log(badLogin.status, badLogin.body);
  console.log('=== Me valid ===');
  const me = await request('/auth/me', { headers: { Authorization: `Bearer ${loginData.token}` } });
  console.log(me.status, me.body);
  console.log('=== Me invalid ===');
  const meBad = await request('/auth/me', { headers: { Authorization: 'Bearer invalid' } });
  console.log(meBad.status, meBad.body);
  console.log('=== Forgot password ===');
  const forgot = await request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email: 'missing@example.com' }) });
  console.log(forgot.status, forgot.body);

  console.log('=== Department read as employee ===');
  const empLogin = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'derek.employee@example.com', password: 'Test@123' }) });
  const empToken = JSON.parse(empLogin.body).data.token;
  const depts = await request('/departments', { headers: { Authorization: `Bearer ${empToken}` } });
  console.log(depts.status, depts.body);
  console.log('=== Department create as non-admin ===');
  const createDeptBlocked = await request('/departments', { method: 'POST', headers: { Authorization: `Bearer ${empToken}` }, body: JSON.stringify({ name: 'Blocked Dept' }) });
  console.log(createDeptBlocked.status, createDeptBlocked.body);
  console.log('=== Department create as admin ===');
  const adminLogin = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'alice.admin@example.com', password: 'Test@123' }) });
  const adminToken = JSON.parse(adminLogin.body).data.token;
  const createDept = await request('/departments', { method: 'POST', headers: { Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({ name: 'Audit Dept' }) });
  console.log(createDept.status, createDept.body);
  console.log('=== Promote invalid role ===');
  const invalidPromote = await request('/employees/cmrhgxg0e0001rkth7m3l0yu1/promote', { method: 'PATCH', headers: { Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({ role: 'SuperAdmin' }) });
  console.log(invalidPromote.status, invalidPromote.body);
  console.log('=== Employees list ===');
  const employees = await request('/employees', { headers: { Authorization: `Bearer ${adminToken}` } });
  console.log(employees.status, employees.body);

  console.log('=== Asset create as admin #1 ===');
  const categoryId = JSON.parse((await request('/categories', { headers: { Authorization: `Bearer ${adminToken}` } })).body).data[0].id;
  const asset1 = await request('/assets', { method: 'POST', headers: { Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({ name: 'Audit Laptop 1', categoryId, serialNumber: 'AUD-1', acquisitionDate: '2026-01-01', acquisitionCost: 1000, condition: 'Good', location: 'Room 1', isBookable: true }) });
  console.log(asset1.status, asset1.body);
  console.log('=== Asset create as admin #2 ===');
  const asset2 = await request('/assets', { method: 'POST', headers: { Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({ name: 'Audit Laptop 2', categoryId, serialNumber: 'AUD-2', acquisitionDate: '2026-01-02', acquisitionCost: 1100, condition: 'Good', location: 'Room 2', isBookable: false }) });
  console.log(asset2.status, asset2.body);
  console.log('=== Asset create as employee blocked ===');
  const assetBlocked = await request('/assets', { method: 'POST', headers: { Authorization: `Bearer ${empToken}` }, body: JSON.stringify({ name: 'Blocked Asset', categoryId }) });
  console.log(assetBlocked.status, assetBlocked.body);
  console.log('=== Asset create validation error ===');
  const assetInvalid = await request('/assets', { method: 'POST', headers: { Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({ categoryId }) });
  console.log(assetInvalid.status, assetInvalid.body);
  console.log('=== Asset search ===');
  const search = await request('/assets?search=audit', { headers: { Authorization: `Bearer ${adminToken}` } });
  console.log(search.status, search.body);

  const firstAssetId = JSON.parse(asset1.body).data.id;
  console.log('=== Asset history ===');
  const history = await request(`/assets/${firstAssetId}/history`, { headers: { Authorization: `Bearer ${adminToken}` } });
  console.log(history.status, history.body);

  const employeeId = 'cmrhgxg970002rkthp88hbihr';
  console.log('=== Allocation create ===');
  const alloc = await request('/allocations', { method: 'POST', headers: { Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({ assetId: firstAssetId, employeeId, expectedReturnDate: '2026-07-20' }) });
  console.log(alloc.status, alloc.body);
  const assetAfterAlloc = await prisma.asset.findUnique({ where: { id: firstAssetId }, select: { status: true } });
  console.log('asset status after alloc', assetAfterAlloc);
  console.log('=== Allocation duplicate ===');
  const allocDup = await request('/allocations', { method: 'POST', headers: { Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({ assetId: firstAssetId, employeeId: 'cmrhgxg0e0001rkth7m3l0yu1', expectedReturnDate: '2026-07-20' }) });
  console.log(allocDup.status, allocDup.body);
  console.log('=== Allocation return ===');
  const allocId = JSON.parse(alloc.body).data.id;
  const allocReturn = await request(`/allocations/${allocId}/return`, { method: 'POST', headers: { Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({ conditionOnReturn: 'Good' }) });
  console.log(allocReturn.status, allocReturn.body);
  const assetAfterReturn = await prisma.asset.findUnique({ where: { id: firstAssetId }, select: { status: true } });
  console.log('asset status after return', assetAfterReturn);

  console.log('=== Overdue setup ===');
  await prisma.allocation.create({ data: { assetId: firstAssetId, employeeId, expectedReturnDate: new Date('2020-01-01'), status: 'Active' } });
  const overdue = await request('/allocations/overdue', { headers: { Authorization: `Bearer ${adminToken}` } });
  console.log(overdue.status, overdue.body);

  console.log('=== Re-allocate for transfer test ===');
  const reAlloc = await request('/allocations', { method: 'POST', headers: { Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({ assetId: firstAssetId, employeeId, expectedReturnDate: '2026-08-01' }) });
  console.log(reAlloc.status, reAlloc.body);
  const assetBeforeTransfer = await prisma.asset.findUnique({ where: { id: firstAssetId }, select: { status: true } });
  console.log('asset status before transfer test', assetBeforeTransfer);

  console.log('=== Transfer create ===');
  const transferCreate = await request('/transfers', { method: 'POST', headers: { Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({ assetId: firstAssetId, toEmployeeId: 'cmrhgxg0e0001rkth7m3l0yu1', reason: 'Team change' }) });
  console.log(transferCreate.status, transferCreate.body);
  const transferId = JSON.parse(transferCreate.body).data.id;
  console.log('=== Transfer approve ===');
  const approve = await request(`/transfers/${transferId}/approve`, { method: 'PATCH', headers: { Authorization: `Bearer ${adminToken}` } });
  console.log(approve.status, approve.body);
  const assetAfterTransfer = await prisma.asset.findUnique({ where: { id: firstAssetId }, select: { status: true } });
  console.log('asset status after transfer approve', assetAfterTransfer);
  console.log('=== Transfer reject ===');
  const transfer2 = await request('/transfers', { method: 'POST', headers: { Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({ assetId: firstAssetId, toEmployeeId: 'cmrhgxg970002rkthp88hbihr', reason: 'Second transfer' }) });
  const transfer2Id = JSON.parse(transfer2.body).data.id;
  const reject = await request(`/transfers/${transfer2Id}/reject`, { method: 'PATCH', headers: { Authorization: `Bearer ${adminToken}` } });
  console.log(reject.status, reject.body);
  console.log('=== Transfer approve as employee blocked ===');
  const blockedTransferApprove = await request(`/transfers/${transfer2Id}/approve`, { method: 'PATCH', headers: { Authorization: `Bearer ${empToken}` } });
  console.log(blockedTransferApprove.status, blockedTransferApprove.body);
})();

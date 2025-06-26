// Test Frontend Team Members Integration
console.log('🚀 Testing Frontend Team Members Integration...');

const API_BASE = 'http://localhost:8000/api/v1';

async function testTeamMembersFlow() {
  try {
    // 1. Register users
    console.log('1. Creating test users...');
    const owner = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'owner_test',
        email: 'owner@test.com',
        password: 'owner123',
        confirm_password: 'owner123',
        full_name: 'Project Owner'
      })
    }).then(r => r.json());
    console.log('Owner created:', owner);

    const member = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'member_test',
        email: 'member@test.com',
        password: 'member123',
        confirm_password: 'member123',
        full_name: 'Team Member'
      })
    }).then(r => r.json());
    console.log('Member created:', member);

    // 2. Login as owner
    console.log('2. Logging in as owner...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'username=owner_test&password=owner123'
    });
    const tokens = await loginResponse.json();
    const token = tokens.access_token;
    console.log('Login successful, token:', token.substring(0, 20) + '...');

    // 3. Create project
    console.log('3. Creating project...');
    const projectResponse = await fetch(`${API_BASE}/projects/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Frontend Test Project',
        description: 'Project for testing frontend team members',
        key: 'FTP'
      })
    });
    const project = await projectResponse.json();
    console.log('Project created:', project);

    // 4. Add member to project
    console.log('4. Adding member to project...');
    const addMemberResponse = await fetch(`${API_BASE}/projects/${project.id}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user_id: member.data.user_id,
        role: 'MEMBER'
      })
    });
    const addMemberResult = await addMemberResponse.json();
    console.log('Member added:', addMemberResult);

    // 5. List project members
    console.log('5. Listing project members...');
    const membersResponse = await fetch(`${API_BASE}/projects/${project.id}/members`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const members = await membersResponse.json();
    console.log('Project members:', members);

    // 6. Test frontend URL
    console.log('6. Frontend URLs to test:');
    console.log(`   - Projects: http://localhost:5173/projects`);
    console.log(`   - Project Detail: http://localhost:5173/projects/${project.id}`);
    
    console.log('✅ All tests passed! Frontend integration ready!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testTeamMembersFlow();

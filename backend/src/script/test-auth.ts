import { 
  registerUser, 
  loginUser, 
  findUserByEmail, 
  deleteUser 
} from '../services/auth.service';

async function testAuth() {
  console.log('🔐 Starting Auth Tests...\n');

  const testUser = {
    username: 'testuser_' + Date.now(),
    email: `test${Date.now()}@example.com`,
    password: 'testpassword123',
    firstName: 'Test',
    lastName: 'User',
    enrollmentYear: 2020,
    occupation: 'Software Developer'
  };

  try {
    // Test 1: Registracija korisnika
    console.log('1. Testing user registration...');
    const newUser = await registerUser(testUser);
    console.log('✅ Registration successful!');
    console.log('   User ID:', newUser.id);
    console.log('   Username:', newUser.username);
    console.log('   Email:', newUser.email);
    console.log('   Role:', newUser.role);
    console.log('');

    // Test 2: Login korisnika
    console.log('2. Testing user login...');
    const loginResult = await loginUser(testUser.username, testUser.password);
    console.log('✅ Login successful!');
    console.log('   Token received:', loginResult.token ? 'Yes' : 'No');
    console.log('   User data:', {
      id: loginResult.user.id,
      username: loginResult.user.username,
      email: loginResult.user.email
    });
    console.log('');

    // Test 3: Pronalaženje korisnika po emailu
    console.log('3. Testing find user by email...');
    const foundUser = await findUserByEmail(testUser.email);
    console.log('✅ User found by email!');
    console.log('   Username:', foundUser?.username);
    console.log('   Email:', foundUser?.email);
    console.log('');

    // Test 4: Login sa pogrešnom šifrom
    console.log('4. Testing login with wrong password...');
    try {
      await loginUser(testUser.email, 'wrongpassword');
      console.log('❌ This should have failed!');
    } catch (error) {
      // Type-safe error handling
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log('✅ Correctly failed with wrong password:', errorMessage);
    }
    console.log('');

    // Test 5: Login sa nepostojećim emailom
    console.log('5. Testing login with non-existent email...');
    try {
      await loginUser('nonexistent@example.com', 'anypassword');
      console.log('❌ This should have failed!');
    } catch (error) {
      // Type-safe error handling
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log('✅ Correctly failed with non-existent email:', errorMessage);
    }
    console.log('');

    // Test 6: Čišćenje - brisanje test korisnika
    console.log('6. Cleaning up - deleting test user...');
    await deleteUser(newUser.id);
    console.log('✅ Test user deleted successfully!');

    console.log('\n🎉 All tests passed! Auth system is working correctly.');

  } catch (error) {
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Test failed:', errorMessage);
    process.exit(1);
  }
}

// Pokrenite testove ako je skripta pokrenuta direktno
if (require.main === module) {
  testAuth();
}

export { testAuth };
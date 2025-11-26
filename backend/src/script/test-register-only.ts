import { registerUser, deleteUser } from '../services/auth.service';

async function testRegisterOnly() {
  console.log('🔐 Testing User Registration Only...\n');

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
    console.log('   First Name:', newUser.first_name);
    console.log('   Last Name:', newUser.last_name);
    console.log('   Enrollment Year:', newUser.enrollment_year);
    console.log('   Role:', newUser.role);
    console.log('   Is Active:', newUser.is_active);
    console.log('');

    // Test 2: Provera da li su svi podaci sačuvani
    console.log('2. Verifying all user data...');
    const expectedFields = [
      'id', 'username', 'email', 'first_name', 'last_name', 
      'enrollment_year', 'role', 'is_active', 'created_at'
    ];
    
    const missingFields = expectedFields.filter(field => !(field in newUser));
    if (missingFields.length === 0) {
      console.log('✅ All user data saved correctly!');
    } else {
      console.log('❌ Missing fields:', missingFields);
    }
    console.log('');

    // Test 3: Provera password hash-a
    console.log('3. Verifying password is hashed...');
    if (newUser.password_hash && newUser.password_hash !== testUser.password) {
      console.log('✅ Password correctly hashed!');
      console.log('   Original:', testUser.password);
      console.log('   Hashed:', newUser.password_hash.substring(0, 20) + '...');
    } else {
      console.log('❌ Password not hashed properly!');
    }
    console.log('');

    // Test 4: Čišćenje - brisanje test korisnika
    // console.log('4. Cleaning up - deleting test user...');
    // await deleteUser(newUser.id);
    // console.log('✅ Test user deleted successfully!');

    // console.log('\n🎉 Registration test passed! User creation is working correctly.');

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Registration test failed:', errorMessage);
    process.exit(1);
  }
}

// Pokrenite testove ako je skripta pokrenuta direktno
if (require.main === module) {
  testRegisterOnly();
}

export { testRegisterOnly };
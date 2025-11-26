import prisma from '../prisma';

async function deleteAllUsers() {
  console.log('🗑️  Deleting All Users...\n');

  try {
    // Prvo proverimo koliko korisnika ima
    const userCount = await prisma.users.count();
    console.log(`📊 Found ${userCount} users in the database`);

    if (userCount === 0) {
      console.log('✅ No users to delete.');
      return;
    }

    // Prikažemo listu korisnika pre brisanja
    console.log('\n📋 Users to be deleted:');
    const allUsers = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        created_at: true
      },
      orderBy: { created_at: 'desc' }
    });

    allUsers.forEach(user => {
      console.log(`   👤 ${user.username} (${user.email}) - ${user.role} - ID: ${user.id}`);
    });

    // Tražimo potvrdu
    console.log('\n⚠️  WARNING: This will delete ALL users from the database!');
    console.log('   This action cannot be undone!');
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise<string>((resolve) => {
      rl.question('❓ Are you sure you want to delete ALL users? (yes/NO): ', resolve);
    });

    rl.close();

    if (answer.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled.');
      return;
    }

    console.log('\n🗑️  Starting deletion...');

    // Brisanje svih korisnika
    // Prvo moramo obrisati zavisne podatke zbog foreign key constraint-ova
    console.log('1. Deleting related data...');
    
    await prisma.private_messages.deleteMany();
    console.log('   ✅ Private messages deleted');
    
    await prisma.event_registration.deleteMany();
    console.log('   ✅ Event registrations deleted');
    
    await prisma.post_likes.deleteMany();
    console.log('   ✅ Post likes deleted');
    
    await prisma.comments.deleteMany();
    console.log('   ✅ Comments deleted');
    
    await prisma.posts.deleteMany();
    console.log('   ✅ Posts deleted');
    
    await prisma.events.deleteMany();
    console.log('   ✅ Events deleted');

    // Sada brišemo sve korisnike
    console.log('2. Deleting all users...');
    const deleteResult = await prisma.users.deleteMany();
    
    console.log(`✅ Successfully deleted ${deleteResult.count} users!`);
    console.log('\n🎉 Database has been cleared of all user data.');

  } catch (error: any) {
    console.error('❌ Error deleting users:', error.message);
    
    if (error.code === 'P2003') {
      console.error('   Foreign key constraint violation.');
      console.error('   Make sure to delete related records first.');
    }
    
    process.exit(1);
  }
}

// Pokreni skriptu
if (require.main === module) {
  deleteAllUsers();
}

export { deleteAllUsers };
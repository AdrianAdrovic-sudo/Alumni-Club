import prisma from '../prisma';

async function deleteAllUsersExceptAdmin() {
  console.log('🗑️  Deleting All Users Except Admins...\n');

  try {
    // Prvo proverimo korisnike
    const allUsers = await prisma.users.findMany({
      select: { id: true, username: true, email: true, role: true },
      orderBy: { role: 'desc' }
    });

    const adminUsers = allUsers.filter(user => user.role === 'admin');
    const regularUsers = allUsers.filter(user => user.role !== 'admin');

    console.log(`📊 Found ${allUsers.length} total users:`);
    console.log(`   👑 ${adminUsers.length} admin users`);
    console.log(`   👤 ${regularUsers.length} regular users`);

    if (regularUsers.length === 0) {
      console.log('✅ No regular users to delete.');
      return;
    }

    console.log('\n📋 Regular users to be deleted:');
    regularUsers.forEach(user => {
      console.log(`   👤 ${user.username} (${user.email}) - ${user.role}`);
    });

    console.log('\n📋 Admin users that will be kept:');
    adminUsers.forEach(user => {
      console.log(`   👑 ${user.username} (${user.email}) - ${user.role}`);
    });

    // Tražimo potvrdu
    console.log('\n⚠️  WARNING: This will delete all regular users!');
    console.log('   Admin accounts will be preserved.');
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise<string>((resolve) => {
      rl.question('❓ Confirm deletion of regular users? (yes/NO): ', resolve);
    });

    rl.close();

    if (answer.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled.');
      return;
    }

    console.log('\n🗑️  Starting deletion of regular users...');

    // Brisanje samo regular korisnika
    const deleteResult = await prisma.$transaction(async (tx) => {
      // Prvo obrišite podatke regular korisnika
      const regularUserIds = regularUsers.map(user => user.id);
      
      await tx.private_messages.deleteMany({
        where: {
          OR: [
            { sender_id: { in: regularUserIds } },
            { receiver_id: { in: regularUserIds } }
          ]
        }
      });

      await tx.event_registration.deleteMany({
        where: { user_id: { in: regularUserIds } }
      });

      await tx.post_likes.deleteMany({
        where: { user_id: { in: regularUserIds } }
      });

      await tx.comments.deleteMany({
        where: { user_id: { in: regularUserIds } }
      });

      await tx.posts.deleteMany({
        where: { user_id: { in: regularUserIds } }
      });

      await tx.events.deleteMany({
        where: { created_by: { in: regularUserIds } }
      });

      // Sada obrišite same korisnike
      return await tx.users.deleteMany({
        where: { id: { in: regularUserIds } }
      });
    });

    console.log(`✅ Successfully deleted ${deleteResult.count} regular users!`);
    console.log(`👑 Preserved ${adminUsers.length} admin users.`);

  } catch (error: any) {
    console.error('❌ Error deleting users:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  deleteAllUsersExceptAdmin();
}

export { deleteAllUsersExceptAdmin };
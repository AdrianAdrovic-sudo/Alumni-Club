import prisma from '../prisma';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

async function deleteAllUsersSafe() {
  console.log('🗑️  Safe Delete All Users (with backup)...\n');

  try {
    const userCount = await prisma.users.count();
    console.log(`📊 Found ${userCount} users in the database`);

    if (userCount === 0) {
      console.log('✅ No users to delete.');
      return;
    }

    // Kreiraj backup folder ako ne postoji
    const backupDir = join(__dirname, 'backups');
    if (!existsSync(backupDir)) {
      mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = join(backupDir, `users-backup-${timestamp}.json`);

    // Napravi backup pre brisanja
    console.log('\n💾 Creating backup...');
    const allUsers = await prisma.users.findMany({
      include: {
        posts: {
          select: { id: true, content: true, created_at: true }
        },
        events: {
          select: { id: true, title: true, start_time: true }
        }
      }
    });

    const backupData = {
      timestamp: new Date().toISOString(),
      userCount: allUsers.length,
      users: allUsers
    };

    writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    console.log(`   ✅ Backup saved to: ${backupFile}`);

    // Prikaži korisnike
    console.log('\n📋 Users to be deleted:');
    allUsers.forEach(user => {
      console.log(`   👤 ${user.username} (${user.email}) - ${user.role}`);
    });

    // Tražimo potvrdu
    console.log('\n⚠️  WARNING: This will delete ALL users!');
    console.log(`💾 A backup has been saved to: ${backupFile}`);
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise<string>((resolve) => {
      rl.question('❓ Type "DELETE ALL" to confirm: ', resolve);
    });

    rl.close();

    if (answer !== 'DELETE ALL') {
      console.log('❌ Operation cancelled.');
      console.log(`💾 Backup remains at: ${backupFile}`);
      return;
    }

    console.log('\n🗑️  Starting deletion...');

    // Brisanje sa transaction-om za bezbednost
    await prisma.$transaction(async (tx) => {
      await tx.private_messages.deleteMany();
      await tx.event_registration.deleteMany();
      await tx.post_likes.deleteMany();
      await tx.comments.deleteMany();
      await tx.posts.deleteMany();
      await tx.events.deleteMany();
      
      const deleteResult = await tx.users.deleteMany();
      console.log(`✅ Successfully deleted ${deleteResult.count} users!`);
    });

    console.log('\n🎉 All users have been deleted.');
    console.log(`💾 Backup saved at: ${backupFile}`);

  } catch (error: any) {
    console.error('❌ Error deleting users:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  deleteAllUsersSafe();
}

export { deleteAllUsersSafe };
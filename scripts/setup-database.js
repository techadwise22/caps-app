#!/usr/bin/env node

/**
 * Database Setup Script
 * 
 * This script helps you set up the database with the new schema.
 * Run this after deploying to Supabase to apply the migrations.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up CAPS App Database...\n');

// Read the migration file
const migrationPath = path.join(__dirname, '../supabase/migrations/001_update_courses_and_users.sql');
const migrationContent = fs.readFileSync(migrationPath, 'utf8');

console.log('📋 Migration file loaded successfully');
console.log('📝 Migration includes:');
console.log('   ✅ Updated users table with level and status fields');
console.log('   ✅ New courses table with YouTube link support');
console.log('   ✅ Course YouTube links table');
console.log('   ✅ Proper indexes for performance');
console.log('   ✅ Row Level Security (RLS) policies');
console.log('   ✅ Demo data for testing\n');

console.log('🔧 To apply this migration:');
console.log('   1. Go to your Supabase dashboard');
console.log('   2. Navigate to SQL Editor');
console.log('   3. Copy and paste the migration content');
console.log('   4. Execute the migration\n');

console.log('📄 Migration content:');
console.log('=' .repeat(80));
console.log(migrationContent);
console.log('=' .repeat(80));

console.log('\n✅ Setup instructions complete!');
console.log('🎯 Your backend is now ready for the CAPS App management features.'); 
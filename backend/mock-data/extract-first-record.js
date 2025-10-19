const XLSX = require('xlsx');

const filePath = '/home/bex/projects/profwise.kz/backend/mock-data/job_general_data.xlsx';
const workbook = XLSX.readFile(filePath);
const worksheet = workbook.Sheets['gendata'];
const data = XLSX.utils.sheet_to_json(worksheet);

// Get first record
const record = data[0];

console.log('\n📦 BACKEND EXCEL DATA - First Record:\n');
console.log('='.repeat(70));
console.log('\n1. Job ID:');
console.log(record.jobid);

console.log('\n2. Education Data:');
console.log(record.education_data);

console.log('\n3. Market Data:');
console.log(record.market_data);

console.log('\n4. RIASEC Codes:');
console.log(record.riaseccodes);

console.log('\n5. Archetype Data:');
console.log(record.archetype_data);

console.log('\n' + '='.repeat(70));

// Try to parse JSON fields
console.log('\n📋 PARSED STRUCTURES:\n');
console.log('='.repeat(70));

try {
  const eduData = JSON.parse(record.education_data);
  console.log('\nEducation Data (parsed):');
  console.log(JSON.stringify(eduData, null, 2));
} catch (e) {
  console.log('\n❌ Failed to parse education_data:', e.message);
}

try {
  const marketData = JSON.parse(record.market_data);
  console.log('\nMarket Data (parsed):');
  console.log(JSON.stringify(marketData, null, 2));
} catch (e) {
  console.log('\n❌ Failed to parse market_data:', e.message);
}

try {
  const archetypeData = JSON.parse(record.archetype_data);
  console.log('\nArchetype Data (parsed):');
  console.log(JSON.stringify(archetypeData, null, 2));
} catch (e) {
  console.log('\n❌ Failed to parse archetype_data:', e.message);
}

// Export for use in other scripts
module.exports = { record, data };

import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// Helper function to generate random alphanumeric password
function generatePassword(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Helper function to generate base64 license code
function generateLicenseCode(length: number = 10): string {
  const bytes = crypto.randomBytes(Math.ceil(length * 0.75));
  return bytes.toString('base64').slice(0, length).replace(/\+/g, '0').replace(/\//g, '1');
}

// Helper function to create login from organization name
function generateLogin(orgName: string, index: number): string {
  // Remove common prefixes and special characters
  let login = orgName
    .replace(/КГУ\s*«?/gi, '')
    .replace(/»/g, '')
    .replace(/Общеобразовательная школа/gi, 'school')
    .replace(/им\./gi, '')
    .replace(/имени/gi, '')
    .replace(/№/g, 'no')
    .replace(/[^a-zA-Z0-9а-яА-ЯёЁ\s]/g, '')
    .trim()
    .toLowerCase();

  // Transliterate Cyrillic to Latin
  const translitMap: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
    'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', ' ': '_'
  };

  login = login.split('').map(char => translitMap[char] || char).join('');

  // Shorten and add index for uniqueness
  login = login.substring(0, 20);
  login = `zko_${login}_${index}`;

  return login.replace(/_{2,}/g, '_');
}

async function main() {
  console.log('🚀 Starting ZKO Schools Import...\n');

  // Read Excel file
  const excelPath = path.join(__dirname, 'schoiols.xlsx');
  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data: { organization: string; licenseCount: number }[] = XLSX.utils.sheet_to_json(worksheet);

  console.log(`📊 Found ${data.length} schools in Excel file`);
  console.log(`📝 Total licenses to create: ${data.reduce((sum, row) => sum + row.licenseCount, 0)}\n`);

  // Step 1: Create or get West Kazakhstan region
  console.log('📍 Creating West Kazakhstan Oblast region...');
  const region = await prisma.region.create({
    data: {
      name: {
        en: 'West Kazakhstan Oblast',
        ru: 'Западно-Казахстанская область',
        kk: 'Батыс Қазақстан облысы'
      }
    }
  });
  console.log(`✅ Region created: ${region.id}\n`);

  // Step 2: Get license class
  console.log('🔍 Finding license class "zko-2025-9"...');
  const licenseClass = await prisma.licenseClass.findFirst({
    where: { id: 'zko-2025-9' }
  });

  if (!licenseClass) {
    throw new Error('License class "zko-2025-9" not found!');
  }
  console.log(`✅ License class found: ${licenseClass.name}\n`);

  // Step 3: Process each school
  const credentials: Array<{
    school: string;
    login: string;
    password: string;
    licenseCount: number;
    licenseCodes: string[];
  }> = [];

  let totalLicensesCreated = 0;
  let schoolsProcessed = 0;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const schoolIndex = i + 1;

    console.log(`\n[${schoolIndex}/${data.length}] Processing: ${row.organization}`);

    // Generate credentials
    const login = generateLogin(row.organization, schoolIndex);
    const password = generatePassword(8);

    console.log(`  🔐 Login: ${login}`);
    console.log(`  🔑 Password: ${password}`);

    // Create organization
    const organization = await prisma.organization.create({
      data: {
        name: row.organization,
        type: 'SCHOOL',
        regionId: region.id,
        login: login,
        password: password
      }
    });

    console.log(`  ✅ Organization created: ${organization.id}`);

    // Create licenses for this school
    const licenseCodes: string[] = [];
    console.log(`  📜 Creating ${row.licenseCount} licenses...`);

    for (let j = 0; j < row.licenseCount; j++) {
      const licenseCode = generateLicenseCode(10);
      licenseCodes.push(licenseCode);

      await prisma.license.create({
        data: {
          startDate: new Date('2025-09-01'),
          expireDate: new Date('2026-08-31'),
          licenseCode: licenseCode,
          name: `ЗКО ${row.organization} - Лицензия ${j + 1}`,
          licenseClassId: licenseClass.id,
          organizationId: organization.id
        }
      });

      totalLicensesCreated++;
    }

    console.log(`  ✅ ${row.licenseCount} licenses created`);

    // Store credentials
    credentials.push({
      school: row.organization,
      login: login,
      password: password,
      licenseCount: row.licenseCount,
      licenseCodes: licenseCodes
    });

    schoolsProcessed++;
  }

  // Step 4: Generate CSV output
  console.log('\n\n📄 Generating credentials CSV file...');

  const csvHeader = 'School Name,Login,Password,License Count,License Codes\n';
  const csvRows = credentials.map(cred => {
    const licenseCodesStr = cred.licenseCodes.join('; ');
    return `"${cred.school}","${cred.login}","${cred.password}",${cred.licenseCount},"${licenseCodesStr}"`;
  }).join('\n');

  const csvContent = csvHeader + csvRows;
  const csvPath = path.join(__dirname, 'zko-schools-credentials.csv');
  fs.writeFileSync(csvPath, csvContent, 'utf-8');

  console.log(`✅ CSV file created: ${csvPath}\n`);

  // Summary
  console.log('═══════════════════════════════════════');
  console.log('✨ IMPORT COMPLETED SUCCESSFULLY!');
  console.log('═══════════════════════════════════════');
  console.log(`📊 Schools imported: ${schoolsProcessed}`);
  console.log(`📜 Licenses created: ${totalLicensesCreated}`);
  console.log(`📍 Region: West Kazakhstan Oblast`);
  console.log(`📅 License period: 2025-09-01 to 2026-08-31`);
  console.log(`📄 Credentials saved to: ${csvPath}`);
  console.log('═══════════════════════════════════════\n');
}

main()
  .catch((error) => {
    console.error('❌ Error during import:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

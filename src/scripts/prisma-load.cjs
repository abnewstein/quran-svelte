/*
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const ROW_LIMIT = 1000;

async function bulkInsert(data, tableName, callback) {
	for (let i = 0; i < data.length; i += ROW_LIMIT) {
		await prisma[tableName].createMany({
			data: data.slice(i, i + ROW_LIMIT)
		});
		console.log(`Inserted ${tableName} data up to index ${i}`);
	}
}

async function main() {
	// Load and insert chapter data
	console.log('Loading chapter data...');
	const chapterData = JSON.parse(fs.readFileSync('../lib/translations/chapters-data.json', 'utf8'));
	const chapterDataMapped = chapterData.map((chapter) => ({
		number: chapter.number,
		arabic_name: chapter.name.arabic,
		transliteration_name: chapter.name.transliteration,
		english_name: chapter.name.english,
		verses_count: chapter.versesCount
	}));
	await bulkInsert(chapterDataMapped, 'chapters');
	console.log('Chapter data loaded.');

	// Load and insert original Arabic verse data
	console.log('Loading original Arabic verse data...');
	const arabicVerseData = JSON.parse(
		fs.readFileSync('../lib/translations/verses-ar-original.json', 'utf8')
	);
	const arabicVerseDataMapped = arabicVerseData.map((verse) => ({
		id: verse.id,
		chapter_number: verse.chapterNumber,
		verse_number: verse.verseNumber,
		text: verse.text
	}));
	await bulkInsert(arabicVerseDataMapped, 'verses');
	console.log('Original Arabic verse data loaded.');

	// Load and insert English translation verse data
	console.log('Loading English translation verse data...');
	const englishTranslationData = JSON.parse(
		fs.readFileSync('../lib/translations/verses-en-sam-gerrans.json', 'utf8')
	);
	const englishTranslationDataMapped = englishTranslationData.map((translation) => ({
		verse_id: translation.id,
		language: 'english',
		translator: 'Sam Gerrans',
		text: translation.text
	}));
	await bulkInsert(englishTranslationDataMapped, 'translations');
	console.log('English translation verse data loaded.');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
*/

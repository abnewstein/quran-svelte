const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
	// Load and insert chapter data
	const chapterData = JSON.parse(fs.readFileSync('../lib/translations/chapters-data.json', 'utf8'));
	for (let chapter of chapterData) {
		await prisma.chapters.create({
			data: {
				number: chapter.number,
				arabic_name: chapter.name.arabic,
				transliteration_name: chapter.name.transliteration,
				english_name: chapter.name.english,
				verses_count: chapter.versesCount
			}
		});
	}

	// Load and insert original Arabic verse data
	const arabicVerseData = JSON.parse(
		fs.readFileSync('../lib/translations/verses-ar-original.json', 'utf8')
	);
	for (let verse of arabicVerseData) {
		await prisma.verses.create({
			data: {
				id: verse.id,
				chapter_number: verse.chapterNumber,
				verse_number: verse.verseNumber,
				text: verse.text
			}
		});
	}

	// Load and insert English translation verse data
	const englishTranslationData = JSON.parse(
		fs.readFileSync('../lib/translations/verses-en-sam-gerrans.json', 'utf8')
	);
	for (let translation of englishTranslationData) {
		await prisma.translations.create({
			data: {
				verse_id: translation.id,
				language: 'english',
				text: translation.text
			}
		});
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

import db from './db/index.js';
import {
	categories,
	pamphletContacts,
	pamphletImages,
	pamphlets,
	pamphletsLocations,
	users,
} from './db/schema.js';

const seed = async (): Promise<void> => {
	await db.delete(pamphletContacts);
	await db.delete(pamphletImages);
	await db.delete(pamphlets);
	await db.delete(pamphletsLocations);
	await db.delete(categories);
	await db.delete(users);

	const hashedPassword = await bcrypt.hash('Password123!', 10);

	await db.insert(users).values([
		{
			name: 'Admin User',
			email: 'admin@pamphlet.test',
			password: hashedPassword,
		},
		{
			name: 'Jane Creator',
			email: 'jane@pamphlet.test',
			password: hashedPassword,
		},
	]);

	await db.insert(categories).values([
		{
			name: 'Food & Dining',
			slug: 'food-dining',
		},
		{
			name: 'Home Services',
			slug: 'home-services',
		},
		{
			name: 'Events',
			slug: 'events',
		},
	]);

	await db.insert(pamphletsLocations).values([
		{
			city: 'Kathmandu',
			latitude: 27.7172,
			longitude: 85.324,
		},
		{
			city: 'Pokhara',
			latitude: 28.2096,
			longitude: 83.9856,
		},
	]);

	const [adminUser] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.email, 'admin@pamphlet.test'));
	const [creatorUser] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.email, 'jane@pamphlet.test'));
	const [kathmandu] = await db
		.select({ id: pamphletsLocations.id })
		.from(pamphletsLocations)
		.where(eq(pamphletsLocations.city, 'Kathmandu'));
	const [pokhara] = await db
		.select({ id: pamphletsLocations.id })
		.from(pamphletsLocations)
		.where(eq(pamphletsLocations.city, 'Pokhara'));

	await db.insert(pamphlets).values([
		{
			title: 'Weekend Food Festival',
			short_description: 'A two-day street food festival with local vendors.',
			content:
				'Enjoy live music, chef demos, and curated tasting menus all weekend.',
			thumbnail_image: '/uploads/pamphlets/food-festival.jpg',
			category: 'Events',
			location_id: kathmandu?.id ?? null,
			user_id: adminUser?.id ?? null,
			url_key: 'weekend-food-festival',
		},
		{
			title: 'Green Home Cleaning',
			short_description: 'Eco-friendly deep cleaning packages for apartments.',
			content:
				'Book weekly or monthly plans with non-toxic, plant-based products.',
			thumbnail_image: '/uploads/pamphlets/green-cleaning.jpg',
			category: 'Home Services',
			location_id: pokhara?.id ?? null,
			user_id: creatorUser?.id ?? null,
			url_key: 'green-home-cleaning',
		},
		{
			title: 'Mountain View Cafe',
			short_description: 'New seasonal menu and sunset happy hour.',
			content:
				'Fresh pastries, artisan coffee, and panoramic views every evening.',
			thumbnail_image: '/uploads/pamphlets/mountain-cafe.jpg',
			category: 'Food & Dining',
			location_id: pokhara?.id ?? null,
			user_id: adminUser?.id ?? null,
			url_key: 'mountain-view-cafe',
		},
	]);

	const seededPamphlets = await db
		.select({ id: pamphlets.id, url_key: pamphlets.url_key })
		.from(pamphlets);
	const pamphletByKey = new Map(
		seededPamphlets.map((pamphlet) => [pamphlet.url_key, pamphlet.id]),
	);

	await db.insert(pamphletImages).values([
		{
			pamphlet_id: pamphletByKey.get('weekend-food-festival') ?? null,
			image_url: '/uploads/pamphlets/food-festival-1.jpg',
		},
		{
			pamphlet_id: pamphletByKey.get('weekend-food-festival') ?? null,
			image_url: '/uploads/pamphlets/food-festival-2.jpg',
		},
		{
			pamphlet_id: pamphletByKey.get('green-home-cleaning') ?? null,
			image_url: '/uploads/pamphlets/green-cleaning-1.jpg',
		},
		{
			pamphlet_id: pamphletByKey.get('mountain-view-cafe') ?? null,
			image_url: '/uploads/pamphlets/mountain-cafe-1.jpg',
		},
	]);

	await db.insert(pamphletContacts).values([
		{
			pamphlet_id: pamphletByKey.get('weekend-food-festival') ?? null,
			phone: '+977-9800000001',
			email: 'events@pamphlet.test',
		},
		{
			pamphlet_id: pamphletByKey.get('green-home-cleaning') ?? null,
			phone: '+977-9800000002',
			email: 'hello@pamphlet.test',
		},
		{
			pamphlet_id: pamphletByKey.get('mountain-view-cafe') ?? null,
			phone: '+977-9800000003',
			email: 'cafe@pamphlet.test',
		},
	]);
};

seed()
	.then(() => {
		console.log('Seed data inserted successfully.');
		process.exit(0);
	})
	.catch((error) => {
		const message = error instanceof Error ? error.message : String(error);
		console.error(`Failed to seed database: ${message}`);
		process.exit(1);
	});

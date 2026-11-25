import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
	// Load Markdown and MDX files in the `src/content/projects/` directory.
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }: { image: any }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			category: z.enum([
				'flight-dynamics',
				'structures-fea',
				'propulsion',
				'manufacturing',
				'systems-ml',
			]),
			tags: z.array(z.string()),
			status: z.enum(['in-development', 'launched', 'archived']).default('launched'),
			version: z.string().optional(),
			// Versioning fields
			versionStatus: z.enum(['current', 'previous']).default('current'),
			currentVersion: z.string().optional(),
			previousDate: z.coerce.date().optional(),
			// Major versions for Version History dropdown
			majorVersions: z.array(z.object({
				version: z.string(),
				date: z.coerce.date(),
				summary: z.string(),
				slug: z.string(),
			})).optional(),
			// Changelog - commit-based entries linked to GitHub
			changelog: z.array(z.object({
				commit: z.string(),
				date: z.coerce.date(),
				message: z.string(),
				body: z.string().optional(),
				url: z.string().url(),
				repo: z.string(),
			})).optional(),
			startedDate: z.coerce.date(),
			launchedDate: z.coerce.date().optional(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			techStack: z.array(z.string()),
			repoUrl: z.string().url().optional(),
			liveUrl: z.string().url().optional(),
		}),
});

export const collections = { projects };

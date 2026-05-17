export const RELEASES_URL = "https://github.com/gapurov/sitegeist-mono/releases";
const RELEASES_API_URL = "https://api.github.com/repos/gapurov/sitegeist-mono/releases?per_page=10";

type GitHubRelease = {
	tag_name?: unknown;
	draft?: unknown;
	prerelease?: unknown;
};

function parseVersion(version: string): number[] | null {
	const parts = version
		.trim()
		.replace(/^v/i, "")
		.split(".")
		.map((part) => Number(part));

	return parts.every((part) => Number.isInteger(part) && part >= 0) ? parts : null;
}

export function isNewerVersion(latest: string, current: string): boolean {
	const latestParts = parseVersion(latest);
	const currentParts = parseVersion(current);

	if (!latestParts || !currentParts) return false;

	for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
		const latestPart = latestParts[i] || 0;
		const currentPart = currentParts[i] || 0;
		if (latestPart > currentPart) return true;
		if (latestPart < currentPart) return false;
	}
	return false;
}

export async function getLatestReleaseVersion(): Promise<string | null> {
	const response = await fetch(RELEASES_API_URL, {
		cache: "no-cache",
		headers: { Accept: "application/vnd.github+json" },
	});

	if (!response.ok) {
		throw new Error(`GitHub releases check failed: ${response.status}`);
	}

	const releases = (await response.json()) as GitHubRelease[];
	const latestRelease = releases.find(
		(release) => release.draft !== true && release.prerelease !== true && typeof release.tag_name === "string",
	);

	return typeof latestRelease?.tag_name === "string" ? latestRelease.tag_name : null;
}

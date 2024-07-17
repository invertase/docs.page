type CheckArgs = {
	// An object of relative file paths (to /docs) and their contents.
	files: Record<string, string>;
};

type CheckResult = {
	errors: unknown;
	warnings: unknown;
};

export function check(args: CheckArgs): CheckResult {
	// TODO
	return {
		errors: [],
		warnings: [],
	};
}

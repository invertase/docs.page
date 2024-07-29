export type CheckResult = {
	type: "warning" | "error";
	message: string;
	filePath: string;
	line: number;
	column: number;
};

export type Route = {
	filePath: string;
	content: string;
};

export type Routes = Map<string, Route>;

export interface Warning {
  warningType?: 'undefined component' | 'undeclared variable';
  line?: number;
  column?: number;
  detail?: string;
}
export interface Error {
  line: number;
  column: number;
  message: number;
}

export interface Heading {
  id: string;
  title: string;
  rank: number;
}

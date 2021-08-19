export type warningType = 'undeclared variable' | 'undefined component';

export interface IWarning {
  warningType: warningType;
  line: number;
  column: number;
  detail: string;
}

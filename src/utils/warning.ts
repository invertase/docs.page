export type warningType = 'undeclared variable' | 'undefined component';

export interface IWarning {
  warningType: warningType;
  line: number;
  column: number;
  message: string;
}

// export class Warning {
//   private constructor(warningType?: warningType, line?: number, column?: number, message?: string) {
//     this.warningType = warningType;
//     this.line = line;
//     this.column = column;
//     this.message = message;
//   }

//   public readonly warningType: warningType;
//   public readonly line: number;
//   public readonly column?: number;
//   public readonly message?: string;

//   public static undeclaredVariable(line, column, variableName?: string) {
//     const message = `
//             We think you have an undeclared mdx variable${
//               ' ' + variableName
//             } at line ${line}, column ${column}.
//             Try adding \"export const ${variableName};\" somewhere in your mdx file.
//             `;
//     return new Warning('undeclared variables', line, column, message);
//   }

//   public static undefinedComponent(line, column, componentName?: string) {
//     const message = `
//             We think you have an undefined component ${
//               ' ' + componentName
//             } at line ${line}, column ${column}.
//             Either export a component definition, or stick to our prebuilt components.
//             `;
//     return new Warning('undefined components', line, column, message);
//   }

//   public toObject(): IWarning {
//     return {
//       warningType: this.warningType,
//       line: this.line,
//       column: this.column,
//       message: this.message,
//     };
//   }
// }



// The following should produce only warnings:

export const undeclaredVariable = `
# Hello World

{x}

export const y = 4;

{y}
`;


export const undefinedComponent = `
# Hello World

{x}

export const Component = () => <></>

<Component/>

<NotAComponent/>
`;

// The following should produce errors (which are currently HANDLED)

export const unclosedError1 = `
# Hello World

<
`;
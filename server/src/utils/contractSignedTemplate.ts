interface Type {
    firstName: string,
    employeeName: string,
}
const contractSignedTemplate = ({ firstName, employeeName }: Type): string => {
    return `
    <h2>Dear ${firstName}!</h2>
    <p><strong>${employeeName}</strong> has reviewed and signed their contract.</p>
    <p>You can review it now under Contracts in the admin panel.</p>
    `
}

export default contractSignedTemplate;

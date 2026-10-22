interface Type {
    employeeName: string,
}
const contractSignedCopyTemplate = ({ employeeName }: Type): string => {
    return `
    <h2>Dear ${employeeName}!</h2>
    <p>Thank you for signing your contract with Health U Australia.</p>
    <p>Please find attached a copy of your signed contract for your records.</p>
    <p>If you have any questions, please contact us at info@healthuau.com or 0481 707 758.</p>
    `
}

export default contractSignedCopyTemplate;

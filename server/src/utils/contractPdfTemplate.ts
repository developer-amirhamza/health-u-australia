interface Type {
    employeeName: string,
}
const contractPdfTemplate = ({ employeeName }: Type): string => {
    return `
    <h2>Dear ${employeeName}!</h2>
    <p>Please find attached your contract from Health U Australia.</p>
    <p>If you have any questions, please contact us at info@healthuau.com or 0481 707 758.</p>
    `
}

export default contractPdfTemplate;

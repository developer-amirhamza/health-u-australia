interface Type {
    employeeName: string,
    signUrl: string,
}
const contractSignatureRequestTemplate = ({ employeeName, signUrl }: Type): string => {
    return `
    <h2>Dear ${employeeName}!</h2>
    <p>Health U Australia has prepared your contract for your review.</p>
    <p>Please open the link below to read the contract and add your signature:</p>
    <p><a href="${signUrl}">${signUrl}</a></p>
    <p>This link lets you review the contract and add your signature only — none of the other details can be changed.</p>
    <p>If you have any questions, please contact us at info@healthuau.com or 0481 707 758.</p>
    `
}

export default contractSignatureRequestTemplate;

interface Type {
    participantName: string,
}
const serviceAgreementPdfTemplate = ({ participantName }: Type): string => {
    return `
    <h2>Dear ${participantName}!</h2>
    <p>Please find attached your NDIS Service Agreement &amp; Consent Form from Health U Australia.</p>
    <p>If you have any questions about this agreement, please contact us at info@healthuau.com or 0481 707 758.</p>
    `
}

export default serviceAgreementPdfTemplate;

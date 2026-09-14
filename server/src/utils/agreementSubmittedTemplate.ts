interface Type {
    firstName: string,
    participantName: string,
    quoteNumber?: string,
}
const agreementSubmittedTemplate = ({ firstName, participantName, quoteNumber }: Type): string => {
    return `
    <h2>Dear ${firstName}!</h2>
    <p>The NDIS Service Agreement you prepared for <strong>${participantName}</strong>${quoteNumber ? ` (Quote ${quoteNumber})` : ''} has been saved successfully.</p>
    <p>You can review, update or download it anytime from the Service Agreements section of the admin panel.</p>
    `
}

export default agreementSubmittedTemplate;

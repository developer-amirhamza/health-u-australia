interface Type {
    participantRepName: string,
    signUrl: string,
}
const serviceAgreementSignatureRequestTemplate = ({ participantRepName, signUrl }: Type): string => {
    return `
    <h2>Dear ${participantRepName}!</h2>
    <p>Health U Australia has prepared your NDIS Service Agreement &amp; Consent Form for your review.</p>
    <p>Please open the link below to review the agreement and add your signature:</p>
    <p><a href="${signUrl}">${signUrl}</a></p>
    <p>This link lets you review the agreement and add your signature only — none of the other details can be changed.</p>
    `
}

export default serviceAgreementSignatureRequestTemplate;

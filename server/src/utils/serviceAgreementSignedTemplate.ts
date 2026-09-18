interface Type {
    firstName: string,
    participantName: string,
}
const serviceAgreementSignedTemplate = ({ firstName, participantName }: Type): string => {
    return `
    <h2>Dear ${firstName}!</h2>
    <p><strong>${participantName}</strong> has reviewed and signed their NDIS Service Agreement.</p>
    <p>You can review it now under Service Agreements in the admin panel.</p>
    `
}

export default serviceAgreementSignedTemplate;

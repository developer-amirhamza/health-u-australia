interface Type {
    firstName: string,
    otp: string,
}
const verifyEmailTemplate = ({ firstName, otp }: Type): string => {
    return `
    <h2>Dear ${firstName}!</h2>
    <p>Thank you for registering with Health U Australia.</p>
    <p>Your email verification code is:</p>
    <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: green;">${otp}</p>
    <p>This code expires in 10 minutes. If you didn't create this account, you can safely ignore this email.</p>
    `
}

export default verifyEmailTemplate;

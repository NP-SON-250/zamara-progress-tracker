export const maskEmail = (email) => {
  if (!email || !email.includes("@")) return "";

  const [localPart, domain] = email.split("@");

  const visibleLength = 3;
  const visiblePart = localPart.slice(-visibleLength);
  const maskedPart = "•".repeat(4);

  return `${maskedPart}${visiblePart}@${domain}`;
};

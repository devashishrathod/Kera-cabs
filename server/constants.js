module.exports = {
  ROLES: Object.freeze({
    ADMIN: "admin",
    STAFF: "staff",
    USER: "user",
  }),

  LOGIN_TYPES: Object.freeze({
    EMAIL: "email",
    MOBILE: "mobile",
    GOOGLE: "google",
    PASSWORD: "password",
    OTHER: "other",
  }),

  BOOKING_STATUS: Object.freeze({
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
    COMPLETED: "completed",
    DUTY_CLOSED: "dutyClosed",
    INVOICE_GENERATED: "invoiceGenerated",
    STATEMENT_SENT: "statementSent",
    CASH_RECEIVED: "cashReceived",
    OUTSTANDING_AMOUNT: "outstandingAmount",
  }),

  DEFAULT_IMAGES: Object.freeze({
    CATEGORY:
      "https://callwave.com/wp-content/uploads/2023/11/image-166-1024x523.png",
  }),
};

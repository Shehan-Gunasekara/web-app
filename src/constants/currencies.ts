function getCurrency() {
  const currencies = [
    { value: "USD", label: "United States Dollar - USD (US$)" },
    { value: "EUR", label: "Euro - EUR (€)" },
    { value: "GBP", label: "British Pound Sterling - GBP (£)" },
    { value: "JPY", label: "Japanese Yen - JPY (¥)" },
    { value: "CAD", label: "Canadian Dollar - CAD (CA$)" },
    { value: "AUD", label: "Australian Dollar - AUD (A$)" },
    { value: "CHF", label: "Swiss Franc - CHF" },
    { value: "CNY", label: "Chinese Yuan - CNY (¥)" },
    { value: "SEK", label: "Swedish Krona - SEK" },
    { value: "NZD", label: "New Zealand Dollar - NZD (NZ$)" },
    { value: "NOK", label: "Norwegian Krone - NOK" },
    { value: "MXN", label: "Mexican Peso - MXN" },
    { value: "SGD", label: "Singapore Dollar - SGD (S$)" },
    { value: "HKD", label: "Hong Kong Dollar - HKD (HK$)" },
    { value: "INR", label: "Indian Rupee - INR (₹)" },
    { value: "LKR", label: "Sri Lankan Rupee - LKR" },
    { value: "BRL", label: "Brazilian Real - BRL (R$)" },
    { value: "RUB", label: "Russian Ruble - RUB" },
    { value: "ZAR", label: "South African Rand - ZAR (R)" },
    { value: "TRY", label: "Turkish Lira - TRY (₺)" },
    { value: "KRW", label: "South Korean Won - KRW (₩)" },
    { value: "AED", label: "United Arab Emirates Dirham - AED (د.إ)" },
  ];
  return currencies;
}

export default getCurrency;

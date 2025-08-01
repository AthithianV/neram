import dayjs from 'dayjs';
import { COLORS } from './colors';
import { DB_DATE_FORMAT, DB_TIME_FORMAT } from './session';

export const PROJECT_INITIAL_VALUES = {
    title: 'UNTITLED',
    description: '',
    color: COLORS[0].value,
    started_at: dayjs().format(`${DB_DATE_FORMAT}T${DB_TIME_FORMAT}`),
    is_billable: true,
    billing_type: 'Hourly' as 'Hourly',
    hourly_rate: 0,
    fixed_rate: 0,
    currency: 'INR',
    tags: [],
};

export const BILLING_TYPE = [
    { title: 'Hourly', color: '#0EA5E9' },
    { title: 'Fixed', color: '#EC4899' },
];

export const DEFAULT_CURRENCY = `$ USD`;

export const CURRENCT_LIST = [
    { code: 'USD', symbol: '$' }, // US Dollar
    { code: 'EUR', symbol: '€' }, // Euro
    { code: 'INR', symbol: '₹' }, // Indian Rupee
    { code: 'GBP', symbol: '£' }, // British Pound
    { code: 'JPY', symbol: '¥' }, // Japanese Yen
    { code: 'CNY', symbol: '¥' }, // Chinese Yuan
    { code: 'AUD', symbol: 'A$' }, // Australian Dollar
    { code: 'CAD', symbol: 'C$' }, // Canadian Dollar
    { code: 'CHF', symbol: 'CHF' }, // Swiss Franc
    { code: 'SGD', symbol: 'S$' }, // Singapore Dollar
    { code: 'NZD', symbol: 'NZ$' }, // New Zealand Dollar
    { code: 'ZAR', symbol: 'R' }, // South African Rand
    { code: 'AED', symbol: 'د.إ' }, // UAE Dirham
    { code: 'SAR', symbol: 'ر.س' }, // Saudi Riyal
    { code: 'SEK', symbol: 'kr' }, // Swedish Krona
    { code: 'NOK', symbol: 'kr' }, // Norwegian Krone
    { code: 'DKK', symbol: 'kr' }, // Danish Krone
    { code: 'HKD', symbol: 'HK$' }, // Hong Kong Dollar
    { code: 'KRW', symbol: '₩' }, // South Korean Won
    { code: 'THB', symbol: '฿' }, // Thai Baht
    { code: 'IDR', symbol: 'Rp' }, // Indonesian Rupiah
    { code: 'MYR', symbol: 'RM' }, // Malaysian Ringgit
    { code: 'PHP', symbol: '₱' }, // Philippine Peso
    { code: 'RUB', symbol: '₽' }, // Russian Ruble
    { code: 'BRL', symbol: 'R$' }, // Brazilian Real
    { code: 'MXN', symbol: 'MX$' }, // Mexican Peso
    { code: 'TRY', symbol: '₺' }, // Turkish Lira
    { code: 'PLN', symbol: 'zł' }, // Polish Zloty
    { code: 'TWD', symbol: 'NT$' }, // New Taiwan Dollar
    { code: 'VND', symbol: '₫' }, // Vietnamese Dong
];

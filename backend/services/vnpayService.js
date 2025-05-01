const crypto = require('crypto');
const moment = require('moment');
const querystring = require('qs');

class VNPayService {
    constructor() {
        this.tmnCode = process.env.VNP_TMN_CODE;
        this.hashSecret = process.env.VNP_HASH_SECRET;
        this.vnpUrl = process.env.VNP_URL;
        this.returnUrl = process.env.VNP_RETURN_URL;
    }

    createPaymentUrl(orderId, amount, orderInfo) {
        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');

        const tmnCode = this.tmnCode;
        const secretKey = this.hashSecret;
        const currCode = 'VND';
        const vnp_Params = {
            'vnp_Version': '2.1.0',
            'vnp_Command': 'pay',
            'vnp_TmnCode': tmnCode,
            'vnp_Locale': 'vn',
            'vnp_CurrCode': currCode,
            'vnp_TxnRef': orderId,
            'vnp_OrderInfo': orderInfo,
            'vnp_OrderType': 'other',
            'vnp_Amount': amount * 100,
            'vnp_ReturnUrl': this.returnUrl,
            'vnp_IpAddr': '127.0.0.1',
            'vnp_CreateDate': createDate,
          /*   'queryStringAuth': true, */
        };
        
        const redirectUrl = new URL(this.vnpUrl);
        
        Object.entries(vnp_Params)
            .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
            .forEach(([key, value]) => {
                // Skip empty value
                if (!value || value === "" || value === undefined || value === null) {
                    return;
                }
                redirectUrl.searchParams.append(key, value.toString());
            });

        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac
            .update(
                Buffer.from(
                    redirectUrl.search.slice(1).toString(),
                    "utf-8"
                )
            )
            .digest("hex");

        redirectUrl.searchParams.append("vnp_SecureHash", signed);
        return redirectUrl.toString();
    }

    verifyReturnUrl(vnp_Params) {
        const secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        // Convert params to query string and sort alphabetically
        const signData = Object.keys(vnp_Params)
            .sort()
            .map(key => {
                if (vnp_Params[key] !== '' && vnp_Params[key] !== null && vnp_Params[key] !== undefined) {
                    return `${key}=${encodeURIComponent(vnp_Params[key]).replace(/%20/g, '+')}`
                }
                return '';
            })
            .filter(item => item) // Remove empty strings
            .join('&');

        const hmac = crypto.createHmac('sha512', this.hashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        return secureHash === signed;
    }
    
}

module.exports = new VNPayService();

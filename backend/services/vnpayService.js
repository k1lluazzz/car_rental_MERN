const crypto = require('crypto');
const moment = require('moment');
const querystring = require('qs');

class VNPayService {
    constructor() {
        this.tmnCode = process.env.VNP_TMN_CODE;
        this.hashSecret = process.env.VNP_HASH_SECRET;
        this.vnpUrl = process.env.VNP_URL;
        this.returnUrl = process.env.VNP_RETURN_URL;
    }    createPaymentUrl(orderId, amount, orderInfo, ipAddr = '127.0.0.1') {
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
            'vnp_OrderType': 'billpayment',
            'vnp_Amount': amount * 100,
            'vnp_ReturnUrl': this.returnUrl,
            'vnp_IpAddr': ipAddr,
            'vnp_CreateDate': createDate,
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
    }    verifyReturnUrl(vnp_Params) {
        try {
            const secureHash = vnp_Params['vnp_SecureHash'];
            
            if (!secureHash) {
                console.error('No secure hash found in VNPay response');
                return false;
            }

            // Create a copy of the params to avoid modifying the original
            const params = { ...vnp_Params };
            delete params['vnp_SecureHash'];
            delete params['vnp_SecureHashType'];

            // Convert params to query string and sort alphabetically
            const signData = Object.keys(params)
                .sort()
                .map(key => {
                    const value = params[key];
                    if (value !== '' && value !== null && value !== undefined) {
                        return `${key}=${encodeURIComponent(value).replace(/%20/g, '+')}`
                    }
                    return '';
                })
                .filter(item => item) // Remove empty strings
                .join('&');

            const hmac = crypto.createHmac('sha512', this.hashSecret);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

            const isValid = secureHash === signed;
            
            if (!isValid) {
                console.error('VNPay signature verification failed');
                console.error('Expected:', signed);
                console.error('Received:', secureHash);
            }

            return isValid;
        } catch (error) {
            console.error('Error verifying VNPay return URL:', error);
            return false;
        }
    }
    
}

module.exports = new VNPayService();

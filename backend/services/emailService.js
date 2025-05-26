const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD
            }
        });
    }

    async sendInvoiceEmail(userEmail, rental, payment) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Hóa đơn thuê xe - HDOTO',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">Xác nhận thanh toán thành công</h2>
                    <p>Kính gửi Quý khách,</p>
                    <p>Cảm ơn bạn đã sử dụng dịch vụ của HDOTO. Dưới đây là chi tiết đơn hàng của bạn:</p>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #333; margin-bottom: 15px;">Chi tiết đơn hàng:</h3>
                        <p><strong>Mã đơn hàng:</strong> ${payment.orderId}</p>
                        <p><strong>Xe thuê:</strong> ${rental.car.name} (${rental.car.brand})</p>
                        <p><strong>Thời gian thuê:</strong> ${new Date(rental.startDate).toLocaleString('vi-VN')} - ${new Date(rental.endDate).toLocaleString('vi-VN')}</p>
                        <p><strong>Số ngày thuê:</strong> ${rental.durationInDays} ngày</p>
                        <p><strong>Tổng tiền:</strong> ${rental.totalAmount.toLocaleString('vi-VN')}đ</p>
                        ${rental.discount ? `<p><strong>Giảm giá:</strong> ${rental.discount}%</p>` : ''}
                        <p><strong>Trạng thái:</strong> <span style="color: #28a745;">Đã thanh toán</span></p>
                    </div>

                    <div style="margin-top: 30px;">
                        <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua:</p>
                        <p>Email: support@hdoto.com</p>
                        <p>Hotline: 1900 xxxx</p>
                    </div>

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #666; font-size: 12px;">Email này được gửi tự động, vui lòng không phản hồi.</p>
                    </div>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Invoice email sent successfully');
            return true;
        } catch (error) {
            console.error('Error sending invoice email:', error);
            return false;
        }
    }
}

module.exports = new EmailService();

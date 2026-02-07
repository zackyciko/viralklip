import { Resend } from 'resend'

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null


export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

export async function sendEmail(options: EmailOptions) {
  try {
    if (!resend) {
      console.warn('Resend API key not configured, skipping email send')
      return { id: 'mock-email-id' }
    }

    const { data, error } = await resend.emails.send({
      from: options.from || 'ViralKlip <noreply@viralklip.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    })

    if (error) {
      console.error('Email send error:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Email send error:', error)
    throw error
  }
}

// Email templates
export const emailTemplates = {
  welcome: (name: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #00f2ff 0%, #0066ff 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #00f2ff; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Selamat Datang di ViralKlip!</h1>
        </div>
        <div class="content">
          <p>Halo <strong>${name}</strong>,</p>
          <p>Terima kasih sudah bergabung dengan ViralKlip! Kamu sekarang bisa mulai mengubah video panjang menjadi klip viral dalam hitungan menit.</p>
          <p><strong>Apa yang bisa kamu lakukan:</strong></p>
          <ul>
            <li>✂️ Potong video otomatis dengan AI</li>
            <li>🎯 Deteksi momen viral</li>
            <li>📊 Analisis prediksi views</li>
            <li>🎨 Multi-format (TikTok, Reels, YouTube)</li>
          </ul>
          <p>Kamu mendapat <strong>3 kredit gratis</strong> untuk memulai!</p>
          <a href="https://viralklip.com/dashboard" class="button">Mulai Sekarang →</a>
          <p>Butuh bantuan? Reply email ini atau kunjungi <a href="https://viralklip.com/help">Help Center</a>.</p>
        </div>
        <div class="footer">
          <p>© 2026 ViralKlip. All rights reserved.</p>
          <p><a href="https://viralklip.com/unsubscribe">Unsubscribe</a></p>
        </div>
      </div>
    </body>
    </html>
  `,

  paymentSuccess: (name: string, plan: string, amount: number, orderId: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #00f2ff 0%, #0066ff 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .receipt { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .receipt-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .total { font-size: 18px; font-weight: bold; color: #00f2ff; }
        .button { display: inline-block; padding: 12px 30px; background: #00f2ff; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Pembayaran Berhasil!</h1>
        </div>
        <div class="content">
          <p>Halo <strong>${name}</strong>,</p>
          <p>Pembayaran kamu telah berhasil diproses. Terima kasih sudah berlangganan!</p>
          
          <div class="receipt">
            <h3>📄 Detail Pembayaran</h3>
            <div class="receipt-row">
              <span>Order ID:</span>
              <span><strong>${orderId}</strong></span>
            </div>
            <div class="receipt-row">
              <span>Paket:</span>
              <span><strong>${plan}</strong></span>
            </div>
            <div class="receipt-row total">
              <span>Total:</span>
              <span>Rp ${amount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <p>Akun kamu sudah diupgrade dan kredit sudah ditambahkan!</p>
          <a href="https://viralklip.com/dashboard" class="button">Buka Dashboard →</a>
        </div>
        <div class="footer">
          <p>© 2026 ViralKlip. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  processingComplete: (name: string, projectTitle: string, clipCount: number, projectId: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #00f2ff 0%, #0066ff 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .stats { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
        .stat-number { font-size: 48px; font-weight: bold; color: #00f2ff; }
        .button { display: inline-block; padding: 12px 30px; background: #00f2ff; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎬 Video Kamu Sudah Siap!</h1>
        </div>
        <div class="content">
          <p>Halo <strong>${name}</strong>,</p>
          <p>Kabar baik! Video "<strong>${projectTitle}</strong>" sudah selesai diproses.</p>
          
          <div class="stats">
            <div class="stat-number">${clipCount}</div>
            <p>Klip viral siap upload!</p>
          </div>

          <p>Semua klip sudah tersedia dalam format:</p>
          <ul>
            <li>📱 9:16 (TikTok, Reels, Shorts)</li>
            <li>🖥️ 16:9 (YouTube)</li>
            <li>📷 1:1 (Instagram Feed)</li>
          </ul>

          <a href="https://viralklip.com/editor/${projectId}" class="button">Lihat Klip →</a>
        </div>
        <div class="footer">
          <p>© 2026 ViralKlip. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  creditLow: (name: string, creditsRemaining: number) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff9500 0%, #ff5e00 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .warning { background: #fff3cd; border-left: 4px solid #ff9500; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #ff9500; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Kredit Hampir Habis</h1>
        </div>
        <div class="content">
          <p>Halo <strong>${name}</strong>,</p>
          
          <div class="warning">
            <p><strong>Kredit tersisa: ${creditsRemaining}</strong></p>
            <p>Kamu hampir kehabisan kredit untuk memproses video.</p>
          </div>

          <p>Jangan sampai kehabisan! Upgrade sekarang untuk:</p>
          <ul>
            <li>✨ Kredit unlimited</li>
            <li>⚡ Processing lebih cepat</li>
            <li>🎯 Fitur premium</li>
            <li>💎 Priority support</li>
          </ul>

          <a href="https://viralklip.com/pricing" class="button">Upgrade Sekarang →</a>
        </div>
        <div class="footer">
          <p>© 2026 ViralKlip. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
}

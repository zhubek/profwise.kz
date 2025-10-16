import { Injectable, Logger } from '@nestjs/common';
import * as brevo from '@getbrevo/brevo';
import * as crypto from 'crypto';
import { Language } from '@prisma/client';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private emailAPI: brevo.TransactionalEmailsApi;
  private readonly isEmailVerificationEnabled: boolean;
  private readonly emailFrom: string;
  private readonly emailFromName: string;
  private readonly frontendUrl: string;

  constructor() {
    this.isEmailVerificationEnabled =
      process.env.ENABLE_EMAIL_VERIFICATION === 'true';
    this.emailFrom = process.env.EMAIL_FROM || 'noreply@profwise.kz';
    this.emailFromName = process.env.EMAIL_FROM_NAME || 'Profwise';
    this.frontendUrl =
      process.env.FRONTEND_URL || 'http://172.26.195.243:3000';

    if (this.isEmailVerificationEnabled) {
      this.emailAPI = new brevo.TransactionalEmailsApi();
      this.emailAPI.setApiKey(
        brevo.TransactionalEmailsApiApiKeys.apiKey,
        process.env.BREVO_API_KEY || '',
      );
      this.logger.log('Email verification enabled with Brevo');
    } else {
      this.logger.log('Email verification disabled');
    }
  }

  /**
   * Generate a random verification token
   */
  generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Get verification token expiry time (24 hours from now)
   */
  getVerificationExpiry(): Date {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24);
    return expiry;
  }

  /**
   * Check if email verification is enabled
   */
  isVerificationEnabled(): boolean {
    return this.isEmailVerificationEnabled;
  }

  /**
   * Get translations for email content
   */
  private getTranslations(language: Language) {
    const translations = {
      EN: {
        verificationSubject: 'Verify your email - Profwise',
        verificationTitle: 'Welcome to Profwise!',
        verificationGreeting: (name: string) => `Hello ${name},`,
        verificationBody: 'Thank you for registering with Profwise. Please verify your email address to complete your registration.',
        verificationButton: 'Click the button below to verify your email:',
        verificationButtonText: 'Verify Email',
        verificationLink: 'Or copy and paste this link into your browser:',
        verificationExpiry: 'This link will expire in 24 hours.',
        verificationIgnore: "If you didn't create an account with Profwise, you can safely ignore this email.",
        welcomeSubject: 'Welcome to Profwise!',
        welcomeTitle: 'Welcome to Profwise!',
        welcomeGreeting: (name: string) => `Hi ${name},`,
        welcomeBody: 'Your email has been verified successfully!',
        welcomeExplore: 'You can now start exploring career guidance tools and take assessments to discover your path.',
        welcomeVisit: 'Visit',
        welcomeVisitLink: 'Profwise',
        welcomeVisitEnd: 'to get started.',
        footer: (year: number) => `© ${year} Profwise. All rights reserved.`,
      },
      RU: {
        verificationSubject: 'Подтвердите ваш email - Profwise',
        verificationTitle: 'Добро пожаловать в Profwise!',
        verificationGreeting: (name: string) => `Здравствуйте, ${name}!`,
        verificationBody: 'Спасибо за регистрацию в Profwise. Пожалуйста, подтвердите ваш email для завершения регистрации.',
        verificationButton: 'Нажмите на кнопку ниже, чтобы подтвердить email:',
        verificationButtonText: 'Подтвердить Email',
        verificationLink: 'Или скопируйте и вставьте эту ссылку в браузер:',
        verificationExpiry: 'Эта ссылка истечет через 24 часа.',
        verificationIgnore: 'Если вы не создавали аккаунт в Profwise, вы можете проигнорировать это письмо.',
        welcomeSubject: 'Добро пожаловать в Profwise!',
        welcomeTitle: 'Добро пожаловать в Profwise!',
        welcomeGreeting: (name: string) => `Привет, ${name}!`,
        welcomeBody: 'Ваш email успешно подтвержден!',
        welcomeExplore: 'Теперь вы можете начать изучать инструменты профориентации и проходить тесты, чтобы найти свой путь.',
        welcomeVisit: 'Посетите',
        welcomeVisitLink: 'Profwise',
        welcomeVisitEnd: 'чтобы начать.',
        footer: (year: number) => `© ${year} Profwise. Все права защищены.`,
      },
      KZ: {
        verificationSubject: 'Email мекенжайыңызды растаңыз - Profwise',
        verificationTitle: 'Profwise-қа қош келдіңіз!',
        verificationGreeting: (name: string) => `Сәлеметсіз бе, ${name}!`,
        verificationBody: 'Profwise-ке тіркелгеніңіз үшін рахмет. Тіркелуді аяқтау үшін email мекенжайыңызды растаңыз.',
        verificationButton: 'Email растау үшін төмендегі түймені басыңыз:',
        verificationButtonText: 'Email растау',
        verificationLink: 'Немесе бұл сілтемені көшіріп, браузеріңізге қойыңыз:',
        verificationExpiry: 'Бұл сілтеме 24 сағат ішінде жарамсыз болады.',
        verificationIgnore: 'Егер сіз Profwise-те аккаунт жасамаған болсаңыз, бұл хатты елемеуге болады.',
        welcomeSubject: 'Profwise-қа қош келдіңіз!',
        welcomeTitle: 'Profwise-қа қош келдіңіз!',
        welcomeGreeting: (name: string) => `Сәлем, ${name}!`,
        welcomeBody: 'Сіздің email мекенжайыңыз сәтті расталды!',
        welcomeExplore: 'Енді сіз мансап бағдарлау құралдарын зерттеп, өз жолыңызды табу үшін тесттер тапсыра аласыз.',
        welcomeVisit: 'Бастау үшін',
        welcomeVisitLink: 'Profwise',
        welcomeVisitEnd: 'сайтына кіріңіз.',
        footer: (year: number) => `© ${year} Profwise. Барлық құқықтар қорғалған.`,
      },
    };

    return translations[language] || translations.RU;
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(
    email: string,
    name: string,
    token: string,
    language: Language = Language.RU,
  ): Promise<void> {
    if (!this.isEmailVerificationEnabled) {
      this.logger.log('Email verification disabled, skipping email send');
      return;
    }

    try {
      const verificationUrl = `${this.frontendUrl}/verify-email?token=${token}`;
      const t = this.getTranslations(language);

      const message = new brevo.SendSmtpEmail();
      message.subject = t.verificationSubject;
      message.htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 30px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${t.verificationTitle}</h1>
            </div>
            <div class="content">
              <h2>${t.verificationGreeting(name)}</h2>
              <p>${t.verificationBody}</p>
              <p>${t.verificationButton}</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">${t.verificationButtonText}</a>
              </div>
              <p>${t.verificationLink}</p>
              <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
              <p><strong>${t.verificationExpiry}</strong></p>
              <p>${t.verificationIgnore}</p>
            </div>
            <div class="footer">
              <p>${t.footer(new Date().getFullYear())}</p>
            </div>
          </div>
        </body>
        </html>
      `;
      message.sender = { name: this.emailFromName, email: this.emailFrom };
      message.to = [{ email, name }];

      await this.emailAPI.sendTransacEmail(message);
      this.logger.log(`Verification email sent to ${email} in ${language}`);
    } catch (error) {
      this.logger.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  /**
   * Send welcome email after verification
   */
  async sendWelcomeEmail(
    email: string,
    name: string,
    language: Language = Language.RU,
  ): Promise<void> {
    if (!this.isEmailVerificationEnabled) {
      return;
    }

    try {
      const t = this.getTranslations(language);

      const message = new brevo.SendSmtpEmail();
      message.subject = t.welcomeSubject;
      message.htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 30px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${t.welcomeTitle}</h1>
            </div>
            <div class="content">
              <h2>${t.welcomeGreeting(name)}</h2>
              <p>${t.welcomeBody}</p>
              <p>${t.welcomeExplore}</p>
              <p>${t.welcomeVisit} <a href="${this.frontendUrl}">${t.welcomeVisitLink}</a> ${t.welcomeVisitEnd}</p>
            </div>
            <div class="footer">
              <p>${t.footer(new Date().getFullYear())}</p>
            </div>
          </div>
        </body>
        </html>
      `;
      message.sender = { name: this.emailFromName, email: this.emailFrom };
      message.to = [{ email, name }];

      await this.emailAPI.sendTransacEmail(message);
      this.logger.log(`Welcome email sent to ${email} in ${language}`);
    } catch (error) {
      this.logger.error('Error sending welcome email:', error);
      // Don't throw error for welcome email, it's not critical
    }
  }

  /**
   * Send test email
   */
  async sendTestEmail(
    email: string,
    subject: string,
    text: string,
  ): Promise<void> {
    if (!this.isEmailVerificationEnabled) {
      this.logger.log('Email verification disabled, skipping email send');
      return;
    }

    try {
      const message = new brevo.SendSmtpEmail();
      message.subject = subject;
      message.htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 30px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Test Email</h1>
            </div>
            <div class="content">
              <p>${text}</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Profwise. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
      message.sender = { name: this.emailFromName, email: this.emailFrom };
      message.to = [{ email }];

      await this.emailAPI.sendTransacEmail(message);
      this.logger.log(`Test email sent to ${email}`);
    } catch (error) {
      this.logger.error('Error sending test email:', error);
      throw new Error('Failed to send test email');
    }
  }
}

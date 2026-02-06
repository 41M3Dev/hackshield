const nodemailer = require('nodemailer');

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true pour 465, false pour les autres ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

/**
 * Envoie un email de vérification
 */
exports.sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: `"${process.env.APP_NAME || 'HackLab'}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: 'Vérifiez votre adresse email',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Bienvenue sur ${process.env.APP_NAME || 'HackLab'} !</h2>
                <p>Merci de vous être inscrit. Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
                <a href="${verificationUrl}"
                   style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
                    Vérifier mon email
                </a>
                <p>Ou copiez ce lien dans votre navigateur :</p>
                <p style="color: #666; font-size: 14px;">${verificationUrl}</p>
                <p style="color: #999; font-size: 12px; margin-top: 30px;">
                    Ce lien expire dans 24 heures. Si vous n'avez pas créé de compte, ignorez cet email.
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email de vérification envoyé à ${email}`);
    } catch (error) {
        console.error('Erreur envoi email:', error);
        throw new Error('Impossible d\'envoyer l\'email de vérification');
    }
};

/**
 * Envoie un email de réinitialisation de mot de passe
 */
exports.sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
        from: `"${process.env.APP_NAME || 'HackLab'}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Réinitialisation de mot de passe</h2>
                <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous :</p>
                <a href="${resetUrl}"
                   style="display: inline-block; padding: 12px 24px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
                    Réinitialiser mon mot de passe
                </a>
                <p>Ou copiez ce lien dans votre navigateur :</p>
                <p style="color: #666; font-size: 14px;">${resetUrl}</p>
                <p style="color: #999; font-size: 12px; margin-top: 30px;">
                    Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email de réinitialisation envoyé à ${email}`);
    } catch (error) {
        console.error('Erreur envoi email:', error);
        throw new Error('Impossible d\'envoyer l\'email de réinitialisation');
    }
};

/**
 * Envoie un email de confirmation de changement de mot de passe
 */
exports.sendPasswordChangedEmail = async (email) => {
    const mailOptions = {
        from: `"${process.env.APP_NAME || 'HackLab'}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: 'Votre mot de passe a été modifié',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Mot de passe modifié</h2>
                <p>Votre mot de passe a été modifié avec succès.</p>
                <p>Si vous n'êtes pas à l'origine de cette modification, contactez immédiatement notre support.</p>
                <p style="color: #999; font-size: 12px; margin-top: 30px;">
                    ${process.env.APP_NAME || 'HackLab'} - ${new Date().toLocaleString('fr-FR')}
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email de confirmation envoyé à ${email}`);
    } catch (error) {
        console.error('Erreur envoi email:', error);
        // Non bloquant, on continue même si l'email n'est pas envoyé
    }
};

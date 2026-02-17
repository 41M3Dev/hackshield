const twilio = require('twilio');

// Configuration Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let client;

// Initialiser le client Twilio seulement si les credentials sont configurés
if (accountSid && authToken && twilioPhoneNumber) {
    client = twilio(accountSid, authToken);
} else {
    console.warn('⚠️  Twilio non configuré. Les SMS ne seront pas envoyés.');
}

/**
 * Envoie un code 2FA par SMS
 */
exports.sendTwoFactorCode = async (phoneNumber, code) => {
    // Mode développement: afficher le code dans la console au lieu de l'envoyer
    if (process.env.NODE_ENV === 'development' || !client) {
        console.log(`\n🔐 Code 2FA pour ${phoneNumber}: ${code}\n`);
        return { success: true, mode: 'development' };
    }

    try {
        const message = await client.messages.create({
            body: `Votre code de vérification ${process.env.APP_NAME || 'HackLab'} est: ${code}. Ce code expire dans 10 minutes.`,
            from: twilioPhoneNumber,
            to: phoneNumber
        });

        console.log(`SMS 2FA envoyé à ${phoneNumber} (SID: ${message.sid})`);
        return { success: true, sid: message.sid };
    } catch (error) {
        console.error('Erreur envoi SMS Twilio:', error);
        throw new Error('Impossible d\'envoyer le code SMS');
    }
};

/**
 * Envoie un SMS de notification générique
 */
exports.sendNotificationSMS = async (phoneNumber, message) => {
    if (process.env.NODE_ENV === 'development' || !client) {
        console.log(`\n📱 SMS pour ${phoneNumber}: ${message}\n`);
        return { success: true, mode: 'development' };
    }

    try {
        const sms = await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: phoneNumber
        });

        console.log(`SMS envoyé à ${phoneNumber} (SID: ${sms.sid})`);
        return { success: true, sid: sms.sid };
    } catch (error) {
        console.error('Erreur envoi SMS:', error);
        throw new Error('Impossible d\'envoyer le SMS');
    }
};

/**
 * Valide le format d'un numéro de téléphone (E.164 format)
 * Exemple: +33612345678 (France), +14155552671 (US)
 */
exports.validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
};

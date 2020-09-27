import fetch from 'node-fetch';

export class Telegram {
    /**
     * @return Promise<void>
     */
    static async setWebhookOrFail(): Promise<void> {
        const url = `https://api.telegram.org/bot${process.env.JGMN_TELEGRAM_TOKEN}/setWebhook`;
        const webhookUrl = `https://${process.env.JGMN_AWS_DEPLOYMENT_DOMAIN}/webhook`;
        console.log('Telegram', `Setting webhook url to '${webhookUrl}'`);

        const result = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                url: webhookUrl,
                allowed_updates: ['message']
            }),
            headers: {
                'content-type': 'application/json'
            }
        });

        console.log('Telegram', 'setWebhook', result);
    }

    /**
     * @param chatId string|number
     * @param text string
     * @return Promise<void>
     */
    static async sendMessageOrFail(chatId: string | number, text: string): Promise<void> {
        const url = `https://api.telegram.org/bot${process.env.JGMN_TELEGRAM_TOKEN}/sendMessage`;
        const params = JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: "HTML"
        });

        console.log('Telegram', 'sendMessage', 'params', params);

        const result = await fetch(url, {
            method: 'POST',
            body: params,
            headers: {
                'content-type': 'application/json'
            }
        });

        console.log('Telegram', 'sendMessage', 'result', result);
    }
}

'use strict';
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { Telegram } from './telegram'

/**
 * @param event APIGatewayEvent
 * @return Promise<APIGatewayProxyResult>
 */
export async function receiveMessage(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    if (event.body === null) {
        console.log('receiveMessage', 'Body is null!');

        return {
            body: '',
            statusCode: 500,
        };
    }

    const request = JSON.parse(event.body);
    console.log('receiveMessage', request);

    const chatId = request.message.chat.id;
    const username = request.message.chat.username;
    const message = `Hi ${username}, the chatId is <b>${chatId}</b>`;
    await Telegram.sendMessageOrFail(chatId, message);

    return {
        body: '',
        statusCode: 200,
    };
}

/**
 * @return Promise<APIGatewayProxyResult>
 */
export async function setWebhookEndpoint(): Promise<APIGatewayProxyResult> {
    await Telegram.setWebhookOrFail();

    return {
        body: 'Webhook has been set',
        statusCode: 200,
    };
}

/**
 * @param event APIGatewayEvent
 * @return Promise<APIGatewayProxyResult>
 */
export async function sendMessage(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    if (!event.pathParameters || !event.pathParameters.chatId) {
        return {
            body: 'Missing chatId in URL',
            statusCode: 400,
        };
    }

    const message = event.queryStringParameters ? (event.queryStringParameters.message || '') : '';
    const chatId = event.pathParameters.chatId;

    try {
        await Telegram.sendMessageOrFail(chatId, message);
    } catch (error) {
        return {
            body: `Message could not be sent (${error})`,
            statusCode: 500,
        };
    }

    return {
        body: `Message has been sent to chat with id '${chatId}'`,
        statusCode: 200,
    };
}

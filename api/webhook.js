// https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// Fixes an error with Promise cancellation
process.env.NTBA_FIX_319 = "test";

import TelegramBot from "node-telegram-bot-api"

// Export as an asynchronous function
// We'll wait until we've responded to the user
export default async (request, response) => {
  try {
    // Create our new bot handler with the token
    // that the Botfather gave us
    // Use an environment variable so we don't expose it in our code
    const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

    // Retrieve the POST request body that gets sent from Telegram
    const { body } = request;

    // Ensure that this is a message being sent
    if (body.message) {
      const {
        chat: { id },
        text,
        from:{first_name}
      } = body.message;

      const message = `✅ Thanks for your message: *"${text}"*\nHave a great day! 👋🏻${first_name}`;

      await bot.sendMessage(id, message, { parse_mode: "Markdown" });
    }
  } catch (error) {
    console.error("Error sending message");
    console.log(error.toString());
  }

  response.send("OK");
};


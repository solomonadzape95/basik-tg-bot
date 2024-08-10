// https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// Fix error with Promise cancellation
process.env.NTBA_FIX_319 = "test";

import TelegramBot from "node-telegram-bot-api"

export default async (request, response) => {
  try {

    const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

    // Retrieve the POST request body from Telegram
    const { body } = request;

    // Ensure its a message
    if (body.message) {
      const {
        chat: { id },
        text,
        from:{first_name}
      } = body.message;

      
      const message = text == '/help' ? `
Hey ${first_name}! Here's how I can help you:

🤔 What is Base - Learn about Base
🤝 Community - Join our vibrant community
🆘 Help - See this help message again

What would you like to know more about?
  `:`✅ Thanks for your message: *"${text}"*\nHave a great day! 👋🏻${first_name}`;

      await bot.sendMessage(id, message, { parse_mode: "Markdown" });
    }
  } catch (error) {
    console.error("Error sending message");
    console.log(error.toString());
  }

  response.send("OK");
};


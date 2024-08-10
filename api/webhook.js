// https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// Fix error with Promise cancellation
process.env.NTBA_FIX_319 = "test";

import TelegramBot from "node-telegram-bot-api"
import { helper } from "../handlers";

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

      
      const message = text == '/help' ? helper(first_name):`✅ Thanks for your message: *"${text}"*\nHave a great day! 👋🏻${first_name}`;

      await bot.sendMessage(id, message, { parse_mode: "Markdown" });
    }
  } catch (error) {
    console.error("Error sending message");
    console.log(error.toString());
  }

  response.send("OK");
};


// https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// Fix error with Promise cancellation
process.env.NTBA_FIX_319 = "test";

import TelegramBot from "node-telegram-bot-api";
const mainMenu = {
  reply_markup: {
    keyboard: [
      [
        { "text": "🤔 What is Base", "callback_data": "/docs" },
        { "text": "🤝 Community", "callback_data": "/community" },
      ],
      [{ "text": "🆘 Help", "callback_data": "/help" }],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  },
};
function returnMsgs (first_name){
  return {
    help: `
      Hey ${first_name}! Here's how I can help you:

      🤔 What is Base - Learn about Base
      🤝 Community - Join our vibrant community
      🆘 Help - See this help message again

      What would you like to know more about?
  `,
    start: `
    🚀 *Welcome, ${first_name}!* 🚀
    
    I'm Basik your Base Onboarding Assistant. Let's get you onchain!
    Use the menu below to explore what I can do for you.`,
    docs: `
🔵 *What is Base* 🔵

Base is a Layer 2 (L2) scaling solution for Ethereum, designed to improve transaction speed and reduce costs. It utilizes optimistic rollups to process transactions off the Ethereum mainnet while maintaining Ethereum's security and compatibility.

 *Key Features*

1. **Technology**: Optimistic Rollup chain
2. **Development**: Initially developed by Coinbase
3. **Purpose**: Faster and cheaper transactions while maintaining Ethereum compatibility
4. **Open-source**: Designed as a collaborative, open-source project
5. **Integration**: Closely integrated with Coinbase's products
6. **Ecosystem**: Supports various dApps and aims to foster a growing ecosystem
7. **Interoperability**: Designed to work well with other L2 solutions and the Ethereum ecosystem

${first_name}, here are some fantastic resources to get you started on Base:

🔗 [Official Site](https://base.org/)
   From zero to hero in no time!
   
🔗 [Documentation](https://docs.base.org/)
   Your go-to guide for all things Base

🔗 [API Reference](https://docs.alchemy.com/reference/base-api-quickstart)
   For when you're ready to build!

Happy learning! 🧠✨
  `,
    community: `
🌟 *Join Our Amazing Base Community, ${first_name}!* 🌟

Connect with fellow enthusiasts and get support:

🔹 [Twitter](https://x.com/baseafricaa?s=21)
   Stay updated with the latest news!

🔹 [Whatsapp](https://chat.whatsapp.com/BTuM7DtNZiIHmwf2T5txc8)
   Dive into discussions and tutorials!

🔹 [Discord](https://discord.gg/JNTUSasX)
   Real-time chats and instant help!
   
We can't wait to meet you! 🎉
  `,
    unknown: `
I'm sorry, but I didn't understand that input. 
Please use the custom keyboard or these commands:

/start - Open the main menu
/help - Open the help menu

  `
  };
}
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
        from: { first_name },
      } = body.message;
      const msgs = returnMsgs(first_name)
      let msg, stickerID;
      text =
        text === "🆘 Help"
          ? "/help"
          : text === "🤔 What is Base"
          ? "/docs"
          : text === "🤝 Community"
          ? "/community"
          : text;
      switch (text) {
        case "/start":
          msg = msgs.start;
          stickerID ="CAACAgIAAxkBAAEMnnRmtEcsy7ykO2WIFtpwBFJLr1EWIAACMTQAAugboErSr6fEZiaivDUE";
          break;
        case "/help" :
          msg = msgs.help;
          break;
          case '/docs':
            msg = msgs.docs;
            break;
            case '/community':
              msg = msgs.community;
              break;
        default:
          msg = text;
          break;
      }
      await bot.sendMessage(id, msg, {
        parse_mode: "Markdown",
        ...mainMenu,
      });
      if(stickerID !== '')await bot.sendSticker(id, stickerID);
      // const message = text == '/help' ? :`✅ Thanks for your message: *"${text}"*\nHave a great day! 👋🏻${first_name}`;

      // await bot.sendMessage(id, message, { parse_mode: "Markdown" ,...mainMenu});
    }
  } catch (error) {
    console.error("Error sending message");
    console.log(error.toString());
  }

  response.send("OK");
};

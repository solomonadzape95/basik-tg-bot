// Sorry for the clutter...
// just Compiled everything into one file
// i'll separate it later
// also i'll be adding some more features later
// https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// Fix error with Promise cancellation
process.env.NTBA_FIX_319 = "test";

import TelegramBot from "node-telegram-bot-api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import telegramifyMarkdown from 'telegramify-markdown'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const mainMenu = {
  reply_markup: {
    keyboard: [
      [{ text: "🤔 What is Base" }, { text: "🤝 Community" }],
      [{ text: "🆘 Help" }, { text: "❓ FAQ" }],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  },
};

function returnMsgs(first_name) {
  return {
    help: `Hey ${first_name}!
Here's how I can help you
  🤔 What is Base - Learn about Base
  🤝 Community - Join our vibrant community
  ❓ FAQ - Get answers to other users' most asked questions
  🆘 Help - See this help message again.

You can also ask me anything about Base or blockchain technology, and I'll do my best to help!

What would you like to know more about?
    `,
    faq: `Have some questions ${first_name} ?
    Which of these do you need answers to?
    P.S if you can't find your question below, you can type it out so I can answer it`,
    start: `🚀 Welcome, ${first_name}!🚀
    I'm Basik your Base Onboarding Assistant.
    Let's get you onchain!
    Use the menu below to explore what I can do for you.
    You can also ask me anything about Base or blockchain technology, and I'll do my best to help!`,
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
7. **Interaction**: Designed to work well with other L2 solutions and the Ethereum ecosystem

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
   Follow our Base community for updates, insights, and news.
   Join the scaling revolution!

🔹 [Whatsapp](https://chat.whatsapp.com/BTuM7DtNZiIHmwf2T5txc8)
   Join Base enthusiasts on WhatsApp!
   Connect and Discuss all things Base!!.

🔹 [Discord](https://discord.gg/JNTUSasX)
   Explore Base with us on Discord.
   From dev talks to exciting discussions, We've got it all.

We can't wait to meet you! 🎉
    `,
    unknown: `
I'm sorry, but I didn't understand that input.
Please use the custom keyboard or these commands:

/start - Open the main menu
/help - Open the help menu

    `,
  };
}
const userConversations = {};

async function getGeminiResponse(userId, userInput) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  if (!userConversations[userId]) {
    userConversations[userId] = [];
  }

  const chat = model.startChat({
    history: userConversations[userId],
  });
  let prompt =
    "You are Basik, a Telegram bot that helps people understand and use Base, a Layer 2 blockchain solution, and blockchain technology in general" +
    userInput;
  const result = await chat.sendMessage(prompt);
  const response = result.response.text();

  // Update conversation history
  userConversations[userId].push({
    role: "user",
    parts: [{ text: userInput }],
  });
  userConversations[userId].push({ role: "model", parts: response });

  // Limit history to last 20 messages
  if (userConversations[userId].length > 20) {
    userConversations[userId] = userConversations[userId].slice(-20);
  }

  return response;
}
export default async (request, response) => {
  try {
    const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

    const { body } = request;

    // Ensure its a message
    if (body.message) {
      let {
        chat: { id },
        text,
        from: { first_name, id: userId },
      } = body.message;
      const msgs = returnMsgs(String(first_name));
      let msg,
        stickerID = "";
      text =
        text === "🆘 Help"
          ? "/help"
          : text === "🤔 What is Base"
          ? "/docs"
          : text === "🤝 Community"
          ? "/community"
          : text === "❓ FAQ"
          ? "/faq"
          : text;
      await bot.sendChatAction(id, "typing");
      switch (text) {
        case "/start":
          msg = msgs.start;
          stickerID =
            "CAACAgIAAxkBAAEMnnRmtEcsy7ykO2WIFtpwBFJLr1EWIAACMTQAAugboErSr6fEZiaivDUE";
          break;
        case "/help":
          msg = msgs.help;
          break;
        case "/docs":
          msg = msgs.docs;
          break;
        case "/community":
          msg = msgs.community;
          break;
        case "/faq":
          msg = msgs.faq;
          break;
        default:
          await bot.sendChatAction(id, "typing");
          msg = await getGeminiResponse(userId, text);
          break;
      }
      const editedMsg = telegramifyMarkdown(msg);
      await bot.sendMessage(id, editedMsg, {
        parse_mode: "MarkdownV2",
        ...mainMenu,
      });
      if (stickerID !== "") await bot.sendSticker(id, stickerID);
    }
  } catch (error) {
    console.error("Error sending message");
    console.log(error.toString());
  }

  response.send("OK");
};

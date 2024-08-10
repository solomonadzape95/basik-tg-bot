import fs from "fs";
import path, { basename } from "path";

const mainMenu = {
  reply_markup: {
    keyboard: [
      [{text: "🤔 What is Base", value: '/docs'}, {text:"🤝 Community",value:'/community'}],
      [{text:"🆘 Help", value: '/help'}],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  },
};

export const handleStart = async (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name;
  const welcomeMessage = `
🚀 *Welcome, ${name}!* 🚀

I'm Basik your Base Onboarding Assistant. Let's get you onchain!
Use the menu below to explore what I can do for you.
  `;
  try {
   bot.sendMessage(chatId, welcomeMessage, {
      parse_mode: "Markdown",
      ...mainMenu,
    })
     const stickerId =
        "CAACAgIAAxkBAAEMnnRmtEcsy7ykO2WIFtpwBFJLr1EWIAACMTQAAugboErSr6fEZiaivDUE";
      bot.sendSticker(chatId, stickerId);
  } catch (error) {
    handleError(bot, chatId, error);
  }
}
export const helper = (name)=>{
return `
Hey ${name}! Here's how I can help you:

🤔 What is Base - Learn about Base
🤝 Community - Join our vibrant community
🆘 Help - See this help message again

What would you like to know more about?
  `;

}
export const handleHelp = async (name) => {
  const helpMessage = `
Hey ${name}! Here's how I can help you:

🤔 What is Base - Learn about Base
🤝 Community - Join our vibrant community
🆘 Help - See this help message again

What would you like to know more about?
  `;
   const stickerId =
      "CAACAgIAAxkBAAEMnoRmtFLleC3c62dM5fdDpNFGPUDKLQAC5zUAAraMQUtiZhcFq2C8BjUE";
  return {msg: helpMessage, sID: stickerId}
//   try{
//      bot.sendMessage(chatId, helpMessage, { parse_mode: "Markdown", ...mainMenu });
    
//      bot.sendSticker(chatId, stickerId);
//   }catch(error){
//     handleError(bot, chatId, error);
// }
};

export const handleDocs = (bot) => (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name;
  const docsMessage = `
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

${name}, here are some fantastic resources to get you started on Base:

🔗 [Official Site](https://base.org/)
   From zero to hero in no time!
   
🔗 [Documentation](https://docs.base.org/)
   Your go-to guide for all things Base

🔗 [API Reference](https://docs.alchemy.com/reference/base-api-quickstart)
   For when you're ready to build!

Happy learning! 🧠✨
  `;

  try {
     bot.sendMessage(chatId, docsMessage, {
      parse_mode: "Markdown",
      ...mainMenu,
    });
    //     const stickerId =
    //   "CAACAgIAAxkBAAEMnoJmtFK-YgAB8HWFjBBInRf1llkVFXoAAsM9AALMEylKhQ_NmhqKA0Y1BA";
    // await bot.sendSticker(chatId, stickerId);
  } 
    // const imagePath = path.join(process.cwd(), "assets", "base.jpg");
    // await bot.sendPhoto(chatId, imagePath, {
    //   caption: "Base Network",
    // });
    catch (error) {
    handleError(bot, chatId, error);
  }
};

export const handleCommunity = (bot) => (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name;
  const communityMessage = `
🌟 *Join Our Amazing Base Community, ${name}!* 🌟

Connect with fellow enthusiasts and get support:

🔹 [Twitter](https://x.com/baseafricaa?s=21)
   Stay updated with the latest news!

🔹 [Whatsapp](https://chat.whatsapp.com/BTuM7DtNZiIHmwf2T5txc8)
   Dive into discussions and tutorials!

🔹 [Discord](https://discord.gg/JNTUSasX)
   Real-time chats and instant help!
   
We can't wait to meet you! 🎉
  `;

  try {
    bot.sendMessage(chatId, communityMessage, {
      parse_mode: "Markdown",
      ...mainMenu,
    });

    // const imagePath = path.join(process.cwd(), "assets", "images.jpg");
    // await bot.sendPhoto(chatId, imagePath, {
    //   caption: "Our vibrant community awaits you!",
    // });


    // const stickerId =
    //   "CAACAgIAAxkBAAEMnnZmtEf3kWWENhEZrR9EIn36Vi-B2AACEjUAAsenoUqpHiuzlnPN-jUE";
    // bot.sendSticker(chatId, stickerId);
  } catch (error) {
    handleError(bot, chatId, error);
  }
};

export const handleUnrecognized = (bot) => (msg) => {
  const chatId = msg.chat.id;
  if (msg.text &&
    (msg.text.startsWith("/") ||
      [
        "🤔 What is Base",
        "🤝 Community",
        "🆘 Help",
      ].includes(msg.text))
  ) return
  const unrecognizedMessage = `
I'm sorry, but I didn't understand that input. 
Please use the custom keyboard or these commands:

/start - Open the main menu
/help - Open the help menu

  `;

  try{
   bot.sendMessage(chatId, unrecognizedMessage, { ...mainMenu });
  //    const stickerId =
  //     "CAACAgIAAxkBAAEMnoZmtFPq6jKR0wSKZ8lAMryV2u4m-QAC1DAAApkwoUoENX02s8n9lTUE";
  //  bot.sendSticker(chatId, stickerId);
}
    catch(error){ handleError(bot, chatId, error)};
};

export const handleError = (bot, chatId, error) => {
  console.error("Error:", error);
  bot
    .sendMessage(
      chatId,
      "I'm sorry, but I encountered an error. Please try again later or contact support.",
      { ...mainMenu }
    )
    .catch(console.error);
};

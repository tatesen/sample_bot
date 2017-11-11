const Botkit = require('botkit');

const controller = Botkit.slackbot({
    debug: true
});

controller.spawn({
    // BotのAPI Tokenを指定する
    token: process.env.SLACK_TOKEN
}).startRTM(function (err) {
    console.log(process.env.SLACK_TOKEN);
    if (err) {
        throw new Error(err);
    }
});

// 定型句にランダムに回答
controller.hears(['こんにちは', '今日は'], ['direct_message', 'direct_mention', 'mention'], function (bot, message) {
    const replyMessages = ['こんにちは!', '今日もよろしくお願いします', 'どうも'];
    const replyMessage = replyMessages[Math.floor(Math.random() * replyMessages.length)];
    bot.reply(message, replyMessage);
});

// 正規表現で複数の言い回しに対応
controller.hears(['^(犬|猫)が好き'], ['direct_message', 'direct_mention', 'mention'], function (bot, message) {
    const animal = message.match[1];
    const replyMessage = `${animal}が好きですか、私は牛を2頭飼っています`
    bot.reply(message, replyMessage);
});

// Conversationオブジェクトを用いた会話
controller.hears(['雑談'], ['direct_message', 'direct_mention', 'mention'], function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        if (!err) {
            convo.ask('何について話しましょうか `人工知能` `音楽` `未来`', [{
                pattern: '人工知能',
                callback: function (response, convo) {
                    convo.say('私は人工知能ではありません');
                    convo.next();
                }
            },
            {
                pattern: '音楽',
                callback: function (response, convo) {
                    convo.say('それについてはスマートスピーカーに聞いてください');
                    convo.next();
                }
            },
            {
                pattern: '未来',
                callback: function (response, convo) {
                    convo.say('来年の事を言えば鬼が笑う、と言います');
                    convo.next();
                }
            },
            ]);
        }
    });
});

// ユーザー名とアイコン画像の切り替え
controller.hears(['止まれ'], ['direct_message', 'direct_mention', 'mention'], function (bot, message) {
    const replyMessage = {
        text: 'こうですか',
        username: '標識',
        icon_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Japan_road_sign_330.svg/273px-Japan_road_sign_330.svg.png'
    };
    bot.reply(message, replyMessage);
});

// デフォルトの応答
controller.on(['direct_message', 'direct_mention', 'mention'], function (bot, message) {
    bot.reply(message, '何か言った?');
});
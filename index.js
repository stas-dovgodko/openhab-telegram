const {rules, items, triggers, actions, osgi} = require('openhab');

class Telegram {
    constructor(thingUid)
    {
        this.actions = actions.thingActions("telegram", thingUid);
        this.asks = [];
        this.commands = {};

        rules.JSRule({
            name: 'Telegram ask internal handler',
            description: "",
            triggers: [
                triggers.ChannelEventTrigger(thingUid + ":callbackEvent")
            ],
            execute: e => {
                const data = JSON.parse(e.receivedTrigger);
                let ask_id = parseInt(data.reply_id, 10);
                if(typeof this.asks[ask_id][data.text] !== 'undefined') {
                    let callback = this.asks[ask_id][data.text];

                    if (typeof callback === 'function') {
                        const answer = callback(this);
                        // ack
                        this.actions.sendTelegramAnswer(ask_id.toString(), (typeof answer === 'string') ? answer : null)
                    }
                }
            }
        });

        rules.JSRule({
            name: 'Telegram commands handler',
            description: "",
            triggers: [
                triggers.ChannelEventTrigger(thingUid + ":messageEvent")
            ],
            execute: e => {

                const data = JSON.parse(e.receivedTrigger);
                if(typeof this.commands[data.text] !== 'undefined') {
                    let callback = this.commands[data.text];

                    if (typeof callback === 'function') {
                        const answer = callback(this);
                        if (typeof answer === 'string') {
                            this.message(answer);
                        }
                    }
                }
            }
        });
    }

    onCommand(command, callback)
    {
        this.commands['/' + command] = callback;

        return this;
    }

    message(message, ...args)
    {
        this.actions.sendTelegram(message, ...args);

        return this;
    }

    alert(message, ...args)
    {
        return this.message('❗' + message, ...args);
    }

    image(url, caption)
    {
        this.actions.sendTelegramPhoto(url, caption);

        return this;
    }


    ask(message, callback) {

        let idx = this.asks.push(callback) - 1;

        const buttons = [];

        for (const button in callback) {
            buttons.push(button);
        }

        this.actions.sendTelegramQuery('❓' + message, idx.toString(), ...buttons)

        return this;
    }
}

exports.bot = (thingUid) => {
    return new Telegram(thingUid);
}

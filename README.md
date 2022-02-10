# openhab-telegram

# Usage examples

```js
const telegram = require('openhab-telegram');


const bot = telegram.bot("telegram:telegramBot:uuid");

bot
.onCommand('info', function(t) {
    return '/test Test command';
})
.onCommand('test', function(t) {
    return 'Say something';
});

```


```js
const telegram = require('openhab-telegram');


const bot = telegram.bot("telegram:telegramBot:uuid");

bot
.ask('Are you sure?', {
    'No': function(b) {
        return true;
    },
    'Yes': function(b) {
        b.ask('Please, confirm', {
            'Yes!': function(b) {
                return 'ГУД!';
            },
            'No!': function(b) {
                return 'Не кіпішуй';
            },
            'Help': function(b) {
                b.message('Something about');
                return true;
            }
        });


        return true;
    }
});

```

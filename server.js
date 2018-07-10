var inquirer = require('inquirer');

var enermy = require('./enermy');
// 我的牌库
var card = require('./card');
// 我的手牌
var myCard = [];
// 我的随从
var myGuide = [];

// 我和对方的气血
var myBlood=15, enermyBlood=15;

// 总费用&当前费用
var maxMoney = 0, nowMoney = 0;
// 当前轮数
var round = 0;

// 绘制当前地图
function showMap() {
    let longStr = '';
    console.log('敌方随从：');
    enermy.forEach((item, index) => {
        longStr += `随从${index+1}【${item.attack},${item.blood}】   `
    })
    console.log(longStr);
    console.log('\n我方随从：');
    longStr = '';
    myGuide.forEach((item, index) => {
        longStr += `随从${index+1}【${item.attack},${item.blood}】   `
    })
    console.log(longStr);
    console.log('\n我方卡牌：');
    longStr = '';
    myCard.forEach((item, index) => {
        longStr += `随从${index+1}【${item.attack},${item.blood}】   `
    })
    console.log(longStr);
    console.log(`\n当前费用：${nowMoney}  我方气血：${myBlood}  敌方气血：${enermyBlood}`);
}

// 下一轮
function next() {
    round++;
    if(card.length==0) {
        myBlood --;
    }else {
        let thisRoundCard = card.shift();
        myCard.push(thisRoundCard);
    }
    nowMoney = maxMoney = round<10? round: 10;
    myGuide.forEach((item)=>{item.active = true});
    showMap();
}

// 使用随从
function useCard(index){
    if(nowMoney>0){
        if(index>0&&index<=myCard.length) {
            let guide = myCard[index-1];
            myCard.splice(index-1,1);
            myGuide.push(guide);
            nowMoney--;
        }else {
            console.log("错误的卡牌数字");
        }
    }else {
        console.log("费用不足");
    }
    showMap();
}

// 攻击效果
function attack(from, to) {
    // 攻击对象判断
    if(to>enermy.length || to<=0) {
        console.log('无效攻击对象。');
        showMap();
        return;
    }
    // 操作对象判断
    if(from<0 || from>myGuide.length) {
        console.log('无效操作对象。');
        showMap();
        return;
    }

    let toGuide = enermy[to-1];
    // 自己攻击
    if(from === 0 ) {
        if(nowMoney>=2) {
            toGuide.blood--;
            nowMoney -=2;
            checkMap();
            showMap();
            return;
        }else {
            console.log('费用不足。');
            showMap();
            return;
        }
    }
    // 随从攻击
    if(from !== 0) {
        let fromGuide = myGuide[from-1];
        toGuide.blood -= fromGuide.attack;
        fromGuide.blood -= toGuide.attack;
        fromGuide.active = false;
        checkMap();
        showMap();
        return;
    }
}

// 检测是否有随从阵亡
function checkMap(){
    let tempGuide = [];
    enermy.forEach((item)=>{
        if(item.blood>0) {
            tempGuide.push(item);
        }
    })
    enermy = JSON.parse(JSON.stringify(tempGuide));
    tempGuide = [];
    myGuide.forEach((item)=>{
        if(item.blood>0) {
            tempGuide.push(item);
        }
    })
    myGuide = JSON.parse(JSON.stringify(tempGuide));
    if(enermyBlood <= 0) {
        console.log("敌人已被消灭。")
    }
}

// 命令执行基本单元
var promps = [{
    type: 'input',
    name: 'command',
    message: '请输入您要执行的操作'
}];


function commandCB(answer) {

    let answerList = answer.split(' ');

    switch(answerList[0]){
        case 'exit':
            return {};
            break;
        case 'use':
            let index = parseFloat(answerList[1]);
            useCard(index);
            break;
        case 'attack':
            let from = parseFloat(answerList[1]);
            let to = parseFloat(answerList[2]);
            attack(from, to);
            break;
        case 'showMap':
            showMap();
            break;
        case 'next':
            next();
            break;
        default:
            console.log('不合法信息');
            break;
    }
    run();
}

function run() {
    inquirer.prompt(promps).then(function (answers) {
        commandCB(answers.command);
    })
}

run();



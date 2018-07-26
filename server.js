var inquirer = require('inquirer');
var colors = require( "colors")

var defaultEnermy = require('./enermy');
// 我的牌库
var card = require('./card');
// 我的手牌
var myCard = [];
// 我的随从
var myGuide = [];
// 对方随从
var enermy = [];
var myBlood, enermyBlood, maxMoney, nowMoney, round;

var gameStatus = false;

// 第一版初始化部分
function init() {
    enermy = JSON.parse(JSON.stringify(defaultEnermy));
    // 将英雄作为id为0的随从
    enermy.unshift({
        attack: 0,
        blood: 5
    })
    myGuide.unshift({
        attack: 0,
        blood: 15
    })

    // 我和对方的气血
    myBlood=myGuide[0].blood;
    enermyBlood=enermy[0].blood;

    // 总费用&当前费用
    maxMoney = 0; nowMoney = 0;
    // 当前轮数
    round = 0;
    gameStatus = true;
}

// 绘制当前地图
function showMap() {
    let longStr = '';
    console.log('敌方随从：'.rainbow);
    enermy.forEach((item, index) => {
        if(index>0) {
            let tempGuide = `随从${index+1}【${item.attack},${item.blood}】`
            if(item.active) {
                tempGuide = colors.green(tempGuide);
            }
            if(item.taunt) {
                tempGuide = colors.bgWhite(tempGuide);
            }
            longStr += tempGuide + '   '
        }
    })
    console.log(longStr.red);
    console.log('\n我方随从：'.rainbow);
    longStr = '';
    myGuide.forEach((item, index) => {
        if(index>0) {
            let tempGuide = `随从${index+1}【${item.attack},${item.blood}】`
            if(item.active) {
                tempGuide = colors.green(tempGuide);
            }
            if(item.taunt) {
                tempGuide = colors.bgWhite(tempGuide);
            }
            longStr += tempGuide + '   '
        }
    })
    console.log(longStr);
    console.log('\n我方卡牌：'.rainbow);
    longStr = '';
    myCard.forEach((item, index) => {
        let tempGuide = `随从${index+1}【${item.attack},${item.blood}】`
        if(item.charge) {
            tempGuide = colors.green(tempGuide);
        }
        if(item.taunt) {
            tempGuide = colors.bgWhite(tempGuide);
        }
        longStr += tempGuide + '   '
    })
    console.log(longStr);
    console.log(`\n当前费用：${nowMoney}  我方气血：${myGuide[0].blood}  敌方气血：${enermy[0].blood}`);
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
            let guide = JSON.parse(JSON.stringify(myCard[index-1]));
            myCard.splice(index-1,1);
            guide.active = guide.charge? true: false;
            myGuide.push(guide);
            nowMoney--;
        }else {
            error("错误的卡牌数字");
            return;
        }
    }else {
        error("费用不足");
        return;
    }
    showMap();
}

// 检测游戏有效性
function checkGame() {
    if(!gameStatus) {
        error("游戏尚未开启！请键入start开始游戏");
        return;
    }
    return gameStatus;
}

// 检测嘲讽效果
function checkTaunt(guides, to) {
    let flag = false;
    guides.forEach((item)=>{
        if(item.taunt) {
            flag = true;
        }
    })
    return !flag || guides[to].taunt;
}

// 检测攻击状态
function checkState(guide) {
    return guide.active;
}

// 攻击效果
function attack(from, to) {
    // 攻击对象判断
    if(to>enermy.length || to<0) {
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

    let toGuide = enermy[to];
    // 自己攻击
    if(from === 0 ) {
        if(nowMoney>=2) {
            toGuide.blood--;
            nowMoney -=2;
            checkMap();
            showMap();
            return;
        }else {
            console.log('当前费用不足。人物技能需要2费用');
            showMap();
            return;
        }
    }
    // 随从攻击
    if(from !== 0) {
        let fromGuide = myGuide[from];
        if(!checkState(fromGuide)){
            error("该随从目前无法攻击！");
            return;
        }
        if(!checkTaunt(enermy, to)) {
            error("请先攻击带有嘲讽的随从！");
            return;
        }
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
    if(enermy[0].blood<=0 || myGuide[0].blood<=0){
        console.log('游戏已结束。'.rainbow);
        gameStatus = false;
        return;
        // TODO 游戏结束
    }
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

// colors定义错误颜色
colors.setTheme({
    error: 'red'
});

function error(text) {
    console.log(`#错误提示#:${text}\n`.red.underline);
    showMap();
}
function tips(text) {
    console.log(`#错误提示#:${text}\n`.green.underline);
}

function commandCB(answer) {

    let answerList = answer.split(' ');

    switch(answerList[0]){
        case 'exit':
            return {};
            break;
        case 'start':
            init();
            break;
        case 'use':
            if(checkGame()){
                let index = parseFloat(answerList[1]);
                useCard(index);
            }
            break;
        case 'attack':
            if(checkGame()){
                let from = parseFloat(answerList[1]);
                let to = parseFloat(answerList[2]);
                attack(from, to);
            }
            break;
        case 'showMap':
            if(checkGame()){
                showMap();
            }
            break;
        case 'next':
            if(checkGame()){
                next();
            }
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



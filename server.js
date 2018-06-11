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
        let thisRoundCard = card.unshift();
        myCard.push(thisRoundCard);
    }
    nowMoney = maxMoney = round<10? round: 10;
    myGuide.forEach((item)=>{item.active = true});
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
    if(from<0 || from>myGuide.length || myGuide[from-1]) {
        console.log('无效操作对象。');
        showMap();
        return;
    }

    let toGuide = enermy[to-1];
    // 自己攻击
    if(from === 0 && nowMoney>=2) {
        toGuide.blood--;
        checkMap();
        showMap();
        return;
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




const lifeCycle = [
    {
        name: 'drawCard',
        action: []
    },{
        name: 'roundBegin',
        action: []
    },{
        name: 'roundEnd',
        action: []
    },{
        name: 'useCard',
        action: []
    },{
        name: 'dropCard',
        action: []
    },{
        name: 'addSuite',
        action: []
    },{
        name: 'deadSuite',
        action: []
    },{
        name: 'treatSuite',
        action: []
    },{
        name: 'damageSuite',
        action: []
    },{
        name: 'everyCount',
        action: []
    },
]

const mySuite = [];

const commonSuite = {
    a: 7,
    b: 7
}

var enermySuite = [];

// 基础随从
class Suite {
    // 基本属性
    constructor(a,b) {
        this.a = a;
        this.b = b;
        this.deadLanguage = [];
        this.firstAction = [];
    }

    // 受到攻击
    underAttack(a) {
        if(this.a > a) {
            this.a -= a;
        }else {
            // TODO 死亡，触发亡语
            this.callDeadLanguage();
        }
    }

    // 触发亡语
    callDeadLanguage() {
        this.deadLanguage.forEach((cb)=> {
            cb();
        })
    }

    // 出发战吼
    callFirstAction() {
        this.firstAction.forEach((cb)=> {
            cb();
        })
    }
}

// 高级随从
// 亡语：对所有随从造成1点攻击
class primaryStudent extends Suite {
    constructor(a,b){
        super(a,b);
    }
}


// 敌方随从定义
for(var i=0;i<7;i++){
    enermySuite.push(new Suite(7,7));
}

console.log(enermySuite);
var inquirer = require('inquirer');

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

var nowSuite = [];

// 基础随从
class Suite {
    // 基本属性
    constructor(a,b) {
        this.a = a;
        this.b = b;
        // this.deadLanguage = [];
        // this.firstAction = [];
    }

    // 受到攻击
    underAttack(a) {
        if(this.a > a) {
            this.a -= a;
        }else {
            // TODO 死亡，触发亡语
            // this.callDeadLanguage();
        }
    }

    // 触发亡语
    // callDeadLanguage() {
    //     this.deadLanguage.forEach((cb)=> {
    //         cb();
    //     })
    // }

    // 出发战吼
    // callFirstAction() {
    //     this.firstAction.forEach((cb)=> {
    //         cb();
    //     })
    // }
}

// 高级随从
// 亡语：对所有随从造成1点攻击
class primarySuite extends Suite {
    constructor(a,b,fa=null, dl=null){
        super(a,b);
        this.deadLanguage = [];
        this.firstAction = [];

        if(fa) {
            this.firstAction.push(fa);
        };
        if(dl) {
            this.deadLanguage.push(dl);
        }
    }

    // 收到攻击
    underAttack(a) {
        super.underAttack();
        if(this.a<=a) {
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


// 敌方随从定义
for(var i=0;i<6;i++){
    enermySuite.push(new Suite(7,7));
}

// enermySuite.push(new primarySuite(1,1,function(){
//     console.log("hello");
// }))

// console.log(enermySuite);

// console.log(inquirer);

var promps = [{
    type: 'input',
    name: 'command',
    message: '请输入模块描述'
}];

function callback(answer) {
    if(answer.command == 'exit') {
        return {}
    }else {
        test();
    }
}

function test() {
    inquirer.prompt(promps).then(function (answers) {
        callback(answers);
    })
}

test();

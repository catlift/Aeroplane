const {ccclass, property} = cc._decorator;

import Global from "../Global"

@ccclass
export default class NewClass extends cc.Component {
	
	@property({
		tooltip: "Global, playerData",
		type: Global
	})
	public Global: Global = null;
	
	@property({
		tooltip: "goldLabel",
		type: cc.Label
	})
	goldLabel: cc.Label = null;
	
	@property({
		tooltip: "gradeLabel",
		type: cc.Label
	})
	gradeLabel: cc.Label = null;
	
	@property({
		tooltip: "scoreLabel",
		type: cc.Label
	})
	scoreLabel: cc.Label = null;
	
	@property({
		tooltip: "hpLabel",
		type: cc.Label
	})
	hpLabel: cc.Label = null;
	
	@property({
		tooltip: "shieldLabel",
		type: cc.Label
	})
	shieldLabel: cc.Label = null;
	
	@property({
		tooltip: "attackLabel",
		type: cc.Label
	})
	attackLabel: cc.Label = null;
	
	@property({
		tooltip: "buffTimeLabel",
		type: cc.Label
	})
	buffTimeLabel: cc.Label = null;
	
	@property({
		tooltip: "gold"
	})
	_gold: Number = 0;
	// @property
	get gold() {
		return this._gold;
	}
	set gold(value) {
		if(value <= 0){
			value = 0;
		}
		this._gold = value;
		this.goldLabel.string = this._gold;
	}
	
	@property({
		tooltip: "grade"
	})
	_grade: Number = 0;
	// @property
	get grade() {
		return this._grade;
	}
	set grade(value) {
		if(value <= 0) {
			value = 0;
		}
		this._grade = value + 1;
		this.gradeLabel.string = this._grade;
	}
	
	@property({
		tooltip: "Score"
	})
	_score: Number = 0;
	// @property
	get score() {
		return this._score;
	}
	set score(value) {
		if(value <= 0){
			value = 0;
		}
		this._score = value;
		this.scoreLabel.string = this._score;
	}
	
	@property({
		tooltip: "hp"
	})
	_hp: Number = 10;
	// @property
	get hp() {
		return this._hp;
	}
	set hp(value) {
		if(value <= 10){
			value = 10;
		}
		this._hp = value;
		this.hpLabel.string = this._hp;
	}
	
	@property({
		tooltip: "shield"
	})
	_shield: Number = 5;
	// @property
	get shield() {
		return this._shield;
	}
	set shield(value) {
		if(value <= 5){
			value = 5;
		}
		this._shield = value;
		this.shieldLabel.string = this.shield;
	}
	
	@property({
		tooltip: "attack"
	})
	_attack: Number = 1;
	// @property
	get attack() {
		return this._attack;
	}
	set attack(value) {
		if(value <= 1){
			value = 1;
		}
		this._attack = value;
		this.attackLabel.string = this._attack;
	}
	
	@property({
		tooltip: "buffTime"
	})
	_buffTime: Number = 5;
	// @property
	get buffTime() {
		return this._buffTime;
	}
	set buffTime(value) {
		if(value <= 5){
			value = 5;
		}
		this._buffTime = value;
		this.buffTimeLabel.string = this._buffTime;
	}
	
	@property({
		tooltip: "upgradeGoldLabel",
		type: cc.Label
	})
	upgradeGoldLabel: cc.Label = null;
	
	@property({
		tooltip: "upgrade Gold"
	})
	_upgradeGold: Number = 100;
	get upgradeGold() {
		return this._upgradeGold;
	}
	set upgradeGold(value){
		value = -value;
		this._upgradeGold = value;
		this.upgradeGoldLabel.string = this._upgradeGold;
	}
	
	@property({
		tooltip: "Upgrade",
		type: cc.Node
	})
	UpgradeNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		cc.director.preloadScene("GameScene", function () {
		    cc.log("game scene preloaded");
		});
		cc.director.preloadScene("HomeScene", function () {
		    cc.log("this scene preloaded");
		});
	}

    start () {
		// 首先，因为可以跨脚本/场景，所以传递倒不难，不过，为了避免每次打开都是从零开始，可以利用本地存储
		// newGold、maxScore、maxHp、maxShield、maxAttack、buffTime
		this.initData();
		this.onTouch();
    }

    // update (dt) {}
	
	initData() {
		let grade = cc.sys.localStorage.getItem("grade");
		if(grade) {
			this.Global.Grade = grade;
			this.grade = grade;
		}else {
			cc.sys.localStorage.setItem("grade", 0);
			this.grade = this.Global.Grade;
		}
		
		let maxScore = cc.sys.localStorage.getItem("maxScore");
		if(maxScore) {
			this.Global.maxScore = maxScore;
			this.score = maxScore;
		}else {
			this.score = this.Global.maxScore;
		}
		
		let newGold = cc.sys.localStorage.getItem("newGold");
		if(newGold) {
			this.Global.newGold = newGold;
			this.gold = newGold;
		}else {
			cc.sys.localStorage.setItem("newGold", 0);
			this.gold = this.Global.newGold;
		}
		
		this.updateData();
	}
	
	updateData() {
		this.grade = this.Global.Grade;
		this.hp = this.Global.maxHp;
		this.shield = this.Global.maxShield;
		this.attack = this.Global.maxAttack;
		this.buffTime = this.Global.buffTime;
		if(this.Global.Grade >= 10) {
			this.upgradeGoldLabel.string = "Max";
		}else {
			this.upgradeGold = this.Global.upgradeGold;
		}
	}
	
	onTouch() {
		this.UpgradeNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
	}
	
	onTouchStart() {
		let grade = cc.sys.localStorage.getItem("grade");
		let newGold = cc.sys.localStorage.getItem("newGold");
		// cc.log(this.gold);
		if(newGold >= this.Global.upgradeGold) {
			newGold -= this.Global.upgradeGold;
			this.gold = newGold;
			this.Global.Grade += 1;
			cc.sys.localStorage.setItem("grade", this.Global.Grade);
			cc.sys.localStorage.setItem("newGold", newGold);
			this.updateData();
		}else {
			this.UpgradeNode.getComponent(cc.Animation).play("move");
		}
	}
	
	onDestroy() {
		this.UpgradeNode.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
	}
}

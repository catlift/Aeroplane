// 这个脚本存一些数据，随便放在 Canvas 的子节点上，记得拖拽这个子节点到 Canvas 脚本上的 Global 就可以

const {ccclass, property} = cc._decorator;

@ccclass
export default class Global extends cc.Component {
	
	@property({
		tooltip: "Grade"
	})
	_Grade: Number = 0;
	get Grade() {
		if(this._Grade >= 10) {
			this._Grade = 10;
		}
		return this._Grade;
	}
	set Grade(value) {
		if(value <= 0) {
			value = 0;
		}
		this._Grade = value;
	}

	@property({
		tooltip: "Hp"
	})
	_maxHp: Number = 10;
	get maxHp() {
		let maxHp = this._maxHp + (this._maxHp * this.Grade)/10;
		return maxHp;
	}
	set maxHp(value) {
		this._maxHp = value;
	}
	
	@property({
		tooltip: "Shield"
	})
	_maxShield: Number = 5;
	get maxShield() {
		let maxShield = this._maxShield + (this._maxShield * this.Grade)/10;
		return maxShield;
	}
	set maxShield(value) {
		this._maxShield = value;
	}
	
	@property({
		tooltip: "Attack"
	})
	_maxAttack: cc.Float = 1;
	get maxAttack() {
		let maxAttack = this._maxAttack + (this._maxAttack * this.Grade)/2;
		return maxAttack;
	}
	set maxAttack(value) {
		this._maxAttack = value;
	}
	
	@property({
		tooltip: "bufftime"
	})
	_buffTime: cc.Float = 5;
	get buffTime() {
		let buffTime = this._buffTime + (this._buffTime * this.Grade)/10;
		return buffTime;
	}
	set buffTime(value) {
		this._buffTime = value;
	}
	
	@property({
		tooltip: "Upgrade Gold"
	})
	_upgradeGold: Number = 100;
	get upgradeGold() {
		let upgradeGold = this._upgradeGold + this.Grade * this._upgradeGold;
		return upgradeGold;
	}
	
	@property({
		tooltip: "maxScore"
	})
	maxScore: Number = 0;
	
	@property({
		tooltip: "nowScore"
	})
	nowScore: Number = 0
	
	@property({
		tooltip: "newGold"
	})
	newGold: Number = 0;
	
	@property({
		tooltip: "nowGold"
	})
	nowGold: Number = 0;
	

    // LIFE-CYCLE CALLBACKS:
	
}

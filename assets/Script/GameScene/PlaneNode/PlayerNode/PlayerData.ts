const {ccclass, property} = cc._decorator;

import Plane from "../Plane"

import Global from "../../../Global"

@ccclass
export default class PlayerData extends Plane {

	@property({
		tooltip: "Hp",
		type: cc.ProgressBar
	})
	HpPro: cc.ProgressBar = null;
	
	@property({
		tooltip: "shield",
		type: cc.ProgressBar
	})
	ShieldPro: cc.ProgressBar = null;
	
	@property({
		tooltip: "score label",
		type: cc.Label
	})
	ScoreLabel: cc.Label = null;
	
	@property({
		tooltip: "score"
	})
	_score: Number = 0;
	// Score 
	@property
	get Score() {
		return this._score;
	}
	set Score(value) {
		if(value < 0) {
			value = 0;
		}
		this._score = value;
		this.ScoreLabel.string = "Score: " + this._score;
	}
	
	// extends plane 的 _Hp
	@property
	get Hp() {
		return this._Hp;
	}
	set Hp(value) {
		if(value < 0) {
			value = 0;
		}
		this._Hp = value;
		// 同步改变 Hp 的 ProgressBar
		this.HpPro.progress = this._Hp / this._maxHp;
	}
	
	// extends plane 的 _Shield
	@property
	get Shield() {
		return this._Shield;
	}
	set Shield(value) {
		if(value < 0) {
			value = 0;
		}
		this._Shield = value;
		// 同步改变 Shield 的 ProgressBar
		this.ShieldPro.progress = this._Shield / this._maxShield;
	}
	
	// extends plane 的 _Attack，后续可能有提升攻击力什么的
	@property
	get Attack() {
		return this._Attack;
	}
	set Attack(value) {
		if(value <= 1) {
			value = 1;
		}
		this._Attack = value;
	}
	
	@property({
		tooltip: "goldLabel",
		type: cc.Label
	})
	goldLabel: cc.Label = null;
	
	@property({
		tooltip: "gold"
	})
	_gold: Number = null;
	
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
		tooltip: "attack buff"
	})
	attackBuff: boolean = false;
	
	@property({
		tooltip: "buff time"
	})
	buffTime: cc.Float = 5;
	
	@property({
		tooltip: "Global, playerData",
		type: Global
	})
	public Global: Global = null;
	
	@property({
		type: cc.Node,
		tooltip: "game over"
	})
	GameOverNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		this.GameOverNode.active = false;
		this.initBullet();
		this.initProgressBar();
	}

    start () {
		
    }

    // update (dt) {}
	
	// 子弹初始化
	initBullet() {
		let bulletFire = this.node.getComponents("BulletFire");
		// cc.log(bulletFire[0].bulletPre.name);
		for(let i = 0; i < bulletFire.length; i++) {
			if(bulletFire[i].bulletPre.name == "Bullet1") {
				bulletFire[i].enabled = false;
			}
		}
	}
	
	// 初始化一下数据和 progress
	initProgressBar() {
		let self = this;
		// gold 和 score 刚开始一定要为零
		this.gold = 0;
		this.Score = 0;
		// 拿到 Global 的 值
		let grade = cc.sys.localStorage.getItem("grade");
		if(grade) {
			this.Global.Grade = grade;
		}
		this.Hp = this.Global.maxHp;
		this.Attack = this.Global.maxAttack;
		this.Shield = this.Global.maxShield;
		this.buffTime = this.Global.buffTime;
		
		// 定义最大值
		this._maxHp = this.Hp;
		this._maxShield = this.Shield;
		// 填充 progress，有 Global 的情况可以不用写
		this.HpPro.progress = this.Hp / this._maxHp;
		this.ShieldPro.progress = this.Shield / this._maxShield;
	}
	
	// 因为同挂载在 PlayerNode 上。所以在 BulletFire.ts 里写也一样
	onCollisionEnter(other, self) {
		if(other.node.group == "enemy") {
			if(this.Shield > 0) {
				this.Shield -= 2;
			}else {
				if(this.Hp > 0) {
					this.Hp -= 2;
					if(this.Hp <= 0){
						// 隐藏player
						this.node.active = false;
						// 显示结算
						this.GameOverNode.active = true;
						// 本地存储
						this.onLocalStorage();
					}
				}
			}
		}
		if(other.node.group == "enemy-bullet") {
			if(this.Shield > 0) {
				this.Shield -= other.node.Attack;
			}else {
				if(this.Hp > 0) {
					this.Hp -= other.node.Attack;
					if(this.Hp <= 0){
						// 隐藏player
						this.node.active = false;
						// 显示结算
						this.GameOverNode.active = true;
						// 本地存储
						this.onLocalStorage();
					}
				}
			}
		}
		if(other.node.group == "gold") {
			this.gold += 1;
		}
		if(other.node.group == "hp") {
			// cc.log(this.Hp);
			// cc.log(this._maxHp);
			if(this.Hp < this._maxHp) {
				this.Hp += 1;
			}else if(this.Shield < this._maxShield) {
				this.Shield += 1;
			}else {
				this.Score += 1;
				this.gold += 1;
			}
		}
		if(other.node.group == "attack") {
			if(this.attackBuff) {
				return;
			}
			let _t = this;
			this.attackBuff = true;
			// 增加新武器
			let buffBullet = self.node.getComponents("BulletFire");
			// cc.log(bulletFire[0].bulletPre.name);
			buffBullet.forEach(bullet => {
				if(bullet.bulletPre.name == "Bullet1") {
					bullet.enabled = true;
				}else {
					bullet.enabled = false;
				}
			});
			this.scheduleOnce(function(){
				_t.attackBuff = false;
				buffBullet.forEach(bullet => {
					if(bullet.bulletPre.name == "Bullet1") {
						bullet.enabled = false;
					}else {
						bullet.enabled = true;
					}
				});
			}, this.buffTime);
		}
	}
	
	// 本地存储
	onLocalStorage() {
		this.Global.nowScore = this.Score;
		this.Global.nowGold = this.gold;
		
		let oldScore = cc.sys.localStorage.getItem("maxScore");
		let oldGold = cc.sys.localStorage.getItem("newGold");
		
		if(!oldScore || this.Global.nowScore > oldScore) {
			cc.sys.localStorage.setItem("maxScore", this.Global.nowScore);
		}
		if(!oldGold || this.Global.nowGold) {
			if(!oldGold) {
				oldGold = 0;
			}
			let newGold = this.Global.nowGold + oldGold;
			cc.sys.localStorage.setItem("newGold", newGold);
		}
	}
}

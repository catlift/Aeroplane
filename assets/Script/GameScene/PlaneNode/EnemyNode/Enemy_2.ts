const {ccclass, property} = cc._decorator;

// 想要继承的
import Plane from "../Plane"
// 随机动画
import Easing from "../Easing"

@ccclass
export default class Enemy_1 extends Plane {
	
	@property({
		tooltip: "Hp",
		type: cc.ProgressBar
	})
	HpPro: cc.ProgressBar = null;
	
	@property({
		tooltip: "死亡后能得到的分数"
	})
	_score: Number = 1;
	@property
	get score() {
		return this._score;
	}
	set score(value) {
		if(value <= 1) {
			value = 1;
		}
		this._score = value;
	}
	
	@property({
		tooltip: "这架飞机的移动速度"
	})
	enemySpeed: Number = 100;
	
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

    // LIFE-CYCLE CALLBACKS:

	onLoad() {
		// this.node.score = this.score;
		// 记得弄一下 progress
		this._maxHp = this.Hp;
		this.HpPro.progress = this.Hp / this._maxHp;
		// 初始化掉落物品
		this.initDropItem();
	}

    onEnable() {
		this.initEnemy();
		
		this.initMove();
	}
	
	reuse(enemyPool) {
		// get 中传入的管理类实例
		this.enemyManager = enemyPool;
	}
	
	hit() {
		this.moveTween.stop(); // 停止 tween，不然。。
		// 通过之前传入的管理类实例回收子 bullet
		this.enemyManager.onKilled(this.node);
		// cc.log("回收e2");
	}
	
	// 初始化一下
	initEnemy() {
		// onLoad 肯定比 onEnable 先执行（且只执行一次），从 onLoad 中拿到数据，作为初始化
		if(this._maxHp) {
			this.Hp = this._maxHp;
		}
		
		// 随机一下 x 轴的位置吧
		let minX = this.node.width/2;
		let maxX = cc.winSize.width/2 - this.node.width/2;
		let rangeX = maxX - minX;
		let random1 = Math.floor(Math.random() * rangeX) + minX;
		let random2 = Math.random() < 0.5 ? -1 : 1;
		// this.node.y 是因为在对象池里面已经设置过 y 轴的位置，这里不变就可以了
		this.node.setPosition(random1 * random2, this.node.y);
	}
	
	initMove() {
		// 向下移动吧
		let randomY = Math.ceil(Math.random() * cc.winSize.height/2);
		let endPoint1 = cc.v2(this.node.x, randomY);
		// 左/右移动
		let dir = Math.random() < 0.5 ? -1 : 1;
		let end2X = (cc.winSize.width/2 + this.node.width) * dir;
		let endPoint2 = cc.v2(end2X, endPoint1.y);
		// 时间
		let time1 = Math.abs(endPoint1.y / this.enemySpeed);
		let time2 = Math.abs(endPoint2.x / this.enemySpeed);
		// 从 easing.ts 拿到 easing，就叫 ani 吧
		let ani: string = Easing.easingTs();
		// cc.log(ani);
		// 或许有多个缓动呢
		let tween_start = cc.tween().to(time1, {position: endPoint1}, {easing: ani});
		let tween_end = cc.tween().to(time2, {position: endPoint2}, {easing: ani});
		let tween_1 = cc.tween().by(time2, {position: cc.v2(-(this.node.x * 2), 0)}, {easing: ani}).by(time2, {position: cc.v2(this.node.x * 2, 0)}, {easing: ani});
		// 执行 tween
		let _t = this;
		this.moveTween = cc.tween(this.node)
			.then(tween_start)
			.then(tween_1)
			.repeat(2)
			.then(tween_end)
			.call(()=>{
				this.hit();
			})
			.start();
	}
	
	initDropItem() {
		// 大概率要排序一下吧，dropItems[gold,item_1,item_2]，不过这种方法只适合排序满的
		if(!this.dropItems) {
			return;
		}
		// cc.log(this.dropItems[0].data.group);
		for(let i = 0; i < this.dropItems.length; i++) {
			switch(this.dropItems[i].data.group) {
				case "gold":
					this.initDropGold(this.dropItems[i]);
					break;
				case "hp":
					this.initDropHp(this.dropItems[i]);
					break;
				case "attack":
					this.initDropAttack(this.dropItems[i]);
					break;
			}
		}
	}
	
	onCollisionEnter(other, self) {
		if(other.node.group == "player") {
			if(this.Hp > 0) {
				this.Hp -= 2;
				if(this.Hp <= 0){
					// this.node.destroy(); // 改成 NodePool 来回收吧
					this.hit();
					cc.find("Canvas/PlaneNode/PlayerNode").getComponent("PlayerData").Score += this.score;
				}
			}
		}
		if(other.node.group == "player-bullet") {
			if(this.Hp > 0) {
				this.Hp -= other.node.Attack;
				if(this.Hp <= 0){
					// this.node.destroy(); // 改成 NodePool 来回收吧
					cc.find("Canvas/PlaneNode/PlayerNode").getComponent("PlayerData").Score += this.score;
					
					if(this.dropItems) {
						// 拿到死亡位置
						let pos: cc.Vec2 = self.node.getPosition();
						
						// 随机掉落物品
						let random = Math.floor(Math.random() * this.dropItems.length);
						for(let i = 0; i < this.dropItems.length; i++) {
							if(i == random) {
								switch(this.dropItems[i].data.group) {
									case "gold":
										this.createDropGold(pos);
										break;
									case "hp":
										this.createDropHp(pos);
										break;
									case "attack":
										this.createDropAttack(pos);
										break;
								}
							}
						}
					}
					
					this.hit();
				}
			}
		}
	}
}

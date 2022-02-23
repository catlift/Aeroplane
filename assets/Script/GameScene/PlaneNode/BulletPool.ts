const {ccclass, property} = cc._decorator;

@ccclass
export default class BulletPool extends cc.Component {

    @property({
		tooltip: "bullet prefab",
		type: cc.Prefab
	})
	bulletPre: cc.Prefab = null;
	
	@property({
		tooltip: "offset(偏移角度)"
	})
	offset: cc.Vec2 = cc.v2(0, 0);
	
	@property({
		tooltip: "rotation"
	})
	_rotation: Number = 0;
	@property
	get rotation() {
		return this._rotation;
	}
	set rotation(value) {
		value = value%360;
		this._rotation = value;
	}
	
	@property({
		tooltip: "频率(间隔)"
	})
	frequency: Number = 1;
	
	@property({
		tooltip: "count"
	})
	count: Number = 200;
	
	@property({
		tooltip: "speed"
	})
	speed: Number = 200;

    // LIFE-CYCLE CALLBACKS:
	
	// 初始化
	initPool(nodeScript) {
		this.bulletPool = new cc.NodePool(nodeScript);
		
		for(let i = 0; i < this.count; i++) {
			// 生成节点
			let bullet = cc.instantiate(this.bulletPre);
			// 通过 put 接口放进对象池
			this.bulletPool.put(bullet);
		}
	}
	
	// 从对象池中请求对象
	createBullet(parentNode, position, Attack) {
		let bullet = null;
		// 通过 size 接口判断对象池中是否有空闲的对象
		if(this.bulletPool.size() > 0) {
			// 传入 manager 的实例，用于之后在子弹脚本中回收子弹
			bullet = this.bulletPool.get(this);
		}else {
			// 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
			bullet = cc.instantiate(this.bulletPre);
		}
		// 初始化位置(这里的 this.node 在这个游戏中，一般指继承这个对象池的脚本，比如 BulletFire)
		let x = position.x;
		let y = position.y;
		bullet.setPosition(x += this.offset.x, y);
		bullet.angle = -this.rotation;
		
		// 将生成的 bullet 加入节点树
		bullet.parent = parentNode;
		// 子弹攻击力，子弹脚本上 this.node.Attack 引用
		bullet.Attack = Attack;
		
		// 对创建的 bullet 进行分组
		if(parentNode.group == "player-bullet") {
			bullet.group = "player-bullet";
			bullet.setScale(1, 1);
		}else if(parentNode.group == "enemy-bullet"){
			bullet.group = "enemy-bullet";
			bullet.setScale(1, -1);
		}
		// cc.log(bullet.group);
		
		// 接下来就可以调用 bullet 身上的脚本进行初始化
		// bullet.getComponent('BulletMove').init(position);
	}
	
	// 将节点返回对象池
	onKilled(bullet) {
		// bullet 应该是一个 cc.Node
		this.bulletPool.put(bullet);
		// cc.log("回收成功");
	}
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class Plane extends cc.Component {
	
	@property({
		tooltip: "Hp string"
	})
	_Hp: Number = 10;
	
	@property({
		tooltip: "shield string"
	})
	_Shield: Number = 5;
	
	@property({
		tooltip: "Attack power"
	})
	_Attack: cc.Float = 1;
	
	// 数组形式计算可能会有一点复杂，也许可以改成单独预制体那种
	@property({
		type: cc.Prefab,
		tooltip: "array, dropItem"
	})
	dropItems: cc.Prefab[] = [];
	
	@property({
		tooltip: "count"
	})
	dropCount: Number = 50;

    // LIFE-CYCLE CALLBACKS:
	
	// gold
	initDropGold(prefab) {
		this.dropGoldPool = new cc.NodePool("DropItem");
		for(let j = 0; j < this.dropCount; j++) {
			let dropGold = cc.instantiate(prefab);
			this.dropGoldPool.put(dropGold);
		}
	}
	
	createDropGold(prefab, pos) {
		cc.log("aa:",pos);
		let dropGold = null;
		if(this.dropGoldPool.size() > 0) {
			dropGold = this.dropGoldPool.get(this);
		}else {
			// 这里肯定也要改的，现在先不改
			dropGold = cc.instantiate(prefab);
		}
		let parentNode: cc.Node = cc.find("Canvas/PlaneNode/DropItemNode");
		// cc.log(parentNode);
		dropGold.parent = parentNode;
		if(pos) {
			dropGold.setPosition(pos);
		}
	}
	
	onKillDropGold(dropGold) {
		this.dropGoldPool.put(dropGold);
		// cc.log("回收gold");
	}
	
	// hp
	initDropHp(prefab) {
		this.dropHpPool = new cc.NodePool("DropItem");
		for(let j = 0; j < this.dropCount; j++) {
			let dropHp = cc.instantiate(prefab);
			this.dropHpPool.put(dropHp);
		}
	}
	
	createDropHp(prefab, pos) {
		cc.log("bb:",pos);
		let dropHp = null;
		if(this.dropHpPool.size() > 0) {
			dropHp = this.dropHpPool.get(this);
		}else {
			dropHp = cc.instantiate(prefab);
		}
		let parentNode: cc.Node = cc.find("Canvas/PlaneNode/DropItemNode");
		// cc.log(parentNode);
		dropHp.parent = parentNode;
		if(pos) {
			dropHp.setPosition(pos);
		}
	}
	
	onKillDropHp(dropHp) {
		this.dropHpPool.put(dropHp);
		// cc.log("回收Hp");
	}
	
	// attack
	initDropAttack(prefab) {
		this.dropAttackPool = new cc.NodePool("DropItem");
		for(let j = 0; j < this.dropCount; j++) {
			let dropAttack = cc.instantiate(prefab);
			this.dropAttackPool.put(dropAttack);
		}
	}
	
	createDropAttack(prefab, pos) {
		cc.log("cc:",pos);
		let dropAttack = null;
		if(this.dropAttackPool.size() > 0) {
			dropAttack = this.dropAttackPool.get(this);
		}else {
			dropAttack = cc.instantiate(prefab);
		}
		let parentNode: cc.Node = cc.find("Canvas/PlaneNode/DropItemNode");
		// cc.log(parentNode);
		dropAttack.parent = parentNode;
		if(pos) {
			dropAttack.setPosition(pos);
		}
	}
	
	onKillDropAttack(dropItem) {
		this.dropAttackPool.put(dropItem);
		// cc.log("回收Attack");
	}
}

class Elemental {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		this._description = "This Elemental currently does not have an Ability";

        this._buff = [
            // Main Stats
            0, // Strength
            0, // Constitution
            0, // intelligence
            0, // Agility

            // Secondary Stats
            0, // Defense
            0, // Damage Shield
        ];


        this._buffTime = []
        for (let i = 0; i < this._buff.length; i++) { // Initiates the timer for every buff at 0.
            this._buffTime.push(0);
        }

        // Secondary stats
        this._health = 0;
        this._barrier = 0;
        this._baseDamageShield = 0;

		this.doubleStrike = false;

		// Default to 0 length for all animations
		this.attackLength = 0;
		this.hurtLength = 0;
		this.deathLength = 0;
	}

	/*********************
	****** Getters *******
	*********************/

    get name() { // Name of Elemental
        return this._name;
    }

    get eleType() { // Elementals type
        return this._eleType;
    }

    get shieldType() { // Elemental type of damage shield
        return this._shieldType;
	}
	
	get description() {
		return this._description;
	}

    
    // Arrays
    get buff() { 
        return this._buff;
    }

    get buffTime() {
        return this._buffTime;
    }

    // stats
    get strength() { // Used in Damage calculations
        return this._baseStrength + this.buff[stat.strength];
    }

    get constitution() { // Used to calculate Damage and Defense
        return this._baseConstitution + this.buff[stat.constitution];
    }

    get intelligence() { // Used to calculate Ability Modifier
        return this._baseIntelligence + this.buff[stat.intelligence];
    }

    get agility() { // Used to calculate Speed.
        return this._baseAgility + this._buff[stat.agility];
    }

    // Calculated stats

    get damage() {
        return this.strength;
    }

    get speed() { // Used to see which Elemental goes first.
        return this.agility;
    }

    get maxHealth() { // Maximum Health for the Elemental
        return this.constitution * 5;
    }

    get health() { // Current Health of the Elemental
        return this._health;
    }

    get defense() { // Mitigates Damage.
        return Math.round((this.constitution * 0.25) + this.buff[stat.defense]);
    }

    get abilityMod() { // Used to modify various Elemental Abilities.
        return this.intelligence * 0.1;
    }

    get damageShield() { // Causes Damage to attacking Elemental.
        let shield = Math.round(this._baseDamageShield + this.buff[stat.damageShield]);

        if (shield < 0) {
            return 0;
            
        } else {
            return shield;
        }
    }

    get barrier() { // Mitigates Damage then is removed based on damage .
        return this._barrier;
    }

	/*********************
	****** Setters *******
    *********************/

    set shieldType(eleType) {
        if (eleType === type.atomic || eleType === eleType.fire || eleType === type.water || eleType === type.earth || eleType === type.wind) {
            this._shieldType = eleType;
        } else {
            throw new TypeError(`Invalid Input; Type must match type.x in enum.js`);
        }
    }

    // Arrays
    set buff(stat) { // Getter and setter for _buff so that buffs can be reset when they wear
        this._buff = stat;
    }

    set buffTime(t) {
        this._buffTime = t;
    }

    // Main Stats
    set strength(buff) { // Sets the Elementals Strength Buff (Does not affect Base Strength)
        if (typeof buff === 'number') {
            this._buff[stat.strength] = buff;
        } else {
            throw new TypeError(`Invalid Input; Strength must be a number`);
        } 
    }

    set constitution(buff) { // Sets the Elementals Constitution Buff (Does not affect Base Constitution)
        if (typeof buff === 'number') {
            this._buff[stat.constitution] = buff;
        } else {
            throw new TypeError(`Invalid Input; Strength must be a number`);
        }
    }

    set intelligence(buff) { // Sets the Elementals intelligence Buff (Does not affect Base intelligence)
        if (typeof buff === 'number') {
            this._buff[stat.intelligence] = buff;
        } else {
            throw new TypeError(`Invalid Input; Strength must be a number`);
        }
    }

    set agility(buff) { // Sets the Elementals agility Buff (Does not affect Base Agility)
        if (typeof buff === 'number') {
            this._buff[stat.agility] = buff;
        } else {
            throw new TypeError(`Invalid Input; Strength must be a number`);
        }
    }

    // Secondary Stats
    set health(h) { 
        if (typeof h === 'number') {
			this._health = h;
        } else {
            throw new TypeError(`Invalid Input; Health must be a number.`);
        }
     }

    set defense(buff) { // Sets the Elementals defense Buff (Does not affect Base Defense)
        if (typeof buff === 'number') {
            this._buff[stat.defense] = buff;
        } else {
            throw new TypeError(`Invalid Input; Defense must be a number`);
        }
    }

    set damageShield(buff) { // Sets the Elementals Damage Shield Buff (Does not affect Base Damage Shield)
        this._buff[stat.damageShield] = buff;
    }

    set barrier(buff) { // Sets Barrier Buff
        if (typeof buff === 'number') {
            this._barrier = buff;

            if (this.barrier < 0) {
                this.barrier = 0;
            }
        } else {
            throw new TypeError(`Invalid Input; Barrier must be a number`);
        }
    }

	/*********************
	****** Methods *******
    *********************/

    getType() { // Gives string of type 
        return Object.keys(type)[this.eleType];
	}
	
	getStats() { // Returns string of Elemental's Stats for HTML5 purposes.
		return `${this.name}<br>
		Strength: ${this.strength}<br>
		Constitution: ${this.constitution}<br>
		Intelligence: ${this.intelligence}<br>
		Agility: ${this.agility} <br>`
	}

    attack(enemy) { // Attack enemy Elemental's health
            let initialDmg = this.calculateDmg(enemy) 
            let dmg = initialDmg - enemy.barrier; // Subtracts Enemy Elementals Barrier from Damage.

            enemy.barrier -= initialDmg; // Subtracts Damage done to Enemy Elementals Barrier.

            if (dmg < 1) { // Ensures that intended Damage does not Heal.
                dmg = 1;
            }


            if (enemy.barrier < 0) { // Ensures that Enemy's Barrier is not a negateive.
                enemy.barrier = 0;
            }

            console.log(`Attacking ${enemy.getType()} for ${dmg} Damage.`);
            enemy.health -= dmg; // Inflicts Damage onto the Enemy Elemental.
			damage = dmg; // For log in arena.js

            if (enemy.damageShield > 0) {
                let enemyType = enemy.eleType;
                if (enemy.buff[stat.damageShield] > 0) {
                    enemyType = enemy.shieldType;
                }

                dmg = this.damageShieldDmg(enemy);
                console.log(`Taking ${dmg} Damage from Damage Shield`);
				this.health -= dmg; // Take damage if enemy has a Damage Shield
				
				let shieldType;
				switch (enemyType) { // Convert the number enemy type to a String the player's can understand
					case type.atomic:
						shieldType = "<font color='purple'>Atomic</font>";
						break;
					case type.fire:
						shieldType = "<font color='crimson'>Fire</font>";
						break;
					case type.water:
						shieldType = "<font color='blue'>Water</font>";
						break;
					case type.earth:
						shieldType = "<font color='dark brown'>Earth</font>";
						break;
					case type.wind:
						shieldType = "<font color='dark grey'>Wind</font>";
						break;
					default:
						shieldType = "ERROR";
						break
				}

				shieldLog = this.name + " has taken <font color='red'>" + dmg + "</font> " + shieldType + " Damage " + "from Enemy Elemental's Damage Shield" + "</br>"
				shieldLog += logWeakness();
            }     
	}
	
	damageShieldDmg(enemy) {
		let enemyType = enemy.eleType;
		if (enemy.buff[stat.damageShield] > 0) {
			enemyType = enemy.shieldType;
		}
		return Math.round(enemy.damageShield * enemy.multiplier(enemyType, this.eleType));
	}

    calculateDmg(enemy) { // Calculates damage.
        let dmg = Math.round((this.damage * this.multiplier(this.eleType, enemy.eleType)) - enemy.defense);

        if (dmg < 0) {
            dmg = 0;
        }

        return dmg;
    }

    multiplier(playerType, enemyType) { // Decides multiplier based on weakness
        let multiplier = 1;
        let weak = "Neutral";
        
        switch (playerType) {
            case type.atomic:
                switch (enemyType) {
                    case type.earth:
                        multiplier = weakness.strong;
                        weak = 'Strong';
                        break;
                    case type.water:
                        multiplier = weakness.weak;
                        weak = 'Weak';
                        break;
                    case type.fire:
                        multiplier = weakness.weak;
                        weak = 'Weak';
                        break;
                    case type.wind:
                        multiplier = weakness.strong;
                        weak = 'Strong';
                        break;
                }
                break;
            case type.earth:
                switch (enemyType) {
                    case type.atomic:
                        multiplier = weakness.trivial;
                        weak = 'Trivial';
                        break;
                    case type.water:
                        multiplier = weakness.strong;
                        weak = 'Strong';
                        break;
                    case type.fire:
                        multiplier = weakness.good;
                        break;
                    case type.wind:
                        multiplier = weakness.weak;
                        weak = 'Weak';
                        break;
                }
                break;
            case type.water:
                switch (enemyType) {
                    case type.atomic:
                    multiplier = weakness.good;
                    weak = 'Good';
                    break;
                case type.earth:
                    multiplier = weakness.trivial;
                    weak = 'Trivial';
                    break;
                case type.fire:
                    multiplier = weakness.strong;
                    weak = 'Strong';
                    break;
                case type.wind:
                    multiplier = weakness.weak;
                    weak = 'Weak';
                    break;
                }
                break;
            case type.fire:
                switch (enemyType) {
                    case type.atomic:
                        multiplier = weakness.good;
                        weak = 'Good';
                        break;
                    case type.earth:
                        multiplier = weakness.weak;
                        weak = 'Weak';
                        break;
                    case type.water:
                        multiplier = weakness.trivial
                        weak = 'Trivial';
                        break;
                    case type.wind:
                        multiplier = weakness.strong;
                        weak = 'Strong';
                        break;
                }
                break;
            case type.wind:
                switch (enemyType) {
                    case type.atomic:
                        multiplier = weakness.trivial;
                        weak = 'Trivial';
                        break;
                    case type.earth:
                        multiplier = weakness.good;
                        weak = 'Good';
                        break;
                    case type.water:
                        multiplier = weakness.good;
                        weak = 'Good';
                        break;
                    case type.fire:
                        multiplier = weakness.trivial;
                        weak = 'Trivial';
						break;
                }
                break;
        }

        if (weak != null) {
            //console.log(`${this.getType()}'s attack is ${weak}`);
        }

		weaknessLog = weak; 

        return multiplier;
    }

    resetBuffs() { // Checks the timer of each buff and resets them to 0 if their timer is up.
        for (let i = 0; i < this.buff.length; i++) {
			this.buffTime[i] --;

            if (this.buffTime[i] < 0) {
				this.buff[i] = 0;
				this.buffTime[i] = 0;
            } 
		}
		//console.log(`${this.getType()} ${this.buff}; ${this.buffTime}`);
	}
	
	resetEle() { // Reset Elementals Health and Buffs (used on deaths)
		for (let i = 0; i < this.buff.length; i++) {
			this.buff[i] = 0;
			this.buffTime[i] = 0;
		}

		this.health = this.maxHealth;
	}

	ability(player, enemy) { // Certain Elementals have extra stats or altered attacks; this ensures there are no errors with .ability() is called on them.
		
		log += "taunts the Enemy."
	}
	
	heal(enemy) {
		return 0;
	}

    // For testing purposes:ss

    listStats() { // Lists all stats.
        console.log(`
            Name: ${this.name}
            Type: ${this.getType()}

            Max Health: ${this.maxHealth}
            Current Health: ${this.health}

            Strength: ${this.strength}
            Constitution: ${this.constitution}
            intelligence: ${this.intelligence}
            Agility: ${this.agility}

            Damage: ${this.damage}
            Speed: ${this.speed}

            Defense: ${this.defense}
            Ability Mod: ${this.abilityMod}
        `);
    }

    logHealth() {
        console.log(`${this.getType()} ${this.name} Health: ${this.health}`);
    }


}

/*********************
******* Atomic *******
*********************/

class Atomic extends Elemental {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		super();
		this._eleType = type.atomic;
		this._shieldType = this.eleType;

		this.spriteLoc = "sprites/elemental/atomic/debug";
		this.attackLength = 8;
		this.hurtLength = 9;
		this.dieLength = 8;
		this.victoryLength = 13;
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/
}

class AtomicC1 extends Atomic {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		super();
		this._name = "C1";

		// Main Stats
		this._baseStrength = 33;
		this._baseConstitution = 22;
		this._baseIntelligence = 38;
		this._baseAgility = 11;	

		// Secondary Stats
		this.health = this.maxHealth;

		this._description = "<b>Radiation Sickness:</b> Upon victory decreases <i>ALL Stats</i> of all Enemy Elementals based on <i>All Stats</i>"
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/

	ability(player, enemy) { // Radiation Sickness
		let DURATION = 3;

		let strDeBuff = Math.round((this.strength * 0.1) * this.abilityMod);
		let intDeBuff = Math.round((this.intelligence * 0.1) * this.abilityMod);
		let agilDeBuff = Math.round((this.agility * 0.1) * this.abilityMod);

		console.log(`
			Debuffing all enemy Elementals Strength by ${strDeBuff}.
			Debuffing all enemy Elementals Strength by ${intDeBuff}.
			Debuffing all enemy Elementals Strength by ${agilDeBuff}.
		`);

		for (let i = 0; i < enemy.elemental.length; i++) {
			enemy.elemental[i].strength = -strDeBuff;
			player.elemental[i].buffTime[stat.strength] = DURATION;

			enemy.elemental[i].intelligence = -intDeBuff;
			player.elemental[i].buffTime[stat.intelligence] = DURATION;

			enemy.elemental[i].agility = -agilDeBuff;
			player.elemental[i].buffTime[stat.agility] = DURATION;
		}

		log += "debuffing all Enemy Elementals Strength by " + strDeBuff + "!</br>";
		log += "All Enemy Elementals Intelligence by " + intDeBuff + "!</br>";
		log += "And all Enemy Elementals Agility by " + agilDeBuff + "!</br>";
	}

	
}

class AtomicC2 extends Atomic {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		super();
		this._name = "C2";

		// Main Stats
		this._baseStrength = 28;
		this._baseConstitution = 22;
		this._baseIntelligence = 24;
		this._baseAgility = 11;

		// Secondary Stats
		this.health = this.maxHealth;

		// Ability Description (HTML5 String)
		this._description = "<b>Hydrogen Blast:</b> Upon victory sets off a powerful explosion damaging all Enemy Elementals by an ammount based on it's <i>Strength</i> and <i>Intelligence</i>";
	
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/

	ability(player, enemy) { // Hydrogen Blast
		// Does dmg ammount of Damage to each enemy Elemental.
		let dmg = Math.round((this.strength * .25) * this.abilityMod);

		console.log(`Inflicting ${dmg} to all enemy Elementals`);
		for (let i = 0; i < enemy.elemental.length; i++) {
			enemy.elemental[i].health -= dmg;
		}

		log += "inflicting " + dmg + " to all enemy Elementals</br>";
	}
}

class AtomicC3 extends Atomic {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		super()
		this._name = "C3";

		// Main Stats
		this._baseStrength = 23;
		this._baseConstitution = 27;
		this._baseIntelligence = 20;
		this._baseAgility = 21;	

		// Secondary Stats
		this.health = this.maxHealth;

		// Ability Description (HTML5 String)
		this._description = "<b>Radiation Shield:</b> Upon victory radiates all Ally Elementals with an <i>Atomic type Damage Shield</i> based on <i>Strength</i> and <i>Intelligence</i>"
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/

	ability(player, enemy) { // Radiation Shield
		// Increases the Damage Shield of every friendly elemental.
		let buff = Math.round((this.strength * 0.5) * this.abilityMod);
		console.log(`Buffing ally Damage Shield by ${buff}`);
		for (let i = 0; i < player.elemental.length; i++) {
			player.elemental[i].damageShield = buff;
			player.elemental[i]._shieldType = this.eleType;
			player.elemental[i].buffTime[stat.damageShield] = 1;
		}

		log += "giving all Ally Elementals an Atomic Damage Shield which inflicts " + buff + " damage!</br>"
	}
}


class AtomicC4 extends Atomic {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		super()
		this._name = "C4";

		// Main Stats
		this._baseStrength = 23;
		this._baseConstitution = 40;
		this._baseIntelligence = 14;
		this._baseAgility = 16;

		// Secondary Stats
		this.health = 50;

		// Ability Description (HTML5 String)
		this._description = "<b>2 Minutes to Midnight:</b> Upon victory the doomsday clock lowers; When the clock strikes midnight the game ends and whoever won that round wins the game; Starts off with less than max health";
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/

	ability(player, enemy) { // 2 Minutes to Midnight: lowers the doomsday number when it reaches 0 whoever lowered it to 0 wins the game.
		let doomsday = localStorage.getItem("doomsday");
		doomsday--;
		localStorage.setItem("doomsday", doomsday);

		log += "increases the Doomsday Clock; the clock now strikes " + doomsday + " Minutes to Midnight!";
	}

	resetEle() {
		for (let i = 0; i < this.buff.length; i++) {
			this.buff[i] = 0;
			this.buffTime[i] = 0;
		}

		this.health = 50;

		localStorage.setItem("doomsday", MINUTES_TO_MIDNIGHT);
	}
}

/*********************
******** Fire ********
*********************/

class Fire extends Elemental {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
        super();
		this._eleType = type.fire;
		this._shieldType = this.eleType;

		this.spriteLoc = "sprites/elemental/fire/debug";
		this.attackLength = 10;
		this.hurtLength = 9;
		this.dieLength = 7;
		this.victoryLength = 9;
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/
}

class FireC1 extends Fire {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		super();
		this._name = "C1";

		// Main Stats
		this._baseStrength = 40;
		this._baseConstitution = 15;
		this._baseIntelligence = 5;
		this._baseAgility = 7;

		// Secondary Stats
		this.health = this.maxHealth;

		// Ability Description (HTML5 String)
		this._description = "<b>Direct Damage:</b> Upon victory damages the Enemy Player's <i>Health</i> Directly based on <i>Strength</i> and <i>Intelligence</i>";
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/

	ability(player, enemy) { // Direct Damage
		let dmg = Math.round(this.strength + (this.abilityMod * this.strength));

		console.log(`Dealing ${dmg} Damage directly to the player`);
		enemy.health -= dmg;

		log += "dealing " + dmg + " damage directly to the Player!</br>";
	}
}

class FireC2 extends Fire {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		super();
		this._name = "C2";

		// Main Stats
		this._baseStrength = 40;
		this._baseConstitution = 18;
		this._baseIntelligence = 5;
		this._baseAgility = 17;

		// Secondary Stats
		this.health = this.maxHealth;

		// Ability Description (HTML5 String)
		this._description = "<b>Armor Penetration:</b> Attacks ignores all <i>Damage Mitigation</i> including <i>Damage Shields</i>";
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/

	calculateDmg(enemy) { // Armor Penetration
		// Instead of an Ability FireC2 gets a modified calculateDmg allowing it to ignore Defense and Barriers.
		return Math.round(this.damage * this.multiplier(this.eleType, enemy.eleType));
    }
}

class FireC3 extends Fire {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		super();
		this._name = "C3";

		// Main Stats
		this._baseStrength = 32;
		this._baseConstitution = 25;
		this._baseIntelligence = 20;
		this._baseAgility = 5;

		// Secondary Stats
		this.health = this.maxHealth;

		// Ability Description (HTML5 String)
		this._description = "<b>Shield of Flames:</b> Upon victory inflames Ally Elementals with a <i>Fire</i> type <i>Damage Shield</i>";
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/

	ability(player, enemy) { // Shield of Flames
		// Increases the Damage Shield of every friendly elemental.
		let buff = Math.round((this.strength * 0.5) * this.abilityMod);
		console.log(`Buffing ally Damage Shield by ${buff}`);
		for (let i = 0; i < player.elemental.length; i++) {
			player.elemental[i].damageShield = buff;
			player.elemental[i]._shieldType = this.eleType;
			player.elemental[i].buffTime[stat.damageShield] = 1;
		}

		log += "buffing it's allys with a Fire Damage Shield that does " + buff + " damage!</br>";
	}
}

class FireC4 extends Fire {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		super();
		this._name = "C4";


		// Main Stats
		this._baseStrength = 32;
		this._baseConstitution = 20;
		this._baseIntelligence = 15;
		this._baseAgility = 5;

		// Secondary Stats
		this.health = this.maxHealth;

		// Ability Description (HTML5 String)
		this._description = "<b>Power Within:</b> Buffs all Ally Elementals with increased <i>Strength</i>; based on <i>Strength</i> and <i>Intelligence</i>";
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/

	ability(player, enemy) { // Power Within: Increases the strength of each friendly Elemental by buff.
		let buff = Math.round((this.strength * 0.1) * this.abilityMod);
		for (let i = 0; i < player.elemental.length; i++) {
			player.elemental[i].strength = buff;
			player.elemental[i].buffTime[stat.strength] = 5;
		}

		log += "increasing the Strength of all it's allies by " + buff + "!</br>";
	}
}

/*********************
******** Water *******
*********************/

class Water extends Elemental {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
        super();
		this._eleType = type.water;
		this._shieldType = this.eleType;

		this.spriteLoc = "sprites/elemental/water/debug";
		this.attackLength = 12;
		this.hurtLength = 13;
		this.dieLength = 10;
		this.victoryLength = 9;
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/
}

class WaterC1 extends Water {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		super();
		this._name = "C1";

		// Main Stats
		this._baseStrength = 22;
		this._baseConstitution = 35;
		this._baseIntelligence = 5;
		this._baseAgility = 8;

		// Secondary Stats
		this.health = this.maxHealth;

		// Ability Description (HTML5 String)
		this._description = "<b>Heal Wounds:</b> Upon victory heals all Ally Elementals <i>Health</i>; based on <i>Constitution</i> and <i>Intelligence</i>";
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/

	ability(player, enemy) { // Heal Wounds
		// Heals every friendly Elemental.
		let heal = Math.round(this.constitution + (this.constitution * this.abilityMod));

		console.log(`${this.getType()} Healing all allies for ${heal}`);
		for (let i = 0; i < player.elemental.length; i++) {
			player.elemental[i].health += heal;

			// Ensures Elementals are not healed above their Max Health
			if (player.elemental[i].health > player.elemental[i].maxHealth) {
				player.elemental[i].health = player.elemental[i].maxHealth;
			}
		}

		log += "heals it's Allies by <font color='green'>" + heal + "</font>!</br>";
	}
}

class WaterC2 extends Water {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		super();
		this._name = "C2";

		// Main Stats
		this._baseStrength = 20;
		this._baseConstitution = 20;
		this._baseIntelligence = 15;
		this._baseAgility = 25;

		// Secondary Stats
		this.health = this.maxHealth;

		// Ability Description (HTML5 String)
		this._description = "<b>Water Barrier:</b> Upon victory covers all Ally Elementals in a Water Barrier giving them a <i>Water</i> type <i>Damage Shield</i> based on <i>Strength</i> and <i>Intelligence</i>";
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/

	ability(player, enemy) { // Water Barrier
		// Increases the Damage Shield of every friendly elemental.
		let buff = Math.round((this.strength * 0.5) * this.abilityMod);
		console.log(`Buffing ally Damage Shield by ${buff}`);
		for (let i = 0; i < player.elemental.length; i++) {
			player.elemental[i].damageShield = buff;
			player.elemental[i]._shieldType = this.eleType;
			player.elemental[i].buffTime[stat.damageShield] = 1;
		}

		log += "giving it's Allies a Water Damage Shield of " + buff + " damage!</br>" ;
	}
}

class WaterC3 extends Water {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		super();
		this._name = "C3";

		// Main Stats
		this._baseStrength = 25;
		this._baseConstitution = 27;
		this._baseIntelligence = 10;
		this._baseAgility = 18;	

		// Secondary Stats
		this.health = this.maxHealth;

		// Ability Description (HTML5 String)
		this._description = "<b>Sacred Oath:</b> Upon victory heals the Player; based on <i>Constitution</i> and <i>Intelligence</i>"
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/

	ability(player, enemy) { // Sacred Oath
		// Heals the player.
		let heal = Math.round(this.constitution + (this.constitution * this.abilityMod));

		console.log(`${this.getType} Healing it's Player for ${heal}.`);

		player.health += heal;

		if (player.health > player.maxHealth) { // Ensure the player isn't healed past Max Health.
			player.health = player.maxHealth;
		}

		log += "heals it's Player for <font color='green'>" + heal + "</font>!</br>"
	}
}

class WaterC4 extends Water {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
        super();
        this._name = "C4";

		this._baseStrength = 25;
		this._baseConstitution = 22;
		this._baseIntelligence = 15;
		this._baseAgility = 18;

		// Secondary Stats
		this.health = this.maxHealth;

		// Ability Description (HTML5 String)
		this._description = "<b>Clarity:</b> Gives Ally Elementals a burst of insight increasing it's <i>Intelligence</i>; based on <i>Intelligence</i>";
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/

	ability(player, enemy) { // Clarity: Increases the Intelligence of all ally Elementals.
		let buff = Math.round(this.intelligence * this.abilityMod);

		console.log(`${this.getType()} buffing all ally Elementals intelligence by: ${buff}`);
		for (let i = 0; i < player.elemental.length; i++) {
			player.elemental[i].intelligence = buff;
			player.elemental[i].buffTime[stat.intelligence] = 1;
		}

		log += "increasing it's Allies Intelligence by " + buff + "!</br>";
	}
}


/*********************
******** Earth *******
*********************/


class Earth extends Elemental {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
        super();
		this._eleType = type.earth;
		this._shieldType = this.eleType;

		this.spriteLoc = "sprites/elemental/earth/debug";
		this.attackLength = 7;
		this.hurtLength = 9;
		this.dieLength = 6;
		this.victoryLength = 7;
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/
}

class EarthC1 extends Earth {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		super();
		this._name = "C1";

		// Main Stats
		this._baseStrength = 30;
		this._baseConstitution = 26;
		this._baseIntelligence = 7;
		this._baseAgility = 2;

		// Secondary Stats
		this.health = this.maxHealth;
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/
}

class EarthC2 extends Earth {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		super();
		this._name = "C2";

		// Main Stats
		this._baseStrength = 25;
		this._baseConstitution = 41;
		this._baseIntelligence = 5;
		this._baseAgility = 2;

		// Secondary Stats
		this.health = this.maxHealth;
		this._baseDamageShield = this._baseConstitution * this.abilityMod;	// Has Damage Shield instead of ability

		// Ability Description (HTML5 String)
		this._description = "<b>Tough Hide:</b> Has inate <i>Damage Shield</i>; changes types when buffed with a <i>Damage Shield</i> from an Ally Elemental.";
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/
	
}

class EarthC3 extends Earth {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		super();
		this._name = "C3";	

		// Main Stats
		this._baseStrength = 25;
		this._baseConstitution = 33;
		this._baseIntelligence = 15;
		this._baseAgility = 9;

		// Secondary Stats
		this.health = this.maxHealth;	

		// Ability Description (HTML5 String)
		this._description = "<b>Thorns:</b> Upon victory engulfs Ally Elementals in Thorns giving them a <i>Earth</i> type <i>Damage Shield</i>";
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/

	ability(player, enemy) { // Thorns
		// Increases the Damage Shield of every friendly elemental.
		let buff = Math.round((this.strength * 0.5) * this.abilityMod);
		console.log(`Buffing ally Damage Shield by ${buff}`);
		for (let i = 0; i < player.elemental.length; i++) {
			player.elemental[i].damageShield = buff;
			player.elemental[i]._shieldType = this.eleType;
			player.elemental[i].buffTime[stat.damageShield] = 1;
		}

		log += "engulfing it's Allies in Thorns giving them an Earth Damage Shield of " + buff + " damage!</br>"
	}
}

class EarthC4 extends Earth {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		super();
		this._name = "C4";		

		// Main Stats
		this._baseStrength = 25;
		this._baseConstitution = 33;
		this._baseIntelligence = 15;
		this._baseAgility = 4;

		// Secondary Stats
		this.health = this.maxHealth;

		// Ability Description (HTML5 String)
		this._description = "<b>Ardent Defender:</b> Upon victory protects all Ally Elementals with increased <i>Defense</i>;based on <i>Constitution</i> and <i>Intelligence</i>";
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/

	ability(player, enemy) { // Ardent Defender
		let buff = Math.round((this.constitution * 0.2) * this.abilityMod);	
		
		console.log(`${this.getType()} buffing all of it's allies Defense by ${buff}.`)

		for (let i = 0; i < player.elemental.length; i++) {
			player.elemental[i].defense = buff;
			player.elemental[i].buffTime[stat.defense] = 5;
		}

		log += "increasing it's Allies Defense by " + buff + "!</br>";
	}
}

/*********************
******* Wind *********
*********************/

class Wind extends Elemental {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
        super();
		this._eleType = type.wind;
		this._shieldType = this.eleType;

		this.spriteLoc = "sprites/elemental/wind/debug";
		this.attackLength = 8;
		this.hurtLength = 9;
		this.dieLength = 10;
		this.victoryLength = 11;
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/
}

class WindC1 extends Wind {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		super();
		this._name = "C1";

		// Main Stats
		this._baseStrength = 25;
		this._baseConstitution = 25;
		this._baseIntelligence = 5;
		this._baseAgility = 30;

		// Secondary Stats
		this.health = this.maxHealth;

		this.doubleStrike = true; // In place of ability; Hit the enemy's Elemental twice, once after the opponent has gone.

		// Ability Description (HTML5 String)
		this._description = "<b>Double Strike:</b> Swiftly attacks the opponent twice, once after the Enemy Elemental has attacked";
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/
}

class WindC2 extends Wind {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		super();
		this._name = "C2";

		// Main Stats
		this._baseStrength = 20;
		this._baseConstitution = 20;
		this._baseIntelligence = 5;
		this._baseAgility = 22;

		// Secondary Stats
		this.health = this.maxHealth;

		this._description = "<b>Life Leech:</b> Increases health based on <i>Damage</i> and <i>Intelligence</i>";
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/

	attack(enemy) { // Life Leech
		// In place of Ability; attacks from Elemental Heal itself.
		Elemental.prototype.attack.call(this, enemy);

		
		let heal = Math.round((this.calculateDmg(enemy)  - enemy.defense) * (this.abilityMod + 2));
		this.health += heal;
		heal = Math.abs(heal)

		extra = eleName(this) + " leeches off it's Enemies life force, healing itself for <font color='green'>" + heal + "</font>!</br></br>	";

		console.log(`Healing self with Life Leech for ${heal}`);
	}

	heal(enemy) {
		return Math.round((this.calculateDmg(enemy)  - enemy.defense) * (this.abilityMod + 2));
	}
}

class WindC3 extends Wind {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
		super();
		this._name = "C3";

		// Main Stats
		this._baseStrength = 20;
		this._baseConstitution = 20;
		this._baseIntelligence = 15;
		this._baseAgility = 20;

		// Secondary Stats
		this.health = this.maxHealth;

		this._description = "<b>Vortex:</b> Upon victory surrounds all Ally Elementals in a <i>Wind</i> type <i>Damage Shield</i>; based on <i>Strength</i> and <i>Intelligence</i>";
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/

	ability(player, enemy) { // Vortex
		// Increases the Damage Shield of every friendly elemental.
		let buff = Math.round((this.strength * 0.7) * this.abilityMod);
		console.log(`Buffing ally Damage Shield by ${buff}`);
		for (let i = 0; i < player.elemental.length; i++) {
			player.elemental[i].damageShield = buff;
			player.elemental[i]._shieldType = this.eleType;
			player.elemental[i].buffTime[stat.damageShield] = 1;
		}

		log += "surrounds it's Allies in a Vortex giving them a Wind Damage Shield of " + buff + " damage!</br>"
	}
}

class WindC4 extends Wind {
	/*********************
	**** Constructor *****
	*********************/

	constructor() {
        super();
		this._name = "C4";
		
		// Main Stats
		this._baseStrength = 25;
		this._baseConstitution = 22;
		this._baseIntelligence = 15;
		this._baseAgility = 23;	

		// Secondary Stats
		this.health = this.maxHealth;

		this._description = "<b>Haste:</b> Gives all Ally Elementals a <i>Speed</i> boost by increasing their <i>Agility</i>; based on <i>Agility</i> and <i>Intelligence</i>";
	}

	/*********************
	****** Getters *******
	*********************/

	/*********************
	****** Setters *******
	*********************/

	/*********************
	****** Methods *******
	*********************/
	ability(player, enemy) { // Haste
		let buff = Math.round((this.agility * 0.1) * this.abilityMod);
		for (let i = 0; i < player.elemental.length; i++) {
			player.elemental[i].strength = buff;
			player.elemental[i].buffTime[stat.agility] = 5;
		}

		log += "increasing it's Allies Agility by " + buff + "!</br>"
	}
}

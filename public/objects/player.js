class Player {
	/*********************
	**** Constructor *****
	*********************/

	constructor(elementals, eleSelect) {
        this._elemental = elementals;
        this._eleSelect = eleSelect;

        this._maxHealth = this.calculateMaxHealth();
        this._health = this._maxHealth;
	}

	/*********************
	****** Getters *******
    *********************/
    
    get elemental() {
        return this._elemental;
    }

    get maxHealth() {
        return this._maxHealth;
    }

    get health() {
        return this._health;
    }

    get eleSelect() {
        return this._eleSelect;
    }


	/*********************
	****** Setters *******
    *********************/
    
    set health(h) {
        if (typeof h === 'number') {
            this._health = h;
        } else {
            throw new TypeError(`Invalid Input; Health must be a number.`);
        }
    }

    set maxHealth(h) { // For debugging purposes only
        if (typeof h === 'number') {
            this._maxHealth = h;
        } else {
            throw new TypeError(`Invalid Input; Max zHealth must be a number.`);
        }
    }

    set elemental(ele) {
        this._elemental = ele;
    }

	/*********************
	****** Methods *******
    *********************/
    
    calculateMaxHealth() {
        let health = 0;
        for (let i = 0; i < this.elemental.length; i++) {
            health += this.elemental[i].maxHealth;
        }
        return health;
    }

    buffTimer() {
        for (let i = 0; i < this.elemental.length; i++) {
            this.elemental[i].resetBuffs();
        }
    }

    // For testing purposes:
    // Main Stats
    listStrength() {
        let ele;

        console.log(`Listing all Elementals Strength`);
        for (let i = 0; i < this.elemental.length; i++) {
            ele = this.elemental[i]
        console.log(`
            ${ele.getType()} Strength : ${ele.Strength}`);
        }
    }

    listConstitution() {
        let ele;

        console.log(`Listing all Elementals Constitution`);
        for (let i = 0; i < this.elemental.length; i++) {
            ele = this.elemental[i]
        console.log(`
            ${ele.getType()} Constitution : ${ele.constitution}`);
        }
    }

    listintelligence() {
        let ele;

        console.log(`Listing all Elementals intelligence`);
        for (let i = 0; i < this.elemental.length; i++) {
            ele = this.elemental[i]
        console.log(`
            ${ele.getType()} intelligence : ${ele.intelligence}`);
        }
    }

    listAgility() {
        let ele;

        console.log(`Listing all Elementals Agility`);
        for (let i = 0; i < this.elemental.length; i++) {
            ele = this.elemental[i]
        console.log(`
            ${ele.getType()} Agility : ${ele.agility}`);
        }
    }

    // Secondary Stats
    listHealth() {
        let ele;

        console.log(`Listing all Elementals Health`);
        for (let i = 0; i < this.elemental.length; i++) {
            ele = this.elemental[i]
        console.log(`
            ${ele.getType()} Health : ${ele.health}`);
        }
    }

    listDefense() {
        let ele;

        console.log(`Listing all Elementals Defense`);
        for (let i = 0; i < this.elemental.length; i++) {
            ele = this.elemental[i]
        console.log(`
            ${ele.getType()} Defense : ${ele.defense}`);
        }
    }

    listDamageShield() {
        let ele;

        console.log(`Listing all Elementals Damage Shield`);
        for (let i = 0; i < this.elemental.length; i++) {
            ele = this.elemental[i]
        console.log(`
            ${ele.getType()} Damage Shield : ${ele.damageShield}`);
        }
    }

    listBarrier() {
        let ele;

        console.log(`Listing all Elementals Barrier`);
        for (let i = 0; i < this.elemental.length; i++) {
            ele = this.elemental[i]
        console.log(`
            ${ele.getType()} Barrier : ${ele.barrier}`);
        }
    }
}
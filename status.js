module.exports = class status {
    constructor(uuid, name) {
        this.uuid = uuid;
        this.name = name;
        this.lvl = 0;
        this.title = [];
        this.stats = [{ // stats = [hp0, mp1, vit2, str3, dex4, int5, wis6]
            hp: 50,
            mp: 50,
            vit: 5, // HP & HP Regen
            str: 5, // Physical ATK
            dex: 5, // Speed
            int: 5, // Magic ATK
            wis: 5 // Mana & Mana Regen
        }];
        this.skills = [];
    }
};
module.exports = class status {
    constructor(uuid, name, lvl, title, job) {
        this.uuid = uuid;
        this.name = name;
        this.lvl = lvl;
        this.title = title;
        this.job = job;
        this.stats = [{ // stats = [hp0, mp1, vit2, str3, dex4, int5, wis6]
            hp: 50,
            mp: 50,
            vit: 5,
            str: 5,
            dex: 5,
            int: 5,
            wis: 5
        }];
        this.skills = [];
    }
};
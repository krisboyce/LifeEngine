const { CellState, BodyCellState } = require('./Organism/Cell/CellState');
const ArmorCell = require("./Organism/Cell/BodyCells/ArmorCell");
const EyeCell = require("./Organism/Cell/BodyCells/EyeCell");
const KillerCell = require("./Organism/Cell/BodyCells/KillerCell");
const MouthCell = require("./Organism/Cell/BodyCells/MouthCell");
const MoverCell = require("./Organism/Cell/BodyCells/MoverCell");
const ProducerCell = require("./Organism/Cell/BodyCells/ProducerCell");

class Registry {
    constructor() {
        this.subscribers = [];
        this.registry = [];
    }

    All() {
        return this.registry;
    }

    Register(item) {
        this.registry.push(item);
        this.Notify('register', item);
    }

    Subscribe(label, notifyFn) {
        if (typeof notifyFn !== 'function') throw new Error("Notification Callback must be a function");
        this.subscribers.push({
            label: label,
            notify: notifyFn
        });
    }

    Unsubscribe(label) {
        this.subscribers = this.subscribers.filter(x => x.label !== label);
    }

    Notify(label, payload) {
        var subs = this.subscribers.filter(x => x.label === label);
        for (var subscriber of subs) {
            subscriber.notify(payload);
        }
    }
}

class CellRegistry extends Registry {

    RegisterCell(item) {
        this.Register(item);
    }

    GetByType(type) {
        return this.registry.find(x => x.CellType && x.CellType === type);
    }

    GetByName(name) {
        return this.registry.find(x => x.name === name);
    }

    WithTag(tag) {
        return this.registry.filter(x => x.tags.find(t => t === tag));
    }
}



class LifeEngineRegistries {
    constructor() {
        this.states = [];
        this.Cells = new CellRegistry();
        
        
    }

    getRandomName() {
        var names = this.Cells.All().map(x => x.name);
        return names[Math.floor(Math.random() * names.length)];
    }

    getRandomLivingType() {
        const living = this.Cells.WithTag('living');
        return living[Math.floor(Math.random() * living.length)];
    }

    States() {
        return this.Cells.All();
    }

    LivingStates() {
        return this.Cells.WithTag('living');
    }

    GetState(name) {
        return this.Cells.GetByName(name);
    }

    RegisterEnvironmentCell(name, color) {
        var state = new CellState(name);
        this.Cells.RegisterCell(new CellState(name, color, "", []));
    }

    RegisterBodyCell(name, color, cellType) {
        var state = new CellState(name, 'living');
        this.Cells.RegisterCell(new BodyCellState(cellType, name, color, "", ['living']));
    }
}

module.exports = LifeEngineRegistries;
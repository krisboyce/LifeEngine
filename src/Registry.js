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

    GetByName(name) {
        return this.registry.find(x => x.state.name === name);
    }

    WithTag(tag) {
        return this.registry.filter(x => x.state.tags.find(t => t === tag));
    }
}

class LifeEngineRegistries {
    constructor(cells) {
        this.Cells = cells;
    }
}

export const Cells = new CellRegistry();
export const Registries = new LifeEngineRegistries(Cells);
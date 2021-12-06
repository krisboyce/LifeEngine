
//An evironment has a grid_map, controller, and renderer
class Environment{
    constructor(registry) {
        this.Registry = registry;
    }

    update(){
        alert("Environment.update() must be overriden");
    }

    changeCell(c, r, type, owner) {
        this.grid_map.setCellType(c, r, type);
        this.grid_map.setCellOwner(c, r, owner);
    }
}


module.exports = Environment;
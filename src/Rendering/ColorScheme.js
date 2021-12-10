const { Cells } = require("../Registry");

var color_scheme = {
    "empty":"#0E1318",
    "food":"#2F7AB7",
    "wall":"gray",
    "mouth": "#DEB14D",
    "chloro": "#15BE39",
    "producer":"#15DE59",
    "mover":"#60D4FF",
    "killer":"#F82380",
    "armor":"#7230DB",
    "eye":"#B6C1EA",
    "eye-slit": "#0E1318"
}

// Renderer controls access to a canvas. There is one renderer for each canvas
class ColorScheme {
    constructor(world_env, editor_env) {
        this.world_env = world_env;
        this.editor_env = editor_env;
        this.color_scheme = color_scheme;
    }
    loadColorScheme() {
        for (var cell of Cells.All()) {
            cell.state.color = this.color_scheme[cell.state.name];
        }
        //CellStates.eye.slit_color=color_scheme['eye-slit']
        for (var cell_type in color_scheme) {
            
            
        }
        this.world_env.renderer.renderFullGrid(this.world_env.grid_map.grid);
        this.editor_env.renderer.renderFullGrid(this.editor_env.grid_map.grid);
    }
}

module.exports = ColorScheme;
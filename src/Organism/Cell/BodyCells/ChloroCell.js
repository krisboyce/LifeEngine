const Hyperparams = require("../../../Hyperparameters");
const BodyCell = require("./BodyCell");

class ChloroCell extends BodyCell{
    constructor(org, loc_col, loc_row){
        super(org, loc_col, loc_row);
    }

    performFunction() {
        var env = this.org.env;
        var real_c = this.getRealCol();
        var real_r = this.getRealRow();
        for (var loc of Hyperparams.breathableNeighbors){
            var cell = env.grid_map.cellAt(real_c+loc[0], real_r+loc[1]);
            this.synthesize(cell, env);
        }
    }

    synthesize(n_cell, env) {
        if (n_cell == null){
            this.org.food_collected++;
            console.log('.');
        }
    }
}

module.exports = ChloroCell;
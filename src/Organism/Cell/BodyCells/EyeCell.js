import BodyCell from "./BodyCell";
import HyperParameters from "../../../Hyperparameters";
import { getRandomDirection, up, down, right, left } from "../../Directions";
import Observation from "../../Perception/Observation";
import { CellState } from "../CellState";
import { Empty } from "../EnvironmentCells/EnvironmentCells";

class EyeCell extends BodyCell{
    static state = new CellState(
        "eye",
        "#B6C1EA",
        "Eye: Looks for cells to move away from or towards. Click again on a placed cell to rotate",
        [],
        super.state
    );

    constructor(org, loc_col, loc_row){
        super(org, loc_col, loc_row);
        this.org.anatomy.has_eyes = true;
    }

    static render(ctx, cell, size) {
        {
            ctx.fillStyle = this.color;
            ctx.fillRect(cell.x, cell.y, size, size);
            if(size == 1)
                return;
            var half = size/2;
            var x = -(size)/8
            var y = -half;
            var h = size/2 + size/4;
            var w = size/4;
            ctx.translate(cell.x+half, cell.y+half);
            ctx.rotate((cell.cell_owner.getAbsoluteDirection() * 90) * Math.PI / 180);
            ctx.fillStyle = "#0E1318";//this.slit_color;
            ctx.fillRect(x, y, w, h);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    }

    initInherit(parent) {
        // deep copy parent values
        super.initInherit(parent);
        this.direction = parent.direction;
    }
    
    initRandom() {
        // initialize values randomly
        this.direction = getRandomDirection();
    }

    initDefault() {
        // initialize to default values
        this.direction = up;
    }

    getAbsoluteDirection() {
        var dir = this.org.rotation + this.direction;
        if (dir > 3)
            dir -= 4;
        return dir;
    }

    performFunction() {
        var obs = this.look();
        this.org.brain.observe(obs);
    }

    look() {
        var env = this.org.env;
        var direction = this.getAbsoluteDirection();
        var addCol = 0;
        var addRow = 0;
        switch(direction) {
            case up:
                addRow = -1;
                break;
            case down:
                addRow = 1;
                break;
            case right:
                addCol = 1;
                break;
            case left:
                addCol = -1;
                break;
        }
        var start_col = this.getRealCol();
        var start_row = this.getRealRow();
        var col = start_col;
        var row = start_row;
        var cell = null;
        for (var i=0; i<HyperParameters.lookRange; i++){
            col+=addCol;
            row+=addRow;
            cell = env.grid_map.cellAt(col, row);
            if (cell == null) {
                break;
            }
            if (cell.type != Empty){
                var distance = Math.abs(start_col-col) + Math.abs(start_row-row);
                return new Observation(cell, distance, direction);
            }
        }
        return new Observation(cell, HyperParameters.lookRange, direction);
    }
}

export default EyeCell;
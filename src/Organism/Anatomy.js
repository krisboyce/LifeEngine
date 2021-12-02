const BodyCellFactory = require("./Cell/BodyCells/BodyCellFactory");
const EyeCell = require("./Cell/BodyCells/EyeCell");
const MoverCell = require("./Cell/BodyCells/MoverCell");
const ProducerCell = require("./Cell/BodyCells/ProducerCell");

class Anatomy {
    constructor(owner) {
        this.owner = owner;
        this.CellRegistry = owner.env.Registry.Cells;
        this.cells = [];
        this.is_producer = false;
        this.is_mover = false;
        this.has_eyes = false;
        this.birth_distance = 4;
    }

    canAddCellAt(c, r) {
        for (var cell of this.cells) {
            if (cell.loc_col == c && cell.loc_row == r){
                return false;
            }
        }
        return true;
    }

    addDefaultCell(state, c, r) {
        var new_cell = BodyCellFactory.createDefault(this.owner, state, c, r);
        this.cells.push(new_cell);
        return new_cell;
    }

    addRandomizedCell(state, c, r) {
        if (state==this.CellRegistry.GetByType(EyeCell) && !this.has_eyes) {
            this.owner.brain.randomizeDecisions();
        }
        var new_cell = BodyCellFactory.createRandom(this.owner, state, c, r);
        this.cells.push(new_cell);
        return new_cell;
    }

    addInheritCell(parent_cell) {
        var new_cell = BodyCellFactory.createInherited(this.owner, parent_cell);
        this.cells.push(new_cell);
        return new_cell;
    }

    replaceCell(state, c, r, randomize=true) {
        this.removeCell(c, r, true);
        if (randomize) {
            return this.addRandomizedCell(state, c, r);
        }
        else {
            return this.addDefaultCell(state, c, r);
        }
    }

    removeCell(c, r, allow_center_removal=false) {
        if (c == 0 && r == 0 && !allow_center_removal)
            return false;
        for (var i=0; i<this.cells.length; i++) {
            var cell = this.cells[i];
            if (cell.loc_col == c && cell.loc_row == r){
                this.cells.splice(i, 1);
                break;
            }
        }
        this.checkTypeChange(cell.state);
        return true;
    }

    getLocalCell(c, r) {
        for (var cell of this.cells) {
            if (cell.loc_col == c && cell.loc_row == r){
                return cell;
            }
        }
        return null;
    }

    checkTypeChange() {
        this.is_producer = false;
        this.is_mover = false;
        this.has_eyes = false;
        for (var cell of this.cells) {
            if (cell.state == this.CellRegistry.GetByType(ProducerCell))
                this.is_producer = true;
            if (cell.state == this.CellRegistry.GetByType(MoverCell))
                this.is_mover = true;
            if (cell.state == this.CellRegistry.GetByType(EyeCell))
                this.has_eyes = true;
        }
    }

    getRandomCell() {
        return this.cells[Math.floor(Math.random() * this.cells.length)];
    }
}

module.exports = Anatomy;
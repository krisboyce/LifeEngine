import { createDefault, createRandom, createInherited } from "./Cell/BodyCells/BodyCellFactory";
import { Eye, Mover, Producer } from "./Cell/BodyCells/BodyCells";

class Anatomy {
    constructor(owner) {
        this.owner = owner;
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

    addDefaultCell(type, c, r) {
        var new_cell = createDefault(this.owner, type, c, r);
        this.cells.push(new_cell);
        return new_cell;
    }

    addRandomizedCell(type, c, r) {
        if (type==Eye && !this.has_eyes) {
            this.owner.brain.randomizeDecisions();
        }
        var new_cell = createRandom(this.owner, type, c, r);
        this.cells.push(new_cell);
        return new_cell;
    }

    addInheritCell(parent_cell) {
        var new_cell = createInherited(this.owner, parent_cell);
        this.cells.push(new_cell);
        return new_cell;
    }

    replaceCell(type, c, r, randomize=true) {
        this.removeCell(c, r, true);
        if (randomize) {
            return this.addRandomizedCell(type, c, r);
        }
        else {
            return this.addDefaultCell(type, c, r);
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
        this.checkTypeChange(cell.getType());
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
            if (cell.getType() == Producer)
                this.is_producer = true;
            if (cell.getType() == Mover)
                this.is_mover = true;
            if (cell.getType() == Eye)
                this.has_eyes = true;
        }
    }

    getRandomCell() {
        return this.cells[Math.floor(Math.random() * this.cells.length)];
    }
}

export default Anatomy;
const BodyCell = require("./BodyCell");

class MoverCell extends BodyCell{
    constructor(org, loc_col, loc_row){
        super(org, loc_col, loc_row);
        this.org.anatomy.is_mover = true;
    }
}

module.exports = MoverCell;
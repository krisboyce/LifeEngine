const { Cells } = require("../../../Registry");

const BodyCellFactory = {
    init: function(CellRegistry) {
        this.CellRegistry = CellRegistry;
    },

    createInherited: function (org, to_copy) {
        var type = to_copy.getType();
        var cell = new type(org, to_copy.loc_col, to_copy.loc_row);
        cell.initInherit(to_copy);
        return cell;
    },

    createRandom: function (org, type, loc_col, loc_row) {
        var cell = new type(org, loc_col, loc_row);
        cell.initRandom();
        return cell;
    },

    createDefault: function (org, type, loc_col, loc_row) {
        var cell = new type(org, loc_col, loc_row);
        cell.initDefault();
        return cell;
    },
}

module.exports = BodyCellFactory;
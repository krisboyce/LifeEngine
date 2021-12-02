
const BodyCellFactory = {
    init: function(CellRegistry) {
        this.CellRegistry = CellRegistry;
    },

    createInherited: function (org, to_copy) {
        var type = this.CellRegistry.GetByName(to_copy.state.name).CellType;
        var cell = new type(org, to_copy.loc_col, to_copy.loc_row);
        cell.state = to_copy.state;
        cell.initInherit(to_copy);
        return cell;
    },

    createRandom: function (org, state, loc_col, loc_row) {
        var type = this.CellRegistry.GetByName(state.name).CellType;
        var cell = new type(org, loc_col, loc_row);
        cell.state = state;
        cell.initRandom();
        return cell;
    },

    createDefault: function (org, state, loc_col, loc_row) {
        var type = this.CellRegistry.GetByName(state.name).CellType;
        var cell = new type(org, loc_col, loc_row);
        cell.state = state;
        cell.initDefault();
        return cell;
    },
}

module.exports = BodyCellFactory;
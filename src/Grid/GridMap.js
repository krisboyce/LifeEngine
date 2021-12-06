import { Empty } from '../Organism/Cell/EnvironmentCells/EnvironmentCells';
import GridCell from '../Organism/Cell/GridCell';

class GridMap {
    constructor(env, cols, rows, cell_size) {
        this.env = env;
        this.resize(cols, rows, cell_size);
    }

    resize(cols, rows, cell_size) {
        this.grid = [];
        this.cols = cols;
        this.rows = rows;
        this.cell_size = cell_size;
        for(var c=0; c<cols; c++) {
            var row = [];
            for(var r=0; r<rows; r++) {
                var cell = new GridCell(Empty, c, r, c*cell_size, r*cell_size);
                row.push(cell);
            }            
            this.grid.push(row);
        }
    }

    fillGrid(type) {
        for (var col of this.grid) {
            for (var cell of col) {
                cell.setType(type);
                cell.owner = null;
                cell.cell_owner = null;
            }
        }
    }

    cellAt(col, row) {
        if (!this.isValidLoc(col, row)) {
            return null;
        }
        return this.grid[col][row];
    }

    setCellType(col, row, type) {
        if (!type) throw new Error("Type for cell must be defined.");
        if (!this.isValidLoc(col, row)) {
            return;
        }
        this.grid[col][row].setType(type);
    }

    setCellOwner(col, row, cell_owner) {
        if (!this.isValidLoc(col, row)) {
            return;
        }
        this.grid[col][row].cell_owner = cell_owner;
        if (cell_owner != null)
            this.grid[col][row].owner = cell_owner.org;
        else 
            this.grid[col][row].owner = null;
    }

    isValidLoc(col, row){
        return col<this.cols && row<this.rows && col>=0 && row>=0;
    }

    getCenter(){
        return [Math.floor(this.cols/2), Math.floor(this.rows/2)]
    }

    xyToColRow(x, y) {
        var c = Math.floor(x/this.cell_size);
        var r = Math.floor(y/this.cell_size);
        if (c >= this.cols)
            c = this.cols-1;
        else if (c < 0)
            c = 0;
        if (r >= this.rows)
            r = this.rows-1;
        else if (r < 0)
            r = 0;
        return [c, r];
    }
}

export default GridMap;

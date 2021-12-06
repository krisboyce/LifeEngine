import Environment from './Environment';
import Renderer from '../Rendering/Renderer';
import GridMap from '../Grid/GridMap';
import Organism from '../Organism/Organism';
import EnvironmentController from '../Controllers/EnvironmentController';
import HyperParameters from '../Hyperparameters.js';
import FossilRecord from '../Stats/FossilRecord';
import { Mouth, Producer } from '../Organism/Cell/BodyCells/BodyCells';
import { Empty, Food, Wall } from '../Organism/Cell/EnvironmentCells/EnvironmentCells';

class WorldEnvironment extends Environment{
    constructor(cell_size, registry) {
        super(registry);
        this.renderer = new Renderer('env-canvas', 'env', cell_size);
        this.controller = new EnvironmentController(this, this.renderer.canvas);
        var grid_rows = Math.ceil(this.renderer.height / cell_size);
        var grid_cols = Math.ceil(this.renderer.width / cell_size);
        this.grid_map = new GridMap(this, grid_cols, grid_rows, cell_size);
        this.organisms = [];
        this.walls = [];
        this.total_mutability = 0;
        this.auto_reset = true;
        this.largest_cell_count = 0;
        this.reset_count = 0;
        this.total_ticks = 0;
        this.data_update_rate = 100;
        FossilRecord.setEnv(this);
    }

    update() {
        var to_remove = [];
        for (var i in this.organisms) {
            var org = this.organisms[i];
            if (!org.living || !org.update()) {
                to_remove.push(i);
            }
        }
        if (HyperParameters.foodDropProb > 0) {
            this.generateFood();
        }
        this.removeOrganisms(to_remove);
        this.total_ticks ++;
        if (this.total_ticks % this.data_update_rate == 0) {
            FossilRecord.updateData();
        }
    }

    render() {
        if (HyperParameters.headless) {
            this.renderer.cells_to_render.clear();
            return;
        }
        this.renderer.renderCells();
        this.renderer.renderHighlights();
    }

    renderFull() {
        this.renderer.renderFullGrid(this.grid_map.grid);
    }

    removeOrganisms(org_indeces) {
        for (var i of org_indeces.reverse()){
            this.total_mutability -= this.organisms[i].mutability;
            this.organisms.splice(i, 1);
        }
        if (this.organisms.length == 0 && this.auto_reset){
            this.reset_count++;
            this.reset();
        }
    }

    OriginOfLife() {
        var center = this.grid_map.getCenter();
        var org = new Organism(center[0], center[1], this);
        org.anatomy.addDefaultCell(Mouth, 0, 0);
        org.anatomy.addDefaultCell(Producer, 1, 1);
        org.anatomy.addDefaultCell(Producer, -1, -1);
        this.addOrganism(org);
        FossilRecord.addSpecies(org, null);
    }

    addOrganism(organism) {
        organism.updateGrid();
        this.total_mutability += organism.mutability;
        this.organisms.push(organism);
        if (organism.anatomy.cells.length > this.largest_cell_count) 
            this.largest_cell_count = organism.anatomy.cells.length;
    }

    averageMutability() {
        if (this.organisms.length < 1)
            return 0;
        if (HyperParameters.useGlobalMutability) {
            return globalMutability;
        }
        return this.total_mutability / this.organisms.length;
    }

    changeCell(c, r, type, owner) {
        super.changeCell(c, r, type, owner);
        this.renderer.addToRender(this.grid_map.cellAt(c, r));
        if(type == Wall)
            this.walls.push(this.grid_map.cellAt(c, r));
    }

    clearWalls() {
        for(var wall of this.walls){
            if (this.grid_map.cellAt(wall.col, wall.row).type == Wall)
                this.changeCell(wall.col, wall.row, Empty, null);
        }
    }

    clearOrganisms() {
        for (var org of this.organisms)
            org.die();
        this.organisms = [];
    }

    generateFood() {
        var num_food = Math.max(Math.floor(this.grid_map.cols*this.grid_map.rows*HyperParameters.foodDropProb/50000), 1)
        var prob = HyperParameters.foodDropProb;
        for (var i=0; i<num_food; i++) {
            if (Math.random() <= prob){
                var c=Math.floor(Math.random() * this.grid_map.cols);
                var r=Math.floor(Math.random() * this.grid_map.rows);

                if (this.grid_map.cellAt(c, r).type == Empty){
                    this.changeCell(c, r, Food, null);
                }
            }
        }
    }

    reset() {
        this.organisms = [];
        this.grid_map.fillGrid(Empty);
        this.renderer.renderFullGrid(this.grid_map.grid);
        this.total_mutability = 0;
        this.total_ticks = 0;
        FossilRecord.clear_record();
        this.OriginOfLife();
    }

    resizeGridColRow(cell_size, cols, rows) {
        this.renderer.cell_size = cell_size;
        this.renderer.fillShape(rows*cell_size, cols*cell_size);
        this.grid_map.resize(cols, rows, cell_size);
    }

    resizeFillWindow(cell_size) {
        this.renderer.cell_size = cell_size;
        this.renderer.fillWindow('env');
        var cols = Math.ceil(this.renderer.width / cell_size);
        var rows = Math.ceil(this.renderer.height / cell_size);
        this.grid_map.resize(cols, rows, cell_size);
    }
}

export default WorldEnvironment;


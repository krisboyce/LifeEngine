import Environment from './Environment';
import Organism from '../Organism/Organism';
import GridMap from '../Grid/GridMap';
import Renderer from '../Rendering/Renderer';
import EditorController from "../Controllers/EditorController";
import Species from '../Stats/Species';
import { Mouth } from '../Organism/Cell/BodyCells/BodyCells';
import { Empty } from '../Organism/Cell/EnvironmentCells/EnvironmentCells';

class OrganismEditor extends Environment{
    constructor(registry) {
        super(registry);
        this.is_active = true;
        var cell_size = 13;
        this.renderer = new Renderer('editor-canvas', 'editor-env', cell_size);
        this.controller = new EditorController(this, this.renderer.canvas);
        this.Registry.Cells.Subscribe('register', (payload) => console.log(payload))
        this.grid_map = new GridMap(this, 15, 15, cell_size);
        this.clear();
    }

    update() {
        if (this.is_active){
            this.renderer.renderHighlights();
        }
    }

    changeCell(c, r, type, owner) {
        super.changeCell(c, r, type, owner);
        this.renderFull();
    }

    renderFull() {
        this.renderer.renderFullGrid(this.grid_map.grid);
    }

    // absolute c r, not local
    addCellToOrg(c, r, type) {
        var center = this.grid_map.getCenter();
        var loc_c = c - center[0];
        var loc_r = r - center[1];
        var prev_cell = this.organism.anatomy.getLocalCell(loc_c, loc_r)
        if (prev_cell != null) {
            var new_cell = this.organism.anatomy.replaceCell(type, prev_cell.loc_col, prev_cell.loc_row, false);
            this.changeCell(c, r, type, new_cell);
        }
        else if (this.organism.anatomy.canAddCellAt(loc_c, loc_r)){
            this.changeCell(c, r, type, this.organism.anatomy.addDefaultCell(type, loc_c, loc_r));
        }
        this.organism.species = new Species(this.organism.anatomy, null, 0);
    }

    removeCellFromOrg(c, r) {
        var center = this.grid_map.getCenter();
        var loc_c = c - center[0];
        var loc_r = r - center[1];
        if (loc_c == 0 && loc_r == 0){
            alert("Cannot remove center cell");
            return;
        }
        var prev_cell = this.organism.anatomy.getLocalCell(loc_c, loc_r)
        if (prev_cell != null) {
            if (this.organism.anatomy.removeCell(loc_c, loc_r)) {
                this.changeCell(c, r, Empty, null);
                this.organism.species = new Species(this.organism.anatomy, null, 0);
            }
        }
    }

    setOrganismToCopyOf(orig_org) {
        this.grid_map.fillGrid(Empty);
        var center = this.grid_map.getCenter();
        this.organism = new Organism(center[0], center[1], this, orig_org);
        this.organism.updateGrid();
        this.controller.updateDetails();
        this.controller.new_species = false;
    }
    
    getCopyOfOrg() {
        var new_org = new Organism(0, 0, null, this.organism);
        return new_org;
    }

    clear() {
        this.grid_map.fillGrid(Empty);
        var center = this.grid_map.getCenter();
        this.organism = new Organism(center[0], center[1], this, null);
        this.organism.anatomy.addDefaultCell(Mouth, 0, 0);
        this.organism.updateGrid();
        this.organism.species = new Species(this.organism.anatomy, null, 0);
    }
}

export default OrganismEditor;
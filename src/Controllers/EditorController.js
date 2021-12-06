import CanvasController from "./CanvasController";
import { None, Edit } from "./ControlModes";
import { rotateRight } from "../Organism/Directions";
import HyperParameters from "../Hyperparameters";
import { Eye } from "../Organism/Cell/BodyCells/BodyCells";
import { Cells } from "../Registry";

export default class EditorController extends CanvasController{
    constructor(env, canvas) {
        super(env, canvas);
        this.mode = None;
        this.edit_cell_type = null;
        this.highlight_org = false;
        this.new_species = false;
        this.defineCellTypeSelection();
        this.defineEditorDetails();
    }

    mouseMove() {
        if (this.right_click || this.left_click)
            this.editOrganism();
    }

    mouseDown() {
        this.editOrganism();
    }

    mouseUp(){}

    getCurLocalCell(){
        return this.env.organism.anatomy.getLocalCell(this.mouse_c-this.env.organism.c, this.mouse_r-this.env.organism.r);
    }

    editOrganism() {
        if (this.edit_cell_type == null || this.mode != Edit)
            return;
        if (this.left_click){
            if(this.edit_cell_type == Eye && this.cur_cell.getType() == Eye) {
                var loc_cell = this.getCurLocalCell();
                loc_cell.direction = rotateRight(loc_cell.direction);
                this.env.renderFull();
            }
            else
                this.env.addCellToOrg(this.mouse_c, this.mouse_r, this.edit_cell_type);
        }
        else if (this.right_click)
            this.env.removeCellFromOrg(this.mouse_c, this.mouse_r);

        this.new_species = true;
        this.setBrainPanelVisibility();
        this.setMoveRangeVisibility();
        this.updateDetails();
    }

    updateDetails() {
        $('.cell-count').text("Cell count: "+this.env.organism.anatomy.cells.length);
    }

    defineCellTypeSelection() {
        var self = this;
        const cells = Cells.WithTag('living');
        for (let i = 5; i > 0; i--) {
            $('#cell-selections').prepend(`<div style='grid-column: ${i};'>`)
        }
        for (let i = cells.length-1; i >=0 ; i--) {
            const cell = cells[i].state;
            const col = Math.floor(i / 4);
            const colEl = $('#cell-selections > div')[col];
            $(colEl).append(`<div class='cell-type' id='${cell.name}' title="${cell.description}"></div>`)
            $('#'+cell.name+'.cell-type ').css('background-color', cell.color);
            $('#'+cell.name+'.cell-legend-type').css('background-color', cell.color);
        }
        $('.cell-type').click( function() {
            let type = Cells.GetByName(this.id);
            if(type){
                self.edit_cell_type = type;
            }

            $(".cell-type" ).css( "border-color", "black" );
            var selected = '#'+this.id+'.cell-type';
            $(selected).css("border-color", "yellow");
        });
    }

    defineEditorDetails() {
        this.details_html = $('#organism-details');
        this.edit_details_html = $('#edit-organism-details');

        this.decision_names = ["ignore", "move away", "move towards"];

        $('#move-range-edit').change ( function() {
            this.env.organism.move_range = parseInt($('#move-range-edit').val());
        }.bind(this));
        $('#observation-type-edit').change ( function() {
            this.setBrainEditorValues($('#observation-type-edit').val());
            this.setBrainDetails();
        }.bind(this));
        $('#reaction-edit').change ( function() {
            var obs = $('#observation-type-edit').val();
            var decision = parseInt($('#reaction-edit').val());
            this.env.organism.brain.decisions[obs] = decision;
            this.setBrainDetails();
        }.bind(this));
    }

    clearDetailsPanel() {
        $('#organism-details').css('display', 'none');
        $('#edit-organism-details').css('display', 'none');
    }

    setDetailsPanel() {
        this.clearDetailsPanel();
        var org = this.env.organism;
        
        $('.cell-count').text("Cell count: "+org.anatomy.cells.length);
        $('#move-range').text("Move Range: "+org.move_range);
        $('#mutation-rate').text("Mutation Rate: "+org.mutability);
        if (HyperParameters.useGlobalMutability) {
            $('#mutation-rate').css('display', 'none');
        }
        else {
            $('#mutation-rate').css('display', 'block');
        }

        this.setMoveRangeVisibility();

        if (this.setBrainPanelVisibility()) {
            this.setBrainDetails();

        }
        $('#organism-details').css('display', 'block');
    }

    setEditorPanel() {
        this.clearDetailsPanel();
        var org = this.env.organism;

        $('.cell-count').text("Cell count: "+org.anatomy.cells.length);
        if (this.setMoveRangeVisibility()){
            $('#move-range-edit').val(org.move_range);
        }
        
        if (this.setBrainPanelVisibility()){
            this.setBrainEditorValues($('#observation-type-edit').val());
        }

        $('#cell-selections').css('display', 'grid');
        $('#edit-organism-details').css('display', 'block');
    }

    setBrainPanelVisibility() {
        var org = this.env.organism;
        if (org.anatomy.has_eyes && org.anatomy.is_mover) {
            $('.brain-details').css('display', 'block');
            return true;
        }
        $('.brain-details').css('display', 'none');
        return false;
    }

    setBrainDetails() {
        var chase_types = [];
        var retreat_types = [];
        for(var cell_name in this.env.organism.brain.decisions) {
            var decision = this.env.organism.brain.decisions[cell_name];
            if (decision == 1) {
                retreat_types.push(cell_name)
            }
            else if (decision == 2) {
                chase_types.push(cell_name);
            }
        }
        $('.chase-types').text("Move Towards: " + chase_types);
        $('.retreat-types').text("Move Away From: " + retreat_types);
    }

    setMoveRangeVisibility() {
        var org = this.env.organism;
        if (org.anatomy.is_mover) {
            $('#move-range-cont').css('display', 'block');
            $('#move-range').css('display', 'block');
            return true;
        }
        $('#move-range-cont').css('display', 'none');
        $('#move-range').css('display', 'none');
        return false;
    }

    setBrainEditorValues(name) {
        $('#observation-type-edit').val(name);
        var reaction = this.env.organism.brain.decisions[name];
        $('#reaction-edit').val(reaction);
    }
}
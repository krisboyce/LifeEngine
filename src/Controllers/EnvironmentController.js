import CanvasController from "./CanvasController";
import Organism from '../Organism/Organism';
import { Drag, None, FoodDrop, WallDrop, ClickKill, Select, Clone } from "./ControlModes";
import { allSelf, all } from "../Grid/Neighbors";
import FossilRecord from "../Stats/FossilRecord";
import HyperParameters from "../Hyperparameters";
import { Empty, Food, Wall } from "../Organism/Cell/EnvironmentCells/EnvironmentCells";

export default class EnvironmentController extends CanvasController{
    constructor(env, canvas) {
        super(env, canvas);
        this.mode = Drag;
        this.org_to_clone = null;
        this.add_new_species = false;
        this.defineZoomControls();
        this.scale = 1;
    }

    defineZoomControls() {
          var scale = 1;
          var zoom_speed = 0.5;
          const el = document.querySelector('#env-canvas');
          el.onwheel = function zoom(event) {
            event.preventDefault();

            var sign = -Math.sign(event.deltaY);

            // Restrict scale
            scale = Math.max(0.5, this.scale+(sign*zoom_speed));

            if (scale != 0.5) {
                var cur_top = parseInt($('#env-canvas').css('top'));
                var cur_left = parseInt($('#env-canvas').css('left'));
                if (sign == 1) {
                    // If we're zooming in, zoom towards wherever the mouse is
                    var diff_x = ((this.canvas.width/2-cur_left/this.scale) - this.mouse_x)*this.scale/1.5;
                    var diff_y = ((this.canvas.height/2-cur_top/this.scale) - this.mouse_y)*this.scale/1.5;
                }
                else {
                    // If we're zooming out, zoom out towards the center
                    var diff_x = -cur_left/scale;
                    var diff_y = -cur_top/scale;
                }
                $('#env-canvas').css('top', (cur_top+diff_y)+'px');
                $('#env-canvas').css('left', (cur_left+diff_x)+'px');
            }
          
            // Apply scale transform
            el.style.transform = `scale(${scale})`;
            this.scale = scale;

          }.bind(this);
    }

    resetView() {
        $('#env-canvas').css('transform', 'scale(1)');
        $('#env-canvas').css('top', '0px');
        $('#env-canvas').css('left', '0px');
        this.scale = 1;
    }

    updateMouseLocation(offsetX, offsetY){
        
        super.updateMouseLocation(offsetX, offsetY);
    }

    mouseMove() {
        this.performModeAction();
    }

    mouseDown() {
        this.start_x = this.mouse_x;
        this.start_y = this.mouse_y;
        this.performModeAction();
    }

    mouseUp() {

    }

    performModeAction() {
        if (HyperParameters.headless)
            return;
        var mode = this.mode;
        var right_click = this.right_click;
        var left_click = this.left_click;
        if (mode != None && (right_click || left_click)) {
            var cell = this.cur_cell;
            if (cell == null){
                return;
            }
            switch(mode) {
                case FoodDrop:
                    if (left_click){
                        this.dropCellType(cell.col, cell.row, Food, false);
                    }
                    else if (right_click){
                        this.dropCellType(cell.col, cell.row, Empty, false);
                    }
                    break;
                case WallDrop:
                        if (left_click){
                            this.dropCellType(cell.col, cell.row, Wall, true);

                        }
                        else if (right_click){
                            this.dropCellType(cell.col, cell.row, Empty, false);
                        }
                        break;
                case ClickKill:
                    this.killNearOrganisms();
                    break;

                case Select:
                    if (this.cur_org == null) {
                        this.cur_org = this.findNearOrganism();
                    }
                    if (this.cur_org != null){
                        this.control_panel.setEditorOrganism(this.cur_org);
                    }
                    break;

                case Clone:
                    if (this.org_to_clone != null){
                        var new_org = new Organism(this.mouse_c, this.mouse_r, this.env, this.org_to_clone);
                        if (this.add_new_species){
                            FossilRecord.addSpeciesObj(new_org.species);
                            new_org.species.start_tick = this.env.total_ticks;
                            this.add_new_species = false;
                            new_org.species.population = 0;
                        }
                        else if (this.org_to_clone.species.extinct){
                            FossilRecord.resurrect(this.org_to_clone.species);
                        }

                        if (new_org.isClear(this.mouse_c, this.mouse_r)){
                            this.env.addOrganism(new_org);
                            new_org.species.addPop();
                        }
                    }
                    break;
                case Drag:
                    var cur_top = parseInt($('#env-canvas').css('top'), 10);
                    var cur_left = parseInt($('#env-canvas').css('left'), 10);
                    var new_top = cur_top + ((this.mouse_y - this.start_y)*this.scale);
                    var new_left = cur_left + ((this.mouse_x - this.start_x)*this.scale);
                    $('#env-canvas').css('top', new_top+'px');
                    $('#env-canvas').css('left', new_left+'px');
                    break;
            }
        }
    }

    dropCellType(col, row, type, killBlocking=false) {
        for (var loc of allSelf){
            var c=col + loc[0];
            var r=row + loc[1];
            var cell = this.env.grid_map.cellAt(c, r);
            if (cell == null)
                continue;
            if (killBlocking && cell.owner != null){
                cell.owner.die();
            }
            else if (cell.owner != null) {
                continue;
            }
            this.env.changeCell(c, r, type, null);
        }
    }

    findNearOrganism() {
        for (var loc of all){
            var c = this.cur_cell.col + loc[0];
            var r = this.cur_cell.row + loc[1];
            var cell = this.env.grid_map.cellAt(c, r);
            if (cell != null && cell.owner != null)
                return cell.owner;
        }
        return null;
    }

    killNearOrganisms() {
        for (var loc of allSelf){
            var c = this.cur_cell.col + loc[0];
            var r = this.cur_cell.row + loc[1];
            var cell = this.env.grid_map.cellAt(c, r);
            if (cell != null && cell.owner != null)
                cell.owner.die();
        }
    }


}
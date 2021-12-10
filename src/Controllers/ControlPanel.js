import HyperParameters from "../Hyperparameters";
import { FoodDrop, WallDrop, ClickKill, Select, Edit, Clone, Drag } from "./ControlModes";
import StatsPanel from "../Stats/StatsPanel";
import { Cells } from "../Registry";

class ControlPanel {
    constructor(engine) {
        this.engine = engine;
        this.defineAbout();
        this.defineMinMaxControls();
        this.defineEngineSpeedControls();
        this.defineGridSizeControls();
        this.defineTabNavigation();
        this.defineHyperparameterControls();
        this.defineModeControls();
        this.defineChallenges();
        this.fps = engine.fps;
        this.organism_record=0;
        this.env_controller = this.engine.env.controller;
        this.editor_controller = this.engine.organism_editor.controller;
        this.env_controller.setControlPanel(this);
        this.editor_controller.setControlPanel(this);
        this.stats_panel = new StatsPanel(this.engine.env);
        this.headless_opacity = 1;
        this.opacity_change_rate = -0.8;
        this.paused=false;
    }

    defineAbout() {
        					// 		<!-- <div class='cell-legend-type' id='mouth' title=""></div>
							// <div class='cell-legend-type' id='producer' title="Producer: Produces adjacent food."></div>
							// <div class='cell-legend-type' id='mover' title="Mover: Allows for movement and rotation."></div>
							// <div class='cell-legend-type' id='killer' title="Killer: Harms oranisms in adjacent cells."></div>
							// <div class='cell-legend-type' id='armor' title="Armor: Negates affects of killer cell."></div>
							// <div class='cell-legend-type' id='eye' title="Eye: Observes cells and decides movement."></div>
							// <div class='cell-legend-type' id='food' title=""></div>
							// 
        
        for (let Cell of Cells.All()) {
            console.log(Cell.state);
            $('#cell-legend')
                .append(`<div class='cell-legend-type' id='${Cell.state.name}' title="${Cell.state.description}"></div>`)
            $('#'+Cell.state.name+'.cell-legend-type').css('background-color', Cell.state.color);
        }
    }

    defineMinMaxControls(){
        this.control_panel_active = true;
        this.no_hud = false;
        $('#minimize').click ( () => {
            $('.control-panel').css('display', 'none');
            $('.hot-controls').css('display', 'block');
            this.control_panel_active = false;
            this.stats_panel.stopAutoRender();
        });
        $('#maximize').click ( () => {
            $('.control-panel').css('display', 'grid');
            $('.hot-controls').css('display', 'none');
            this.control_panel_active = true;
            if (this.tab_id == 'stats') {
                this.stats_panel.startAutoRender();
            }
        });
        const V_KEY = 118;
        $('body').keypress( (e) => {
            if (e.which === V_KEY) {
                if (this.no_hud) {
                    let control_panel_display = this.control_panel_active ? 'grid' : 'none';
                    let hot_control_display = !this.control_panel_active ? 'block' : 'none';
                    if (this.control_panel_active && this.tab_id == 'stats') {
                        this.stats_panel.startAutoRender();
                    };
                    $('.control-panel').css('display', control_panel_display);
                    $('.hot-controls').css('display', hot_control_display);
                }
                else {
                    $('.control-panel').css('display', 'none');
                    $('.hot-controls').css('display', 'none');
                }
                this.no_hud = !this.no_hud;
            }
        });
        // var self = this;
        // $('#minimize').click ( function() {
        //     $('.control-panel').css('display', 'none');
        //     $('.hot-controls').css('display', 'block');
            
        // }.bind(this));
        // $('#maximize').click ( function() {
        //     $('.control-panel').css('display', 'grid');
        //     $('.hot-controls').css('display', 'none');
        //     if (self.tab_id == 'stats') {
        //         self.stats_panel.startAutoRender();
        //     }
        // });
    }

    defineEngineSpeedControls(){
        this.slider = document.getElementById("slider");
        this.slider.oninput = function() {
            this.fps = this.slider.value
            if (this.engine.running) {
                this.changeEngineSpeed(this.fps);
            }
            $('#fps').text("Target FPS: "+this.fps);
        }.bind(this);
        $('.pause-button').click(function() {
            $('.pause-button').find("i").toggleClass("fa fa-pause");
            $('.pause-button').find("i").toggleClass("fa fa-play");
            this.paused = !this.paused;
            if (this.engine.running) {
                this.engine.stop();
            }
            else if (!this.engine.running){
                this.engine.start(this.fps);
            }
        }.bind(this));
        $('.headless').click(function() {
            $('.headless').find("i").toggleClass("fa fa-eye");
            $('.headless').find("i").toggleClass("fa fa-eye-slash");
            if (HyperParameters.headless){
                $('#headless-notification').css('display', 'none');
                this.engine.env.renderFull();
            }
            else {
                $('#headless-notification').css('display', 'block');
            }
            HyperParameters.headless = !HyperParameters.headless;
        }.bind(this));
    }

    defineGridSizeControls() {
        $('#fill-window').change(function() {
            if (this.checked)
                $('.col-row-input').css('display' ,'none');
            else
                $('.col-row-input').css('display' ,'block');
        });

        $('#resize').click(function() {
            var cell_size = $('#cell-size').val();
            var fill_window = $('#fill-window').is(":checked");
            if (fill_window) {
                this.engine.env.resizeFillWindow(cell_size);
            }
            else {
                var cols = $('#col-input').val();
                var rows = $('#row-input').val();
                this.engine.env.resizeGridColRow(cell_size, cols, rows);
            }
            this.engine.env.reset();
            this.stats_panel.reset();
            
        }.bind(this));
    }

    defineTabNavigation() {
        this.tab_id = 'about';
        var self = this;
        $('.tabnav-item').click(function() {
            $('.tab').css('display', 'none');
            var tab = '#'+this.id+'.tab';
            $(tab).css('display', 'grid');
            self.engine.organism_editor.is_active = (this.id == 'editor');
            self.stats_panel.stopAutoRender();
            if (this.id == 'stats') {
                self.stats_panel.startAutoRender();
            }
            self.tab_id = this.id;
        });
    }

    defineHyperparameterControls() {
        $('#food-prod-prob').change(function() {
            HyperParameters.foodProdProb = $('#food-prod-prob').val();
        }.bind(this));
        $('#lifespan-multiplier').change(function() {
            HyperParameters.lifespanMultiplier = $('#lifespan-multiplier').val();
        }.bind(this));

        $('#mover-rot').change(function() {
            HyperParameters.moversCanRotate = this.checked;
        });
        $('#offspring-rot').change(function() {
            HyperParameters.offspringRotate = this.checked;
        });
        $('#insta-kill').change(function() {
            HyperParameters.instaKill = this.checked;
        });
        $('#look-range').change(function() {
            HyperParameters.lookRange = $('#look-range').val();
        });
        $('#food-drop-rate').change(function() {
            HyperParameters.foodDropProb = $('#food-drop-rate').val();
        });

        $('#evolved-mutation').change( function() {
            if (this.checked) {
                $('.global-mutation-in').css('display', 'none');
                $('#avg-mut').css('display', 'block');
            }
            else {
                $('.global-mutation-in').css('display', 'block');
                $('#avg-mut').css('display', 'none');
            }
            HyperParameters.useGlobalMutability = !this.checked;
        });
        $('#global-mutation').change( function() {
            HyperParameters.globalMutability = parseInt($('#global-mutation').val());
        });
        $('.mut-prob').change( function() {
            switch(this.id){
                case "add-prob":
                    HyperParameters.addProb = this.value;
                    HyperParameters.balanceMutationProbs(1);
                    break;
                case "change-prob":
                    HyperParameters.changeProb = this.value;
                    HyperParameters.balanceMutationProbs(2);
                    break;
                case "remove-prob":
                    HyperParameters.removeProb = this.value;
                    HyperParameters.balanceMutationProbs(3);
                    break;
            }
            $('#add-prob').val(Math.floor(HyperParameters.addProb));
            $('#change-prob').val(Math.floor(HyperParameters.changeProb));
            $('#remove-prob').val(Math.floor(HyperParameters.removeProb));
        });
        $('#movers-produce').change( function() {
            HyperParameters.moversCanProduce = this.checked;
        });
        $('#food-blocks').change( function() {
            HyperParameters.foodBlocksReproduction = this.checked;        
        });
        $('#reset-rules').click( function() {
            HyperParameters.setDefaults();
            $('#food-prod-prob').val(HyperParameters.foodProdProb);
            $('#lifespan-multiplier').val(HyperParameters.lifespanMultiplier);
            $('#mover-rot').prop('checked', HyperParameters.moversCanRotate);
            $('#offspring-rot').prop('checked', HyperParameters.offspringRotate);
            $('#insta-kill').prop('checked', HyperParameters.instaKill);
            $('#evolved-mutation').prop('checked', !HyperParameters.useGlobalMutability);
            $('#add-prob').val(HyperParameters.addProb);
            $('#change-prob').val(HyperParameters.changeProb);
            $('#remove-prob').val(HyperParameters.removeProb);
            $('#movers-produce').prop('checked', HyperParameters.moversCanProduce);
            $('#food-blocks').prop('checked', HyperParameters.foodBlocksReproduction);
            $('#food-drop-rate').val(HyperParameters.foodDropProb);
            $('#look-range').val(HyperParameters.lookRange);

            if (!HyperParameters.useGlobalMutability) {
                $('.global-mutation-in').css('display', 'none');
                $('#avg-mut').css('display', 'block');
            }
            else {
                $('.global-mutation-in').css('display', 'block');
                $('#avg-mut').css('display', 'none');
            }
        });
    }

    defineModeControls() {
        var self = this;
        $('.edit-mode-btn').click( function() {
            $('#cell-selections').css('display', 'none');
            $('#organism-options').css('display', 'none');
            self.editor_controller.setDetailsPanel();
            switch(this.id) {
                case "food-drop":
                    self.setMode(FoodDrop);
                    break;
                case "wall-drop":
                    self.setMode(WallDrop);
                    break;
                case "click-kill":
                    self.setMode(ClickKill);
                    break;
                case "select":
                    self.setMode(Select);
                    break;
                case "edit":
                    self.setMode(Edit);
                    self.editor_controller.setEditorPanel();
                    break;
                case "drop-org":
                    self.setMode(Clone);
                    self.env_controller.org_to_clone = self.engine.organism_editor.getCopyOfOrg();
                    self.env_controller.add_new_species = self.editor_controller.new_species;
                    self.editor_controller.new_species = false;
                    // console.log(self.env_controller.add_new_species)
                    break;
                case "drag-view":
                    self.setMode(Drag);
            }
            $('.edit-mode-btn').css('background-color', '#9099c2');
            $('#'+this.id).css('background-color', '#81d2c7');
        });

        $('.reset-view').click( function(){
            this.env_controller.resetView();
        }.bind(this));

        var env = this.engine.env;
        $('#reset-env').click( function() {
            this.engine.env.reset();
            this.stats_panel.reset();
        }.bind(this));
        $('#auto-reset').change(function() {
            env.auto_reset = this.checked;
        });
        $('#clear-walls').click( function() {
            if (confirm("Are you sure you want to clear all the walls?")) {
                this.engine.env.clearWalls();
            }
        }.bind(this));
        $('#clear-editor').click( function() {
            this.engine.organism_editor.clear();
            this.editor_controller.setEditorPanel();
        }.bind(this));
    }

    defineChallenges() {
        $('.challenge-btn').click(function() {
            $('#challenge-title').text($(this).text());
            $('#challenge-description').text($(this).val());
        });
    }

    setMode(mode) {
        this.env_controller.mode = mode;
        this.editor_controller.mode = mode;
    }

    setEditorOrganism(org) {
        this.engine.organism_editor.setOrganismToCopyOf(org);
        this.editor_controller.clearDetailsPanel();
        this.editor_controller.setDetailsPanel();
    }

    changeEngineSpeed(change_val) {
        this.engine.stop();
        this.engine.start(change_val)
        this.fps = this.engine.fps;
    }

    updateHeadlessIcon(delta_time) {
        if (this.paused)
            return;
        var op = this.headless_opacity + (this.opacity_change_rate*delta_time/1000);
        if (op <= 0.4){
            op=0.4;
            this.opacity_change_rate = -this.opacity_change_rate;
        }
        else if (op >= 1){
            op=1;
            this.opacity_change_rate = -this.opacity_change_rate;
        }
        this.headless_opacity = op;
        $('#headless-notification').css('opacity',(op*100)+'%');
    }

    update(delta_time) {
        $('#fps-actual').text("Actual FPS: " + Math.floor(this.engine.actual_fps));
        $('#reset-count').text("Auto reset count: " + this.engine.env.reset_count);
        this.stats_panel.updateDetails();
        if (HyperParameters.headless)
            this.updateHeadlessIcon(delta_time);

    }

}


export default ControlPanel;
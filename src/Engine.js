const WorldEnvironment = require('./Environments/WorldEnvironment');
const ControlPanel = require('./Controllers/ControlPanel');
const OrganismEditor = require('./Environments/OrganismEditor');
const ColorScheme = require('./Rendering/ColorScheme');
const Registry = require('./Registry');
const BodyCellFactory = require('./Organism/Cell/BodyCells/BodyCellFactory');
const { Mouth, Producer, Mover, Armor, Killer, Eye } = require('./Organism/Cell/BodyCells/BodyCells')

const render_speed = 60;

class Engine {
    constructor(){
        this.fps = 60;
        this.registry = new Registry();
        this.registry.RegisterEnvironmentCell('empty', '#0E1318');
        this.registry.RegisterEnvironmentCell('wall', 'gray');
        this.registry.RegisterEnvironmentCell('food', '#2F7AB7');
        
        this.registry.RegisterBodyCell('mouth', '#DEB14D', Mouth);
        this.registry.RegisterBodyCell('producer', '#15DE59', Producer);
        this.registry.RegisterBodyCell('mover', '#60D4FF', Mover);
        this.registry.RegisterBodyCell('armor', '#7230DB', Armor);
        this.registry.RegisterBodyCell('killer', '#F82380', Killer);
        this.registry.RegisterBodyCell('eye', '#B6C1EA', Eye, (ctx, cell, size) => {
            ctx.fillStyle = this.color;
            ctx.fillRect(cell.x, cell.y, size, size);
            if(size == 1)
                return;
            var half = size/2;
            var x = -(size)/8
            var y = -half;
            var h = size/2 + size/4;
            var w = size/4;
            ctx.translate(cell.x+half, cell.y+half);
            ctx.rotate((cell.cell_owner.getAbsoluteDirection() * 90) * Math.PI / 180);
            ctx.fillStyle = this.slit_color;
            ctx.fillRect(x, y, w, h);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        });

        BodyCellFactory.init(this.registry.Cells);
        this.env = new WorldEnvironment(5, this.registry);
        this.organism_editor = new OrganismEditor(this.registry);
        this.controlpanel = new ControlPanel(this);
        this.colorscheme = new ColorScheme(this.env, this.organism_editor);
        this.colorscheme.loadColorScheme();
        this.env.OriginOfLife();
        this.last_update = Date.now();
        this.delta_time = 0;
        this.actual_fps = 0;
        this.running = false;

        
        
    }

    start(fps=60) {
        if (fps <= 0)
            fps = 1;
        this.fps = fps;
        this.game_loop = setInterval(function(){this.updateDeltaTime();this.environmentUpdate();}.bind(this), 1000/fps);
        this.running = true;
        if (this.fps >= render_speed) {
            if (this.render_loop != null) {
                clearInterval(this.render_loop);
                this.render_loop = null;
            }
        }
        else
            this.setRenderLoop();
    }
    
    stop() {
        clearInterval(this.game_loop);
        this.running = false;
        this.setRenderLoop();
    }

    setRenderLoop() {
        if (this.render_loop == null) {
            this.render_loop = setInterval(function(){this.updateDeltaTime();this.necessaryUpdate();}.bind(this), 1000/render_speed);
        }
    }

    updateDeltaTime() {
        this.delta_time = Date.now() - this.last_update;
        this.last_update = Date.now();
    }


    environmentUpdate() {
        this.env.update(this.delta_time);
        this.actual_fps = 1/this.delta_time*1000;
        if(this.render_loop == null){
            this.necessaryUpdate();
        }
            
    }

    necessaryUpdate() {
        this.env.render();
        this.controlpanel.update(this.delta_time);
        this.organism_editor.update();
    }

}

module.exports = Engine;

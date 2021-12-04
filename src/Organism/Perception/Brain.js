const Hyperparams = require("../../Hyperparameters");
const Directions = require("../Directions");

const Decision = {
    neutral: 0,
    retreat: 1,
    chase: 2,
    getRandom: function(){
        return Math.floor(Math.random() * 3);
    },
    getRandomNonNeutral: function() {
        return Math.floor(Math.random() * 2)+1;
    }
}

class Brain {
    constructor(owner){
        this.owner = owner;
        this.observations = [];

        // corresponds to CellTypes
        this.decisions = [];
        const names = owner.env.Registry.Cells.All().map(x => x.name).forEach(name => {
            this.decisions[name] = Decision.neutral;
        });

        this.decisions['food'] = Decision.chase;
        this.decisions['killer'] = Decision.retreat;
    }

    randomizeDecisions() {
        // randomize the non obvious decisions
        this.decisions['mouth'] = Decision.getRandom();
        this.decisions['producer'] = Decision.getRandom();
        this.decisions['mover'] = Decision.getRandom();
        this.decisions['armor'] = Decision.getRandom();
        this.decisions['eye'] = Decision.getRandom();
    }

    observe(observation) {
        this.observations.push(observation);
    }

    decide() {
        var decision = Decision.neutral;
        var closest = Hyperparams.lookRange + 1;
        var move_direction = 0;
        for (var obs of this.observations) {
            if (obs.cell == null || obs.cell.owner == this.owner) {
                continue;
            }
            if (obs.distance < closest) {
                // console.log(obs.cell.state)
                decision = this.decisions[obs.cell.state.name];
                // console.log(decision)
                move_direction = obs.direction;
                closest = obs.distance;
            }
        }
        this.observations = [];
        if (decision == Decision.chase) {
            this.owner.changeDirection(move_direction);
            return true;
        }
        else if (decision == Decision.retreat) {
            this.owner.changeDirection(Directions.getOppositeDirection(move_direction));
            return true;
        }
        return false;
    }

    mutate() {
        this.decisions[this.owner.env.Registry.getRandomName()] = Decision.getRandom();
        this.decisions['empty'] = Decision.neutral; // if the empty cell has a decision it gets weird
    }
}

module.exports = Brain;
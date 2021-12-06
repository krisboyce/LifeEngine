import { adjacent, all } from "./Grid/Neighbors";

const HyperParameters = {
    setDefaults: function() {
        this.headless = false;
    
        this.lifespanMultiplier = 100;
        this.foodProdProb = 4;
        this.foodProdProbScalar = 4;
        this.killableNeighbors = adjacent;
        this.edibleNeighbors = adjacent;
        this.growableNeighbors = adjacent;
    
        this.useGlobalMutability = false;
        this.globalMutability = 5;
        this.addProb = 33;
        this.changeProb = 33;
        this.removeProb = 33;
        
        this.moversCanRotate = true;
        this.offspringRotate = true;
    
        this.foodBlocksReproduction = true;
        this.moversCanProduce = false;
    
        this.instaKill = false;
    
        this.lookRange = 20;
    
        this.foodDropProb = 0;
    },
    balanceMutationProbs: function(choice) {
        if (choice == 1) {
            var remaining = 100 - this.addProb;
            this.changeProb = remaining/2;
            this.removeProb = remaining/2;
        }
        else if (choice == 2) {
            var remaining = 100 - this.changeProb;
            this.addProb = remaining/2;
            this.removeProb = remaining/2;
        }
        else {
            var remaining = 100 - this.removeProb;
            this.changeProb = remaining/2;
            this.addProb = remaining/2;
        }
    }
}

HyperParameters.setDefaults();

export default HyperParameters;
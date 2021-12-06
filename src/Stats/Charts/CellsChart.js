import { Cells } from "../../Registry";
import FossilRecord from "../FossilRecord";
import ChartController from "./ChartController";

class CellsChart extends ChartController {
    constructor(registry) {
        super("Organism Size / Composition", 
            "Avg. Number of Cells per Organism",
            "Note: to maintain efficiency, species with very small populations are discarded when collecting cell statistics.");
        this.registry = registry;
    }

    setData() {
        this.clear();
        //this.mouth, this.producer, this.mover, this.killer, this.armor, this.eye
        this.data.push({
                type: "line",
                markerType: "none",
                color: 'black',
                showInLegend: true, 
                name: "pop1",
                legendText: "Avg. organism size",
                dataPoints: []
            }
        );
        for (var c of Cells.WithTag('living')) {
            this.data.push({
                type: "line",
                markerType: "none",
                color: c.color,
                showInLegend: true, 
                name: c.name,
                legendText: "Avg. " + c.name + " cells",
                dataPoints: []
            }
        );
        }
        this.addAllDataPoints();


    }

    addDataPoint(i) {
        var t = FossilRecord.tick_record[i];
        var p = FossilRecord.av_cells[i];
        this.data[0].dataPoints.push({x:t, y:p});
        var j=1;
        for (var name in FossilRecord.av_cell_counts[i]) {
            var count = FossilRecord.av_cell_counts[i][name];
            try{
            this.data[j].dataPoints.push({x:t,y:count})
            }catch(err){
                console.log(err);
            }
            j++;
        }
    }
}

export default CellsChart;
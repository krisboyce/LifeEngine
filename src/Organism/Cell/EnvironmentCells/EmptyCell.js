import { CellState } from "../CellState";
import EnvironmentCell from "./EnvironmentCell";

export default class EmptyCell extends EnvironmentCell {
    static state = new CellState('empty', '#0E1318', '');
    constructor(){
        super();
    }
} 
import { CellState } from "../CellState";
import EnvironmentCell from "./EnvironmentCell";

export default class FoodCell extends EnvironmentCell {
    static state = new CellState('food', '#2F7AB7', '');
    constructor(){
        super();
    }
}
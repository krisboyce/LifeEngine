import { CellState } from "../CellState";
import { CellTags } from "../CellTags";
import EnvironmentCell from "./EnvironmentCell";

export default class FoodCell extends EnvironmentCell {
    static state = new CellState(
        'food',
        '#2F7AB7',
        'Food: Not part of an organism. Once an organism has eaten enough food, it will reproduce.',
        [CellTags.Nourishment, CellTags.Observable, CellTags.Passable, ...super.state.tags]
    );

    constructor(){
        super();
    }
}
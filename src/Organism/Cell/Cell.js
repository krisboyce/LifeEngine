import { Cells } from "../../Registry";

export default class Cell {
    static state;
    constructor(){

    }

    getType(){
        return this.constructor;
    }
}
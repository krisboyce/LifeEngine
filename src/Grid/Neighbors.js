// contains local cell values for the following:

//all       ...
//          .x.
//          ...

//adjacent   .
//          .x.
//           .

//corners   . .
//           x
//          . .

//allSelf   ...
//          ...
//          ...

export const all = [[0, 1],[0, -1],[1, 0],[-1, 0],[-1, -1],[1, 1],[-1, 1],[1, -1]];
export const adjacent = [[0, 1],[0, -1],[1, 0],[-1, 0]];
export const corners = [[-1, -1],[1, 1],[-1, 1],[1, -1]];
export const allSelf = [[0, 0],[0, 1],[0, -1],[1, 0],[-1, 0],[-1, -1],[1, 1],[-1, 1],[1, -1]];


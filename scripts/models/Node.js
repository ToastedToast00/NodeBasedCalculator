export class Node 
{
    constructor(type, x = 0, y = 0)
    {
        this.id = crypto.randomUUID;
        this.type = type;

        //position in the workspace
        this.x = x;
        this.y = y;

        //ports (will be filled by NodeRegistry later)
        this.inputs = {};
        this.outputs = {};

        //connections
        this.connectionsIn = [];        // { fromNodeId, fromPort }
        this.connectionsOut = [];       // { toNodeId, toPort }
    }
}
import { Node } from "./Node";

export class Graph 
{
    constructor()
    {
        this.nodes = new Map();     //id -> Node
        this.connections = [];      //global list of connections
    }

    // create a new node
    createNode (type, x = 100, y = 100)
    {
        const node = new Node(type, x, y);
        this.nodes.set(node.id, node);
        return node;
    }

    // move an existing node
    moveNode(nodeId, newX, newY)
    {
        const node = this.nodes.get(nodeId);
        if (!node) return;
        node.x = newX;
        node.y = newY;
    }

    // delete a node and clean up connections
    deleteNode(nodeId)
    {
        const node = this.nodes.get(nodeId);
        if (!node) return;

        //remove inbound connections
        node.connectionsIn.foreach(conn => 
        {
            const fromNode = this.nodes.get(conn.fromNodeId);
            if (fromNode)
            {
                fromNode.connectionsOut =
                    fromNode.connectionsOut.filter (c => c.toNodeId != nodeId);
            }
        });

        //remove outbound connections
        node.connectionsOut.foreach(conn => 
        {
            const toNode = this.nodes.get(conn.toNodeId);
            if (toNode)
            {
                toNode.connectionsIn = 
                    toNode.connectionsIn.filter(c => c.fromNodeId != nodeId);
            }
        })

        //deletes the node
        this.nodes.delete(nodeId);
    }

    connectNodes(outNodeId, outPort, inNodeId, inPort) {;
    const outNode = this.nodes.get(outNodeId);
    const inNode = this.nodes.get(inNodeId);

    if (!outNode || !inNode) {
        throw new Error("One or both nodes do not exist.");
    }

    // 1. Validate ports exist
    if (!(outPort in outNode.outputs)) {
        throw new Error(`Output port '${outPort}' does not exist on node ${outNodeId}`);
    }

    if (!(inPort in inNode.inputs)) {
        throw new Error(`Input port '${inPort}' does not exist on node ${inNodeId}`);
    }

    // 2. Validate type compatibility
    const outType = outNode.outputs[outPort].type;
    const inType = inNode.inputs[inPort].type;

    if (outType !== inType) {
        throw new Error(`Type mismatch: ${outType} → ${inType} is not allowed.`);
    }

    // 3. Prevent circular connections
    if (this._createsCycle(outNodeId, inNodeId)) {
        throw new Error("Connection would create a circular dependency.");
    }

    // 4. Add connection to both nodes
    outNode.connectionsOut.push({ toNodeId: inNodeId, toPort: inPort });
    inNode.connectionsIn.push({ fromNodeId: outNodeId, fromPort: outPort });

    // 5. Add to global connection list
    this.connections.push({
        fromNodeId: outNodeId,
        fromPort: outPort,
        toNodeId: inNodeId,
        toPort: inPort
    });

    return true;
    }
}


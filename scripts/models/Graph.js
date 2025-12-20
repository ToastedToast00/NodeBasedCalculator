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
}
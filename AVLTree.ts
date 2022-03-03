enum BalanceFactor {
    UNBALANCED_RIGHT = 1,
    SLIGHTLY_UNBALANCED_RIGHT = 2,
    BALANCED = 3,
    SLIGHTLY_UNBALANCED_LEFT = 4,
    UNBALANCED_LEFT = 5
}

enum Compare {
    LESS_THAN = -1,
    BIGGER_THAN = 1,
    EQUALS = 0
}

function defaultCompare<T>(a: T, b: T): number {
    if (a === b) {
        return Compare.EQUALS; //0
    }                    //-1                    //1
    return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
}

type ICompareFunction<T> = (a: T, b: T) => number;

// The TreeNode
class TreeNode<K> {
    left: TreeNode<K>;
    right: TreeNode<K>;
    key: K
    constructor(key: K) {
        this.key = key;
    }

    toString() {
        return `${this.key}`;
    }
}

//The AVLTree
export class AVLTree<T>{

    compareFn: ICompareFunction<T>
    root: TreeNode<T>;

    constructor(compareFn: ICompareFunction<T> = defaultCompare) {
        this.compareFn = compareFn;
    }

    getRoot(){
        return this.root;
    }

    search(key: T) {
        return this.searchNode(this.root, key);
      }
    
     searchNode(node: TreeNode<T>, key: T): boolean {
        if (node == null) {
          return false;
        }
    
        if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
          return this.searchNode(node.left, key);
        } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
          return this.searchNode(node.right, key);
        }
        // key is equal to node.item
        return true;
      }

    getNodeHeight(node: TreeNode<T>): number {
        if (node == null) {
            return -1;
        }
        return Math.max(this.getNodeHeight(node.left), this.getNodeHeight(node.right)) + 1; //returns 0
        //more recursion: undefined -> -1, Math.max returns the biggest number plus 1
    }

    //left to right non-double rotation
    rotationLL(node: TreeNode<T>) {
        //console.log(node) TreeNode {
        //   key: 50,
        //   left: TreeNode { key: 30, left: TreeNode { key: 10 } }
        // }

        //console.log(node.left) TreeNode { key: 30, left: TreeNode { key: 10 } }
        //grab left node
        const tmp = node.left;

        //check right side of the left node and it is 'undefined' and make entire left node 'undefined'
        //undefined  
        node.left = tmp.right;

        //console.log(node) TreeNode { key: 50, left: undefined }
        //make original node with a 'undefined' left node, a right node
        tmp.right = node;

        //console.log(tmp)
        // TreeNode {
        //     key: 30,
        //     left: TreeNode { key: 10 },
        //     right: TreeNode { key: 50, left: undefined }
        //   }
        //   Now 'tmp' has a key 30, right side node key 50 with a left node 'undefined'
        //   Now left side node of key 30 appears with key node of 10
        return tmp;

    }

    rotationRR(node: TreeNode<T>) {
        //same as rotationLL , manipulate node, cut and paste
        const tmp = node.right;
        node.right = tmp.left;
        tmp.left = node;
        return tmp;
    }

    rotationLR(node: TreeNode<T>) {
        node.left = this.rotationRR(node.left);
        return this.rotationLL(node);
    }


    rotationRL(node: TreeNode<T>) {
        
        node.right = this.rotationLL(node.right);
        //node.right =
        // {"key":70,
        // "left":{"key":50},
        // "right":{
        //     "key":72,
        //     "right":{
        //         "key":80,
        //         "left":{
        //             "key":75},
        //         "right":{
        //             "key":90}}}}
        // NOTE: this is result of this.rotationLL(node.right) , being passed to this.rotationRR(node)
        //see that node.right also has 70 (root) and 50 (root.left)

        return this.rotationRR(node);
 



    }

    getBalanceFactor(node: TreeNode<T>) {

        //     50(3)           BalanceFactor(50): 2
        //     /  \            NodeKey(a): Height a
        //    30(2)70(0)       BalanceFactor = (HeightNodeLeft - HeightNodeRight) 
        //   /  \              //When HeightNodeKeyLeft or right doesn't exist we give: -1 height
        //  10(0)40(1)         //When HeightNodeKeyLeft or right is a leaf (or childless), we give it 0 height
        //       /             //The height higher number stays
        //      35(0)
        //
        // -2 - UNBALANCED_RIGHT
        // -1 - SLIGHTLY_UNBALANCED_RIGHT
        //  1 - SLIGHTLY_UNBALANCED_LEFT
        //  2 - UNBALANCED_LEFT
        //  0 - BALANCED 


                                         //0                           //undefined will return -1
        const heightDifference = this.getNodeHeight(node.left) - this.getNodeHeight(node.right); //0 - (-1) = 1
        switch (heightDifference) {
            case -2:
                return BalanceFactor.UNBALANCED_RIGHT;
            case -1:
                return BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT;
            case 1:
                return BalanceFactor.SLIGHTLY_UNBALANCED_LEFT; //first tree
            case 2:
                return BalanceFactor.UNBALANCED_LEFT;
            default:
                return BalanceFactor.BALANCED;
        }
    }


    insert(key: T) {
        this.root = this.insertNode(this.root, key);
        
    }

    insertNode(node: TreeNode<T>, key: T) {
        // if node is empty -> null or undefined
        // create: new TreeNode(key) and return it
        if (node == null) {
            // create object instance new TreeNode()
            return new TreeNode(key); 
        } 
        // if key is < than this.root.key, we recursively insert node.left
        // we recursively call 'insertNode' and standby until recursion hits base case: if null or undefined
        else if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
                                      // undefined, 50
            //(grabs node key72, on call 1)    // returns right away: new TreeNode(50)
            node.left = this.insertNode(node.left, key);
            //  node.left = new TreeNode(50) - key:50, left:undefined, right: undefined
            //continue on base call.. (doesnt check the next conditions , its an else if) 
               
        } 
        //if key > than this.root.key, we recursively insert.right
        else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
            node.right = this.insertNode(node.right, key);
        } 
        //else catches duplicated numbers, it just returns the node
        else {
            return node; // duplicated key
        }
        // console.log(JSON.stringify(node))

        
        // as we are inserting the nodes we verify if the node is balanced
        // each step of the the recursion, after hiting the base case,
        // last insertion would be undefined or 75?
        const balanceState = this.getBalanceFactor(node);
        //first tree: 4 - SLIGHTLY_UNBALANCED_LEFT
        //second tree: 3 - BALANCED


        if (balanceState === BalanceFactor.UNBALANCED_LEFT) {
            if (this.compareFn(key, node.left.key) === Compare.LESS_THAN) {
                // Left left case
                node = this.rotationLL(node);
            } else {
                // Left right case
                return this.rotationLR(node);
            }
        }

        if (balanceState === BalanceFactor.UNBALANCED_RIGHT) {
            if (this.compareFn(key, node.right.key) === Compare.BIGGER_THAN) {
                // Right right case
                node = this.rotationRR(node);
            } else {
                // Right left case
                  
                    //   70   (goes into RL)
                    //  /  \
                    // 50   80 
                    //     /  \
                    //    72   90
                    //     \
                    //      75
                return this.rotationRL(node);
            }
        }
    
        return node;
        //1º TreeNode { key: 70, left: TreeNode { key: 50 } }
        
        //2º TreeNode {
        //     key: 70,
        //     left: TreeNode { key: 50 },
        //     right: TreeNode { key: 80 }
        //   }

        // recursion:
        // TreeNode { key: 80, left: TreeNode { key: 72 } } - unraveling level 1 of recursion, assuming root is level 0.
        // right by followed by layer 0 results:
        // recursion end(root level):
        // TreeNode {
        //     key: 70,
        //     left: TreeNode { key: 50 },
        //     right: TreeNode { key: 80, left: TreeNode { key: 72 } }
        //   }
        // still balanced, next key is 90

        // level 1 recursion(node.right) - balanced:
        // TreeNode {
        //     key: 80,
        //     left: TreeNode { key: 72 },
        //     right: TreeNode { key: 90 }
        //   } 
        // level 0 (root) recursion (node.right) - balanced:
        // TreeNode {
        //     key: 70,
        //     left: TreeNode { key: 50 },
        //     right: TreeNode {
        //       key: 80,
        //       left: TreeNode { key: 72 },
        //       right: TreeNode { key: 90 }
        //     }
        //   }
        
    }


    // used on removeNode method below
    // we iteratively iterate until we reach the last node, which is the smallest
    minNode(node: TreeNode<T>){
        let current = node; 
        //we walk left until we reach the smallest value
        while(current != null && current.left != null){
            current = current.left
        };
        //returns last node
        return current;


    }

    removeNode(node: TreeNode<T>, key: T) {
        if (node == null) {
          return null;
        }
    
        if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
          // The key to be deleted is in the left sub-tree
          node.left = this.removeNode(node.left, key);
        } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
          // The key to be deleted is in the right sub-tree
          node.right = this.removeNode(node.right, key);
        } else {
          // node is the node to be deleted
          if (node.left == null && node.right == null) {
            node = undefined;
          } else if (node.left == null && node.right != null) {
            node = node.right;
          } else if (node.left != null && node.right == null) {
            node = node.left;
          } else {
            // node has 2 children, get the in-order successor
            const inOrderSuccessor = this.minNode(node.right);
            node.key = inOrderSuccessor.key;
            node.right = this.removeNode(node.right, inOrderSuccessor.key);
          }
        }
    
        if (node == null) {
          return node;
        }
    
        // verify if tree is balanced
        const balanceState = this.getBalanceFactor(node);
    
        if (balanceState === BalanceFactor.UNBALANCED_LEFT) {
          // Left left case
          if (
            this.getBalanceFactor(node.left) === BalanceFactor.BALANCED ||
            this.getBalanceFactor(node.left) === BalanceFactor.SLIGHTLY_UNBALANCED_LEFT
          ) {
            return this.rotationLL(node);
          }
          // Left right case
          if (this.getBalanceFactor(node.left) === BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT) {
            return this.rotationLR(node.left);
          }
        }
    
        if (balanceState === BalanceFactor.UNBALANCED_RIGHT) {
          // Right right case
          if (
            this.getBalanceFactor(node.right) === BalanceFactor.BALANCED ||
            this.getBalanceFactor(node.right) === BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT
          ) {
            return this.rotationRR(node);
          }
          // Right left case
          if (this.getBalanceFactor(node.right) === BalanceFactor.SLIGHTLY_UNBALANCED_LEFT) {
            return this.rotationRL(node.right);
          }
        }
    
        return node;
      }



    
}

// NOTES:
// - All this code requires these TypeScript options:
//   -"strictNullChecks": false,             - Need to use null and undefined
//   -"strictPropertyInitialization":false,  - No need to initialize class fields
//   -"target": "es2020",  
//   -"module": "commonjs", 
//   -"outDir": "./", 
//   -"esModuleInterop": true,
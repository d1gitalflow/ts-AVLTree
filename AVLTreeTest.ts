import { AVLTree } from './AVLTree'

const TEST_SUITE_FUNCS: Array<() => void> = [
    function testInsert(): void {
        let avltree = new AVLTree<string>();
        avltree.insert('January')
        avltree.insert('February')
        avltree.insert('March')
        avltree.insert('April')
        avltree.insert('May')
        avltree.insert('June')
        assertEquals(true, avltree.search('April'));
        assertEquals(true, avltree.search('March'));
        assertEquals(true, avltree.search('February'));

    },

    function testRemove(): void {
        let avltree = new AVLTree<number>();
        avltree.insert(99)
        avltree.insert(50)
        avltree.insert(12)
        avltree.insert(90)
        avltree.insert(52)
        avltree.insert(15)
        // lets remove
        avltree.removeNode(avltree.root, 52)
        //lets search the removed key
        assertEquals(false, avltree.search(52))
        assertEquals(true, avltree.search(12))

    },

    function testSearch(): void {
        let avltree = new AVLTree<number>();
        avltree.insert(99)
        avltree.insert(50)
        avltree.insert(12)
        avltree.insert(90)
        avltree.insert(52)
        avltree.insert(15)
        assertEquals(true,avltree.search(99))
    },

    function testMinNode():void{
        let avltree = new AVLTree<number>();
        avltree.insert(99)
        avltree.insert(50)
        avltree.insert(12)
        avltree.insert(90)
        avltree.insert(52)
        avltree.insert(15)
        // minNode(avltree.root).key -  minNode() returns a TreeNode<T> type, but if we access TreeNode<T>,
        // type class field we access the returned key field value
        assertEquals(12,avltree.minNode(avltree.root).key)
    }
]


//helper definitions
function assertEquals<E>(expected: E, actual: E) {
    if (expected !== actual) {
        throw 'Values are not equal';
    }
}




// run all tests
for(let i = 0; i<TEST_SUITE_FUNCS.length; i++){
    TEST_SUITE_FUNCS[i]();
}
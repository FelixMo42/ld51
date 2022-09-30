class Heap {
    // the heap
    heap = []

    // push a new node to the heap
    push(node) {
        this.heap.push(node)

        this.sortDown( this.heap.length - 1 )
    }

    // pop the smallest node of the heap
    pop() {
        // get the node
        let node = this.heap[0]
        
        // put the last element of the array in the front
        this.heap[0] = this.heap.pop()

        // sort the first element up into the correct postion
        this.sortUp(0)

        // return it
        return node
    }

    // update a node
    update(val) {
        // try to find the index of the value
        for (let i = 0; i < this.heap.length; i++) {
            // is this it?
            if (this.heap[i] === val) {
                // try sorting it in both directions
                this.sortUp(i)
                this.sortDown(i)

                // were done here
                return
            }
        }
    }

    /////////////////
    // PRIVATE API //
    /////////////////

    // sort a node down a node tell its in the right position
    sortDown(index) {
        // get the parent of the selected node
        let parent = Math.floor(index / 2)

        // while its less than its parent
        while (this.heap[index].cost < this.heap[parent].cost) {

            // flip the node and its parent
            [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]]

            // the index is now the parent
            index = parent

            // refind the parent
            parent = Math.floor(index / 2)
        }
    }

    // sort a node up a node tell its in the right position
    sortUp(index) {
        while (true) {
            // get its children nodes
            let left = index * 2 + 1
            let right = index * 2 + 2

            // keep track of the biggest node
            let max = index

            // is left bigger?
            if (left < this.heap.length && this.heap[left].cost < this.heap[max].cost) {
                max = left
            }
    
            // is even bigger?
            if (right < this.heap.length && this.heap[right].cost < this.heap[max].cost) {
                max = right
            }
    
            // are one of the children bigger?
            if (index != max) {
                // flip the index with the max
                [this.heap[index], this.heap[max]] = [this.heap[max], this.heap[index]]

                // the index is now at the positon of the previous max
                index = max
            } else {
                // were done, lets return
                return
            }
        }
    }
}
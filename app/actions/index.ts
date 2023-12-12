export const increment = () => {
    return {
        type: 'INCREMENT'
    }
}
export const decrement = () => {
    return {
        type: 'DECREMENT'
    }
}
export const addTodo = (text: string, dueDate?: Date | undefined) => ({
    type: 'ADD_TODO',
    payload: {
        id: Date.now(),
        text,
        dueDate,
    }
})
export const removeTodo = (uid: string) => ({
    type: 'REMOVE_TODO',
    payload: {
        uid: uid
    }
})
import { Request, Response } from 'express';

const todos = [
        {id: 1, text: 'Todo 1', completedAt: new Date()},
        {id: 2, text: 'Todo 2', completedAt: null},
        {id: 3, text: 'Todo 3', completedAt: new Date()},
];

export class TodoController{

    //* DI
    constructor(){}

    public getTodos = ( req:Request, res:Response )=>{
        return res.json(todos);
    }

    public getTodoById = ( req:Request, res:Response )=>{
        const id = +req.params.id;
        if(isNaN(id)) return res.status(400).json({message: `Id argument is not a number`});
        const todo = todos.find( todo => todo.id === id );
        (todo)
        ? res.status(200).json(todo)
        : res.status(404).json({message: `Todo with id ${id} not found`});
    }

    public createTodo = ( req:Request, res:Response )=>{
        const { text } = req.body;
        if(!text) return res.status(400).json({message: 'Text is required'});
        const todo = {
            id: todos.length + 1,
            text,
            completedAt: new Date,
        }
        todos.push(todo);
        res.status(201).json(todo);
    }

    public updateTodo = ( req:Request, res:Response )=>{
        const id = +req.params.id;
        if(isNaN(id)) return res.status(400).json({message: `Id argument is not a number`});
        
        const todo = todos.find( todo => todo.id === id );
        if(!todo) return res.status(404).json({message: `Todo with id ${id} not found`});
        
        const { text, completedAt } = req.body;
        
        todo.text = text || todo.text;
        (completedAt === 'null')
        ? todo.completedAt = null
        : todo.completedAt = new Date(completedAt || todo.completedAt);
        
        res.status(200).json(todo);
    }

    public deleteTodo = ( req:Request, res:Response )=>{
        const id = +req.params.id;
        if(isNaN(id)) return res.status(400).json({message: `Id argument is not a number`});
        const todo = todos.find( todo => todo.id === id );
        if(!todo) return res.status(404).json({message: `Todo with id ${id} not found`});
        todos.splice(todos.indexOf(todo), 1);
        res.status(200).json(todo);
    }
}
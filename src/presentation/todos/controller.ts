import { Request, Response } from 'express';
import { prisma } from '../../data/postgres';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';

export class TodoController{

    //* DI
    constructor(){}

    public getTodos = async( req:Request, res:Response )=>{
        const todos = await prisma.todo.findMany();
        return res.json(todos);
    }

    public getTodoById = async( req:Request, res:Response )=>{
        const id = +req.params.id;
        if(isNaN(id)) return res.status(400).json({message: `Id argument is not a number`});
        
        const todo = await prisma.todo.findFirst({ where: { id } });
        if(!todo) return res.status(404).json({error: `Todo with id ${id} not found`});

        return res.status(200).json(todo);
    }

    public createTodo = async( req:Request, res:Response )=>{
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        
        if(error) return res.status(400).json({ error });

        const todo = await prisma.todo.create({ 
            data:  createTodoDto!,  
        });
        
        res.status(201).json(todo);
    }

    public updateTodo = async( req:Request, res:Response )=>{
        const id = +req.params.id;
        
        const [ error, updateTodoDto ] = UpdateTodoDto.update({...req.body, id});
        if(error) return res.status(400).json({ error });

        const todo = await prisma.todo.findFirst({ where: { id } });
        if(!todo) return res.status(404).json({error: `Todo with id ${id} not found`});

        const updateTodo = await prisma.todo.update({ 
            where: { id }, 
            data: updateTodoDto!.values
         });
        
        res.status(200).json(updateTodo);
    }

    public deleteTodo = async( req:Request, res:Response )=>{
        const id = +req.params.id;
        if(isNaN(id)) return res.status(400).json({message: `Id argument is not a number`});
        const todoById = await prisma.todo.findFirst({ where: { id } });
        if(!todoById) return res.status(404).json({message: `Todo with id ${id} not found`});
        const deleted = await prisma.todo.delete({ where: { id } });
        
        (deleted)
        ? res.status(200).json(deleted) 
        : res.status(400).json({error: `Todo with id ${id} not found`});
    }
}
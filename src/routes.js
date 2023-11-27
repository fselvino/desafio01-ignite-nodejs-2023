import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"
import {randomUUID} from 'crypto'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {

      const task = database.select ('tasks')      

      return res.end(JSON.stringify(task))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

         //testa se o usuario informou o title ou description
         if (!title || !description) {
          return res.writeHead(400).end(JSON.stringify({ messagem: 'Informar title ou description' }))
        }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at : null,
        created_at: new Date(),
        update_at: new Date()

      }
      

      database.insert('tasks', task)
      return res.writeHead(201).end()
    }

  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
    

      //retorna um array de task onde id for igual ao informado
      const [task] = database.select('tasks', { id })     

      //realiza teste para verificar se existe tarefa
      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ messagem: 'Não existe a tarefa informada' }))
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
  method: 'PUT',
  path: buildRoutePath('/tasks/:id'),
  handler: (req, res) => {
    const { id } = req.params
    const {title, description} = req.body
  
    //testa se o usuário informou o title ou a descrição
    if(!title || !description){
      return res.writeHead(400).end(JSON.stringify({messagem: 'Informar title ou description'}))
    }

    //retorna um array de task onde id for igual ao informado
    const [task] = database.select('tasks', { id })     

    //realiza teste para verificar se existe tarefa
    if (!task) {
      return res.writeHead(404).end(JSON.stringify({ messagem: 'Não existe a tarefa informada' }))
    }

    //manda as informações a serem atualizadas para modulo database
    database.update('tasks', id, {
      title,
      description, 
      update_at: new Date()//atualiza o campo com a data hora que houve atualização do registro
    })

    return res.writeHead(204).end()
  }
}
,
  {
  method: 'PATCH',
  path: buildRoutePath('/tasks/:id/complete'),
  handler: (req, res) => {
    const { id } = req.params
   

    //retorna um array de task onde id for igual ao informado
    const [task] = database.select('tasks', { id })     

    //realiza teste para verificar se existe tarefa
    if (!task) {
      return res.writeHead(404).end(JSON.stringify({ messagem: 'Não existe a tarefa informada' }))
    }

    //pega o valor de complete_at precisa ser declarado com let porque sofrera atualização
    let {completed_at} = task
   
    /**
     * Esse teste possibilita seja concluido ou retirado a conclusão da tarefa.
     */
    if(completed_at !== null){
      
      completed_at = null
    }else {
      completed_at = new Date()
    }

    console.log(completed_at)
    //Atualiza o campo completed_at de controle da tarefa e o campo que houve atualização do registro
    database.update('tasks', id, {
      completed_at,       
      update_at: new Date()
    })

    return res.writeHead(204).end()
  }
}

]
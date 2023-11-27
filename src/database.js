import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

//console.log(databasePath)
export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(
        () => {
          this.#persist()
        }
      )
  }

  //persist os dados nesse caso no arquivo db.json
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  //search recebe um objeto com {id}
  select(table, search) {
    let data = this.#database[table] ?? []

    //se existir o id
    if (search) {
      //filtra o objeto e retorno chave valor
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          if (!value) return true

          return row[key].includes(value)
        })
      })
    }
    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }
    this.#persist()
    return data
  }


  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {

      //recupera todas informaçoes da linha a ser atualizada
      const row = this.#database[table][rowIndex]
    
      //Atualiza somente os campos {title, description e update_at} 
      this.#database[table][rowIndex] = { id, ...row, ...data }

      this.#persist()
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)  

    if(rowIndex > -1){
      this.#database[table].splice(rowIndex,1)//Encontra o registro e exclui a linha      
      this.#persist()
    }
  }

}
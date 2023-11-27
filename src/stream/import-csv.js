import { parse} from 'csv-parse'
import fs from  'node:fs'

//define o nome do arquivo e o local de onde será importado
const csvPath = new URL('../arquivo-csv/tasks.csv', import.meta.url)


//carrega o arquivo
const stream = fs.createReadStream(csvPath)

//define como será lido o arquivo
const csvParse = parse({
  delimiter:',',
  skipEmptyLines:true,
  fromLine:2 // incia a leitrura pela segunda linha despresando o cabeçalho
})



async function ImportCSV() {

  //recebe o arquivo
  const linesParse = stream.pipe(csvParse)

  //realiza a leitura de cada linha e monta um array com titulo e descrição
  for await ( const line of linesParse){
    const [title, description] = line

    //Envia por POST atraves de um arquivo JSON, todas as informações lidas do arquivo csv
    await fetch('http://localhost:3333/tasks', {
      method:'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({ //antes do envio converte o objeto json em string
        title,
        description
      })
    })
  }
}

ImportCSV()
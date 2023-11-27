export function buildRoutePath(path) {

  //Encontrar tudo que começe com : e depois : lestras 
  //que começe com letras minusculas e maiusculas
  //+ indica que as letras podem repetir uma ou mais vezes 
  //g significa que e uma regex global não para na primeira opçao que encontrar
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')
  
  //console.log(pathWithParams)

  //const test = /users\/([a-z0-9-_]+)/
  const pathRegex = new RegExp(`^${pathWithParams}`)
  

  return pathRegex
  //console.log(Array.from(path.matchAll(routeParametersRegex)))
}
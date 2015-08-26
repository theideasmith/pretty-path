var opts = {}

function options(options){
  opts = options
  return fsDefaults()
}

function ensureArray(path){

  if(path === null || path === undefined)
    throw new TypeError("cannot ensure type of null path")
  if (path.constructor === String) {
    var res =  pathToArray(path)
    return res
  } else if(path.constructor === Array) {
    return path
  } else
    throw new TypeError("Can only switch between" +
                             " string and array," +
                                    "not object"  )
}

function ensureString(path){
  if(path === null || path === undefined)
    throw new TypeError("Cannot ensure type of null path")

  if (path.constructor === String) return path
  else if(path.constructor === Array) return joinPaths(path)
}

function last(arr){
  return arr[arr.length-1]
}

function resolveToRoot(pwd, relative) {

  if (!pwd){
    throw new Error("Cannot resolve with " +
                    typeof string +
                    " root path")
  }

  if (!relative){
    throw new Error("Cannot resolve with " +
                    typeof relative +
                    " relative path")
  }

  var options = fsDefaults()
  pwd = formatPath(pwd), relative = formatPath(relative)

  if (!isRoot(pwd)) {
    throw new Error("Can only resolve" +
      " from root path and relative path, " +
      " not relative and relative")
  }

  //Break paths into an array
  //so they are easier to work with
  var relatives = pathToArray(relative)
  var result = pathToArray(pwd)

  while ( relatives.length > 0 ){

    var res
    var currrel = relatives.shift()

    switch (currrel) {
      case options.superdir:
        res = result.pop()
        break;
      case options.currdir:
      case '':
        res = last(result)
        break;
      default:
        res = currrel
        result.push(res)
        break;
    }

    if(res === null || res === undefined) {
      throw new Error("Invalid path " +
                             relative +
                    ". Please try again")
    }
  }
  return joinPaths( result )
}


function fsDefaults(){
  var options = opts || {}
  return {

    currdir: options.currdir || '.',
    superdir: options.superdir || '..',
    delimeter: options.delimeter || '/',
    root: options.root || '',
    aliases: options.aliases || {
      '~': ''
    }
  }
}

function alias(path, aliases){
  if ((aliases[path] !== undefined) &&
      (aliases[path] !== null))
        return aliases[path]
  return path
}

function joinPaths(_paths){
  var options = fsDefaults()
  var paths = ensureArray(_paths)
  var joined = paths.join(options.delimeter)
  return cleanPath(joined)
}

function unAlias(_path, aliases){
  var path = ensureArray(_path)
  path.unshift( alias(path.shift(), aliases) )
  return path
}

function cleanPath(path){

  if (!path){
    throw new Error("Cannot clean " +
                    typeof string +
                    " string")
  }

  var options = fsDefaults()

  // var multipleCurrentDir = new RegExp(
  //   '^(' + options.currdir )

  path = ensureString(path)
        .replace(/^(\.\/){2,}/g, '')
        .replace(/\/(\.\/){2,}/, '/')  //  "./"
        .replace(/\/+/g, '/') // "//////" => '/'
  return path
}

function formatPath(path){
  path = path || '~'
  options = fsDefaults()
  path = unAlias(path, options.aliases)
  //If it is root, set up root again in the string
  if (path[0] === options.root)
    path.unshift(options.delimeter)
  //If it is not root, and the path has already been aliased,
  //and the path does not contain a './' as in x/y/z
  //not ./x/y/z,
  //==> Then add the './'

  //Note: it doesn't interfere with a path beginning with /,
  //because the / is removed when path becomes
  //an array. Think about it and the reason will
  //become clear
  else if (path[0] !== options.currdir ){
    path.unshift(options.currdir)
  }

  // console.log(path)



  //Figure out how to determine if the end of the path has a '/'
  //For now, leave that alone and let the user determine that themselves
  var dirty =  joinPaths( path )
  //
  // path = dirty
  return cleanPath(dirty)
}

function isRoot( string ){
  if (!string){
    throw new Error("Cannot check if " +
                    typeof string +
                    " string is root")
  }
  var arr = pathToArray(string)
  return arr[0] === fsDefaults().root
}



function pathToArray(_string){
  if (!_string){
    throw new Error("Cannot break " +
                    typeof _string +
                    " string into array")
  }
  var string = cleanPath(_string)
  var res =  string.split(fsDefaults().delimeter)

  return res
}

/*
 * Exports
 */
formatPath.break = pathToArray
formatPath.isRoot = isRoot
formatPath.join = joinPaths
formatPath.clean = cleanPath
formatPath.resolve = resolveToRoot


module.exports = formatPath

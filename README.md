# OFX converter
Little and not so robust node code to convert `ofx` files to `csv` or `xlsx`.

## Installing
1. Clone this repo;
2. Go to repo folder;
3. Run
```
npm install -g 
```

## Usage
Once installed, you may run the command at your terminal.

### Syntax
```
$ ofx-conv <pathToFile> [outputFormat]
```
#### Input
`pathToFile`    -> Relative or absolute path to `ofx` file
`outputFormat`  -> "xlsx" for `.xlsx` format. Default value is `.csv`
#### Output
The output file will be at the same folder as the input file.

## Examples
### Converting to csv
```
$ ofx-conv myFile.ofx
```

### Converting to xlsx
```
$ ofx-conv /Users/me/Desktop/myFile.ofx xlsx
```

Feel free to contribute! 

Vinícius Muller Silveira


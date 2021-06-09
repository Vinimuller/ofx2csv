#!/usr/bin/env node

const fs            = require('fs');
const ofx           = require('ofx');
const {jsonToXlsx}  = require('json-and-xlsx');
// const { parse }     = require('json2csv');

// get file name from argv
const inFile    = process.argv[2];
var xlsxOutput  = false;

if(process.argv[3] == "xlsx")
{
    xlsxOutput  = true;
}

// console.log(process.argv);
// console.log(xlsxOutput);

function writeToCsv(transactionsArr)
{
    // out file has the same name as in file but with another extension
    const outFile   = inFile.split(".")[0] + ".csv";
    try {
        const csv = parse(transactionsArr);
        console.log(csv);
      } catch (err) {
        console.error(err);
      }

    return 0;
}
 
function writeToXlsx(transactionsArr)
{
    // out file has the same name as in file but with another extension
    const outFile   = inFile.split(".")[0] + ".xlsx";
    // parse from json to xlsx
    const xlsxData  = jsonToXlsx.readAndGetBuffer(transactionsArr);

    // write data to file
    fs.writeFileSync(outFile, xlsxData, 'binary');

    return 0;
}

fs.readFile(inFile, 'utf8', function(err, ofxData) {
    if (err){
        console.log(".ofx file not found\n");
        console.log(err);
        return 0;
    }

    const jsonOfxObj = ofx.parse(ofxData);
    
    // get transactions object array
    var transactions    = jsonOfxObj.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;
    var acumulated      = 0;

    // Loop each transaction
    transactions.forEach(function(obj) {

        // parse date param to DD/MM/YY
        obj.DTPOSTED = obj.DTPOSTED.toString().slice(6,8) + "/" + 
                            obj.DTPOSTED.toString().slice(4,6) + "/" + 
                            obj.DTPOSTED.toString().slice(0,4);

        // calculate acumulated value to this date
        obj.TRNAMT      = parseFloat(obj.TRNAMT);
        acumulated      += obj.TRNAMT;
        obj.ACUMULATED  = acumulated;
    });

    if(xlsxOutput)
    {
        // Xlsx output
        writeToXlsx(transactions);
    }else{
        // Csv output
        writeToCsv(transactions);
    }

    console.log("Done!");
});

/* 
OFX transaction structure
{
    TRNTYPE: 'DEBIT',
    DTPOSTED: '20210306000000[0:GMT]',
    TRNAMT: '-3596.86',
    FITID: '6043c0a6-7ac1-4100-9bb9-086abd03bad8',
    MEMO: 'Pagamento da fatura - Cartão Nubank'
}
*/


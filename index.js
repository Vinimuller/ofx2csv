#!/usr/bin/env node

const fs            = require('fs');
const ofx           = require('ofx');
const {jsonToXlsx}  = require('json-and-xlsx');

// get file name from argv
const inFile    = process.argv[2];
var xlsxOutput  = false;

// get output format from argv
if(process.argv[3] == "xlsx")
{
    xlsxOutput  = true;
}

// read ofx file
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

        // parse date param to DD/MM/YYYY
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

function writeToCsv(transactionsArr)
{
    // out file has the same name as in file but with another extension
    const outFile   = inFile.slice(0,-4) + ".csv";
    // csv buffer starts with csv header
    var csvBuffer   = "TRNTYPE,DTPOSTED,TRNAMT,FITID,MEMO,ACUMULATED\r\n";

    transactionsArr.forEach(function(obj){
        // parse an transaction object to string
        csvBuffer += obj.TRNTYPE + "," +
                        obj.DTPOSTED + "," +
                        obj.TRNAMT + "," +
                        obj.FITID + "," +
                        obj.MEMO + "," +
                        obj.ACUMULATED.toFixed(2) + "\r\n";
    });

    // write to file
    fs.writeFileSync(outFile, csvBuffer, 'utf8');

    return 0;
}
 
function writeToXlsx(transactionsArr)
{
    // out file has the same name as in file but with another extension
    const outFile   = inFile.slice(0,-4) + ".xlsx";
    // parse from json to xlsx
    const xlsxBuffer  = jsonToXlsx.readAndGetBuffer(transactionsArr);

    // write data to file
    fs.writeFileSync(outFile, xlsxBuffer, 'binary');

    return 0;
}

/* 
OFX transaction structure
{
    TRNTYPE: 'DEBIT',
    DTPOSTED: '20210306000000[0:GMT]',
    TRNAMT: '-666.66',
    FITID: '6fdsdf-7dce-0000-9aa9-091abd34edd8',
    MEMO: 'Pagamento da fatura - Cartão Nubank'
}
*/


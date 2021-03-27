const ofx   = require('ofx');
const fs    = require('fs');
 
const csvFile = "nubank.csv";


fs.appendFileSync(csvFile, "Tipo;Data;Valor;Descricao\r\n");

fs.readFile('*.ofx', 'utf8', function(err, ofxData) {
    if (err){
        console.log("Erro ao ler arquivo");
        console.log(err);
    }

    const data = ofx.parse(ofxData);
    var transactions = data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;

    transactions.forEach(function(obj) {
        // Loop each transaction
        console.log(obj.MEMO);
        fs.appendFileSync(csvFile, obj.TRNTYPE + ";" + obj.DTPOSTED + ";" + obj.TRNAMT + ";" + obj.MEMO + "\r\n");
    });

});

// Transaction structure
// {
//     TRNTYPE: 'DEBIT',
//     DTPOSTED: '20210306000000[0:GMT]',
//     TRNAMT: '-3596.86',
//     FITID: '6043c0a6-7ac1-4100-9bb9-086abd03bad8',
//     MEMO: 'Pagamento da fatura - Cartão Nubank'
//   }


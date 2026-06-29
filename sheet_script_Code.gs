// ============================================================
// Sheets Script: sheet_script_Code.gs
// Google Spreadsheet-ari LOTUTAKO scripta (ez web app-a)
// Extensions > Apps Script bidez ireki eta hemen itsatsi
// ============================================================

// ⚠️ KONFIGURAZIOA
var DATU_ORRIA     = "ZURE_SHEET_IZENA_HEMEN"; // Datuen iturria (adib. "1EE1D")
var IKASLE_ZUTABEA = 4;                         // D zutabea = ikaslearen izena

// ============================================================

// Funtzio nagusia: eskuz edo trigger bidez exekutatu
// Ikasle berri bakoitzeko pestaina bat sortzen du (existitzen ez bada)
// eta ikasle horren errenkadak pestaina horretara kopiatzen ditu
function eguneratuIkasleOrriak() {
  var ss        = SpreadsheetApp.getActiveSpreadsheet();
  var datuOrria = ss.getSheetByName(DATU_ORRIA);

  if (!datuOrria) {
    SpreadsheetApp.getUi().alert("Ez da '" + DATU_ORRIA + "' izeneko orririk aurkitu.");
    return;
  }

  var datuak   = datuOrria.getDataRange().getValues();
  var goiburua = datuak[0]; // Lehen errenkada = goiburua

  // Ikasle izen guztiak bildu (bikoizturik gabe)
  var ikasleIzenak = [];
  for (var i = 1; i < datuak.length; i++) {
    var izena = datuak[i][IKASLE_ZUTABEA - 1];
    if (izena && ikasleIzenak.indexOf(izena) === -1) {
      ikasleIzenak.push(izena);
    }
  }

  // Ikasle bakoitzeko pestaina sortu edo garbitu eta bete
  for (var j = 0; j < ikasleIzenak.length; j++) {
    var ikasleIzena = ikasleIzenak[j];
    var ikasleOrria = ss.getSheetByName(ikasleIzena);

    // Pestaina ez badago, sortu
    if (!ikasleOrria) {
      ikasleOrria = ss.insertSheet(ikasleIzena);
    } else {
      ikasleOrria.clearContents(); // Badago: edukia garbitu eta berridatzi
    }

    // Goiburua kopiatu
    ikasleOrria.appendRow(goiburua);

    // Ikasle honi dagozkion errenkadak kopiatu
    for (var k = 1; k < datuak.length; k++) {
      if (datuak[k][IKASLE_ZUTABEA - 1] === ikasleIzena) {
        ikasleOrria.appendRow(datuak[k]);
      }
    }

    // Goiburua izoztuta utzi eta zutabeen zabalera egokitu
    ikasleOrria.setFrozenRows(1);
    ikasleOrria.autoResizeColumns(1, goiburua.length);
  }

  SpreadsheetApp.getUi().alert(
    ikasleIzenak.length + " ikasleen orriak eguneratu dira."
  );
}

// Goiburu automatikoa ezartzeko (lehen aldiz bakarrik behar da)
// Exekutatu lehen erabileran datu-orrian goiburua ez badago
function ezarriGoiburua() {
  var ss        = SpreadsheetApp.getActiveSpreadsheet();
  var datuOrria = ss.getSheetByName(DATU_ORRIA);

  if (!datuOrria) {
    SpreadsheetApp.getUi().alert("Ez da '" + DATU_ORRIA + "' izeneko orririk aurkitu.");
    return;
  }

  var goiburua = ["Data", "Ordua", "Irakaslea", "Ikaslea", "Ebidentzia", "Oharra"];
  datuOrria.getRange(1, 1, 1, goiburua.length).setValues([goiburua]);
  datuOrria.setFrozenRows(1);
  SpreadsheetApp.getUi().alert("Goiburua ezarri da.");
}

// Menu pertsonalizatua gehitzen du Sheets-en goiko barran
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Inplikazioa")
    .addItem("Ikasleen orriak eguneratu", "eguneratuIkasleOrriak")
    .addSeparator()
    .addItem("Goiburua ezarri (lehen aldiz)", "ezarriGoiburua")
    .addToUi();
}

// Trigger automatikoa: datu-orrian aldaketa bat gertatzen den bakoitzean exekutatzen da
// Errenkada berri bat osatuta dagoenean (ikaslea + ebidentzia), pestaina eguneratzen du
function onEdit(e) {
  var ss        = SpreadsheetApp.getActiveSpreadsheet();
  var datuOrria = ss.getSheetByName(DATU_ORRIA);

  // Aldaketa datu-orrian gertatu ez bada, ez egin ezer
  if (!e || e.source.getActiveSheet().getName() !== DATU_ORRIA) return;

  var errenkada = e.range.getRow();

  // Goiburua aldatu bada (1. errenkada), ez egin ezer
  if (errenkada <= 1) return;

  var datuak      = datuOrria.getDataRange().getValues();
  var goiburua    = datuak[0];
  var ikasleIzena = datuak[errenkada - 1][IKASLE_ZUTABEA - 1];

  // Ikaslearen izena hutsik badago, ez egin ezer
  if (!ikasleIzena) return;

  var ikasleOrria = ss.getSheetByName(ikasleIzena);

  // Pestaina ez badago, sortu
  if (!ikasleOrria) {
    ikasleOrria = ss.insertSheet(ikasleIzena);
    ikasleOrria.appendRow(goiburua);
    ikasleOrria.setFrozenRows(1);
  } else {
    // Badago: edukia garbitu eta ikasle honi dagozkion errenkada guztiak berridatzi
    ikasleOrria.clearContents();
    ikasleOrria.appendRow(goiburua);
  }

  // Ikasle honi dagozkion errenkada guztiak kopiatu
  for (var i = 1; i < datuak.length; i++) {
    if (datuak[i][IKASLE_ZUTABEA - 1] === ikasleIzena) {
      ikasleOrria.appendRow(datuak[i]);
    }
  }

  ikasleOrria.autoResizeColumns(1, goiburua.length);
}

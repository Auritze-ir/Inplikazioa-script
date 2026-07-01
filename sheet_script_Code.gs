// ============================================================
// Sheets Script: sheet_script_Code.gs
// Google Spreadsheet-ari LOTUTAKO scripta (ez web app-a)
// Extensions > Apps Script bidez ireki eta hemen itsatsi
// ============================================================

// ⚠️ KONFIGURAZIOA
var DATU_ORRIA     = "ZURE_SHEET_PESTAINA_IZENA_HEMEN"; // Datuen iturria (adib. "1EE1D")
var IKASLE_ZUTABEA = 4;                         // D zutabea = ikaslearen izena

// ============================================================

// Funtzio nagusia: eskuz edo trigger bidez exekutatu
// Ikasle berri bakoitzeko pestaina bat sortzen du (existitzen ez bada)
// eta FILTER formula bat jartzen du ikaslearen datuak automatikoki erakusteko
function eguneratuIkasleOrriak() {
  var ss        = SpreadsheetApp.getActiveSpreadsheet();
  var datuOrria = ss.getSheetByName(DATU_ORRIA);

  if (!datuOrria) {
    SpreadsheetApp.getUi().alert("Ez da '" + DATU_ORRIA + "' izeneko orririk aurkitu.");
    return;
  }

  var datuak   = datuOrria.getDataRange().getValues();
  var goiburua = datuak[0];

  // Ikasle izen guztiak bildu (bikoizturik gabe)
  var ikasleIzenak = [];
  for (var i = 1; i < datuak.length; i++) {
    var izena = datuak[i][IKASLE_ZUTABEA - 1];
    if (izena && ikasleIzenak.indexOf(izena) === -1) {
      ikasleIzenak.push(izena);
    }
  }

  // Ikasle bakoitzeko pestaina sortu (existitzen ez bada) eta FILTER formula jarri
  for (var j = 0; j < ikasleIzenak.length; j++) {
    var ikasleIzena = ikasleIzenak[j];
    var ikasleOrria = ss.getSheetByName(ikasleIzena);

    // Pestaina ez badago, sortu
    if (!ikasleOrria) {
      ikasleOrria = ss.insertSheet(ikasleIzena);
    } else {
      ikasleOrria.clearContents();
    }

    // Goiburua A1-en jarri
    ikasleOrria.getRange(1, 1, 1, goiburua.length).setValues([goiburua]);
    ikasleOrria.setFrozenRows(1);

    // FILTER formula A2-n jarri
    // Datu-orri osoa irakurtzen du eta ikasle honi dagozkion errenkadak bakarrik erakusten ditu
    var formula = "=FILTER('" + DATU_ORRIA + "'!A2:G4771;" +
                  "'" + DATU_ORRIA + "'!D2:D4771=\"" + ikasleIzena + "\")";
    ikasleOrria.getRange("A2").setFormula(formula);

    // Datuak kargatu arte itxaron, gero zutabeak tamainatu
    SpreadsheetApp.flush();
    ikasleOrria.autoResizeColumns(1, goiburua.length);
  }

  SpreadsheetApp.getUi().alert(
    ikasleIzenak.length + " ikasleen orriak eguneratu dira."
  );
}

// Goiburu automatikoa ezartzeko (lehen aldiz bakarrik behar da)
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

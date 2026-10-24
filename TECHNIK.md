# Technische Dokumentation – ElektroMaster 1.0

## Architektur

Statische HTML/CSS/ES-Module ohne Framework, Paketinstallation oder Laufzeitabhängigkeiten. Unterstützungsziel sind aktuelle Safari-, Edge- und Chrome-Versionen. Externe Ressourcen werden ausschließlich über ausdrücklich angeklickte Quellenlinks aufgerufen.

- index.html: Einstieg und PWA-Metadaten
- app.js: Rendering, Navigation, Training, Prüfung, Dateiexport/-import
- content.js: Themen, 61 Lernmodule, 35 Formeln, 139 feste Fragen
- engine.js: 16 Rechengeneratoren, Auswertung, Wiederholung, Fortschritt und Importvalidierung
- style.css: Dark/Light, responsive Darstellung, Touch-Elemente
- sw.js: versionierter Offline-Cache aller Laufzeitdateien
- manifest.webmanifest und Icons: Installation und Erscheinungsbild
- server.mjs: minimaler lokaler Server, Port 4173, Bindung an 127.0.0.1
- tests.mjs, tests-formulas.mjs, tests-ui.mjs: reproduzierbare Tests

Die App arbeitet ohne Backend. localStorage-Schlüssel: **elektromaster.v1**. Backup-Schema: Version 1. Fortschritt, Lerntage und laufende Einheit werden nach Interaktionen gespeichert. Die App ist für eine aktive Sitzung pro Browserprofil gedacht; gleichzeitiges Lernen in mehreren Tabs kann nach dem Prinzip „letzter Schreibzugriff gewinnt“ Daten überschreiben.

## Inhalte erweitern

Formeldatensätze stehen in rows und algebraSteps. Die Reihenfolge bestimmt die IDs f0 bis f34. Bestehende Einträge daher nicht umsortieren; neue Einträge hinten anfügen. Drei Kernfragen je Formel werden aus der Formel, Umstellung und Symbolbedeutung erstellt. Plausible Ablenkantworten explizit pflegen.

Konzeptmodule stehen in concepts und besitzen IDs c0 bis c25. Die Verständnisfrage entsteht aus Frage, richtiger Antwort, drei Ablenkantworten und Erklärung. Zusatzfragen stehen in extra. IDs über Releases stabil halten, damit Lernfortschritt erhalten bleibt.

Jede feste Frage benötigt:
- id, lesson, group, level
- kind und type
- prompt, vier unterschiedliche options, answer als Index
- explanation

Gruppen: basis, ac, machine, industry. Stufen: 1 Grundlagen, 2 Aufbau, 3 Meistertechnik (in Version 1 bei komplexen Rechenvorlagen). Die Auswahl der Antworten wird beim Trainingsstart gemischt; der korrekte Index wird mitgeführt.

## Rechenvorlagen erweitern

In calcTypes eine stabile ID ergänzen. In generate(id, rng) eine Fallbehandlung mit prompt, values und fields hinzufügen.

Ein Ergebnisfeld enthält:
- label: gesuchte Größe
- answer: exakter numerischer Wert, nicht vorzeitig gerundet
- unit: erwartete Einheit
- steps: vollständig lesbarer Lösungsweg

Bei neuen Einheiten die Einheitenliste der Oberfläche erweitern. In tests.mjs eine unabhängige Referenzrechnung unter refs ergänzen. Der injizierbare Zufallsgenerator ermöglicht reproduzierbare Tests.

Bewertung: maximaler Fehler max(|Sollwert| · 0,01; 0,00001), Einheit muss exakt der erwarteten Auswahl entsprechen. Zahlenparser akzeptiert Komma oder Punkt und wissenschaftliche Schreibweise, aber keine Tausendertrennzeichen oder angehängte Einheiten.

## Lernmodell

stats[id] speichert attempts, correct, run, due, last, score und group. Eine sichere vollständig richtige Antwort erhöht run. Fehler und Unsicherheit setzen run auf 0. Intervalle: 0, 1, 3, 7, 14, 30, 60 Tage. Zeitstempel sind Millisekunden seit Unix-Epoche; Lerntage verwenden das lokale Kalenderdatum.

Gefestigt: run ≥ 3. Im Wiederholungsmodus erscheinen nur bereits bearbeitete fällige Aufgaben; Rechenvorlagen werden dafür mit neuen Werten erzeugt. Es gibt keine externe KI.

XP: erstmals pro Aufgaben-ID und Tag 20/5. Level = floor(XP/200) + 1. Tagesziel zählt eindeutige IDs. Bewusst kein Leistungsanspruch durch bloßes Lesen.

## Prüfung

8 feste Fragen aus allen vier Gruppen und 4 mehrteilige Rechenaufgaben. 30 Minuten, absolute deadline. Eingaben und Navigation werden gespeichert. Training bewertet sofort; Prüfung bewertet einmalig bei Abgabe oder festgestelltem Zeitablauf. Eine Prüfung wird beim nächsten aktiven Aufruf weitergeführt/ausgewertet, nicht durch einen Hintergrunddienst.

Ergebnisse vergangener Prüfungen speichern Datum, Punkte und Gesamtpunkte, maximal 100 Einträge. Die ausführlichen Musterlösungen der gerade beendeten Sitzung sind bis zum Verlassen/Neuladen verfügbar; das Archiv speichert die Punktübersicht, nicht jeden alten Antworttext.

## Offline und Updates

sw.js installiert alle Laufzeitdateien atomar über cache.addAll. Aktivierung entfernt alte ElektroMaster-Caches. Cache-first für bereits gespeicherte Dateien; bei fehlender Netzwerkverbindung liefert eine Navigation index.html. Externe Quellen gehören nicht zum Offlineumfang.

Bei jedem Release die CACHE-Versionskennung in sw.js erhöhen. App-Dateien gemeinsam veröffentlichen. Es gibt bewusst kein erzwungenes skipWaiting, das eine laufende Prüfung mitten im Update ersetzen könnte. Nach einem Update die App-Tabs schließen und neu öffnen; gegebenenfalls nach dem ersten Online-Neuladen nochmals schließen. Vor Updates ein Backup empfehlen.

GitHub Pages benötigt kein Routing-Rewrite: Die Oberfläche navigiert innerhalb index.html; alle Ressourcenpfade sind relativ. Ein Projektunterpfad ist damit möglich.

## Daten und Sicherheit

Keine Telemetrie, keine Anmeldung, keine externen Schriftarten. Import validiert das Schema und bekannte Aufgaben-IDs. Es wird kein Code aus Backups ausgeführt. Texte werden für die HTML-Ausgabe maskiert. Lokale Daten sind keine manipulationssicheren Prüfungsnachweise. Uhrverstellung kann Lernabstände und Zeitprüfung beeinflussen.

Der Browser entscheidet über Speicherquoten und Verfügbarkeit. Bei Speicherfehlern bleibt der aktuelle In-Memory-Zustand exportierbar. Dateien und Backups vor öffentlichem Upload trennen; persönliche Backups niemals ins öffentliche Repository hochladen.

## Entwicklung und Tests

Node.js LTS verwenden. Keine npm-install-Phase erforderlich.

```text
npm test
npm start
```

Oder die drei Testdateien einzeln mit node ausführen. tests-ui.mjs nutzt eine DOM-Attrappe; es prüft Bedienlogik, aber keine Browser-Layout-Engine, keine echte Dateiauswahl und keine Service-Worker-Ausführung.

Die Veröffentlichung ist vorbereitet. Ein GitHub-Repository und die Pages-Freigabe müssen noch vom Kontoinhaber angelegt werden.

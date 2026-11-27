# Ergänzung Version 2.1 – Zustände und Historie

Speicherschlüssel elektromaster.v2 und Backup-Version 2 bleiben erhalten. Jedes Tagestraining ergänzt trainingId (electro:YYYY-MM-DD:mc bzw. calc), status (offen, begonnen, abgeschlossen, übersprungen), goalDate und bei Bedarf skippedOn/madeUp. Die ursprüngliche Datumskennung bleibt daily.date; completedOn ist der tatsächliche Abschluss. Ein übersprungenes Training hat finished:false und keine Zielgutschrift.

normalizeRun ergänzt Metadaten vorhandener V2-Läufe ohne Änderung von XP, Ergebnissen oder bisherigen completedOn-Gutschriften. Bereits gezählte Zieltermine werden in goalDate übernommen. Neue verspätete Abschlüsse erhalten goalDate:null; dadurch bleibt die Zielhistorie stabil. Diese Regel wird in Oberfläche und Anleitung erklärt. Export/Import enthalten die neuen Felder, validieren Zustände und IDs und bleiben für V1/V2 lesbar. Eine ältere App-Version soll nicht mehr parallel schreiben, da sie die neue Semantik nicht kennt.

startDaily wechselt zwischen getrennt gespeicherten Läufen. skipDaily verändert nur den ausgewählten früheren, unvollständigen Lauf und löst bei Bedarf die aktive Referenz. Bereits bewertete Fragen werden beim Fortsetzen nicht erneut vergütet. finishDaily blockiert übersprungene Läufe bis zum freiwilligen Wiederbeginn und vergibt den Bonus idempotent anhand des ursprünglichen Datums plus Modus. Bestehende Bonuskennungen bleiben erhalten; bereits abgeschlossene Läufe erhalten nie einen zweiten Bonus.

Beim lokalen Laden wird die aktive Tagesreferenz mit dem maßgeblichen Tagesdatensatz verbunden; eine veraltete aktive Kopie kann kein übersprungenes Training wiederbeleben. trainingHistory erzeugt fehlende Kalendertage nur zur Anzeige und speichert keine erfundenen Aufgaben. Die Historie reicht ab dem ersten gespeicherten Tagestraining bis heute (maximal 5000 Tage); Kalenderarithmetik berücksichtigt Zeitumstellungen. Bestehende Aufgabenstatistik und Erfolge bleiben unverändert.

Service-Worker-Version und erwartete Cachekennung sind 2.1.0. Die 16 Offline-Ressourcen bleiben vollständig. Keine Änderung an App-Adresse, Scope, Manifest-ID oder GitHub-Pages-Konfiguration.

# ElektroMaster 2.0 – technische Dokumentation

## Architektur

Statische PWA ohne Buildschritt, Framework, externe Schrift-/Bilddienste oder Laufzeit-API. ES-Module, CSS, native HTML-Dialoge und lokale SVGs. GitHub Pages kann die Dateien unverändert ausliefern. Node.js ist nur für den lokalen Server und Tests nötig.

| Datei | Verantwortung |
|---|---|
| content.js | Unveränderte V1-Inhalte: 61 Lektionen, 35 Formeln, 139 Fragen |
| engine.js | Bestehende Aufgaben-, Bewertungs-, Wiederholungs- und Statistiklogik; optional unterdrückte XP für Wiederholungen |
| app.js | Bestehende Oberfläche mit neuen Routen, Ereignissen, Hilfe und Updateablauf |
| state.js | V2-Datenstruktur, Validierung, V1-Übernahme, Schutz vor Überschreiben ungültiger Daten |
| daily.js | Kalenderauswahl, feste Aufgaben, unabhängige Tagesläufe, Abschluss, Bonus und Serie |
| knowledge.js | 62 Artikel, Kategorien, Formelverweise, Suchindex und Aufgaben-Themen-Zuordnung |
| diagrams.js | Lokale, aus gegebenen Aufgabenwerten beschriftete SVGs |
| features.js | Darstellung von Modulauswahl, Tagestraining, Lexikon und Hilfefenster |
| platform.js | Modulregister; Elektrotechnik aktiv, vier geplante Module |
| sw.js | Versionierter Cache, lokale Offline-Ressourcen, kontrollierte Aktivierung |

## Speicherung und Migration

V1-Schlüssel: elektromaster.v1. V2-Schlüssel: elektromaster.v2. Sicherheitskopie: elektromaster.before-v2.

Beim Start hat ein vorhandener V2-Stand Vorrang. Andernfalls wird V1 validiert, ergänzt und unter V2 gespeichert. Vor dem ersten Schreiben wird der ursprüngliche V1-Text einmalig unter dem Sicherheitskopieschlüssel gesichert. V1 selbst bleibt unangetastet. Bei ungültigen Daten verhindert loadBlocked weitere Speicherzugriffe; ein Export der Originaldaten und ein gültiger Import ermöglichen die Wiederherstellung. Schreibfehler werden angezeigt; der aktuelle Stand bleibt zunächst nur im Arbeitsspeicher.

Die bestehenden Felder für XP, Aufgabenstatistiken, Wiederholungstermine, Aktivitätstage, gelesene Lektionen, Prüfungsergebnisse, Theme und Ziel bleiben erhalten. Neue Felder: daily, dailySettings, dailyRewards, favorites, helpUses, moduleData und selectedModule. Die IDs des Bestands bleiben gleich. Alte Aktivitätstage bleiben gespeichert; die neue Tagestrainingsserie wird aus abgeschlossenen Tagesläufen abgeleitet.

Elektrotechnik verwendet zur Kompatibilität weiterhin die bisherigen Felder auf der Wurzelebene. moduleData reserviert getrennte Bereiche für spätere Module. Das Modulregister ist eine Vorbereitung, noch kein allgemeiner Loader für beliebige zusätzliche Lernpakete. Ein neues Modul benötigt Daten, Darstellung und einen eigenen Statistikadapter.

Tagesläufe speichern vollständige Aufgaben, Reihenfolge, Eingaben, Bewertungen und Position. Zahlenaufgaben enthalten zusätzlich ihren Seed. Es gibt keine automatische Löschung alter Tage; der Speicher wächst mit der Nutzung. Speicherwarnungen erfordern ein externes Backup. Es wird keine unbegrenzte Aufbewahrung im Browserspeicher zugesichert.

Dateiexport enthält den Lernstand ohne aktive normale Einheit/Prüfung. Tagesläufe behalten ihren Teilfortschritt. Dateiimport akzeptiert V1/V2, validiert IDs, Aufgaben, Einheiten, Bewertungen, Datum und Umfang und ersetzt nach Bestätigung den Stand. Lokales Neuladen stellt auch eine gültige aktive Einheit wieder her. Import und Export übertragen keine Offline-Caches.

## Tagestraining und Zeit

Lokale Datumskennungen und Kalenderarithmetik verwenden dayKey und setDate statt fester 24-Stunden-Abstände. Die Auswahl wird beim ersten Aufruf eines Tages erzeugt und sofort gespeichert. MC berücksichtigt Themen, Stufen, Schwächen und kürzlich verwendete Fragen. Zahlenaufgaben verwenden verschiedene Vorlagen und deterministische Seeds. Bereits vorhandene Tagesdaten werden nicht neu ausgewürfelt. Umfangänderungen beeinflussen nur zukünftige, noch nicht erzeugte Tage.

Jeder Modus besitzt einen eigenen Lauf. syncDaily speichert den aktiven Stand im Tagesdatensatz. Abschluss setzt vollständige Eingaben und Bewertungen voraus, nicht richtige Antworten. completedOn bezeichnet den tatsächlichen lokalen Abschlusstag. goalDate zählt nur fristgerechte neue Abschlüsse; Nachholungen haben goalDate:null. finishDaily ist idempotent. Pro ursprünglichem Training gibt es höchstens einen Bonus. Replay-Läufe beeinflussen weder Bonus noch Trainingstage; record erhält reward:false, damit auch normale Antwort-XP entfallen. Die Lernstatistik kann sich durch Wiederholung weiterhin ändern.

Eine Serie reicht vom heutigen Tag rückwärts, oder vom gestrigen Tag, wenn heute noch kein Abschluss vorliegt. Verstellen der Geräteuhr kann bei einer rein lokalen App nicht manipulationssicher verhindert werden.

## Hilfe, Lexikon und Bilder

Feste Fragen verweisen auf die bestehenden Lektions-IDs. Alle 16 Rechenvorlagen haben explizite Zuordnungen zu einem oder mehreren Artikeln. Das Lexikon nutzt die Grundformeln aus content.js; ergänzende Formeln, Erklärungen, Einheiten und eigene Beispiele liegen in knowledge.js. Die Suche berücksichtigt Titel, Erklärung, Beispiele und Formelzeichen und normalisiert deutsche Sonderzeichen.

Hilfe ist ein natives Dialogelement, ohne Neuaufbau der Aufgabenfelder. Schließen stellt den Fokus wieder her. Prüfungsmodus sperrt sowohl den Hilfeaufruf als auch die Navigation in Nachschlagebereiche. Dies ist eine didaktische Sperre, keine abgesicherte Online-Prüfungsumgebung.

SVGs sind inline, lokal und farbschemafähig. Beschriftungen verwenden gegebene Werte, keine berechneten gesuchten Lösungen. Auf schmalen Bildschirmen können breite Diagramme horizontal gescrollt werden. Funktionsschemata sind vereinfachte Lehrbilder und keine ausführungsreifen Anlagenpläne.

## Offline und Updates

Service-Worker-Cache: elektromaster-2.1.0- plus Scope-Pfad. Install speichert 16 Ressourcen einschließlich Verzeichniseinstieg und index.html. Alle sechs neuen Module gehören dazu. Ressourcen werden beim Installieren mit cache:reload angefordert. Fetch arbeitet für GET innerhalb desselben Ursprungs und Scopes zunächst aus dem versionsbezogenen Cache; Navigation hat einen Offline-Fallback auf index.html.

Es gibt kein bedingungsloses skipWaiting. Ein wartendes Update wird nach Schließen bisheriger Clients oder ausdrücklich per ACTIVATE_UPDATE aktiv. Die Oberfläche bietet vorher einen Backup-Download an und verweigert die ausdrückliche Übernahme bei offener Einheit. Alte Caches werden bei Aktivierung bewusst nicht automatisch entfernt. Bei künftigen Änderungen VERSION in sw.js erhöhen und die erwartete Cachekennung in app.js mitführen. Externe Quellenlinks sind keine Voraussetzung für Offline-Lernen.

## Prüfen und weiterentwickeln

Im Projektordner: npm test. Dafür sind keine npm-Pakete erforderlich. Alternativ die sechs tests*.mjs-Dateien einzeln mit Node ausführen. Lokal starten: node server.mjs. Der Server bindet nur an 127.0.0.1:4173.

Vor Veröffentlichung alle Laufzeitdateien gemeinsam ersetzen und die tatsächliche GitHub-Pages-Adresse einschließlich Unterpfad testen. Änderungen an Aufgaben-IDs oder Generatoren benötigen erneut Migrations- und Backup-Tests. Konkrete Prüfergebnisse und noch offene Gerätekontrollen: PRUEFBERICHT.md.

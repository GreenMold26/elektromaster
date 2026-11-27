# Ergänzung für Version 2.1

Im Bereich „Tägliches Training“ stehen die heutigen Trainings immer oben. Darunter kannst du ein begonnenes altes Training fortsetzen oder mit „Überspringen und heutiges Training starten“ direkt zum heutigen Modus wechseln. Ist dieser heute bereits abgeschlossen, startet eine freiwillige Wiederholung ohne XP.

Überspringen löscht keine Antworten. Unter „Trainingstage & verpasste Tage“ kannst du gespeicherte offene oder übersprungene Trainings freiwillig nachholen. Derselbe Verlauf ist in der Lernstatistik erreichbar. Beim Wechsel bleibt auch dein begonnenes heutiges Training erhalten. Nachgeholte Einheiten erscheinen beim ursprünglichen Datum mit ihrem tatsächlichen Abschlussdatum. Sie füllen keine verpassten Tagesziele auf und verlängern die Serie nicht rückwirkend. Eine Nachholung erfüllt auch das heutige Tagesziel nicht; dafür bearbeitest du eines der heutigen Trainings.

Vor dem Update exportiere deinen Lernstand in der App. Der Git-Sicherungsbranch enthält nur Quellcode, keine iPhone-Lernstände. Nach Veröffentlichung die App online öffnen, unter Einstellungen nach Updates suchen und das Update mit Backup übernehmen. Bei einer offenen Einheit entweder abschließen oder nach dem Online-Laden alle App-Fenster und zugehörigen Safari-Tabs schließen und erneut öffnen. App und Browserdaten nicht löschen.

# ElektroMaster 2.0 – bestehende App aktualisieren

## 1. Vor dem Update sichern

Öffne deine bisherige App auf PC und iPhone jeweils dort, wo du tatsächlich lernst. Unter Einstellungen → Backup exportieren die JSON-Datei speichern. Gib den Dateien unterschiedliche Namen, etwa PC-vor-2.0.json und iPhone-vor-2.0.json. Der Fortschritt wird nicht zwischen Geräten synchronisiert.

Bewahre die Dateien privat auf. Lade sie nicht zu GitHub hoch. Lösche weder Browserdaten noch die installierte App. Notiere zum Vergleich XP, gelesene Inhalte und Prüfungsbestleistungen. Beende möglichst die laufende Prüfung vor dem Wechsel.

## 2. Dateien im vorhandenen GitHub-Projekt ersetzen

1. ElektroMaster-2.0.zip vollständig entpacken.
2. Dein **bestehendes Repository** öffnen. Unter Settings → Pages nachsehen, aus welchem Branch und Ordner deine bisherige App veröffentlicht wird. Diese Einstellungen beibehalten.
3. Im Code-Bereich genau den bisherigen App-Ordner öffnen – dort muss bereits index.html liegen. Bei Veröffentlichung aus /docs ist dies der Ordner docs.
4. Über Add file → Upload files die App-Dateien aus dem entpackten ElektroMaster-Ordner hochladen. Gleichnamige Dateien ersetzen; alle unten genannten neuen Dateien mitnehmen. Änderungen gemeinsam mit einer Nachricht wie „ElektroMaster 2.0“ speichern.
5. Keine zusätzliche Ordnerebene anlegen: index.html muss am bisherigen Ort bleiben. CNAME, vorhandene GitHub-Workflows und andere eigene Repository-Dateien beibehalten.
6. Die erfolgreiche Pages-Veröffentlichung abwarten. Deine **bisherige Webadresse** verwenden. Kein neues Repository und keine neue Domain anlegen.

Erforderliche App-Dateien (alle gemeinsam aktualisieren):

- index.html, style.css, app.js, engine.js, content.js
- state.js, daily.js, knowledge.js, diagrams.js, features.js, platform.js
- sw.js, manifest.webmanifest, icon.svg, icon-192.png, icon-512.png
- .nojekyll (leere Datei; gegebenenfalls versteckte Dateien einblenden)

Dokumentation, Tests und lokale Startdateien dürfen ebenfalls hochgeladen werden. Sie werden für den Browserbetrieb nicht benötigt. **Die ZIP-Datei allein hochzuladen aktualisiert die App nicht.**

Bei einem vorhandenen eigenen GitHub-Actions-Veröffentlichungsablauf die Dateien in dessen bisheriges Quellverzeichnis übernehmen und den bestehenden Ablauf beibehalten. Diese Übergabe enthält keine Änderung deiner GitHub-Konfiguration.

Offizielle Orientierung: [GitHub – Veröffentlichungsquelle](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## 3. Bestehende Installation auf PC und iPhone aktualisieren

1. Online gehen und die bisherige App-Adresse bzw. das vorhandene App-Symbol öffnen. Etwas Zeit zum Laden der neuen Dateien lassen.
2. Falls noch Version 1.0 erscheint: alle offenen ElektroMaster-Fenster und Safari-Tabs dieser Adresse schließen, danach erneut öffnen. Ein wartendes Update kann erst dann aktiv werden. Gegebenenfalls noch einmal online laden und schließen.
3. In Version 2.0 erscheinen Modulauswahl, Tägliches Training und Lexikon. Elektrotechnik auswählen und den übernommenen Fortschritt mit deinen Notizen vergleichen.
4. Unter Einstellungen warten, bis „Offline bereit“ angezeigt wird. Ein aktuelles Backup exportieren und aufbewahren.
5. Erst danach die App ohne Netz neu öffnen und ein Training sowie das Lexikon ausprobieren.

Die App bleibt unter derselben Adresse. Der alte Version-1-Speichereintrag wird nicht überschrieben. Bei der ersten Übernahme wird zusätzlich eine lokale Sicherung angelegt; sie ist unter Einstellungen → Sicherung vor Version 2.0 exportierbar. Diese lokale Kopie ersetzt kein außerhalb des Browsers gespeichertes Backup.

Bei späteren Updates gibt es Einstellungen → Nach App-Updates suchen. „Update mit Backup übernehmen“ ist verfügbar, wenn ein Update wartet. Vorher die offene Lerneinheit abschließen und die angebotene Backup-Datei tatsächlich speichern.

**Falls Fortschritt fehlt:** zunächst richtige Adresse, Browserprofil und App-Aufruf prüfen. Safari und die Home-Bildschirm-App können getrennte Speicher besitzen. Anschließend das passende private Backup importieren; der Import ersetzt den Stand dieses Geräts. Keine leere Sicherung über deine alte Datei speichern.

Für eine zusätzliche Erstinstallation beschreibt [Apple das Hinzufügen einer Website zum Home-Bildschirm](https://support.apple.com/en-eg/guide/iphone/iphea86e5236/ios). Für das Update einer vorhandenen Installation ist eine Neuinstallation nicht vorgesehen.

## 4. Neue Funktionen benutzen

**Hilfe:** In einer normalen Aufgabe „Hilfe / Nachschlagen“ öffnen. Passende Themen oder Suchbegriffe wählen. Die Beispiele sind eigenständig; deine Eingabe bleibt beim Schließen erhalten. Im Prüfungsmodus steht die Hilfe nicht zur Verfügung.

**Tagestraining:** MC und Rechnen lassen sich unabhängig beginnen, unterbrechen und fortsetzen. Standard: zehn Fragen bzw. fünf Aufgaben. Für das Tagesziel genügt ein vollständig bearbeitetes Training; richtige Antworten sind dafür keine Voraussetzung. Jede Frage muss beantwortet, jedes Rechenfeld mit Zahl und Einheit abgegeben werden. Eine inhaltlich ernsthafte Bearbeitung kann die App darüber hinaus nicht feststellen.

Die Auswahl bleibt für den Tag fest. Änderungen des Umfangs in Einstellungen gelten für den nächsten noch nicht angelegten Tag. Offene frühere Tagestrainings bleiben zugänglich. Ein Abschluss nach dem ursprünglichen Trainingstag wird als Nachholung gespeichert und zählt nicht für Tagesziel oder Serie. Freiwillige Wiederholungen ändern die Erfolgsstatistik, geben aber weder XP noch einen neuen Trainingstag.

Die neue Tagestrainingsserie beginnt mit den Abschlüssen in Version 2.0. Alte Aktivitäten bleiben in der Statistik erhalten; sie werden nicht nachträglich als abgeschlossene Tagestrainings gewertet. Andere Lernbereiche bleiben auch bei offenem Tagesziel frei.

**Lexikon:** Volltextsuche, Kategorie und Unterkategorie eingrenzen; Einträge als Favoriten speichern. Verwandte Themen öffnen weitere Einträge. Formeln bleiben zusätzlich über die bisherige Formelsammlung erreichbar.

**Modulauswahl:** Nur Elektrotechnik ist freigeschaltet. Die vier weiteren Bereiche sind als Planung gekennzeichnet.

## 5. Bestehende Lernfunktionen

Lernmodule, Quiz, Formeltrainer, Rechentrainer, Wiederholungen und die 30-minütige Technikprüfung bleiben erhalten. Prüfungszeit läuft bei geschlossenem Fenster weiter; ausgewertet wird beim nächsten Aufruf. Der Rechentrainer akzeptiert Dezimalkomma und Punkt; keine Tausendertrennzeichen verwenden. Bewertung: 1 % relative Toleranz, mindestens 0,00001 in der gefragten Einheit; falsche Einheit gibt keinen Punkt. Mehrteilige Aufgaben geben Teilpunkte.

Normale Aufgaben vergeben weiterhin 20 XP bei vollständig richtiger Antwort, sonst 5 XP, begrenzt je Aufgabentyp und Kalendertag. Tagesabschlüsse ergänzen 50 XP, höchstens einmal pro ursprünglichem Training. Alle 200 XP steigt das Level. Wiederholungen bleiben lernstandsabhängig.

## 6. Backups und lokale Nutzung

Version 2.0 importiert Sicherungen der Versionen 1 und 2. Der Import ersetzt den vorhandenen Stand nach Bestätigung; ungültige Dateien werden abgewiesen. Tagestrainings einschließlich Teilfortschritt und Favoriten werden in V2-Backups mitgenommen. Eine laufende normale Einheit oder Prüfung wird beim Dateiimport nicht wiederhergestellt; beim normalen Neuladen auf demselben Gerät schon. V2-Backups sind nicht für Version 1.0 geeignet.

Alle Lernstände bleiben im Browser. Kein Konto, keine automatische Gerätesynchronisation. Bei Speicherwarnungen sofort exportieren: der verfügbare Browserspeicher ist begrenzt und gespeicherte Tagestrainings wachsen über die Zeit.

Zum lokalen Test unter Windows: ZIP entpacken, Node.js bereitstellen, Starten.cmd öffnen und http://localhost:4173 aufrufen. Keine Pakete installieren. Das Serverfenster offen lassen. index.html nicht direkt doppelklicken. Der lokale Test hat einen anderen Speicher als deine GitHub-Adresse und übernimmt dessen Lernstand nicht automatisch. Die localhost-Adresse ist nicht vom iPhone aus erreichbar.

## 7. Was noch zu prüfen ist

Automatisierte Tests sind bestanden. Die tatsächliche Darstellung in Safari/Edge, Installation auf einem echten iPhone und echte Offline-Neuladung müssen noch am Gerät geprüft werden. Die Checkliste steht in PRUEFBERICHT.md. Es wurde nichts in deinem GitHub-Konto veröffentlicht oder an deinem tatsächlichen Gerätefortschritt verändert.

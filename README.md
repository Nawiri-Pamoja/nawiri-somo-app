# Nawiri Pamoja – Dholuo ↔ English (Lern-App, Version 2)

Offline-Lern-App für Luo-Kinder: vom ersten Hören über Lesenlernen bis zu ganzen Sätzen und Computer-Englisch.
Läuft im Browser (Chrome) eines Android-Tablets und wird einmal „installiert“ – danach ohne Internet.

## Inhalt der App
- **8 Stufen, 173 Lektionen**: Hören (Bild + Ton) → Lesen lernen (Dholuo-Laute, dann englisches ABC) → erste Wörter →
  Alltagssätze → eigene Sätze bauen → Schule und Welt → Computer und Internet → Wortschatz-Schatzkiste.
- Rund **680 Wörter, 200 Redewendungen, 85 Sätze, 10 Dialoge, 7 Geschichten**, dazu Satzmuster, die die App selbst
  zu immer neuen Übungssätzen zusammensetzt.
- Drei Einstiege je Kind: „Achako“ (ganz neu), „Anyalo somo“ (kann schon lesen), „I speak English“ (lernt Dholuo).
- Mehrere Kinder pro Tablet (Tierbild statt Passwort), Wiederholung nach Vergessenskurve, Zwei-Spieler-Spiel.

## Auf die Website stellen und installieren
1. Den ganzen Ordner (`index.html`, `sw.js`, `manifest.webmanifest`, `icons/`, `audio/`) auf den Webspace laden,
   z. B. nach `https://nawiri-pamoja.org/lern/`. Es muss **https** sein (Mikrofon und Installation gehen nur so).
2. Auf dem Tablet in Chrome die Adresse öffnen, **einmal mit Internet**, kurz warten. Dann Menü ⋮ → „App installieren“
   (oder in der App: Helpers → „Install on this tablet“).
3. Test: Flugmodus an, App starten.

## Tablet einmalig vorbereiten (wichtig für den Ton)
Die englische Stimme kommt aus der Sprachausgabe von Android, nicht aus der App.
- Einstellungen → System → Sprachen → **Sprachausgabe** (Speech Services by Google) → Sprachdaten installieren:
  **Englisch** (am besten „English (Kenya)“ oder UK) und **Swahili (Kenia)**. Beides herunterladen, solange Internet da ist.
- Swahili dient als Notlösung: Solange es keine echten Dholuo-Aufnahmen gibt, liest die Swahili-Stimme Dholuo-Silben
  und -Wörter vor (die Schreibweise ist sehr ähnlich). Das klingt nicht wie ein Luo, hilft aber beim Lesenlernen.
  Abschaltbar unter Helpers → Settings. Jede echte Aufnahme ersetzt die Notlösung automatisch.
- Beim ersten Aufnehmen fragt Chrome nach dem Mikrofon: erlauben.
- In der App unter Helpers stehen zwei Testknöpfe („test English“, „test Dholuo“).

## Muttersprachler (Helpers)
Start- oder „An“-Seite → „Helpers / Jokony“ → kleine Rechenaufgabe als Kindersicherung. Siehe `HELPERS.md` (Englisch, zum Weitergeben).
- **Check the Dholuo**: jeden Eintrag bestätigen oder korrigieren. Unsichere Einträge kommen zuerst.
- **Record Dholuo voices**: zuerst „Sounds“ (130 Silben, ca. 20 Minuten) – die braucht das Lesenlernen am dringendsten.
- **Export / Import**: Aufnahmen und Korrekturen als Datei teilen (WhatsApp, Mail) und auf anderen Tablets einlesen.
- Dauerhaft für alle Tablets: `python3 tools/pack_to_audio.py dholuo-voices-….txt`, dann `VERSION` in `sw.js` erhöhen und neu hochladen.
- `review/dholuo-review.csv` enthält alle Einträge als Tabelle zum Gegenlesen außerhalb der App.

## Neue Version hochladen
`VERSION` in `sw.js` erhöhen (np-v2 → np-v3), alles neu hochladen. Die Tablets holen sich die neue Version beim nächsten
Start mit Internet (manchmal erst beim zweiten Öffnen). Lernstände und Aufnahmen bleiben auf dem Tablet erhalten.

## Wichtig zu wissen
- Das Dholuo stammt aus dem Wissen eines KI-Modells und ist **nicht von Muttersprachlern geprüft**. 93 Einträge sind
  ausdrücklich als unsicher markiert; auch die übrigen können Fehler, andere Dialektformen oder unübliche Schreibweisen enthalten.
- Lernstände liegen nur auf dem jeweiligen Tablet (Browser-Speicher). „Browserdaten löschen“ löscht sie.
- Bilder sind Emoji des Tablets; auf sehr alten Android-Versionen fehlen einzelne.

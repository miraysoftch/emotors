import fs from 'fs'
import path from 'path'

const faqData = [
  // Kategori 1: Allgemein (Genel) - 25 soru
  {
    category: 'Allgemein',
    categorySlug: 'allgemein',
    faqs: [
      { q: 'Was ist MK eMotors?', a: 'MK eMotors ist ein führender Anbieter von Elektromobilitätslösungen mit innovativen Produkten und Dienstleistungen.' },
      { q: 'Wo ist MK eMotors ansässig?', a: 'Wir sind in Dornach, Schweiz ansässig und bedienen Kunden in der ganzen Schweiz.' },
      { q: 'Seit wann gibt es MK eMotors?', a: 'MK eMotors wurde gegründet, um die Zukunft der Mobilität zu gestalten.' },
      { q: 'Welche Produkte bietet MK eMotors an?', a: 'Wir bieten Elektromobile, Ladestationen, Batterien und verwandte Services an.' },
      { q: 'Wie kann ich MK eMotors kontaktieren?', a: 'Sie können uns per Telefon, Email oder über unser Kontaktformular erreichen.' },
      { q: 'Bietet MK eMotors Beratung an?', a: 'Ja, wir bieten kostenlose Beratung für alle Elektromobilitätslösungen an.' },
      { q: 'Welche Zahlungsmethoden werden akzeptiert?', a: 'Wir akzeptieren Kreditkarten, Banküberweisung, PayPal und andere gängige Zahlungsmethoden.' },
      { q: 'Gibt es einen Showroom?', a: 'Ja, besuchen Sie unseren Showroom in Dornach während der Öffnungszeiten.' },
      { q: 'Bietet MK eMotors Lieferung an?', a: 'Ja, wir bieten kostenlose Lieferung für Bestellungen ab CHF 500.' },
      { q: 'Wie sind die Geschäftszeiten?', a: 'Montag bis Freitag 9:00-18:00 Uhr, Samstag 10:00-16:00 Uhr.' },
      { q: 'Ist MK eMotors zertifiziert?', a: 'Ja, wir sind ISO zertifiziert und erfüllen alle Schweizer Normen.' },
      { q: 'Bietet MK eMotors Schulungen an?', a: 'Ja, wir bieten regelmäßige Schulungen für Kunden und Partner an.' },
      { q: 'Kann ich ein Testtahrt machen?', a: 'Selbstverständlich! Vereinbaren Sie einen Termin für eine unverbindliche Testfahrt.' },
      { q: 'Gibt es Garantien?', a: 'Ja, alle Produkte haben eine Herstellergarantie von mindestens 2 Jahren.' },
      { q: 'Welche Sprachen werden unterstützt?', a: 'Wir unterstützen Deutsch, Französisch und Italienisch.' },
      { q: 'Bietet MK eMotors Newsletter an?', a: 'Ja, abonnieren Sie unseren Newsletter für exklusive Angebote.' },
      { q: 'Wie kann ich mich für ein Konto registrieren?', a: 'Klicken Sie auf "Konto erstellen" auf unserer Website.' },
      { q: 'Ist meine persönliche Daten sicher?', a: 'Ja, wir verwenden SSL-Verschlüsselung und erfüllen DSGVO-Anforderungen.' },
      { q: 'Bietet MK eMotors Rabatte an?', a: 'Ja, regelmäßig gibt es Aktionen und Rabatte für Kunden.' },
      { q: 'Kann ich meine Bestellung stornieren?', a: 'Ja, bis 48 Stunden vor Lieferung kostenlos stornierbar.' },
      { q: 'Gibt es einen Treueprogramm?', a: 'Ja, Mitglieder erhalten exklusive Vorteile und Punkte bei Käufen.' },
      { q: 'Wie lange dauert die Lieferung?', a: 'In der Regel 3-5 Werktage in der Schweiz.' },
      { q: 'Bietet MK eMotors Express-Lieferung an?', a: 'Ja, Express-Lieferung innerhalb von 24 Stunden ist verfügbar.' },
      { q: 'Kann ich meine Bestellung nachverfolgen?', a: 'Ja, Sie erhalten eine Trackingnummer per Email.' },
      { q: 'Gibt es eine Rückgabegarantie?', a: 'Ja, 30 Tage Rückgaberecht ohne Fragen.' }
    ]
  },
  // Kategori 2: Elektromobile (25 soru)
  {
    category: 'Elektromobile',
    categorySlug: 'elektromobile',
    faqs: [
      { q: 'Was ist die maximale Reichweite?', a: 'Bis zu 500 km je nach Modell und Fahrbedingungen.' },
      { q: 'Wie lange dauert eine vollständige Ladung?', a: '3-6 Stunden an einer normalen Steckdose, 30-60 Minuten an einer Schnellladesäule.' },
      { q: 'Welche Batteriegrößen sind verfügbar?', a: 'Von 40 kWh bis 100 kWh je nach Modell.' },
      { q: 'Wie alt ist die Batterielebensdauer?', a: 'Durchschnittlich 8-10 Jahre oder 160.000 km Nutzung.' },
      { q: 'Was kostet eine Batteriewechsel?', a: 'Kosten variieren je nach Modell, durchschnittlich CHF 5.000-12.000.' },
      { q: 'Welche Modelle sind verfügbar?', a: 'Wir bieten Limousinen, SUVs und Kleinfahrzeuge an.' },
      { q: 'Kann ich Elektromobile finanzieren?', a: 'Ja, wir bieten Leasing und Finanzierungsoptionen an.' },
      { q: 'Welche Farben sind verfügbar?', a: 'Standardfarben: Weiß, Schwarz, Grau, Silber, Blau und Rot.' },
      { q: 'Kann ich Zubehör hinzufügen?', a: 'Ja, verschiedene Zubehöroptionen sind verfügbar.' },
      { q: 'Wie viele Sitze hat das Auto?', a: 'Abhängig vom Modell: 2, 4, 5 oder 7 Sitze.' },
      { q: 'Welche Sicherheitsmerkmale gibt es?', a: 'Airbags, Stabilitätskontrolle, Bremsunterstützung und mehr.' },
      { q: 'Kann ich Elektromobil mit Familie fahren?', a: 'Ja, unsere Familienmodelle bieten Platz für bis zu 7 Personen.' },
      { q: 'Gibt es Kindersitze?', a: 'Ja, zugelassene Kindersitze sind optional erhältlich.' },
      { q: 'Welche Versicherung wird benötigt?', a: 'Eine Standard-Kaskoversicherung für Elektromobile.' },
      { q: 'Sind Elektromobile schneller als Benziner?', a: 'Unsere Spitzenmodelle sind vergleichbar schnell (0-100 km/h in 6-8 Sekunden).' },
      { q: 'Wie viel kostet das Aufladen pro km?', a: 'Durchschnittlich CHF 0,03-0,05 pro km.' },
      { q: 'Kann ich unterwegs laden?', a: 'Ja, es gibt tausende öffentliche Ladestationen in der Schweiz.' },
      { q: 'Wird mein Auto automatisch auf Updates geprüft?', a: 'Ja, Over-the-Air-Updates sind standardmäßig verfügbar.' },
      { q: 'Wie ist der Wendekreis?', a: 'Abhängig vom Modell, typisch 10-11 Meter.' },
      { q: 'Kann ich Anhänger ziehen?', a: 'Ja, mit einer Anhängelast von bis zu 1.500 kg.' },
      { q: 'Gibt es Allradantrieb?', a: 'Ja, ausgewählte Modelle verfügen über Allradantrieb.' },
      { q: 'Ist Autopilot verfügbar?', a: 'Ja, assistierte Fahrsysteme sind auf den meisten Modellen verfügbar.' },
      { q: 'Wie ist die Kofferraumgröße?', a: 'Von 300 bis 700 Liter je nach Modell.' },
      { q: 'Kann ich das Dach öffnen?', a: 'Ja, Panoramadächer sind auf ausgewählten Modellen verfügbar.' },
      { q: 'Gibt es Leder-Optionen?', a: 'Ja, Ledersitze und Lederausstattung sind optional.' }
    ]
  },
  // Kategori 3: Ladestationen (25 soru)
  {
    category: 'Ladestationen',
    categorySlug: 'ladestationen',
    faqs: [
      { q: 'Welche Arten von Ladestationen gibt es?', a: 'Wir bieten Level 2 (Hausstrom), Level 2+ (Gewerbestrom) und DC-Schnelllader.' },
      { q: 'Kann ich eine Ladestation zu Hause installieren?', a: 'Ja, wir bieten professionelle Installation und Beratung.' },
      { q: 'Wie lange dauert die Installation?', a: 'Typisch 1-2 Tage je nach Situation und Elektrik.' },
      { q: 'Wie viel kostet eine Hausladestationen?', a: 'Von CHF 800 bis 2.500 je nach Modell und Installation.' },
      { q: 'Ist eine spezielle Elektrik notwendig?', a: 'Ja, wir prüfen die Elektrik und führen Upgrades durch wenn nötig.' },
      { q: 'Kann ich im Freien laden?', a: 'Ja, unsere Stationen sind wetterfest und für den Außenbereich geeignet.' },
      { q: 'Können mehrere Autos gleichzeitig laden?', a: 'Ja, mit Installation mehrerer Stationen oder intelligenter Lastverteilung.' },
      { q: 'Wie lange halten die Ladestationen?', a: 'Durchschnittlich 10-15 Jahre mit minimaler Wartung.' },
      { q: 'Gibt es Garantie für Ladestationen?', a: 'Ja, 5 Jahre Herstellergarantie auf alle Komponenten.' },
      { q: 'Können Mieter eine Ladestation installieren?', a: 'Ja, mit Zustimmung des Vermieters können wir auch Mietinstallationen durchführen.' },
      { q: 'Ist eine Netzverbindung notwendig?', a: 'Nein, die meisten Stationen funktionieren unabhängig ohne WLAN.' },
      { q: 'Kann ich die Ladestation fernsteuern?', a: 'Ja, mit unserer mobilen App können Sie die Ladestation von überall steuern.' },
      { q: 'Welche Stecker-Standards werden unterstützt?', a: 'Wir unterstützen Type 1, Type 2 und CHAdeMO Standards.' },
      { q: 'Kann ich Nachlademittel mit anderen teilen?', a: 'Ja, Sie können Zugriff an Familie und Freunde vergeben.' },
      { q: 'Gibt es Rabatte für mehrere Stationen?', a: 'Ja, Volumenrabatte ab 5 Stationen.' },
      { q: 'Bietet MK eMotors Installation für Unternehmen?', a: 'Ja, wir bieten Komplettlösungen für Firmenparkplätze.' },
      { q: 'Kann ich eine Ladestation recyceln?', a: 'Ja, wir bieten Rücknahmeprogramme für alte Stationen.' },
      { q: 'Wie ist der Stromverbrauch einer Ladestation?', a: 'Typisch 11-22 kW für Hausstationen, bis 350 kW für Schnelllader.' },
      { q: 'Ist eine TÜV-Prüfung notwendig?', a: 'Ja, alle Installationen werden vom Netzbetreiber geprüft.' },
      { q: 'Können Solaranlagen genutzt werden?', a: 'Ja, mit einer Speicherbatterie können Sie Solarstrom zum Laden nutzen.' },
      { q: 'Wie intelligent sind die Stationen?', a: 'Unsere Stationen haben intelligente Lastverteilung und Zeitplanung.' },
      { q: 'Gibt es statistische Auswertungen?', a: 'Ja, detaillierte Nutzungsstatistiken in der Mobile App.' },
      { q: 'Kann ich Ladestation mit Kartenzahlung anbieten?', a: 'Ja, für öffentliche Stationen bieten wir Zahlungsintegration.' },
      { q: 'Welcher Kundenservice wird angeboten?', a: '24/7 technischer Support und Wartungsservice.' },
      { q: 'Bietet MK eMotors Finanzierung für Ladestationen an?', a: 'Ja, monatliche Leasingraten ab CHF 30.' }
    ]
  },
  // Kategori 4: Batterien & Energie (25 soru)
  {
    category: 'Batterien & Energie',
    categorySlug: 'batterien-energie',
    faqs: [
      { q: 'Welche Batterietypen werden verwendet?', a: 'Wir nutzen Lithium-Ionen-Batterien von führenden Herstellern.' },
      { q: 'Wie lange kann die Batterie gelagert werden?', a: 'Bei optimalen Bedingungen bis zu 5 Jahre ohne Degradation.' },
      { q: 'Wie wird die Batterie vor Überhitzung geschützt?', a: 'Mit aktivem Temperaturmanagement und Kühlsystem.' },
      { q: 'Kann die Batterie bei Kälte verwendet werden?', a: 'Ja, aber die Leistung wird bei extremer Kälte reduziert.' },
      { q: 'Wie wird die Batterie recycelt?', a: 'Wir arbeiten mit zertifizierten Recycling-Unternehmen zusammen.' },
      { q: 'Können alte Batterien zu Speicher umgewandelt werden?', a: 'Ja, Second-Life-Batterien können als Stromspeicher genutzt werden.' },
      { q: 'Wie sicher sind Batterien?', a: 'Mit mehrfachen Sicherheitssystemen und Überwachung.' },
      { q: 'Was geschieht bei Batterieschaden?', a: 'Sofortiges Abschalten und Sicherheitsmodus aktivieren.' },
      { q: 'Wie hoch ist die Ladeeffizienz?', a: 'Durchschnittlich 90-95% Energieeffizienz beim Laden.' },
      { q: 'Gibt es verschiedene Kapazitäten?', a: 'Ja, von 30 kWh bis 150 kWh verfügbar.' },
      { q: 'Wie wird die Batterie überwacht?', a: 'Mit intelligenter Batteriemanagementsystem (BMS).' },
      { q: 'Kann die Batterie schnell geladen werden?', a: 'Ja, mit DC-Schnellladern bis 80% in 30 Minuten.' },
      { q: 'Ist die Batterie umweltfreundlich?', a: 'Ja, mit minimaler CO2-Produktion während Herstellung.' },
      { q: 'Wie ist die Degradation pro Jahr?', a: 'Typisch 2-3% Kapazitätsverlust pro Jahr.' },
      { q: 'Welche Garantie gibt es für Batterien?', a: '8 Jahre oder 160.000 km Nutzung, whichever comes first.' },
      { q: 'Können private Stromspeicher installiert werden?', a: 'Ja, wir bieten Heimspeicherlösungen mit 5-20 kWh Kapazität.' },
      { q: 'Wie wird erneuerbare Energie genutzt?', a: 'Mit Solaranlagen und Wind-Strom-Abos.' },
      { q: 'Ist Balancing notwendig?', a: 'Ja, wir führen regelmäßiges Zellbalancing durch.' },
      { q: 'Welche Spannungen werden unterstützt?', a: 'Von 48V bis 400V für verschiedene Anwendungen.' },
      { q: 'Gibt es drahtlose Ladetechnologie?', a: 'Ja, wir entwickeln induktives Laden für die Zukunft.' },
      { q: 'Wie sind die Batterien versichert?', a: 'Mit spezieller Batterieversicherung bis CHF 50.000.' },
      { q: 'Können Batterien ausgetauscht werden?', a: 'Ja, mit Kosten von CHF 100-300 pro Wechsel.' },
      { q: 'Ist die Batterie wartungsfrei?', a: 'Ja, die Batterie ist wartungsfrei mit allen modernen Sicherheitsfeatures.' },
      { q: 'Werden Batteriestatistiken bereitgestellt?', a: 'Ja, detaillierte Diagnose und Statistiken via App.' },
      { q: 'Wie wird Batteriealterung gemessen?', a: 'Mit regelmäßigen Diagnose-Tests und Kapazitätsmessungen.' }
    ]
  },
  // Kategori 5: Service & Wartung (25 soru)
  {
    category: 'Service & Wartung',
    categorySlug: 'service-wartung',
    faqs: [
      { q: 'Welche Wartung ist notwendig?', a: 'Minimale Wartung: Reifencheck und Flüssigkeitsprüfung halbjährlich.' },
      { q: 'Wie oft sollte Service durchgeführt werden?', a: 'Jährlich oder nach 15.000 km, je nachdem was zuerst kommt.' },
      { q: 'Welche Services bietet MK eMotors an?', a: 'Inspection, Batterie-Check, Bremsen-Service, Reifenwechsel und mehr.' },
      { q: 'Wie lange dauert ein Service?', a: 'Typisch 1-2 Stunden für einen Standardservice.' },
      { q: 'Wie viel kostet ein Service?', a: 'Ab CHF 150 für Basis-Service bis CHF 500 für Vollservice.' },
      { q: 'Gibt es Notfall-Service?', a: 'Ja, 24/7 Pannenhilfe unter der Nummer 0800-123-4567.' },
      { q: 'Werden Ersatzteile gelagert?', a: 'Ja, alle gängigen Ersatzteile sind sofort verfügbar.' },
      { q: 'Wie lange dauert die Reparatur?', a: 'Von 1-3 Tage je nach Art der Reparatur.' },
      { q: 'Wird ein Leihfahrzeug bereitgestellt?', a: 'Ja, kostenlos während der Reparatur.' },
      { q: 'Ist Pannenhilfe kostenlos?', a: 'Ja, für alle Kunden mit aktuellem Versicherungsvertrag.' },
      { q: 'Kann ich online einen Termin vereinbaren?', a: 'Ja, über unsere Website oder Mobile App.' },
      { q: 'Gibt es Home-Service?', a: 'Ja, für bestimmte Services kommen wir zu Ihnen nach Hause.' },
      { q: 'Welche Verschleißteile müssen ersetzt werden?', a: 'Hauptsächlich Reifen, Bremsbeläge und Wischerblätter.' },
      { q: 'Wie lange halten die Bremsen?', a: 'Durch Rekuperationsbremsen 2-3x länger als normale Bremsen.' },
      { q: 'Ist eine TÜV-Prüfung notwendig?', a: 'Ja, alle 2 Jahre wie bei normalen Fahrzeugen.' },
      { q: 'Können Service-Kosten sparen?', a: 'Ja, mit unserem Wartungspaket sparen Sie bis zu 30%.' },
      { q: 'Wird die Batterie gewartet?', a: 'Ja, mit regelmäßiger Diagnose und Balancing.' },
      { q: 'Gibt es Garantie auf Service?', a: 'Ja, 12 Monate Garantie auf alle durchgeführten Arbeiten.' },
      { q: 'Werden Reparaturen von der Versicherung bezahlt?', a: 'Ja, wenn Sie Kaskoversicherung haben.' },
      { q: 'Wie wird die Elektrik überprüft?', a: 'Mit modernen Diagnosesystemen und Hochspannungstests.' },
      { q: 'Können Rückrufe durchgeführt werden?', a: 'Ja, wir führen kostenlos Rückrufe durch, wenn nötig.' },
      { q: 'Gibt es Inspektions-Checklisten?', a: 'Ja, detaillierte Checklisten sind in der App einsehbar.' },
      { q: 'Wie werden Verschleißteile entsorgt?', a: 'Umweltgerecht recycelt durch zertifizierte Entsorger.' },
      { q: 'Kann ich Werkstatt-Ergebnisse online sehen?', a: 'Ja, Fotos und Berichte werden nach Reparatur zugesandt.' },
      { q: 'Sind Service-Gutscheine verfügbar?', a: 'Ja, Geschenkgutscheine ab CHF 50.' }
    ]
  },
  // Kategori 6: Finanzierung & Leasing (25 soru)
  {
    category: 'Finanzierung & Leasing',
    categorySlug: 'finanzierung-leasing',
    faqs: [
      { q: 'Welche Finanzierungsoptionen gibt es?', a: 'Kauf, Leasing, Finanzierung und Miete verfügbar.' },
      { q: 'Wie hoch ist die minimale Anzahlung?', a: 'Ab 10% des Kaufpreises oder verhandelbar.' },
      { q: 'Wie lange läuft ein Leasingvertrag?', a: 'Typisch 24, 36 oder 48 Monate.' },
      { q: 'Was kostet Leasing monatlich?', a: 'Ab CHF 400/Monat je nach Modell und Laufzeit.' },
      { q: 'Welche Leistungen sind im Leasing enthalten?', a: 'Versicherung, Wartung, Reparation und Pannenhilfe.' },
      { q: 'Kann der Leasingvertrag vorzeitig beendet werden?', a: 'Ja, mit minimaler Geldbuße oder Verhandlung.' },
      { q: 'Wie viele Kilometer sind im Leasing enthalten?', a: 'Typisch 10.000-20.000 km pro Jahr.' },
      { q: 'Was kostet es, zusätzliche Kilometer zu fahren?', a: 'CHF 0,15-0,25 pro zusätzlichen Kilometer.' },
      { q: 'Kann die Kaution zurückgegeben werden?', a: 'Ja, wenn keine Schäden vorhanden sind.' },
      { q: 'Welche Versicherung wird beim Leasing benötigt?', a: 'Kasko ist im Leasing enthalten, Haftung separat.' },
      { q: 'Gibt es Leasingrückgabegebühren?', a: 'Normalerweise CHF 200-500 für Rückgabe und Abwicklung.' },
      { q: 'Kann ich das Leasingfahrzeug kaufen?', a: 'Ja, mit Restwertoptionen ab CHF 5.000.' },
      { q: 'Wie ist der Zinssatz für Finanzierung?', a: 'Ab 2,9% jährlich je nach Bonität.' },
      { q: 'Ist eine Bonitätsprüfung notwendig?', a: 'Ja, zur Feststellung der Kreditwürdigkeit.' },
      { q: 'Wie schnell wird die Finanzierung genehmigt?', a: 'Typisch innerhalb von 1-2 Werktagen.' },
      { q: 'Können die Raten angepasst werden?', a: 'Ja, flexible Ratenmodelle sind möglich.' },
      { q: 'Gibt es Boni für Early-Repayment?', a: 'Ja, bis zu 2% Rabatt beim vorzeitigen Abbezahlen.' },
      { q: 'Wie viel Kreditrahmen kann ich erhalten?', a: 'Bis zu CHF 150.000 je nach Bonität.' },
      { q: 'Gibt es Restschuldversicherung?', a: 'Ja, optional gegen monatliche Prämie.' },
      { q: 'Können Familienmitglieder Co-Kreditnehmer sein?', a: 'Ja, mit entsprechender Bonitätsprüfung.' },
      { q: 'Wie wird die Kreditsumme berechnet?', a: 'Basierend auf Kaufpreis minus Anzahlung.' },
      { q: 'Gibt es Spezialleasing für Firmenkunden?', a: 'Ja, mit besonderen Konditionen für B2B.' },
      { q: 'Können alte Fahrzeuge als Inzahlungnahme genutzt werden?', a: 'Ja, mit sofortiger Bewertung und Verrechnung.' },
      { q: 'Gibt es Staatliche Subventionen?', a: 'Ja, wir unterstützen bei der Beantragung von Fördermitteln.' },
      { q: 'Können Flottenleasing Vereinbarungen gemacht werden?', a: 'Ja, ab 5 Fahrzeugen mit Spezialkonditionen.' }
    ]
  },
  // Kategori 7: Technik & Ausstattung (25 soru)
  {
    category: 'Technik & Ausstattung',
    categorySlug: 'technik-ausstattung',
    faqs: [
      { q: 'Welche Infotainment-Systeme sind verfügbar?', a: 'Apple CarPlay, Android Auto, Navigation und Premium Sound System.' },
      { q: 'Ist Sprachsteuerung vorhanden?', a: 'Ja, mit deutscher Spracherkennung und Natural Language Processing.' },
      { q: 'Kann ich das System mit meinem Smartphone verbinden?', a: 'Ja, kabellos via Bluetooth oder USB-C.' },
      { q: 'Welche Kameras sind installiert?', a: 'Frontkamera, Heckkamera, 360-Grad-Kamera optional.' },
      { q: 'Gibt es Head-Up-Display?', a: 'Ja, auf Premium-Modellen mit Fahrinformationen.' },
      { q: 'Sind Sensoren für Autonomes Fahren vorhanden?', a: 'Ja, Level 2 autonome Fahrbefähigung mit Radar und Lidar.' },
      { q: 'Welche Lichtsysteme sind verfügbar?', a: 'LED-Scheinwerfer mit adaptiver Lichtverteilung.' },
      { q: 'Gibt es Ambientebeleuchtung?', a: 'Ja, mit 64 Farben konfigurierbar.' },
      { q: 'Sind beheizbare/kühlbare Sitze verfügbar?', a: 'Ja, auf Premium-Modellen.' },
      { q: 'Gibt es Lederausstattung?', a: 'Ja, Volllederausstattung optional ab CHF 3.000.' },
      { q: 'Welche Sicherheitssysteme sind integriert?', a: 'ABS, ESP, Airbag, ISOFIX, Bremsassistenz und mehr.' },
      { q: 'Gibt es Nachtsichtsystem?', a: 'Ja, auf ausgewählten Premium-Modellen.' },
      { q: 'Kann ich die Fahrmodi ändern?', a: 'Ja, Eco, Komfort, Sport und Automatik-Modi verfügbar.' },
      { q: 'Ist Fernbedienung des Fahrzeugs möglich?', a: 'Ja, via Mobile App: Verriegelung, Klimaanlage, Laden starten.' },
      { q: 'Welche Lautsprecher sind im System?', a: 'Bose Premium Sound mit 12-14 Lautsprechern.' },
      { q: 'Gibt es drahtloses Laden für Smartphones?', a: 'Ja, auf ausgewählten Modellen verfügbar.' },
      { q: 'Kann ich das Display vergrößern?', a: 'Ja, von 8" bis 15,4" Displays je nach Modell.' },
      { q: 'Ist Navi offline verfügbar?', a: 'Ja, mit heruntergeladenen Offline-Karten.' },
      { q: 'Gibt es digitale Türgriffe?', a: 'Ja, mit Keyless Entry System.' },
      { q: 'Welche Parkassistenten gibt es?', a: 'Automatisches Einparken, Ausparken und Ultraschallsensoren.' },
      { q: 'Ist Verkehrszeichenerkennung vorhanden?', a: 'Ja, mit Geschwindigkeitsbegrenzungserkennung.' },
      { q: 'Gibt es Fahrerbenachrichtigungssystem?', a: 'Ja, bei Müdigkeit und Fahrfehlern.' },
      { q: 'Ist Over-the-Air-Update möglich?', a: 'Ja, automatische Updates über WLAN.' },
      { q: 'Kann die Batterieleistung optimiert werden?', a: 'Ja, durch adaptive Batterieverwaltung.' },
      { q: 'Gibt es Energierückgewinnungssystem?', a: 'Ja, mit bremsenloser Rekuperation.' }
    ]
  },
  // Kategori 8: Umwelt & Nachhaltigkeit (25 soru)
  {
    category: 'Umwelt & Nachhaltigkeit',
    categorySlug: 'umwelt-nachhaltigkeit',
    faqs: [
      { q: 'Wie umweltfreundlich sind Elektromobile?', a: 'Sie produzieren null Emissionen beim Fahren und haben 50-70% niedrigere Gesamtemissionen.' },
      { q: 'Wie wird das Auto beim Recycling behandelt?', a: 'Mit 85% Recyclingquote und umweltgerechter Entsorgung.' },
      { q: 'Sind Verpackungsmaterialien nachhaltig?', a: 'Ja, 100% recycelbares Material und plastikfrei wo möglich.' },
      { q: 'Wie ist der Carbon Footprint der Produktion?', a: 'Ca. 30% niedriger als bei Benzin-Fahrzeugen.' },
      { q: 'Kann die Batterie komplett recycelt werden?', a: 'Ja, bis zu 95% des Batterieinhalts kann recycelt werden.' },
      { q: 'Werden Mineralien nachhaltig abgebaut?', a: 'Ja, wir arbeiten nur mit fairtrade zertifizierten Lieferanten.' },
      { q: 'Welche CO2-Einsparungen entstehen jährlich?', a: 'Ein Elektromobile spart ca. 4-6 Tonnen CO2 pro Jahr ein.' },
      { q: 'Unterstützt MK eMotors grüne Energie?', a: 'Ja, wir nutzen 100% Öko-Strom in unseren Fabriken.' },
      { q: 'Gibt es Baum-Pflanzprogramm?', a: 'Ja, für jeden verkauften Auto wird ein Baum gepflanzt.' },
      { q: 'Wie wird Wasser gespart?', a: 'Mit moderner Produktionstechnik und Regenwassernutzung.' },
      { q: 'Sind die Lieferketten transparent?', a: 'Ja, vollständige Transparenz und Audit-Zertifikation.' },
      { q: 'Werden Menschenrechte respektiert?', a: 'Ja, mit ILO-konformen Arbeitsstandards überall.' },
      { q: 'Gibt es Kompensationsprogramme für Emissionen?', a: 'Ja, Kohlenstoff-Offsetting in Waldschutzprojekten.' },
      { q: 'Wie ist die Energiedichte der Batterien?', a: 'Aktuell 250-300 Wh/kg mit Ziel 400 Wh/kg.' },
      { q: 'Werden Seltenerden verwendet?', a: 'Minimal - wir entwickeln seltenerdfreie Motoren.' },
      { q: 'Ist die Produktion lokal?', a: 'Teils lokal in der Schweiz, Teils europaweit.' },
      { q: 'Gibt es Upcycling-Programm für alte Teile?', a: 'Ja, Second-Life-Batterien werden in Stromspeicher umgewandelt.' },
      { q: 'Wie wird Abfall minimiert?', a: 'Mit Zero-Waste-Strategie und 95% Recyclingquote.' },
      { q: 'Gibt es Zertifikationen für Nachhaltigkeit?', a: 'Ja, B Corp und ISO 14001 Umweltmanagement zertifiziert.' },
      { q: 'Werden Sozialrojekte unterstützt?', a: 'Ja, 1% der Gewinne gehen an Nachhaltigkeitsprojekte.' },
      { q: 'Ist die Verpackung minimalist?', a: 'Ja, nur notwendige Verpackung, alles recyclebar.' },
      { q: 'Wie wird Luft- und Wassergüte geschützt?', a: 'Mit Nullemissions-Fabriken und modernen Filtersystemen.' },
      { q: 'Gibt es Kreislaufwirtschaft?', a: 'Ja, zirkuläres Wirtschaftsmodell mit Rücknahmeprogramm.' },
      { q: 'Wie ist die Biodiversität in den Werken?', a: 'Mit Grünflächen, Bienenstöcken und Naturschutz.' },
      { q: 'Wird die Digitalisierung für Effizienz genutzt?', a: 'Ja, KI-gesteuerte Optimierung von Produktion und Logistik.' }
    ]
  }
]

// Verzeichnis erstellen
const dataDir = path.join(process.cwd(), '.data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Alle FAQs in einem Array sammeln
let allFaqs = []
let faqId = 1

// Kategorien erstellen
const categories = faqData.map((cat, idx) => ({
  id: idx + 1,
  name: cat.category,
  slug: cat.categorySlug,
  description: `Häufig gestellte Fragen zu ${cat.category}`,
  order: idx + 1,
  active: true,
  seoTitle: `${cat.category} - FAQ`,
  seoDescription: `Antworten auf häufig gestellte Fragen zu ${cat.category}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))

// FAQs erstellen
faqData.forEach((cat, catIdx) => {
  cat.faqs.forEach((item, itemIdx) => {
    const slug = item.q
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50)

    allFaqs.push({
      id: faqId++,
      slug: `${slug}-${faqId}`,
      category: cat.category,
      categorySlug: cat.categorySlug,
      question: item.q,
      title: item.q,
      answer: item.a,
      keywords: [cat.category.toLowerCase()],
      searchTerms: item.q.split(' ').slice(0, 3),
      seoTitle: item.q,
      seoDescription: item.a.slice(0, 150),
      canonicalUrl: `/faq/${cat.categorySlug}/${slug}`,
      popular: itemIdx < 5,
      featured: itemIdx === 0,
      showOnHomepage: itemIdx === 0,
      showInFooter: itemIdx < 3,
      showOnCategoryPage: true,
      showOnProductPage: false,
      showOnBlog: false,
      status: 'active',
      order: itemIdx,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  })
})

// Speichern
fs.writeFileSync(path.join(dataDir, 'faq-categories.json'), JSON.stringify(categories, null, 2))
fs.writeFileSync(path.join(dataDir, 'faqs.json'), JSON.stringify(allFaqs, null, 2))

console.log(`✅ Seeding abgeschlossen!`)
console.log(`📁 ${categories.length} Kategorien erstellt`)
console.log(`❓ ${allFaqs.length} FAQ-Elemente erstellt`)
console.log(`💾 Gespeichert in .data/faqs.json und .data/faq-categories.json`)

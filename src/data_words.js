/* ================= WORDS =================
   Block format: first line  code|emoji|English title|Dholuo title
   then one line per word:   picture|English|Dholuo
   - Dholuo ending in "?"  = the author is NOT sure, a native speaker should check first.
   - picture starting "~"  = picture is only decoration (not used in picture questions).
   - empty Dholuo          = no Dholuo word known (English-only school / computer term).
   All Dholuo here was written without a native speaker. Helpers confirm or fix it inside the app. */
const WORD_BLOCKS = [
`num|🔢|Numbers|Kwan
1|one|achiel
2|two|ariyo
3|three|adek
4|four|ang'wen
5|five|abich
6|six|auchiel
7|seven|abiriyo
8|eight|aboro
9|nine|ochiko
10|ten|apar
11|eleven|apar gachiel
12|twelve|apar gariyo
13|thirteen|apar gadek
14|fourteen|apar gang'wen
15|fifteen|apar gabich
16|sixteen|apar gauchiel
17|seventeen|apar gabiriyo
18|eighteen|apar gaboro
19|nineteen|apar gochiko
20|twenty|piero ariyo
21|twenty-one|piero ariyo gachiel
25|twenty-five|piero ariyo gabich
30|thirty|piero adek
40|forty|piero ang'wen
50|fifty|piero abich
60|sixty|piero auchiel
70|seventy|piero abiriyo
80|eighty|piero aboro
90|ninety|piero ochiko
100|one hundred|mia achiel
200|two hundred|mia ariyo
500|five hundred|mia abich
1000|one thousand|alufu achiel?
0|zero|nono?`,

`ani|🐾|Animals|Le
🐕|dog|guok
🐄|cow|dhiang'
🐐|goat|diel
🐔|chicken|gweno
🐈|cat|paka?
🐟|fish|rech
🐦|bird|winyo
🐑|sheep|rombo
🐍|snake|thuol
🦁|lion|sibuor
🐘|elephant|liech
🦛|hippo|rao
🐊|crocodile|nyang'
🐒|monkey|ong'er
🐇|hare|apuoyo
🐸|frog|ogwal
🐖|pig|anguro
🦆|duck|atudo
🐂|bull|ruath
🐓|rooster|thuon gweno
🐥|chick|nyathi gweno
🐀|rat|oyieyo
🐝|bee|kich
🦟|mosquito|suna
🐜|ant|ochunglo?
🦋|butterfly|oguyo?
🕷️|spider|mbui?
🐢|tortoise|opuk
🦎|lizard|ng'ech?
🦓|zebra|magwar?
🦒|giraffe|tiga
🐃|buffalo|jowi
🦏|rhino|omuga
🐆|leopard|kwach
~🐺|hyena|ondiek
🦉|owl|tula
🦅|hawk|otenga
~🐦|crow|agak
🕊️|dove|akuru
🦗|grasshopper|dede
🐛|worm|kudni
🦇|bat|olik
🐌|snail|kamnie?
~🐴|donkey|kanyna?
🐪|camel|ngamia?
🐠|tilapia|ngege
~🐟|Nile perch|mbuta
~🐟|small fish (omena)|omena
🐮|calf|nyaroya
~🐾|wild animal|le
~🐄|livestock|jamni
~🐂|horn|tung'
~🐒|tail|yiw
~🐦|wing|bwombe
~🐦|nest|od winyo`,

`bod|🧍|Body|Del
🙂|head|wich
👁️|eye|wang'
👂|ear|it
👃|nose|um
👄|mouth|dhok
🦷|tooth|lak
👅|tongue|lep
✋|hand|lwedo
🦵|leg / foot|tielo
💇|hair|yie wich
~🧣|neck|ng'ut
~🔙|back|ng'e
~🧍|stomach|ich
~🧍|chest|kor
☝️|finger|lith lwedo
~🦶|toe|lith tielo?
~🦵|knee|chong
💪|arm|bat
~🤷|shoulder|gok
~✋|skin|pien
🦴|bone|chogo
🩸|blood|remo
❤️|heart|adundo
🧍|body|del
💅|fingernail|kogno
🧔|beard|yie tik
~🙂|face|lela wang'?
~🙂|chin|tik
~🗣️|voice|duol
😢|tear|pi wang'
~🧠|brain|obwongo`,

`fam|👪|People|Ji
👩|mother|mama
👨|father|baba
🧒|child|nyathi
👶|baby|nyathi matin
👵|grandmother|dayo
👴|grandfather|kwaro
👦|boy|wuoyi
👧|girl|nyako
🤵|man|dichwo
👰|woman|dhako
🤝|friend|osiep
👬|brother|owadwa
👭|sister|nyaminwa
~🧑‍🏫|teacher|japuonj
~🧑‍🎓|pupil|japuonjre
~👨‍⚕️|doctor|jathieth
~👨‍🌾|farmer|japur
~🎣|fisherman|jalupo
~👨‍🍳|cook|jatedo
👮|police officer|polis
👑|chief|ruoth
~👴|elder|jaduong'
👥|people|ji
~🧑|person|dhano
~👪|family|joot
~👶|children|nyithindo
~👨|uncle|nera
~👩|aunt|waya
~🏘️|neighbour|jirani?
~🚶|visitor|wendo
~👯|twins|rude
~👪|parent|janyuol
~🚗|driver|jariembo
~🛒|trader|jaohala
~⛪|pastor|jayalo
~🏷️|name|nying`,

`food|🍲|Food and drink|Chiemo
💧|water|pi
🥛|milk|chak
~🍚|ugali|kuon
🍠|sweet potato|rabuon
🥚|egg|tong'
🌽|maize|oduma
🥭|mango|maembe?
🍖|meat|ring'o
🧂|salt|chumbi
~🍬|sugar|sukari
🍵|tea|chai
🥣|porridge|nyuka
~🍲|beans|oganda
🥬|vegetables|alot
🍌|banana|rabolo
~🍚|rice|ochele?
🍞|bread|makate
~🧴|cooking oil|mo
🥜|groundnuts|njugu
~🍠|cassava|marieba?
~🌾|millet|kal
~🌾|sorghum|bel
~🥡|flour|mogo
🍯|honey|mor kich
~🍲|stew|kado
🍽️|food|chiemo
~🎋|sugarcane|niang'
🍊|orange|machunga
~🍈|pawpaw|apoyo
🍅|tomato|nyanya
🧅|onion|kitungu
🌶️|pepper|pilipili
🎃|pumpkin|budho
🍗|chicken meat|ring' gweno
~🍲|maize and beans|nyoyo
~🍐|guava|mapera
🍋|lemon|ndim?
~🥬|cowpea leaves|boo
~🥬|jute mallow|apoth
~🌱|sesame|nyim
~🍩|mandazi|mandas?
~🍞|chapati|chapat?
🍍|pineapple|nanas?
~😋|hunger|kech
~🥵|thirst|riyo`,

`nat|🌍|Around us|Piny
☀️|sun|chieng'
🌙|moon|dwe
⭐|star|sulwe
🌧️|rain|koth
🔥|fire|mach
🌳|tree|yath
🌊|lake|nam
~🏞️|river|aora
⛰️|hill|got
~🪨|stone|kidi
~🟤|soil|lowo
~🌤️|sky|polo
☁️|cloud|boche polo
🌬️|wind|yamo
🌿|grass|lum
🌸|flower|maua?
🍃|leaf|oboke
~🌲|forest|bungu
~🏖️|sand|kuoyo
~💨|smoke|iro
⚡|lightning|mil polo?
~🌩️|thunder|mor polo
🌈|rainbow|lihudu?
~🔥|ash|buru
~🟤|mud|chuodho
~💧|dew|tho
🌱|seed|kodhi
~🌳|root|tiend yath
🌍|world|piny
🏝️|island|chula
~👤|shadow|tipo
~🌑|darkness|mudho
💡|light|ler
~🥵|heat|liet
🥶|cold|koyo
~🌊|wave|apaka`,

`home|🏠|Home|Dala
🏠|house|ot
🏡|home|dala
🚪|door|dhoot
~🪟|window|dirisa
🛏️|bed|kitanda
🪑|chair|kom
~🍽️|table|mesa
🏺|pot|agulu
☕|cup|okombe
🍽️|plate|san
🥄|spoon|ojiko
🔪|knife|pala
🧺|basket|okapu
🧹|broom|oywech
🪔|lamp|taya
~🔥|firewood|yien
~🍳|kitchen|jokon
~🏠|roof|tado
🧱|wall|kor ot
~🧶|mat|par
~🛌|blanket|onget
🧼|soap|sabun
🔑|key|ofunguo?
~🧵|rope|tol
🎒|bag|ofuko
~🪣|bucket|ndowo
~🛢️|tin|debe
~🔥|cooking stones|kende
~🛖|granary|dero
~🚧|fence|chiel
~🏡|yard|laru
~🐄|cattle pen|kul
🚽|toilet|choo
~⛏️|hoe|kwer
~🔪|panga|beti
~🪓|axe|le
~🪡|needle|sindan
~🏺|gourd|agwata
~🚪|gate|rangach
~⚫|charcoal|makaa
~🔥|matches|kibirit
📻|radio|nyakalondo
📱|phone|simu
🔦|torch|toch?
~💧|water pot|dapi
~🪨|grinding stone|pong'`,

`sch|🏫|School|Skul
🏫|school|skul
📚|book|buk
🖊️|pen|kalam
📄|paper|kalatas
~🏫|class|klas
~⬛|blackboard|bao
~🖍️|chalk|chok
~📖|lesson|puonj
~📝|exam|penj
❓|question|penjo
~✅|answer|dwoko
🔢|number|namba
🔤|letter|nyukta
~💬|word|wach
~📖|story|sigana
🎵|song|wer
⚽|ball|opira
🔔|bell|olang'
~👕|uniform|yunifom
📏|ruler|rula
🖼️|picture|picha
~🗣️|language|dhok
~🎲|game|tugo
~📓|exercise book|buk ndiko
~🪑|desk|des?
~🏖️|holiday|yweyo?`,

`clo|👕|Clothes|Lewni
👕|shirt|sati
👖|trousers|long'
👗|dress|law
👟|shoes|wuoche
🧢|hat|ogudu
🧥|sweater|sweta?
🧦|socks|soks?
~👗|skirt|sket?
~👖|belt|okanda
🧣|headscarf|kitamba
📿|beads|tigo
💍|ring|pete
⌚|watch|sa
~👚|clothes|lewni
~🧵|cloth|nanga
~🧺|towel|taulo`,

`col|🎨|Colours|Rangi
🔴|red|makwar
⚫|black|marateng'
⚪|white|marachar
🟢|green|mang'ich?
🔵|blue|buluu?
🟡|yellow|ratong'?
🟤|brown|rabuor?
🎨|colour|rangi`,

`verb|🏃|Actions|Timo
🍽️|to eat|chiemo
🥤|to drink|metho
😴|to sleep|nindo
🏃|to run|ringo
🚶|to walk|wuotho
~⚽|to play|tugo
🎤|to sing|wer
📖|to read|somo
✏️|to write|ndiko
~🔢|to count|kwano
~👋|to come|biro
~➡️|to go|dhi
~🪑|to sit|bet
🧍|to stand|chung'
👀|to see|neno
~👂|to hear|winjo
🗣️|to speak|wuoyo
~💬|to say|wacho
~🤲|to give|miyo
~✊|to take|kawo
~📦|to bring|kelo
🧼|to wash|luoko
🛁|to bathe|luokore?
🍳|to cook|tedo
~⛏️|to dig|puro
🛒|to buy|nyiewo
~💰|to sell|uso
😂|to laugh|nyiero
😭|to cry|ywak
~🦘|to jump|dum?
💃|to dance|miel
~💪|to work|tiyo
~🧑‍🎓|to learn|puonjore
~🧑‍🏫|to teach|puonjo
~💡|to know|ng'eyo
~🙋|to want|dwaro
~❤️|to like|hero
~🤝|to help|konyo
~📂|to open|yawo
~🚪|to close|loro
~🏋️|to carry|ting'o
~🚰|to fetch water|tuomo pi
~🧱|to build|gero
✂️|to cut|ng'ado
~⬇️|to fall|podho
~⏳|to wait|rito
~📣|to call|luongo
~❓|to ask|penjo
~✅|to answer|dwoko
🤔|to think|paro
~🤷|to forget|wil
~🔍|to find|yudo
~🔎|to look for|manyo
🧹|to sweep|yweyo
🏊|to swim|goyo abal
🧗|to climb|idho
~🤾|to throw|wito
~🤲|to catch|mako
~🦶|to kick|gweyo
~👊|to hit|goyo
~👉|to push|dhiro
~👈|to pull|ywayo
~⏰|to wake up|chiew
~↩️|to return|duogo
~🏁|to arrive|chopo
~🚪|to enter|donjo
~🚶|to go out|wuok
🙏|to pray|lamo
👋|to greet|moso
~▶️|to begin|chako
~🏁|to finish|tieko
~🎯|to try|temo
~📨|to send|oro
~💵|to pay|chulo
🎣|to fish|lupo
~🐄|to herd|kwayo
~🥛|to milk|nyiedho
~🌱|to plant|pidho
~🌾|to harvest|keyo
~🕊️|to fly|fuyo
~🦷|to bite|kayo
~🖼️|to show|nyiso
~🏠|to live (stay)|dak
~🙈|to hide|pondo
~🪢|to tie|tweyo
~👕|to wear|rwako
~🤲|to share|pogo
~👃|to smell|ng'weyo
~👅|to taste|bilo
~✋|to touch|mulo
~🧵|to sew|twang'o
~🥁|to beat a drum|goyo bul
~🧺|to wash clothes|luoko lewni
~🔥|to light a fire|moko mach
~💭|to dream|leko
~🙂|can (to be able)|nyalo
~📢|to shout|kok
~🤫|to be quiet|ling'
~👁️|to look|ng'iyo
~🚿|to pour|olo
~🔨|to make / repair|loso
~📖|to tell a story|gano sigana`,

`adj|✨|Describing words|Kaka gik chalo
~🐘|big|duong'
~🐜|small|tin
👍|good|ber
👎|bad|rach
~🦒|tall / long|bor
~📏|short|chiek
~🔥|hot|liet
~🧊|cold (thing)|ng'ich
~✨|new|nyien
~🏚️|old|moti
~🐟|many|ng'eny
~🤏|few|nok
~🏋️|heavy|pek
~🪶|light / easy|yot
~💪|hard / strong|tek
~✨|clean|ler
~🟤|dirty|mochido?
~😋|sweet / tasty|mit
~😖|bitter|kech
~🐇|fast|piyo
~🐢|slow|mos
~🌺|beautiful|jaber
~🥛|full|pong'
~⭕|empty|nono?
~📍|near|machiegni
~🛤️|far|mabor
😊|happy|mor
😢|sad|kuyo
😫|tired|ol
🤒|sick|tuo
~💪|healthy|ngima
~🦉|clever|riek
~✅|true|adier
~🏜️|dry|motuo
~🥭|ripe|ochiek
~↔️|wide|lach
~🔪|sharp|bith
~✅|correct|kare
😨|afraid|luor
😠|angry|kecho?`,

`gram|💬|Small words|Weche matindo
~🙋|I|an
~👉|you|in
~🧑|he / she|en
~👥|we|wan
~👥|you (many)|un
~👥|they|gin
~🙋|my|mara
~👉|your|mari
~🧑|his / her|mare
~👥|our|marwa
~❓|who|ng'a
~❓|what|ang'o
~❓|where|kanye
~❓|when|karang'o
~❓|why|nang'o
~❓|how|nade
~❓|how many|adi
~➕|and / with|gi
~↔️|or|kata
~↩️|but|to
~💡|because|nikech
~🚫|not|ok
✅|yes|ee
❌|no|ooyo
~👇|this|ma
~👉|that|mano
~💯|all|duto
~‼️|very|ahinya
~➕|also|bende
~🔁|again|kendo
~☝️|only|kende
~🤔|if|ka
~📦|thing|gima
~📦|something|gimoro
~⭕|nothing|onge gimoro
~🧑|someone|ng'ato
~👥|everyone|ji duto
~✅|there is|nitie
~🚫|there is not|onge
~📍|here|kae
~👉|there|kucha
~📥|inside|ei
~📤|outside|oko
⬆️|up|malo
⬇️|down|piny
~⏩|in front|nyime
~⏪|behind|chien
⬅️|left|koracham
➡️|right|korachwich
~⬇️|under|e bwo
~⬆️|on top of|e wi
~↔️|beside|e bath
~↔️|between|e kind`,

`time|⏰|Time|Kinde
~📅|today|kawuono
~📅|tomorrow|kiny
~📅|yesterday|nyoro
~⏱️|now|sani
~⏳|later|bang'e
🌅|morning|okinyi
🌇|evening|odhiambo
🌃|night|otieno
~📆|day|odiechieng'
~📆|week|juma
~🌙|month|dwe
~🎆|year|higa
⏰|hour|sa
~♾️|every day|pile
~📜|long ago|chon
~📆|Monday|Wuok Tich
~📆|Tuesday|Tich Ariyo
~📆|Wednesday|Tich Adek
~📆|Thursday|Tich Ang'wen
~📆|Friday|Tich Abich
~📆|Saturday|Chieng' Ngeso
~📆|Sunday|Jumapil
~🌧️|rainy season|chwiri
~☀️|dry season|oro
~🌾|harvest time|kinde keyo
~📆|January|Dwe mar Achiel
~📆|February|Dwe mar Ariyo
~📆|March|Dwe mar Adek
~📆|April|Dwe mar Ang'wen
~📆|May|Dwe mar Abich
~📆|June|Dwe mar Auchiel
~📆|July|Dwe mar Abiriyo
~📆|August|Dwe mar Aboro
~📆|September|Dwe mar Ochiko
~📆|October|Dwe mar Apar
~📆|November|Dwe mar Apar gachiel
~📆|December|Dwe mar Apar gariyo`,

`place|📍|Places|Kuonde
~🛍️|market|chiro
🏪|shop|duka
🏥|hospital|osiptal
⛪|church|kanisa
🏘️|village|gweng'
🏙️|town|taon?
🌾|farm|puodho
🛣️|road|yo
🌉|bridge|olalo
~🏟️|playing field|pap
~💦|well|soko
🇰🇪|Kenya|Kenya
~🗺️|country|piny
~🖥️|internet café|saiba?
~🏦|bank|bengi?
~🏢|office|ofis
~⛴️|lake shore|wath`,

`go|🚲|Travel and money|Wuoth gi pesa
🚗|car|mtoka
🚲|bicycle|ndiga
🏍️|motorbike|pikipiki?
⛵|boat|yie
🚌|bus|bas
✈️|aeroplane|ndege
🚚|lorry|lori
💰|money|pesa
~🪙|shilling|siling'
~🏷️|price|nengo
~🧭|journey|wuoth
🎁|gift|mich
~💼|work|tich`,

`hea|💊|Health|Ngima
💊|medicine|yath
~🤒|sickness|tuo
~🌡️|fever|homa?
~🦟|malaria|maleria
~😷|cough|ahonda
🩹|wound|adhola
🤕|headache|wich bar
~🤢|stomach ache|rem ich?
~🦷|toothache|rem lak?
~🧼|to wash hands|luoko lwedo
~💧|clean water|pi maler
~♨️|to boil water|chwako pi
~🛏️|mosquito net|net mar suna?
~🦷|to brush teeth|luoko lak?
💉|injection|sindan
~😣|pain|rem
~🦠|germs|kute
~💪|health|ngima
~🤮|to vomit|ng'ok
~🚑|accident|masira
~🩺|to treat|thiedho`,

`math|➕|School English: maths|Kwan e skul
➕|to add|medo
➖|to take away|golo
✖️|to multiply|
➗|to divide|pogo
=|equals|romo
½|half|nus
⭕|circle|
⬛|square|
🔺|triangle|
~📏|line|
~🥇|first|mokwongo
~🥈|second|mar ariyo
~🥉|third|mar adek
~🏁|last|mogik
~📈|more than|ng'eny moloyo
~📉|less than|nok moloyo
~💯|total|duto
~🔢|to count|kwano
~📐|to measure|pimo
~⚖️|the same|chal`,

`tech|💻|Computer and internet|Kompyuta
💻|computer|kompyuta
🌐|internet|intanet
⌨️|keyboard|
🖱️|mouse|
🖥️|screen|
🔍|to search|manyo
👆|to click|mulo?
~⌨️|to type|ndiko
📨|to send|oro
💬|message|ote
📧|email|
✉️|letter (post)|barua
🔑|password|wach maling'ling'?
~👤|user name|
~📂|to open|yawo
~❌|to close|loro
💾|to save|kano
🗑️|to delete|rucho
⬇️|to download|
⬆️|to upload|
🖨️|to print|goyo chapa
🔗|link|
~📄|page|
🔋|battery|betri?
🔌|to charge|
📶|network|
🎧|headphones|
🔊|sound|duol
📷|photo|picha
🎬|video|video
📰|news|weche manyien
~🔒|to log in|donjo
~🚪|to log out|wuok
~❌|cancel|weyo
~⏳|loading|rit
⚠️|error|ketho
🆘|help|kony
~➡️|next|
~⬅️|back|chien
⚙️|settings|
~🎁|free|nono`
];

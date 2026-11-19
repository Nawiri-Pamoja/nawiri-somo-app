/* ================= PHRASES, SENTENCES, DIALOGUES, STORIES =================
   Lines:  English|Dholuo      ("?" at the end of the Dholuo = please check first) */
const PHRASE_BLOCKS = [
`greet|👋|Greetings|Mos
Hello!|Misawa!
I greet you.|Amosi.
Good morning.|Oyawore.
Good afternoon.|Osaore.
Good evening.|Oimore.
How are you?|Idhi nade?
I am fine.|Adhi maber.
Very well.|Ber ahinya.
And you?|To in?
What's up?|Nang'o?
Come in.|Donji.
Goodbye.|Oriti.
See you tomorrow.|Wanere kiny.
Sleep well.|Nind maber.
How is home?|Dala nade?
Everyone is well.|Ji duto ber.?`,

`polite|🙏|Kind words|Weche mabeyo
Thank you.|Erokamano.
Thank you very much.|Erokamano ahinya.
Thank you too.|Erokamano bende.
Please.|Akwayi.
Sorry.|Mos.
Forgive me.|Ng'wonna.
No problem.|Onge wach.
Yes.|Ee.
No.|Ooyo.
All right.|Kare.
Well done!|Itimo maber!
God bless you.|Nyasaye ogwedhi.
I agree.|Ayie.
Me too.|An bende.
Welcome.|Marahaba.?
Excuse me, may I pass?|Akwayi, anyalo kadho?`,

`intro|🙋|About me|Wach kuoma
What is your name?|Nyingi ng'a?
My name is Achieng'.|Nyinga en Achieng'.
How old are you?|In gi higni adi?
I am ten years old.|An gi higni apar.
Where do you live?|Idak kanye?
I live in Boro.|Adak Boro.
Where do you come from?|Ia kanye?
I come from Siaya.|Aa Siaya.
Who is this?|Ma ng'a?
This is my friend.|Ma en osiepna.
I am a pupil.|An japuonjre.
I am happy to see you.|Amor neni.
I have one brother.|An gi owadwa achiel.?
I have two sisters.|An gi nyimine ariyo.?
I speak Dholuo.|Awacho Dholuo.
I am learning English.|Apuonjora Kisungu.?`,

`class|🏫|In class|E klas
Sit down.|Bed piny.
Stand up.|Chung' malo.
Come here.|Bi ka.
Listen.|Winji.
Look.|Ne.
Open your book.|Yaw bugi.
Close the door.|Lor dhoot.
Read.|Som.
Write.|Ndik.
Say it again.|Wach kendo.
Be quiet.|Ling'.
I understand.|Awinjo.
I do not understand.|Ok awinj.
I do not know.|Akia.
I know.|Ang'eyo.
May I go out?|Anyalo wuok oko?
May I drink water?|Anyalo modho pi?
Teacher, help me.|Japuonj, konya.
What does this mean?|Ma tiende ang'o?
Speak slowly.|Wuo mos.
I have finished.|Asetieko.
I am ready.|Aikora.
It is correct.|En kare.
Try again.|Tem kendo.
Hurry up.|Tim piyo.
Wait.|Rit.
Give me the book.|Miya buk.
Whose is this?|Ma mar ng'a?
It is mine.|En mara.
How do you say this in English?|Iwacho ma nade gi Kisungu?`,

`daily|🏡|At home|E dala
I am hungry.|Kech kaya.
I am thirsty.|Riyo oloya.?
I want water.|Adwaro pi.
Give me water.|Miya pi.
Let us eat.|Wachiem.
The food is tasty.|Chiemo mit.
I am full.|Ayieng'.
I am tired.|Aol.
I am going to sleep.|Adhi nindo.
Wake up.|Chiew.
Wash your hands.|Luok lweti.
I am going to school.|Adhi skul.
I am going home.|Adhi dala.
Come and eat.|Bi ichiem.
Where is mother?|Mama ni kanye?
She is at the market.|En chiro.
I am fetching water.|Atuomo pi.
Help me carry this.|Konya ting'o ma.
It is raining.|Koth chwe.
The sun is hot.|Chieng' liet.
It is cold.|Koyo ng'ich.?
Sweep the house.|Yue ot.?
Light the fire.|Mok mach.
Bring firewood.|Kel yien.`,

`play|⚽|Playing|Tugo
Let us play.|Watugi.
Let us go.|Wadhi.
Come with me.|Bi wadhi.
Kick the ball.|Gwe opira.
Run!|Ring!
Stop.|Chung'.
Be careful!|Tang'!
Wait for me.|Rita.
Do you want to play?|Idwaro tugo?
Yes, I want to.|Ee, adwaro.
I win.|Aloyo.
You win.|Iloyo.
Let us sing.|Wawer.
Let us be friends.|Wabed osiepe.
Give me the ball.|Miya opira.
It is my turn.|Ma en kinda.?`,

`market|🛍️|At the market|E chiro
How much is this?|Ma nengone adi?
It is ten shillings.|En siling' apar.
I want to buy fish.|Adwaro nyiewo rech.
It is expensive.|Nengone tek.
Reduce the price.|Dwok nengo piny.?
Give me two.|Miya ariyo.
I have no money.|Aonge pesa.
Here is the money.|Pesa eri.
What are you selling?|Iuso ang'o?
I am selling tomatoes.|Auso nyanya.
Do you have sugar?|In gi sukari?
It is finished.|Orumo.
Give me my change.|Miya pesa modong'.?
Thank you, goodbye.|Erokamano, oriti.`,

`help|🆘|Help and health|Kony gi ngima
Help me!|Konya!
I am sick.|Atuo.
My head hurts.|Wiya bara.
My stomach hurts.|Iya rama.
I am lost.|Alal.
Where is the hospital?|Osiptal ni kanye?
Call the teacher.|Luong japuonj.
I fell down.|Agore piny.
I am afraid.|Aluor.
Do not be afraid.|Kik iluor.
Are you well?|Ingima?
What happened?|Ang'o motimore?
I need a doctor.|Adwaro jathieth.
Drink clean water.|Modh pi maler.
Wash your hands with soap.|Luok lweti gi sabun.
Sleep under a mosquito net.|Nind e bwo net.?`,

`feel|😊|Feelings|Chuny
I am happy.|Amor.
I am sad.|Chunya okuyo.
I love you.|Aheri.
I like this.|Ahero ma.
I do not like this.|Ok ahero ma.
You are my friend.|In osiepna.
Can I help you?|Anyalo konyi?
Thank you for helping me.|Erokamano kuom konya.
It is true.|En adier.
Really?|Adier?
What do you think?|Iparo nade?
I refuse.|Adagi.
I am surprised.|Awuoro.
I am angry.|Iya owang'.
Peace.|Kwe.
Let us share.|Wapog.?`,

`ask|❓|Questions|Penjo
What is this?|Ma en ang'o?
What is that?|Mano en ang'o?
This is a dog.|Ma en guok.
Where are you going?|Idhi kanye?
I am going to the market.|Adhi chiro.
What are you doing?|Itimo ang'o?
I am reading.|Asomo.
What do you want?|Idwaro ang'o?
When will you come?|Ibiro karang'o?
I will come tomorrow.|Abiro kiny.
Why are you crying?|Iywak nang'o?
Who is your teacher?|Japuonjni en ng'a?
How many are they?|Gin adi?
Do you understand?|Iwinjo?
What time is it?|Sa adi?
Where is the toilet?|Choo ni kanye?
Is it far?|Obor?
It is near.|Ochiegni.
Do you speak English?|Iwacho Kisungu?
A little.|Matin.`,

`cyber|💻|At the internet café|E saiba
I want to use a computer.|Adwaro tiyo gi kompyuta.
How much is one hour?|Sa achiel en pesa adi?
Please help me search.|Akwayi, konya manyo.
Can you show me?|Inyalo nyisa?
It does not work.|Ok oti.
The internet is slow.|Intanet dhi mos.?
I want to send a message.|Adwaro oro ote.
I forgot my password.|Wiya owil gi password mara.?
I want to print this.|Adwaro goyo chapa ma.?
Where do I click?|Amul kanye?
What does this word mean?|Wach ni tiende ang'o?
I have finished, thank you.|Asetieko, erokamano.`
];

/* Sentences for reading and for building with word tiles. */
const SENT_BLOCKS = [
`s1|🧩|Sentences 1|Weche 1
The dog is running.|Guok ringo.
The child is drinking milk.|Nyathi madho chak.
Mother is cooking fish.|Mama tedo rech.
The cow eats grass.|Dhiang' chamo lum.
The house is big.|Ot duong'.
The goat is small.|Diel tin.
The sun is hot.|Chieng' liet.
The water is cold.|Pi ng'ich.
The food is good.|Chiemo ber.
The bird is singing.|Winyo wer.
The baby is sleeping.|Nyathi matin nindo.
Father is going to the lake.|Baba dhi nam.`,

`s2|🧩|Sentences 2|Weche 2
I have two books.|An gi buge ariyo.
I see three birds.|Aneno winy adek.
I can read.|Anyalo somo.
I can write my name.|Anyalo ndiko nyinga.
I like mangoes.|Ahero maembe.?
I am eating ugali and fish.|Achamo kuon gi rech.
I am washing my hands.|Aluoko lweta.
I help my mother.|Akonyo mama.
I do not have a pen.|Aonge kalam.
I want to learn English.|Adwaro puonjora Kisungu.?
I am eight years old.|An gi higni aboro.
I am going to school.|Adhi skul.`,

`s3|🧩|Sentences 3|Weche 3
She is my sister.|En nyaminwa.
He is my friend.|En osiepna.
We are friends.|Wan osiepe.
They are working on the farm.|Gitiyo e puodho.
He is running fast.|Oringo matek.
She is singing a song.|Owero wer.
We go to school every day.|Wadhi skul pile.
We drink clean water.|Wamodho pi maler.
The children are playing football.|Nyithindo tugo opira.
The teacher is writing on the blackboard.|Japuonj ndiko e bao.
The boy climbs the tree.|Wuoyi idho yath.
The girl carries water.|Nyako ting'o pi.`,

`s4|🧩|Where is it?|Ni kanye?
The fish is in the lake.|Rech ni e nam.
The book is on the table.|Buk ni e wi mesa.
The cat is under the chair.|Paka ni e bwo kom.?
The ball is behind the house.|Opira ni e ng'e ot.?
Mother is in the kitchen.|Mama ni e jokon.
The cows are in the field.|Dhok ni e pap.
Where is my pen?|Kalamna ni kanye?
It is here.|En kae.?
The school is near.|Skul chiegni.
The market is far.|Chiro bor.
The bird is in the tree.|Winyo ni e yath.
The children are outside.|Nyithindo ni oko.`,

`s5|🧩|Yesterday and tomorrow|Nyoro gi kiny
Yesterday I went to the market.|Nyoro ne adhi chiro.
Tomorrow I will go to Kisumu.|Kiny abiro dhi Kisumo.
Today it is raining.|Kawuono koth chwe.
Yesterday we played football.|Nyoro ne watugo opira.
Tomorrow we will go to school.|Kiny wabiro dhi skul.
Father bought bread yesterday.|Baba ne onyiewo makate nyoro.
I ate fish last night.|Ne achamo rech otieno.?
The teacher will come tomorrow.|Japuonj biro kiny.
I have finished my work.|Asetieko tija.
We have eaten.|Wasechiemo.
The rain has come.|Koth osebiro.?
Grandmother told us a story.|Dani ne oganonwa sigana.`,

`s6|🧩|Questions and no|Penjo gi ooyo
Do you like fish?|Ihero rech?
Yes, I like fish.|Ee, ahero rech.
No, I do not like fish.|Ooyo, ok ahero rech.
What are you eating?|Ichamo ang'o?
Where is your father?|Wuonu ni kanye?
Who is singing?|Ng'a mawer?
How many goats do you have?|In gi diek adi?
I have five goats.|An gi diek abich.
I cannot swim.|Ok anyal goyo abal.
He is not sick.|Ok otuo.
We do not have water.|Waonge pi.
Why are you laughing?|Inyiero nang'o?`,

`s7|🧩|Longer sentences|Weche maboyo
The elephant is bigger than the cow.|Liech duong' moloyo dhiang'.
The moon shines at night.|Dwe rieny gotieno.
Birds fly in the sky.|Winy fuyo e polo.
Please give me water.|Akwayi, miya pi.
My father is a fisherman.|Wuonwa en jalupo.
My mother sells fish at the market.|Minwa uso rech e chiro.
I wash my hands before I eat.|Aluoko lweta ka pok achiemo.
When it rains, we stay in the house.|Ka koth chwe, wabet e ot.
I want to be a teacher.|Adwaro bedo japuonj.
If you read every day, you will know a lot.|Ka isomo pile, ibiro ng'eyo mang'eny.
There are many fish in the lake.|Rech ng'eny e nam.
We work together.|Watiyo kaachiel.`
];

/* One and many:  picture|one (English)|many (English)|one (Dholuo)|many (Dholuo) */
const PLURALS = `🐕|dog|dogs|guok|guogi
🐄|cow|cows|dhiang'|dhok
🐐|goat|goats|diel|diek
🐔|chicken|chickens|gweno|gwen
🐦|bird|birds|winyo|winy
🐟|fish|fish|rech|rech
🧒|child|children|nyathi|nyithindo
📚|book|books|buk|buge
🏠|house|houses|ot|udi
🌳|tree|trees|yath|yien
~🪨|stone|stones|kidi|kite
🪑|chair|chairs|kom|kombe
👁️|eye|eyes|wang'|wenge
✋|hand|hands|lwedo|lwete
🦷|tooth|teeth|lak|leke
🦵|foot|feet|tielo|tiende
👧|girl|girls|nyako|nyiri
👦|boy|boys|wuoyi|yawuoyi
👩|woman|women|dhako|mon
👨|man|men|dichwo|chwo
~🧑|person|people|dhano|ji
~🧑‍🏫|teacher|teachers|japuonj|jopuonj
🧑‍🤝‍🧑|friend|friends|osiep|osiepe
🥚|egg|eggs|tong'|tonge
🐍|snake|snakes|thuol|thuonde?
👂|ear|ears|it|ite
⭐|star|stars|sulwe|sulwe?
🐑|sheep|sheep|rombo|rombe`;

/* Pattern drills: the app builds many sentences from these. Nouns are picked by word id. */
const PATTERN_NOUNS = ['ani_dog','ani_cow','ani_goat','ani_chicken','ani_fish','ani_bird','ani_snake','ani_lion','ani_elephant','ani_hippo','ani_frog','ani_duck','ani_sheep','ani_monkey',
 'home_house','home_door','home_bed','home_chair','home_pot','home_cup','home_plate','home_spoon','home_knife','home_basket','home_broom','home_lamp','home_bag','home_phone',
 'sch_book','sch_pen','sch_ball','sch_bell','sch_ruler','clo_shirt','clo_hat','clo_dress','go_car','go_bicycle','go_boat','food_egg','food_banana','food_orange','food_tomato'];
const PATTERNS = [
 {id:'this', title:'This is a …', luoT:'Ma en …', en:n=>'This is '+art(n)+'.', luo:l=>'Ma en '+l+'.'},
 {id:'see',  title:'I see a …',   luoT:'Aneno …', en:n=>'I see '+art(n)+'.',   luo:l=>'Aneno '+l+'.'},
 {id:'want', title:'I want a …',  luoT:'Adwaro …', en:n=>'I want '+art(n)+'.', luo:l=>'Adwaro '+l+'.'},
 {id:'have', title:'I have a …',  luoT:'An gi …', en:n=>'I have '+art(n)+'.',  luo:l=>'An gi '+l+'.'},
 {id:'where',title:'Where is the …?', luoT:'… ni kanye?', en:n=>'Where is the '+n+'?', luo:l=>cap(l)+' ni kanye?'},
 {id:'like', title:'I like the …', luoT:'Ahero …', en:n=>'I like the '+n+'.', luo:l=>'Ahero '+l+'.'}
];
/* Doing words with every person:  English -ing form | Dholuo verb */
const DOING = [['running','ringo'],['eating','chiemo'],['sleeping','nindo'],['walking','wuotho'],['playing','tugo'],['singing','wer'],
 ['reading','somo'],['writing','ndiko'],['dancing','miel'],['laughing','nyiero'],['working','tiyo'],['coming','biro']];
const PERSONS = [['I am','a'],['You are','i'],['He is','o'],['She is','o'],['We are','wa'],['They are','gi']];

/* Dialogues: who(a/b)|English|Dholuo */
const DIALOGS = [
{id:'d_meet', e:'👋', t:'Meeting someone', l:'Romo gi ng\'ato', lines:`a|Hello!|Misawa!
b|Hello!|Misawa!
a|What is your name?|Nyingi ng'a?
b|My name is Otieno.|Nyinga en Otieno.
a|I am happy to see you.|Amor neni.
b|Me too.|An bende.`},
{id:'d_how', e:'😊', t:'How are you?', l:'Idhi nade?', lines:`a|Good morning.|Oyawore.
b|Good morning.|Oyawore.
a|How are you?|Idhi nade?
b|I am fine. And you?|Adhi maber. To in?
a|Very well.|Ber ahinya.
b|Thank you.|Erokamano.`},
{id:'d_school', e:'🏫', t:'Going to school', l:'Dhi skul', lines:`a|Where are you going?|Idhi kanye?
b|I am going to school.|Adhi skul.
a|Who is your teacher?|Japuonjni en ng'a?
b|My teacher is Mr Ouma.|Japuonjna en Japuonj Ouma.?
a|Let us go.|Wadhi.
b|Yes, let us go.|Ee, wadhi.`},
{id:'d_water', e:'💧', t:'I am thirsty', l:'Riyo', lines:`a|Mother, I want water.|Mama, adwaro pi.
b|Come here.|Bi ka.
a|Please give me water.|Akwayi, miya pi.
b|Here is the water.|Pi eri.
a|Thank you very much.|Erokamano ahinya.
b|No problem.|Onge wach.`},
{id:'d_play', e:'⚽', t:'Let us play', l:'Watugi', lines:`a|Do you want to play?|Idwaro tugo?
b|Yes, I want to.|Ee, adwaro.
a|Give me the ball.|Miya opira.
b|Kick the ball!|Gwe opira!
a|I win!|Aloyo!
b|Well done!|Itimo maber!`},
{id:'d_market', e:'🛍️', t:'Buying fish', l:'Nyiewo rech', lines:`a|Good afternoon.|Osaore.
b|Good afternoon. What do you want?|Osaore. Idwaro ang'o?
a|I want to buy fish.|Adwaro nyiewo rech.
b|It is fifty shillings.|En siling' piero abich.
a|It is expensive.|Nengone tek.
b|Give me forty.|Miya piero ang'wen.
a|Here is the money.|Pesa eri.
b|Thank you, goodbye.|Erokamano, oriti.`},
{id:'d_sick', e:'🤒', t:'I am sick', l:'Atuo', lines:`a|Are you well?|Ingima?
b|No. I am sick.|Ooyo. Atuo.
a|What happened?|Ang'o motimore?
b|My head hurts.|Wiya bara.
a|Sorry. Let us go to the hospital.|Mos. Wadhi osiptal.
b|Thank you for helping me.|Erokamano kuom konya.`},
{id:'d_class', e:'📖', t:'In class', l:'E klas', lines:`a|Sit down. Open your book.|Bed piny. Yaw bugi.
b|Teacher, I do not understand.|Japuonj, ok awinj.
a|Listen. I say it again.|Winji. Awacho kendo.
b|Now I understand.|Sani awinjo.
a|Well done! Read.|Itimo maber! Som.
b|I can read!|Anyalo somo!`},
{id:'d_what', e:'🔍', t:'What is this?', l:'Ma en ang\'o?', lines:`a|Look! What is this?|Ne! Ma en ang'o?
b|This is a hippo.|Ma en rao.
a|Say it again.|Wach kendo.
b|This is a hippo.|Ma en rao.
a|Is it big?|Oduong'?
b|Yes, it is very big.|Ee, oduong' ahinya.`},
{id:'d_cyber', e:'💻', t:'At the internet café', l:'E saiba', lines:`a|Hello. I want to use a computer.|Misawa. Adwaro tiyo gi kompyuta.
b|Come in. Sit here.|Donji. Bed ka.
a|How much is one hour?|Sa achiel en pesa adi?
b|It is fifty shillings.|En siling' piero abich.
a|Please help me search.|Akwayi, konya manyo.
b|Write the word here and click.|Ndik wach ka, to imul.?
a|I have finished, thank you.|Asetieko, erokamano.
b|Goodbye.|Oriti.`}
];

/* Stories: English|Dholuo  — then questions:  ?question|right answer|wrong|wrong */
const STORIES = [
{id:'st_goat', e:'🐐', t:'Achieng\' and the goat', l:'Achieng\' gi diel', text:`Achieng' has a small goat.|Achieng' nigi diel matin.
The goat likes to eat grass.|Diel ohero chamo lum.
Every morning Achieng' gives the goat water.|Okinyi ka okinyi Achieng' miyo diel pi.
One day the goat runs away.|Chieng' moro diel ringo.
Achieng' looks for the goat.|Achieng' manyo diel.
The goat is behind the house.|Diel ni e ng'e ot.?
Achieng' is happy.|Achieng' mor.
?What does the goat like to eat?|grass|fish|bread
?Where is the goat?|behind the house|in the lake|at school`},
{id:'st_water', e:'💧', t:'Fetching water', l:'Tuomo pi', text:`Otieno wakes up early.|Otieno chiewo okinyi mang'ich.
He takes a bucket.|Okawo ndowo.
He walks to the well with his sister.|Owuotho gi nyamin mondo gidhi soko.?
They fetch clean water.|Gituomo pi maler.
The water is heavy.|Pi pek.
They carry it home together.|Giting'e dala kaachiel.
Mother says: Thank you, my children.|Mama wacho: Erokamano, nyithinda.
?What does Otieno take?|a bucket|a book|a ball
?Who goes with Otieno?|his sister|his teacher|his dog`},
{id:'st_hare', e:'🐇', t:'The hare and the elephant', l:'Apuoyo gi liech', text:`The elephant is very big.|Liech duong' ahinya.
The hare is small, but he is clever.|Apuoyo tin, to oriek.
The elephant says: I am strong. You are weak.|Liech wacho: An ratego. In inyap.?
The hare says: Let us run to the river.|Apuoyo wacho: Waring wadhi aora.
The elephant runs. He is tired.|Liech ringo. Ool.
The hare sits on the elephant's back.|Apuoyo obet e ng'e liech.?
The hare arrives first and laughs.|Apuoyo okwongo chopo, to onyiero.?
?Who is clever?|the hare|the elephant|the fish
?Where do they run?|to the river|to the school|to the market`},
{id:'st_market', e:'🛍️', t:'Market day', l:'Chieng\' chiro', text:`Today is market day.|Kawuono en chieng' chiro.
Mother goes to the market with Akinyi.|Mama dhi chiro gi Akinyi.
They sell tomatoes and onions.|Giuso nyanya gi kitungu.
A man buys ten tomatoes.|Dichwo moro nyiewo nyanya apar.
Akinyi counts the money.|Akinyi kwano pesa.
Mother buys fish and salt.|Mama nyiewo rech gi chumbi.
In the evening they go home.|Odhiambo gidok dala.
?What do they sell?|tomatoes and onions|fish and salt|books
?Who counts the money?|Akinyi|the man|the teacher`},
{id:'st_rain', e:'🌧️', t:'The rain is coming', l:'Koth biro', text:`The sky is black.|Polo rateng'.
The wind is strong.|Yamo kudho matek.?
The children run home.|Nyithindo ringo dala.
Father brings the cows into the pen.|Baba kelo dhok e kul.
The rain falls on the roof.|Koth chwe e wi ot.?
Grandmother tells a story by the fire.|Dani gano sigana e dho mach.?
Tomorrow the maize will grow.|Kiny oduma biro dongo.
?What colour is the sky?|black|red|white
?Who tells a story?|grandmother|father|the teacher`},
{id:'st_ball', e:'⚽', t:'The football match', l:'Tugo mar opira', text:`Today we play football at school.|Kawuono watugo opira e skul.
Our team has eleven players.|Kanywa nigi jotugo apar gachiel.?
Ochieng' kicks the ball.|Ochieng' gweyo opira.
Atieno runs very fast.|Atieno ringo matek ahinya.
She scores a goal!|Ogoyo goal!?
Everyone is happy and sings.|Ji duto mor kendo giwer.
We play together. We win together.|Watugo kaachiel. Waloyo kaachiel.
?Where do they play?|at school|at the lake|at the market
?Who runs very fast?|Atieno|Ochieng'|the teacher`},
{id:'st_friends', e:'🧑‍🤝‍🧑', t:'Two friends', l:'Osiepe ariyo', text:`Atieno and Akinyi are friends.|Atieno gi Akinyi gin osiepe.
They live in the same village.|Gidak e gweng' achiel.
Every day they walk to school together.|Pile giwuotho kaachiel kadhi skul.?
At school they sit at one desk.|E skul gibedo e des achiel.?
Atieno has a mango. Akinyi has groundnuts.|Atieno nigi maembe. Akinyi nigi njugu.?
They share their food.|Gipogo chiembgi.?
In the evening they fetch water together and sing.|Odhiambo gituomo pi kaachiel kendo giwer.
Akinyi says: You are my best friend.|Akinyi wacho: In osiepna maber moloyo.?
Atieno says: I will always be with you.|Atieno wacho: Abiro bedo kodi pile.?
?What do they share?|their food|their books|their shoes
?Where do they sit at school?|at one desk|under a tree|at the door`},
{id:'st_cyber', e:'💻', t:'The first day at the computer', l:'Chieng\' mokwongo e kompyuta', text:`Awino goes to the internet café.|Awino dhi e saiba.?
She sits in front of a computer.|Obet e nyim kompyuta.
She wants to learn about fish in the lake.|Odwaro puonjore kuom rech manie nam.
She types the word "tilapia" and clicks "search".|Ondiko wach "tilapia" to omulo "search".?
Many pages open. They are in English.|Kalatese mang'eny yawore. Gin gi Kisungu.?
Awino can read them!|Awino nyalo somogi!
She says: English opens the world.|Owacho: Kisungu yawo piny.?
?Where does Awino go?|to the internet café|to the lake|to the farm
?What word does she type?|tilapia|goat|rain`}
];

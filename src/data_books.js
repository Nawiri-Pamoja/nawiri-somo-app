/* ================= READING BOOKS (Buge mag somo) =================
   Short Dholuo booklets made only of letters a child already knows. The app checks every word and puts each
   booklet right after the review where the last of its letters has been learned.
   Booklets before the capital letters are written in small letters on purpose.
   First line: id|picture|Dholuo title|English title.  Then one line per page: Dholuo|English|picture
   "?" after the Dholuo = the author is not sure; helpers check these first. */
const BOOK_BLOCKS = [
`b01|🤱|mama|Mother
mama|mother|🤱
ot|house|🏠
kom|chair|🪑
it|ear|👂`,
`b02|🌊|nam|The lake
nam|lake|🌊
lum|grass|🌿
um|nose|👃
kuon|ugali|🍚
kom tin.|The chair is small.|🪑`,
`b03|🏠|ma en ot|This is a house
ma en ot.|This is a house.|🏠
ma en kom.|This is a chair.|🪑
ma en mama.|This is mother.|🤱
ma en pi.|This is water.|💧`,
`b32|👀|aneno|I see
aneno mama.|I see mother.|🤱
aneno nam.|I see the lake.|🌊
aneno kom.|I see a chair.|🪑
aneno lum.|I see grass.|🌿`,
`b04|🐟|aneno rech|I see a fish
aneno nam.|I see the lake.|🌊
aneno rech.|I see a fish.|🐟
rech ni e nam.|The fish is in the lake.|🎣
rech tin.|The fish is small.|🐠`,
`b05|🏠|mama ni e ot|Mother is in the house
mama ni e ot.|Mother is in the house.|🤱
kom ni e ot.|The chair is in the house.|🪑
pi ni e ot.|The water is in the house.|💧
an e ot.?|I am in the house.|🏠`,
`b06|🧔|baba|Father
ma en baba.|This is father.|🧔
baba ni e dala.|Father is at home.|🏡
baba gi mama.|Father and mother.|👫
baba ber.?|Father is good.|❤️`,
`b07|🐕|guok|The dog
ma en guok.|This is a dog.|🐕
guok ni e dala.|The dog is at home.|🏡
aneno guok gi diel.|I see a dog and a goat.|🐐
guok tin.|The dog is small.|🐶`,
`b08|🍲|mama tedo|Mother cooks
mama tedo rech.|Mother cooks fish.|🐟
mama tedo kuon.|Mother cooks ugali.|🍚
kuon ber.|The ugali is good.|😋
baba gi mama e dala.?|Father and mother are at home.|🏡`,
`b09|🐐|diel|The goat
ma en diel.|This is a goat.|🐐
diel tin.|The goat is small.|🐐
diel ni e lum.?|The goat is in the grass.|🌿
an gi diel.|I have a goat.|🙋`,
`b10|📚|buk|The book
ma en buk.|This is a book.|📚
an gi buk.|I have a book.|📖
an gi kalam.|I have a pen.|🖊️
buk ni e kom.?|The book is on the chair.|🪑`,
`b11|🐦|winyo|The bird
ma en winyo.|This is a bird.|🐦
winyo ni e yath.|The bird is in the tree.|🌳
winyo wer.|The bird sings.|🎶
aneno winy ariyo.|I see two birds.|🐦🐦`,
`b12|🍲|chiemo|Food
mama tedo chiemo.|Mother cooks food.|🍲
wuoyi chamo chiemo.|The boy eats food.|👦
chiemo mit.|The food is tasty.|😋
wachiem!|Let us eat!|🍽️`,
`b13|🥛|chak|Milk
ma en chak.|This is milk.|🥛
mama nigi chak.|Mother has milk.|🤱
wuoyi dwaro chak.|The boy wants milk.|👦
chak ber.|Milk is good.|👍`,
`b14|🌳|yath|The tree
ma en yath.|This is a tree.|🌳
yath bor.|The tree is tall.|🌴
guok ni e bwo yath.?|The dog is under the tree.|🐕
winyo ni e wi yath.?|The bird is on top of the tree.|🐦`,
`b15|👧|nyako|The girl
ma en nyako.|This is a girl.|👧
nyako dhi skul.|The girl goes to school.|🏫
nyako somo buk.|The girl reads a book.|📖
nyako mor.|The girl is happy.|😊`,
`b16|🏫|adhi skul|I go to school
adhi skul.|I go to school.|🏫
an gi buk gi kalam.|I have a book and a pen.|🖊️
asomo buk.|I am reading a book.|📖
asomo maber.?|I read well.|⭐`,
`b17|⭐|sulwe|The star
ma en sulwe.|This is a star.|⭐
sulwe ni e polo.|The star is in the sky.|🌌
dwe ni e polo.|The moon is in the sky.|🌙
aneno sulwe.|I see a star.|✨`,
`b18|🥛|wuoyi madho chak|The boy drinks milk
wuoyi madho chak.|The boy drinks milk.|🥛
nyako madho pi.|The girl drinks water.|💧
baba dhi nam.|Father goes to the lake.|🛶
adhi dala.|I go home.|🏡`,
`b19|🐄|dhiang'|The cow
ma en dhiang'.|This is a cow.|🐄
dhiang' chamo lum.|The cow eats grass.|🌿
dhiang' duong'.|The cow is big.|🐂
aneno dhok.|I see cows.|🐄🐄`,
`b20|🧒|nyathi|The child
ma en nyathi.|This is a child.|🧒
nyathi ringo.|The child runs.|🏃
nyathi nindo.|The child sleeps.|🛌
nyathi tugo gi guok.?|The child plays with the dog.|🐕`,
`b21|🐍|thuol|The snake
ma en thuol.|This is a snake.|🐍
thuol ni e lum.|The snake is in the grass.|🌿
tang'!|Be careful!|⚠️
ring!|Run!|🏃`,
`b22|🐠|ngege|Tilapia
ma en ngege.|This is a tilapia.|🐠
ngege ni e nam.|The tilapia is in the lake.|🌊
baba lupo ngege.?|Father catches tilapia.|🎣
mama tedo ngege.|Mother cooks tilapia.|🍲`,
`b23|☀️|chieng' liet|The sun is hot
chieng' liet.|The sun is hot.|☀️
koth chwe.|It is raining.|🌧️
pi ng'ich.|The water is cold.|🧊
polo rateng'.|The sky is black.|🌑`,
`b24|👩‍🏫|japuonj|The teacher
ma en japuonj.|This is the teacher.|👩‍🏫
japuonj ndiko e bao.|The teacher writes on the board.|✍️
nyithindo somo.|The children read.|📖
japuonj mor.|The teacher is happy.|😊`,
`b25|🐃|jowi|The buffalo
ma en jowi.|This is a buffalo.|🐃
jowi duong' ahinya.|The buffalo is very big.|🦬
jowi chamo lum.|The buffalo eats grass.|🌿
aneno jowi gi liech.?|I see a buffalo and an elephant.|🐘`,
`b26|🎂|higni|Years
an gi higni abiriyo.|I am seven years old.|7️⃣
owadwa nigi higni apar.?|My brother is ten years old.|🔟
dayo nigi higni mang'eny.?|Grandmother is many years old.|👵
erokamano, nyasaye!?|Thank you, God!|🙏`,
`b27|🐐|Achieng' gi diel|Achieng' and the goat
Achieng' nigi diel matin.|Achieng' has a small goat.|🐐
Diel ohero chamo lum.|The goat likes to eat grass.|🌿
Achieng' miyo diel pi.|Achieng' gives the goat water.|💧
Chieng' moro diel ringo!|One day the goat runs away!|🏃
Achieng' manyo diel.|Achieng' looks for the goat.|🔍
Achieng' mor.|Achieng' is happy.|😊`,
`b28|💧|Otieno tuomo pi|Otieno fetches water
Otieno chiewo okinyi.?|Otieno wakes up in the morning.|🌅
Okawo ndowo.|He takes a bucket.|🪣
Odhi e soko.?|He goes to the well.|🚶
Otuomo pi maler.?|He fetches clean water.|💧
Mama wacho: Erokamano!|Mother says: Thank you!|🤱`,
`b29|🧑‍🤝‍🧑|Osiepe|Friends
Atieno gi Akinyi gin osiepe.|Atieno and Akinyi are friends.|🧑‍🤝‍🧑
Gidhi skul kaachiel.?|They go to school together.|🏫
Gipogo chiemo.?|They share food.|🍲
Giwer kaachiel.?|They sing together.|🎶`,
`b30|🛍️|Chiro|The market
Kawuono en chieng' chiro.|Today is market day.|🛍️
Mama dhi chiro gi Akinyi.|Mother goes to the market with Akinyi.|🧺
Giuso nyanya.|They sell tomatoes.|🍅
Akinyi kwano pesa.|Akinyi counts the money.|💰
Odhiambo gidok dala.?|In the evening they go home.|🏡`,
`b31|🌧️|Koth|The rain
Polo rateng'.|The sky is black.|🌑
Nyithindo ringo dala.|The children run home.|🏃
Koth chwe e wi ot.?|The rain falls on the roof.|🌧️
Dayo gano sigana.?|Grandmother tells a story.|👵
Kiny oduma biro dongo.|Tomorrow the maize will grow.|🌽`
];

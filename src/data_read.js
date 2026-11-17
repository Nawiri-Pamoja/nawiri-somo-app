/* ================= LEARNING TO READ AND WRITE + THE LEARNING PATH ================= */
const VOWELS = ['a','e','i','o','u'];
/* Dholuo letters in teaching order. Chosen so that real words come early: it, um, ot, kom, mama, nam, tuo … */
const LIT_SEQ = ['a','m','o','t','i','k','u','n','l','e','p','r','b','d','g','w','y','ch','s','ny','dh','th',"ng'",'ng','j','h'];
/* key word for every letter: the picture children already know the Dholuo name of */
const KEYW = {a:'ani_duck', m:'fam_mother', o:'home_house', t:'food_egg', i:'bod_ear', k:'home_chair', u:'bod_nose', n:'nat_lake', l:'bod_tooth',
  e:'ani_fish', p:'food_water', r:'ani_hippo', b:'fam_father', d:'ani_goat', g:'ani_dog', w:'bod_eye', y:'nat_tree', ch:'food_milk', s:'nat_star',
  ny:'fam_girl', dh:'ani_cow', th:'ani_snake', "ng'":'num_four', ng:'ani_tilapia', j:'ani_buffalo', h:'time_year'};
/* letters that look alike: used as distractors when searching for a letter */
const LOOKALIKE = {b:'dpq', d:'bpq', p:'bdq', q:'pdb', m:'nw', n:'mhu', u:'nv', h:'nk', i:'lj', l:'it', t:'lf', a:'oe', o:'ac', e:'ca', c:'eo', g:'qy', y:'gv', w:'mv', k:'hx', r:'nt', s:'z', j:'i', ch:'th', th:'ch', dh:'th', ny:'ng', ng:"ng'", "ng'":'ng'};
/* capital letters, grouped by how they are written */
const CAPS = ['LITEFH', 'AVWXYZ', 'KMN', 'COGQS', 'UJ', 'BDPR'];
const NAMES = {A:"Achieng'", B:'Bondo', C:'Chulaimbo', D:'Dorcas', E:'Esther', F:'Faith', G:'Gem', H:'Homa Bay', I:'Isaac', J:'Jaramogi', K:'Kisumu', L:'Lwanda',
  M:'Migori', N:'Nyanza', O:'Otieno', P:'Pamoja', Q:'Queen', R:'Rusinga', S:'Siaya', T:'Tom', U:'Ugenya', V:'Victoria', W:'Winam', X:'Xavier', Y:'Yala', Z:'Zawadi'};
const DIGITS = ['01234', '56789'];
const COUNT_PICS = ['🐟', '🐐', '🥭', '🐔', '⚽', '🌽', '⭐', '🍌'];

/* English letters: picture, key word. Taught in the usual phonics order (s a t p i n …), not A–Z. */
const ABC = [['a','🐜','ant'],['b','⚽','ball'],['c','🐈','cat'],['d','🐕','dog'],['e','🥚','egg'],['f','🐟','fish'],['g','🐐','goat'],['h','🐔','hen'],
 ['i','🐛','insect'],['j','🍯','jam'],['k','🔑','key'],['l','🦁','lion'],['m','🌙','moon'],['n','👃','nose'],['o','🐙','octopus'],['p','🖊️','pen'],
 ['q','👑','queen'],['r','🌧️','rain'],['s','☀️','sun'],['t','🌳','tree'],['u','☂️','umbrella'],['v','🚐','van'],['w','💧','water'],['x','📦','box'],['y','🟡','yellow'],['z','🦓','zebra']];
const ABC_PAIRS = ['sa', 'tp', 'in', 'md', 'go', 'ck', 'eu', 'rh', 'bf', 'lj', 'vw', 'xy', 'zq'];
/* short English words to read (each after the letters it needs) */
const CVC = [
 {after: 'go', words: '🗺️ map|👨 man|🍳 pan|📌 pin|🥫 tin|🐜 ant|🐕 dog|🐖 pig|🍲 pot'},
 {after: 'eu', words: '🐈 cat|🧢 cap|☕ cup|☀️ sun|🥜 nut|🖊️ pen|🥅 net|🔟 ten|🥚 egg|🧒 kid'},
 {after: 'bf', words: '🎩 hat|🐔 hen|🛏️ bed|🚌 bus|👜 bag|🐀 rat|🔴 red|🦇 bat|🛖 hut|🪭 fan'},
 {after: 'zq', words: '📦 box|🦊 fox|6 six|🕸️ web|🚐 van|🍯 jam|🦵 leg|🪵 log|🤐 zip|✈️ jet'}
];
/* words children see so often that they learn them by sight. Dholuo only where it fits. */
const SIGHT = [
 {id: 'sw1', words: 'I:an|a:|the:|is:|it:|see:neno|this:ma|yes:ee|no:ooyo|and:gi', pat: ['This is a #.', 'I see a #.', 'It is a #.']},
 {id: 'sw2', words: 'you:in|he:en|she:en|we:wan|my:mara|can:nyalo|go:dhi|like:hero|in:e|on:e wi', pat: ['I like the #.', 'We can see a #.', 'My # is big.']},
 {id: 'sw3', words: 'are:|have:|to:|do:timo|look:ng\'iyo|come:bi|here:kae|what:ang\'o|where:kanye|said:', pat: ['Look at the #.', 'Here is a #.', 'I have a #.']}
];
const TRICKY = [['🚢','ship'],['👟','shoe'],['🪑','chair'],['🧀','cheese'],['3','three'],['🦷','tooth'],['🌳','tree'],['🐝','bee'],['🌙','moon'],['📚','book'],['🦆','duck'],['💍','ring'],['🐳','whale'],['📱','phone']];

/* ---------- the path ----------
   L listen · PW pre-writing · LIT the whole Dholuo reading-and-writing course · ENG English letters and first English reading
   W words · P phrases · S sentences · PAT pattern drill · DO doing-words · PL one/many · D dialogue · ST story · T typing */
const STAGES = [
 {id:'A', e:'👂', en:'Listen', luo:'Winji', sub:'pictures and sound'},
 {id:'B', e:'✏️', en:'Read and write', luo:'Som gi ndik', sub:'Dholuo letters, words, sentences'},
 {id:'B2', e:'🔤', en:'English letters', luo:'Nyukta mag Kisungu', sub:'English sounds, first English words'},
 {id:'C', e:'🖼️', en:'First words', luo:'Weche mokwongo', sub:'words with pictures'},
 {id:'D', e:'💬', en:'Talk', luo:'Wuoyo', sub:'things we say every day'},
 {id:'E', e:'🧩', en:'Sentences', luo:'Weche maboyo', sub:'build your own sentences'},
 {id:'F', e:'🏫', en:'School and world', luo:'Skul gi piny', sub:'school English, stories'},
 {id:'G', e:'💻', en:'Computer', luo:'Kompyuta', sub:'English for the internet'}
];
const PATH_SPEC = {
A:['L|Animals|Le|🐕|ani_dog,ani_cow,ani_goat,ani_chicken,ani_cat,ani_fish',
   'L|Food|Chiemo|🥛|food_water,food_milk,food_egg,food_maize,food_banana,food_bread',
   'L|My body|Denda|👁️|bod_head,bod_eye,bod_ear,bod_nose,bod_mouth,bod_hand',
   'L|My family|Joodwa|👩|fam_mother,fam_father,fam_child,fam_baby,fam_grandmother,fam_grandfather',
   'L|More animals|Le moko|🦁|ani_bird,ani_snake,ani_lion,ani_elephant,ani_hippo,ani_monkey',
   'L|Sky and earth|Polo gi piny|☀️|nat_sun,nat_moon,nat_star,nat_rain,nat_fire,nat_tree',
   'L|At home|E dala|🏠|home_house,home_door,home_bed,home_chair,home_cup,home_spoon',
   'L|1 2 3 4 5|Kwan|1|num_one,num_two,num_three,num_four,num_five',
   'L|6 7 8 9 10|Kwan|6|num_six,num_seven,num_eight,num_nine,num_ten',
   'L|Doing|Timo|🏃|verb_to-eat,verb_to-drink,verb_to-sleep,verb_to-run,verb_to-walk,verb_to-sing',
   'L|Colours|Rangi|🔴|col_red,col_black,col_white,col_green,col_blue,col_yellow',
   'L|My things|Gika|⚽|sch_book,sch_ball,clo_shoes,clo_shirt,go_car,go_bicycle',
   'L|Small animals|Le matindo|🐸|ani_frog,ani_duck,ani_bee,ani_rat,ani_hare,ani_tortoise',
   'L|Good food|Chiemo mamit|🍌|food_meat,food_orange,food_tomato,food_honey,food_groundnuts,food_sweet-potato'],
B:['PW|1', 'PW|2', 'LIT'],
B2:['ENG'],
C:['W|ani|0|8','P|greet|0|8','W|food|0|8','W|bod|0|9','PAT|this','W|fam|0|8','W|num|0|10','P|greet|8|16','W|home|0|8','P|polite|0|8','D|d_meet',
   'W|nat|0|8','W|verb|0|8','PAT|see','W|col|0|8','W|sch|0|8','P|intro|0|8','D|d_how','W|clo|0|8','W|verb|8|16','PAT|want'],
D:['P|class|0|10','W|ani|8|16','P|class|10|20','W|food|8|16','P|class|20|30','D|d_class','W|bod|9|18','W|fam|8|16','P|daily|0|8','P|daily|8|16','P|daily|16|24','D|d_water',
   'W|home|8|16','PAT|have','P|play|0|8','P|play|8|16','D|d_play','D|d_what','W|nat|8|16','W|verb|16|24','W|verb|24|32','P|intro|8|16','P|polite|8|16',
   'P|feel|0|8','P|feel|8|16','PAT|where','P|ask|0|10','P|ask|10|20','D|d_school'],
E:['W|gram|0|10','DO','S|s1','W|adj|0|10','S|s2','PL|0|14','PL|14|28','W|gram|10|20','S|s3','W|verb|32|40','W|verb|40|48','W|gram|20|30','S|s4','W|adj|10|20','ST|st_goat',
   'W|gram|30|40','S|s5','W|adj|20|30','W|verb|48|56','S|s6','W|gram|40|52','W|adj|30|40','PAT|like','S|s7','ST|st_water'],
F:['W|num|10|20','W|num|20|34','W|time|0|8','W|time|8|15','W|time|15|25','W|time|25|37','W|math|0|10','W|math|10|20','W|sch|8|17','W|sch|17|26','ST|st_hare',
   'W|place|0|9','W|place|9|17','W|go|0|13','P|market|0|14','D|d_market','ST|st_market','W|hea|0|11','W|hea|11|21','P|help|0|16','D|d_sick','W|clo|8|16','ST|st_rain','ST|st_ball'],
G:['W|tech|0|8','W|tech|8|16','T|tech|0|8','W|tech|16|24','W|tech|24|32','T|tech|8|24','W|tech|32|41','P|cyber|0|12','D|d_cyber','T|tech|24|41','ST|st_cyber']
};

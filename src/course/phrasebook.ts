/** Words with a pronunciation guide, for languages with their own script. */
export type Scripted = readonly [text: string, pronunciation: string];

export type Phrase = {
  en: string;
  es: string;
  fr: string;
  de: string;
  it: string;
  pt: string;
  ja: Scripted;
  ko: Scripted;
  zh: Scripted;
  hi: Scripted;
  ar: Scripted;
};

function phrase(
  en: string,
  [es, fr, de, it, pt]: readonly [string, string, string, string, string],
  ja: Scripted,
  ko: Scripted,
  zh: Scripted,
  hi: Scripted,
  ar: Scripted,
): Phrase {
  return { en, es, fr, de, it, pt, ja, ko, zh, hi, ar };
}

/**
 * 8 phrases for each of the 10 levels, in level order, in every language.
 * Gender-neutral wordings are chosen where the app can't yet teach agreement.
 * Every language needs a fluent speaker's review before launch.
 */
export const PHRASEBOOK: readonly Phrase[] = [
  // Level 1: Basics
  phrase('hello', ['Hola', 'Bonjour', 'Hallo', 'Ciao', 'Olá'], ['こんにちは', 'konnichiwa'], ['안녕하세요', 'annyeonghaseyo'], ['你好', 'nǐ hǎo'], ['नमस्ते', 'namaste'], ['مرحبا', 'marḥaban']),
  phrase('goodbye', ['Adiós', 'Au revoir', 'Auf Wiedersehen', 'Arrivederci', 'Tchau'], ['さようなら', 'sayōnara'], ['안녕히 가세요', 'annyeonghi gaseyo'], ['再见', 'zàijiàn'], ['अलविदा', 'alvidā'], ['مع السلامة', 'maʿa as-salāma']),
  phrase('please', ['Por favor', "S'il vous plaît", 'Bitte', 'Per favore', 'Por favor'], ['お願いします', 'onegaishimasu'], ['부탁합니다', 'butakhamnida'], ['请', 'qǐng'], ['कृपया', 'kṛpayā'], ['من فضلك', 'min faḍlik']),
  phrase('thank you', ['Gracias', 'Merci', 'Danke', 'Grazie', 'Obrigado'], ['ありがとう', 'arigatō'], ['감사합니다', 'gamsahamnida'], ['谢谢', 'xièxie'], ['धन्यवाद', 'dhanyavād'], ['شكرا', 'shukran']),
  phrase('yes', ['Sí', 'Oui', 'Ja', 'Sì', 'Sim'], ['はい', 'hai'], ['네', 'ne'], ['是', 'shì'], ['हाँ', 'hā̃'], ['نعم', 'naʿam']),
  phrase('no', ['No', 'Non', 'Nein', 'No', 'Não'], ['いいえ', 'iie'], ['아니요', 'aniyo'], ['不', 'bù'], ['नहीं', 'nahī̃'], ['لا', 'lā']),
  phrase('good night', ['Buenas noches', 'Bonne nuit', 'Gute Nacht', 'Buona notte', 'Boa noite'], ['おやすみなさい', 'oyasuminasai'], ['안녕히 주무세요', 'annyeonghi jumuseyo'], ['晚安', "wǎn'ān"], ['शुभ रात्रि', 'śubh rātri'], ['تصبح على خير', 'tuṣbiḥ ʿalā khayr']),
  phrase('excuse me', ['Perdón', 'Excusez-moi', 'Entschuldigung', 'Scusi', 'Com licença'], ['すみません', 'sumimasen'], ['실례합니다', 'sillyehamnida'], ['打扰一下', 'dǎrǎo yíxià'], ['माफ़ कीजिए', 'māf kījie'], ['عفوا', 'ʿafwan']),

  // Level 2: People and family
  phrase('mother', ['madre', 'mère', 'Mutter', 'madre', 'mãe'], ['お母さん', 'okāsan'], ['어머니', 'eomeoni'], ['妈妈', 'māma'], ['माँ', 'mā̃'], ['أم', 'umm']),
  phrase('father', ['padre', 'père', 'Vater', 'padre', 'pai'], ['お父さん', 'otōsan'], ['아버지', 'abeoji'], ['爸爸', 'bàba'], ['पिता', 'pitā'], ['أب', 'ab']),
  phrase('brother', ['hermano', 'frère', 'Bruder', 'fratello', 'irmão'], ['兄弟', 'kyōdai'], ['형제', 'hyeongje'], ['兄弟', 'xiōngdì'], ['भाई', 'bhāī'], ['أخ', 'akh']),
  phrase('sister', ['hermana', 'sœur', 'Schwester', 'sorella', 'irmã'], ['姉妹', 'shimai'], ['자매', 'jamae'], ['姐妹', 'jiěmèi'], ['बहन', 'bahan'], ['أخت', 'ukht']),
  phrase('friend', ['amigo', 'ami', 'Freund', 'amico', 'amigo'], ['友達', 'tomodachi'], ['친구', 'chingu'], ['朋友', 'péngyou'], ['दोस्त', 'dost'], ['صديق', 'ṣadīq']),
  phrase('child', ['niño', 'enfant', 'Kind', 'bambino', 'criança'], ['子供', 'kodomo'], ['아이', 'ai'], ['孩子', 'háizi'], ['बच्चा', 'bacchā'], ['طفل', 'ṭifl']),
  phrase('man', ['hombre', 'homme', 'Mann', 'uomo', 'homem'], ['男の人', 'otoko no hito'], ['남자', 'namja'], ['男人', 'nánrén'], ['आदमी', 'ādmī'], ['رجل', 'rajul']),
  phrase('woman', ['mujer', 'femme', 'Frau', 'donna', 'mulher'], ['女の人', 'onna no hito'], ['여자', 'yeoja'], ['女人', 'nǚrén'], ['औरत', 'aurat'], ['امرأة', 'imraʾa']),

  // Level 3: Food and drink
  phrase('water', ['agua', 'eau', 'Wasser', 'acqua', 'água'], ['水', 'mizu'], ['물', 'mul'], ['水', 'shuǐ'], ['पानी', 'pānī'], ['ماء', 'māʾ']),
  phrase('bread', ['pan', 'pain', 'Brot', 'pane', 'pão'], ['パン', 'pan'], ['빵', 'ppang'], ['面包', 'miànbāo'], ['रोटी', 'roṭī'], ['خبز', 'khubz']),
  phrase('rice', ['arroz', 'riz', 'Reis', 'riso', 'arroz'], ['ご飯', 'gohan'], ['밥', 'bap'], ['米饭', 'mǐfàn'], ['चावल', 'cāval'], ['أرز', 'aruzz']),
  phrase('coffee', ['café', 'café', 'Kaffee', 'caffè', 'café'], ['コーヒー', 'kōhī'], ['커피', 'keopi'], ['咖啡', 'kāfēi'], ['कॉफ़ी', 'kŏfī'], ['قهوة', 'qahwa']),
  phrase('tea', ['té', 'thé', 'Tee', 'tè', 'chá'], ['お茶', 'ocha'], ['차', 'cha'], ['茶', 'chá'], ['चाय', 'cāy'], ['شاي', 'shāy']),
  phrase('milk', ['leche', 'lait', 'Milch', 'latte', 'leite'], ['牛乳', 'gyūnyū'], ['우유', 'uyu'], ['牛奶', 'niúnǎi'], ['दूध', 'dūdh'], ['حليب', 'ḥalīb']),
  phrase('I want water', ['Quiero agua', "Je veux de l'eau", 'Ich möchte Wasser', 'Voglio acqua', 'Quero água'], ['水が欲しいです', 'mizu ga hoshii desu'], ['물을 원해요', 'mureul wonhaeyo'], ['我要水', 'wǒ yào shuǐ'], ['मुझे पानी चाहिए', 'mujhe pānī cāhie'], ['أريد ماء', 'urīd māʾ']),
  phrase('delicious', ['delicioso', 'délicieux', 'lecker', 'delizioso', 'delicioso'], ['おいしい', 'oishii'], ['맛있어요', 'masisseoyo'], ['好吃', 'hǎochī'], ['स्वादिष्ट', 'svādiṣṭ'], ['لذيذ', 'ladhīdh']),

  // Level 4: Shopping and money
  phrase('money', ['dinero', 'argent', 'Geld', 'soldi', 'dinheiro'], ['お金', 'okane'], ['돈', 'don'], ['钱', 'qián'], ['पैसा', 'paisā'], ['مال', 'māl']),
  phrase('price', ['precio', 'prix', 'Preis', 'prezzo', 'preço'], ['値段', 'nedan'], ['가격', 'gagyeok'], ['价格', 'jiàgé'], ['कीमत', 'kīmat'], ['سعر', 'siʿr']),
  phrase('How much is it?', ['¿Cuánto cuesta?', 'Combien ça coûte ?', 'Wie viel kostet das?', 'Quanto costa?', 'Quanto custa?'], ['いくらですか', 'ikura desu ka'], ['얼마예요?', 'eolmayeyo?'], ['多少钱?', 'duōshao qián?'], ['यह कितने का है?', 'yah kitne kā hai?'], ['بكم هذا؟', 'bikam hādhā?']),
  phrase('expensive', ['caro', 'cher', 'teuer', 'caro', 'caro'], ['高い', 'takai'], ['비싸요', 'bissayo'], ['贵', 'guì'], ['महंगा', 'mahangā'], ['غال', 'ghālin']),
  phrase('cheap', ['barato', 'bon marché', 'billig', 'economico', 'barato'], ['安い', 'yasui'], ['싸요', 'ssayo'], ['便宜', 'piányi'], ['सस्ता', 'sastā'], ['رخيص', 'rakhīṣ']),
  phrase('shop', ['tienda', 'magasin', 'Geschäft', 'negozio', 'loja'], ['店', 'mise'], ['가게', 'gage'], ['商店', 'shāngdiàn'], ['दुकान', 'dukān'], ['متجر', 'matjar']),
  phrase('I want this', ['Quiero esto', 'Je veux ceci', 'Ich möchte das', 'Voglio questo', 'Quero isto'], ['これが欲しいです', 'kore ga hoshii desu'], ['이것을 원해요', 'igeoseul wonhaeyo'], ['我要这个', 'wǒ yào zhège'], ['मुझे यह चाहिए', 'mujhe yah cāhie'], ['أريد هذا', 'urīd hādhā']),
  phrase('the bill', ['la cuenta', "l'addition", 'die Rechnung', 'il conto', 'a conta'], ['お会計', 'okaikei'], ['계산서', 'gyesanseo'], ['账单', 'zhàngdān'], ['बिल', 'bil'], ['الفاتورة', 'al-fātūra']),

  // Level 5: Travel and directions
  phrase('train', ['tren', 'train', 'Zug', 'treno', 'trem'], ['電車', 'densha'], ['기차', 'gicha'], ['火车', 'huǒchē'], ['ट्रेन', 'ṭren'], ['قطار', 'qiṭār']),
  phrase('airport', ['aeropuerto', 'aéroport', 'Flughafen', 'aeroporto', 'aeroporto'], ['空港', 'kūkō'], ['공항', 'gonghang'], ['机场', 'jīchǎng'], ['हवाई अड्डा', 'havāī aḍḍā'], ['مطار', 'maṭār']),
  phrase('ticket', ['boleto', 'billet', 'Fahrkarte', 'biglietto', 'bilhete'], ['切符', 'kippu'], ['표', 'pyo'], ['票', 'piào'], ['टिकट', 'ṭikaṭ'], ['تذكرة', 'tadhkara']),
  phrase('map', ['mapa', 'carte', 'Karte', 'mappa', 'mapa'], ['地図', 'chizu'], ['지도', 'jido'], ['地图', 'dìtú'], ['नक्शा', 'nakśā'], ['خريطة', 'kharīṭa']),
  phrase('left', ['izquierda', 'gauche', 'links', 'sinistra', 'esquerda'], ['左', 'hidari'], ['왼쪽', 'oenjjok'], ['左边', 'zuǒbiān'], ['बाएँ', 'bāẽ'], ['يسار', 'yasār']),
  phrase('right', ['derecha', 'droite', 'rechts', 'destra', 'direita'], ['右', 'migi'], ['오른쪽', 'oreunjjok'], ['右边', 'yòubiān'], ['दाएँ', 'dāẽ'], ['يمين', 'yamīn']),
  phrase('straight ahead', ['todo recto', 'tout droit', 'geradeaus', 'sempre dritto', 'em frente'], ['まっすぐ', 'massugu'], ['직진', 'jikjin'], ['直走', 'zhí zǒu'], ['सीधे', 'sīdhe'], ['إلى الأمام', 'ilā al-amām']),
  phrase('Where is the station?', ['¿Dónde está la estación?', 'Où est la gare ?', 'Wo ist der Bahnhof?', "Dov'è la stazione?", 'Onde fica a estação?'], ['駅はどこですか', 'eki wa doko desu ka'], ['역이 어디예요?', 'yeogi eodiyeyo?'], ['车站在哪里?', 'chēzhàn zài nǎlǐ?'], ['स्टेशन कहाँ है?', 'sṭeśan kahā̃ hai?'], ['أين المحطة؟', 'ayna al-maḥaṭṭa?']),

  // Level 6: Hotels and getting around
  phrase('hotel', ['hotel', 'hôtel', 'Hotel', 'albergo', 'hotel'], ['ホテル', 'hoteru'], ['호텔', 'hotel'], ['酒店', 'jiǔdiàn'], ['होटल', 'hoṭal'], ['فندق', 'funduq']),
  phrase('room', ['habitación', 'chambre', 'Zimmer', 'camera', 'quarto'], ['部屋', 'heya'], ['방', 'bang'], ['房间', 'fángjiān'], ['कमरा', 'kamrā'], ['غرفة', 'ghurfa']),
  phrase('key', ['llave', 'clé', 'Schlüssel', 'chiave', 'chave'], ['鍵', 'kagi'], ['열쇠', 'yeolsoe'], ['钥匙', 'yàoshi'], ['चाबी', 'cābī'], ['مفتاح', 'miftāḥ']),
  phrase('bed', ['cama', 'lit', 'Bett', 'letto', 'cama'], ['ベッド', 'beddo'], ['침대', 'chimdae'], ['床', 'chuáng'], ['बिस्तर', 'bistar'], ['سرير', 'sarīr']),
  phrase('bus', ['autobús', 'bus', 'Bus', 'autobus', 'ônibus'], ['バス', 'basu'], ['버스', 'beoseu'], ['公交车', 'gōngjiāochē'], ['बस', 'bas'], ['حافلة', 'ḥāfila']),
  phrase('taxi', ['taxi', 'taxi', 'Taxi', 'taxi', 'táxi'], ['タクシー', 'takushī'], ['택시', 'taeksi'], ['出租车', 'chūzūchē'], ['टैक्सी', 'ṭaiksī'], ['سيارة أجرة', 'sayyārat ujra']),
  phrase('I have a reservation', ['Tengo una reserva', "J'ai une réservation", 'Ich habe eine Reservierung', 'Ho una prenotazione', 'Tenho uma reserva'], ['予約があります', 'yoyaku ga arimasu'], ['예약했어요', 'yeyakhaesseoyo'], ['我有预订', 'wǒ yǒu yùdìng'], ['मेरी बुकिंग है', 'merī buking hai'], ['عندي حجز', 'ʿindī ḥajz']),
  phrase('Where is the hotel?', ['¿Dónde está el hotel?', "Où est l'hôtel ?", 'Wo ist das Hotel?', "Dov'è l'albergo?", 'Onde fica o hotel?'], ['ホテルはどこですか', 'hoteru wa doko desu ka'], ['호텔이 어디예요?', 'hoteri eodiyeyo?'], ['酒店在哪里?', 'jiǔdiàn zài nǎlǐ?'], ['होटल कहाँ है?', 'hoṭal kahā̃ hai?'], ['أين الفندق؟', 'ayna al-funduq?']),

  // Level 7: Daily routine
  phrase('morning', ['mañana', 'matin', 'Morgen', 'mattina', 'manhã'], ['朝', 'asa'], ['아침', 'achim'], ['早上', 'zǎoshang'], ['सुबह', 'subah'], ['صباح', 'ṣabāḥ']),
  phrase('night', ['noche', 'nuit', 'Nacht', 'notte', 'noite'], ['夜', 'yoru'], ['밤', 'bam'], ['晚上', 'wǎnshang'], ['रात', 'rāt'], ['ليل', 'layl']),
  phrase('day', ['día', 'jour', 'Tag', 'giorno', 'dia'], ['日', 'hi'], ['날', 'nal'], ['天', 'tiān'], ['दिन', 'din'], ['يوم', 'yawm']),
  phrase('house', ['casa', 'maison', 'Haus', 'casa', 'casa'], ['家', 'ie'], ['집', 'jip'], ['家', 'jiā'], ['घर', 'ghar'], ['بيت', 'bayt']),
  phrase('to eat', ['comer', 'manger', 'essen', 'mangiare', 'comer'], ['食べる', 'taberu'], ['먹다', 'meokda'], ['吃', 'chī'], ['खाना', 'khānā'], ['أكل', 'akl']),
  phrase('to drink', ['beber', 'boire', 'trinken', 'bere', 'beber'], ['飲む', 'nomu'], ['마시다', 'masida'], ['喝', 'hē'], ['पीना', 'pīnā'], ['شرب', 'shurb']),
  phrase('to sleep', ['dormir', 'dormir', 'schlafen', 'dormire', 'dormir'], ['寝る', 'neru'], ['자다', 'jada'], ['睡觉', 'shuìjiào'], ['सोना', 'sonā'], ['نوم', 'nawm']),
  phrase('to wake up', ['despertarse', 'se réveiller', 'aufwachen', 'svegliarsi', 'acordar'], ['起きる', 'okiru'], ['일어나다', 'ireonada'], ['起床', 'qǐchuáng'], ['उठना', 'uṭhnā'], ['استيقاظ', 'istīqāẓ']),

  // Level 8: Work and hobbies
  phrase('work', ['trabajo', 'travail', 'Arbeit', 'lavoro', 'trabalho'], ['仕事', 'shigoto'], ['일', 'il'], ['工作', 'gōngzuò'], ['काम', 'kām'], ['عمل', 'ʿamal']),
  phrase('school', ['escuela', 'école', 'Schule', 'scuola', 'escola'], ['学校', 'gakkō'], ['학교', 'hakgyo'], ['学校', 'xuéxiào'], ['स्कूल', 'skūl'], ['مدرسة', 'madrasa']),
  phrase('book', ['libro', 'livre', 'Buch', 'libro', 'livro'], ['本', 'hon'], ['책', 'chaek'], ['书', 'shū'], ['किताब', 'kitāb'], ['كتاب', 'kitāb']),
  phrase('language', ['idioma', 'langue', 'Sprache', 'lingua', 'idioma'], ['言語', 'gengo'], ['언어', 'eoneo'], ['语言', 'yǔyán'], ['भाषा', 'bhāṣā'], ['لغة', 'lugha']),
  phrase('music', ['música', 'musique', 'Musik', 'musica', 'música'], ['音楽', 'ongaku'], ['음악', 'eumak'], ['音乐', 'yīnyuè'], ['संगीत', 'saṅgīt'], ['موسيقى', 'mūsīqā']),
  phrase('sport', ['deporte', 'sport', 'Sport', 'sport', 'esporte'], ['スポーツ', 'supōtsu'], ['운동', 'undong'], ['运动', 'yùndòng'], ['खेल', 'khel'], ['رياضة', 'riyāḍa']),
  phrase('movie', ['película', 'film', 'Film', 'film', 'filme'], ['映画', 'eiga'], ['영화', 'yeonghwa'], ['电影', 'diànyǐng'], ['फ़िल्म', 'film'], ['فيلم', 'fīlm']),
  phrase('computer', ['computadora', 'ordinateur', 'Computer', 'computer', 'computador'], ['コンピューター', 'konpyūtā'], ['컴퓨터', 'keompyuteo'], ['电脑', 'diànnǎo'], ['कंप्यूटर', 'kampyūṭar'], ['حاسوب', 'ḥāsūb']),

  // Level 9: Past and future
  phrase('yesterday', ['ayer', 'hier', 'gestern', 'ieri', 'ontem'], ['昨日', 'kinō'], ['어제', 'eoje'], ['昨天', 'zuótiān'], ['बीता कल', 'bītā kal'], ['أمس', 'ams']),
  phrase('today', ['hoy', "aujourd'hui", 'heute', 'oggi', 'hoje'], ['今日', 'kyō'], ['오늘', 'oneul'], ['今天', 'jīntiān'], ['आज', 'āj'], ['اليوم', 'al-yawm']),
  phrase('tomorrow', ['mañana', 'demain', 'morgen', 'domani', 'amanhã'], ['明日', 'ashita'], ['내일', 'naeil'], ['明天', 'míngtiān'], ['आने वाला कल', 'āne vālā kal'], ['غدا', 'ghadan']),
  phrase('now', ['ahora', 'maintenant', 'jetzt', 'adesso', 'agora'], ['今', 'ima'], ['지금', 'jigeum'], ['现在', 'xiànzài'], ['अब', 'ab'], ['الآن', 'al-ān']),
  phrase('later', ['más tarde', 'plus tard', 'später', 'più tardi', 'mais tarde'], ['後で', 'ato de'], ['나중에', 'najunge'], ['以后', 'yǐhòu'], ['बाद में', 'bād mẽ'], ['لاحقا', 'lāḥiqan']),
  phrase('I worked', ['Trabajé', "J'ai travaillé", 'Ich habe gearbeitet', 'Ho lavorato', 'Trabalhei'], ['働きました', 'hatarakimashita'], ['일했어요', 'ilhaesseoyo'], ['我工作了', 'wǒ gōngzuò le'], ['मैंने काम किया', 'maĩne kām kiyā'], ['عملت', 'ʿamiltu']),
  phrase('I ate', ['Comí', "J'ai mangé", 'Ich habe gegessen', 'Ho mangiato', 'Comi'], ['食べました', 'tabemashita'], ['먹었어요', 'meogeosseoyo'], ['我吃了', 'wǒ chī le'], ['मैंने खाया', 'maĩne khāyā'], ['أكلت', 'akaltu']),
  phrase('We will eat', ['Comeremos', 'Nous mangerons', 'Wir werden essen', 'Mangeremo', 'Comeremos'], ['一緒に食べます', 'issho ni tabemasu'], ['우리는 먹을 거예요', 'urineun meogeul geoyeyo'], ['我们会吃', 'wǒmen huì chī'], ['हम खाएँगे', 'ham khāẽge'], ['سنأكل', 'sanaʾkul']),

  // Level 10: Real conversations
  phrase('How are you?', ['¿Cómo estás?', 'Comment ça va ?', 'Wie geht es dir?', 'Come stai?', 'Como vai?'], ['お元気ですか', 'ogenki desu ka'], ['잘 지내요?', 'jal jinaeyo?'], ['你好吗?', 'nǐ hǎo ma?'], ['आप कैसे हैं?', 'āp kaise haĩ?'], ['كيف حالك؟', 'kayfa ḥāluka?']),
  phrase("What's your name?", ['¿Cómo te llamas?', "Comment tu t'appelles ?", 'Wie heißt du?', 'Come ti chiami?', 'Como você se chama?'], ['お名前は?', 'onamae wa?'], ['이름이 뭐예요?', 'ireumi mwoyeyo?'], ['你叫什么名字?', 'nǐ jiào shénme míngzi?'], ['आपका नाम क्या है?', 'āpkā nām kyā hai?'], ['ما اسمك؟', 'mā ismuka?']),
  phrase('Nice to meet you', ['Mucho gusto', 'Enchanté', 'Freut mich', 'Piacere', 'Prazer'], ['はじめまして', 'hajimemashite'], ['만나서 반가워요', 'mannaseo bangawoyo'], ['很高兴认识你', 'hěn gāoxìng rènshi nǐ'], ['आपसे मिलकर खुशी हुई', 'āpse milkar khuśī huī'], ['تشرفنا', 'tasharrafnā']),
  phrase("I don't understand", ['No entiendo', 'Je ne comprends pas', 'Ich verstehe nicht', 'Non capisco', 'Não entendo'], ['わかりません', 'wakarimasen'], ['이해가 안 돼요', 'ihaega an dwaeyo'], ['我不明白', 'wǒ bù míngbai'], ['मुझे समझ नहीं आया', 'mujhe samajh nahī̃ āyā'], ['لا أفهم', 'lā afham']),
  phrase('Please repeat', ['Repita, por favor', "Répétez, s'il vous plaît", 'Bitte wiederholen', 'Ripeta, per favore', 'Repita, por favor'], ['もう一度お願いします', 'mō ichido onegaishimasu'], ['다시 말해 주세요', 'dasi malhae juseyo'], ['请再说一遍', 'qǐng zài shuō yí biàn'], ['कृपया दोहराइए', 'kṛpayā dohrāie'], ['أعد من فضلك', 'aʿid min faḍlik']),
  phrase('See you later', ['Hasta luego', 'À plus tard', 'Bis später', 'A dopo', 'Até logo'], ['またね', 'mata ne'], ['나중에 봐요', 'najunge bwayo'], ['回头见', 'huítóu jiàn'], ['फिर मिलेंगे', 'phir milẽge'], ['أراك لاحقا', 'arāka lāḥiqan']),
  phrase('Thank you very much', ['Muchas gracias', 'Merci beaucoup', 'Vielen Dank', 'Grazie mille', 'Muito obrigado'], ['どうもありがとうございます', 'dōmo arigatō gozaimasu'], ['정말 감사합니다', 'jeongmal gamsahamnida'], ['非常感谢', 'fēicháng gǎnxiè'], ['बहुत धन्यवाद', 'bahut dhanyavād'], ['شكرا جزيلا', 'shukran jazīlan']),
  phrase('Have a good day', ['Que tengas un buen día', 'Bonne journée', 'Schönen Tag noch', 'Buona giornata', 'Tenha um bom dia'], ['良い一日を', 'yoi ichinichi o'], ['좋은 하루 보내세요', 'joeun haru bonaeseyo'], ['祝你今天愉快', 'zhù nǐ jīntiān yúkuài'], ['आपका दिन शुभ हो', 'āpkā din śubh ho'], ['يوما سعيدا', 'yawman saʿīdan']),
];

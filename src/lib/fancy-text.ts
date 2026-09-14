const ALPHA = "abcdefghijklmnopqrstuvwxyz";
const UPPER = ALPHA.toUpperCase();
const DIGITS = "0123456789";

function mapFrom(lowerSet: string, upperSet: string, digitSet?: string) {
  const map = new Map<string, string>();
  const lower = Array.from(lowerSet);
  const upper = Array.from(upperSet);
  const digits = digitSet ? Array.from(digitSet) : [];
  ALPHA.split("").forEach((c, i) => lower[i] && map.set(c, lower[i]!));
  UPPER.split("").forEach((c, i) => upper[i] && map.set(c, upper[i]!));
  DIGITS.split("").forEach((c, i) => digits[i] && map.set(c, digits[i]!));
  return (input: string) =>
    Array.from(input)
      .map((ch) => map.get(ch) ?? ch)
      .join("");
}

const combine = (mark: string) => (input: string) =>
  Array.from(input)
    .map((ch) => ch + mark)
    .join("");

const FLIP: Record<string, string> = {
  a: "ɐ",
  b: "q",
  c: "ɔ",
  d: "p",
  e: "ǝ",
  f: "ɟ",
  g: "ƃ",
  h: "ɥ",
  i: "ᴉ",
  j: "ɾ",
  k: "ʞ",
  l: "l",
  m: "ɯ",
  n: "u",
  o: "o",
  p: "d",
  q: "b",
  r: "ɹ",
  s: "s",
  t: "ʇ",
  u: "n",
  v: "ʌ",
  w: "ʍ",
  x: "x",
  y: "ʎ",
  z: "z",
  ".": "˙",
  ",": "'",
  "?": "¿",
  "!": "¡",
  "'": ",",
  "(": ")",
  ")": "(",
  "[": "]",
  "]": "[",
};

export type FancyStyle = { id: string; label: string; transform: (s: string) => string };

export const FANCY_STYLES: FancyStyle[] = [
  {
    id: "bold",
    label: "Bold",
    transform: mapFrom("𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳", "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙", "𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗"),
  },
  {
    id: "italic",
    label: "Italic",
    transform: mapFrom("𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧", "𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍"),
  },
  {
    id: "bolditalic",
    label: "Bold italic",
    transform: mapFrom("𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛", "𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁"),
  },
  {
    id: "script",
    label: "Script",
    transform: mapFrom("𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃â„´đ“…đ“†đ“‡đ“ˆđ“‰đ“Šđ“‹đ“Œđ“đ“Žđ“", "𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵"),
  },
  {
    id: "boldscript",
    label: "Bold script",
    transform: mapFrom("𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃", "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩"),
  },
  {
    id: "fraktur",
    label: "Fraktur",
    transform: mapFrom("𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷", "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ"),
  },
  {
    id: "boldfraktur",
    label: "Bold fraktur",
    transform: mapFrom("𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟", "𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅"),
  },
  {
    id: "double",
    label: "Double struck",
    transform: mapFrom("𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫", "𝔸𝔹â„‚ð”»ð”¼ð”½ð”¾â„ð•€ð•ð•‚ð•ƒð•„â„•ð•†â„™â„šâ„ð•Šð•‹ð•Œð•ð•Žð•ð•â„¤", "𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡"),
  },
  {
    id: "mono",
    label: "Monospace",
    transform: mapFrom("𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣", "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉", "𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿"),
  },
  {
    id: "sans",
    label: "Sans",
    transform: mapFrom("𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓", "𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹", "𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫"),
  },
  {
    id: "sansbold",
    label: "Sans bold",
    transform: mapFrom("𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇", "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭", "𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵"),
  },
  {
    id: "circled",
    label: "Circled",
    transform: mapFrom("ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ", "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ"),
  },
  {
    id: "darkcircled",
    label: "Filled circles",
    transform: mapFrom("🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩", "🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩"),
  },
  {
    id: "squared",
    label: "Squared",
    transform: mapFrom("🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉", "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉"),
  },
  {
    id: "darksquared",
    label: "Filled squares",
    transform: mapFrom("🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉", "🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉"),
  },
  {
    id: "smallcaps",
    label: "Small caps",
    transform: mapFrom("ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘQʀꜱᴛᴜᴠᴡxʏᴢ", "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘQʀꜱᴛᴜᴠᴡxʏᴢ"),
  },
  {
    id: "superscript",
    label: "Superscript",
    transform: mapFrom("ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ", "ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ", "⁰¹²³⁴⁵⁶⁷⁸⁹"),
  },
  {
    id: "subscript",
    label: "Subscript",
    transform: mapFrom("ₐbcdₑfghᵢⱼₖₗₘₙₒₚqᵣₛₜᵤᵥwₓyz", "ₐbcdₑfghᵢⱼₖₗₘₙₒₚqᵣₛₜᵤᵥwₓyz", "₀₁₂₃₄₅₆₇₈₉"),
  },
  {
    id: "fullwidth",
    label: "Full width",
    transform: mapFrom("ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ", "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ", "０１２３４５６７８９"),
  },
  {
    id: "inverted",
    label: "Upside down",
    transform: (s: string) =>
      Array.from(s.toLowerCase())
        .reverse()
        .map((c) => FLIP[c] ?? c)
        .join(""),
  },
  { id: "strike", label: "Strikethrough", transform: combine("\u0336") },
  { id: "underline", label: "Underline", transform: combine("\u0332") },
  { id: "slash", label: "Slashed", transform: combine("\u0338") },
  { id: "hearts", label: "Hearts", transform: combine("\u0d4d\u0332") },
  {
    id: "spaced",
    label: "Spaced out",
    transform: (s) => Array.from(s).join(" "),
  },
  {
    id: "dotted",
    label: "Dot separated",
    transform: (s) => Array.from(s).join("·"),
  },
  {
    id: "wavy",
    label: "Wavy brackets",
    transform: (s) => `｡:*♡ ${s} ♡*:｡`,
  },
  {
    id: "stars",
    label: "Star frame",
    transform: (s) => `✧･ﾟ ${s} ･ﾟ✧`,
  },
];

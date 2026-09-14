export type SymbolCategory = { id: string; label: string; symbols: string[] };

const chars = (s: string) => Array.from(s).filter((c) => c.trim().length > 0);

export const SYMBOL_CATEGORIES: SymbolCategory[] = [
  { id: "hearts", label: "Hearts", symbols: chars("♥♡❤❥❣❦❧💕💖💗💘💝💞💓💔♥️❤︎ღ丹") },
  { id: "stars", label: "Stars", symbols: chars("★☆✡✦✧✩✪✫✬✭✮✯✰⁂⭐🌟✨🌠🔯✵✶✷✸✹") },
  { id: "arrows", label: "Arrows", symbols: chars("←↑→↓↔↕↖↗↘↙⇐⇑⇒⇓⇔⇖⇗⇘⇙➔➜➙➡➢➣➤⟵⟶⟷↩↪") },
  { id: "shapes", label: "Shapes", symbols: chars("■□▢▣▤▥▦▧▨▩▪▫▬▭▮▯▰▱△▲▽▼◀▶◆◇◈○●◉◌◍◎◐◑") },
  { id: "math", label: "Math", symbols: chars("＋−×÷±∓∞≈≠≤≥∑∏√∛∜∫∬∮∂∆∇∈∉⊂⊃∪∩∀∃∅ℵπ") },
  { id: "currency", label: "Currency", symbols: chars("$¢£¤¥₠₡₢₣₤₥₦₧₨₩₪₫€₭₮₯₰₱₲₳₴₵₸₹₺₼₽﷼") },
  { id: "punct", label: "Punctuation", symbols: chars("‚„…‰′″‴‹›«»¡¿·•‣※‼⁇⁈⁉‽–—―§¶†‡") },
  { id: "brackets", label: "Brackets", symbols: chars("()[]{}⟨⟩⟪⟫⌈⌉⌊⌋「」『』【】〔〕〖〗〘〙《》") },
  { id: "chess", label: "Chess & cards", symbols: chars("♔♕♖♗♘♙♚♛♜♝♞♟♠♣♥♦♤♧♡♢🂡🂱🃁🃑") },
  { id: "music", label: "Music", symbols: chars("♩♪♫♬♭♮♯𝄞𝄢𝄪𝄫🎵🎶🎼🎤🎧🎸🎹🥁🎷🎺") },
  { id: "weather", label: "Weather", symbols: chars("☀☁☂☃☄★☇☈☉☊☋☌☍❄❅❆☼☽☾🌙🌞🌈⛅⛈🌧🌩🌪") },
  { id: "zodiac", label: "Zodiac", symbols: chars("♈♉♊♋♌♍♎♏♐♑♒♓⛎☿♀♁♂♃♄♅♆♇") },
  { id: "office", label: "Office", symbols: chars("✁✂✃✄✆✇✈✉✎✏✐✑✒📌📍📎📏📐📝📁📂🗂🗒🗓") },
  { id: "checks", label: "Checks & crosses", symbols: chars("✓✔✗✘☑☒✕✖✚✛✜✝✞✟✠❌❎✅⛔🚫") },
  { id: "greek", label: "Greek", symbols: chars("αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ") },
  { id: "cyrillic", label: "Cyrillic", symbols: chars("бгджзийклмнптфцчшщъыьэюяБГДЖЗИЙЛПФЦЧШЩЪЫЬЭЮЯ") },
  { id: "latin", label: "Accented latin", symbols: chars("àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖØÙÚÛÜÝ") },
  { id: "numbers", label: "Number forms", symbols: chars("½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞⅟↉ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫⅬⅭⅮⅯ①②③④⑤⑥⑦⑧⑨⑩") },
  { id: "braille", label: "Braille", symbols: chars("⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⣿⣾⣽⣻⢿⡿") },
  { id: "box", label: "Box drawing", symbols: chars("─│┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬▀▄█▌▐░▒▓") },
  { id: "tech", label: "Tech", symbols: chars("⌘⌥⌃⇧⏎⌫⌦⇪⇥⏏⏻⏼⏽⭘⌨🖱🖥💻📱🔋🔌📶") },
  { id: "religion", label: "Religion", symbols: chars("☦☧☨☩☪☫☬☭☮☯✝✞✟✡☥⛩🕉🕎🛐") },
  { id: "faces", label: "Faces", symbols: chars("😀😃😄😁😆😅😂🤣😊😇🙂🙃😉😌😍🥰😘😜🤩🥳😎🤔😐😴😭😡🤯") },
  { id: "hands", label: "Hands", symbols: chars("👍👎👌✌🤞🤟🤘🤙👋🤚🖐✋🖖👏🙌🤲🙏💪👊✊") },
  { id: "nature", label: "Nature", symbols: chars("🌱🌲🌳🌴🌵🌾🌿☘🍀🍁🍂🍃🌷🌹🌺🌻🌼🌸💐🍄") },
  { id: "food", label: "Food", symbols: chars("🍎🍊🍋🍌🍉🍇🍓🍒🍑🥭🍍🥥🥑🍔🍟🍕🌭🍿🍩🍪🎂🍰☕🍵🍺") },
  { id: "travel", label: "Travel", symbols: chars("🚗🚕🚙🚌🏎🚓🚑🚒🚚🚲🛵🏍✈🚀🛸🚁⛵🛳🚂🚆🗺🏝🏔") },
  { id: "flourish", label: "Flourishes", symbols: chars("۞۩ஐ⁂❈❉❊❋✿❀❁❃✾✽✼✻✺❖◈⟐⟡⟢⟣") },
];

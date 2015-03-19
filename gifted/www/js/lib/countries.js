function getCountries() {
	var Countries = [ {
		en_name : "Angola",
		cn_name : "安哥拉",
		IDN : "AO",
		phone_prefix : "244",
		lag : "-7"
	}, {
		en_name : "Afghanistan",
		cn_name : "阿富汗",
		IDN : "AF",
		phone_prefix : "93",
		lag : "0"
	}, {
		en_name : "Albania",
		cn_name : "阿尔巴尼亚",
		IDN : "AL",
		phone_prefix : "355",
		lag : "-7"
	}, {
		en_name : "Algeria",
		cn_name : "阿尔及利亚",
		IDN : "DZ",
		phone_prefix : "213",
		lag : "-8"
	}, {
		en_name : "Andorra",
		cn_name : "安道尔共和国",
		IDN : "AD",
		phone_prefix : "376",
		lag : "-8"
	}, {
		en_name : "Anguilla",
		cn_name : "安圭拉岛",
		IDN : "AI",
		phone_prefix : "1264",
		lag : "-12"
	}, {
		en_name : "Antigua and Barbuda",
		cn_name : "安提瓜和巴布达",
		IDN : "AG",
		phone_prefix : "1268",
		lag : "-12"
	}, {
		en_name : "Argentina",
		cn_name : "阿根廷",
		IDN : "AR",
		phone_prefix : "54",
		lag : "-11"
	}, {
		en_name : "Armenia",
		cn_name : "亚美尼亚",
		IDN : "AM",
		phone_prefix : "374",
		lag : "-6"
	}, {
		en_name : "Ascension",
		cn_name : "阿森松",
		IDN : "Ascension",
		phone_prefix : "247",
		lag : "-8"
	}, {
		en_name : "Australia",
		cn_name : "澳大利亚",
		IDN : "AU",
		phone_prefix : "61",
		lag : "2"
	}, {
		en_name : "Austria",
		cn_name : "奥地利",
		IDN : "AT",
		phone_prefix : "43",
		lag : "-7"
	}, {
		en_name : "Azerbaijan",
		cn_name : "阿塞拜疆",
		IDN : "AZ",
		phone_prefix : "994",
		lag : "-5"
	}, {
		en_name : "Bahamas",
		cn_name : "巴哈马",
		IDN : "BS",
		phone_prefix : "1242",
		lag : "-13"
	}, {
		en_name : "Bahrain",
		cn_name : "巴林",
		IDN : "BH",
		phone_prefix : "973",
		lag : "-5"
	}, {
		en_name : "Bangladesh",
		cn_name : "孟加拉国",
		IDN : "BD",
		phone_prefix : "880",
		lag : "-2"
	}, {
		en_name : "Barbados",
		cn_name : "巴巴多斯",
		IDN : "BB",
		phone_prefix : "1246",
		lag : "-12"
	}, {
		en_name : "Belarus",
		cn_name : "白俄罗斯",
		IDN : "BY",
		phone_prefix : "375",
		lag : "-6"
	}, {
		en_name : "Belgium",
		cn_name : "比利时",
		IDN : "BE",
		phone_prefix : "32",
		lag : "-7"
	}, {
		en_name : "Belize",
		cn_name : "伯利兹",
		IDN : "BZ",
		phone_prefix : "501",
		lag : "-14"
	}, {
		en_name : "Benin",
		cn_name : "贝宁",
		IDN : "BJ",
		phone_prefix : "229",
		lag : "-7"
	}, {
		en_name : "BermudaIs.",
		cn_name : "百慕大群岛",
		IDN : "BM",
		phone_prefix : "1441",
		lag : "-12"
	}, {
		en_name : "Bolivia",
		cn_name : "玻利维亚",
		IDN : "BO",
		phone_prefix : "591",
		lag : "-12"
	}, {
		en_name : "Botswana",
		cn_name : "博茨瓦纳",
		IDN : "BW",
		phone_prefix : "267",
		lag : "-6"
	}, {
		en_name : "Brazil",
		cn_name : "巴西",
		IDN : "BR",
		phone_prefix : "55",
		lag : "-11"
	}, {
		en_name : "Brunei",
		cn_name : "文莱",
		IDN : "BN",
		phone_prefix : "673",
		lag : "0"
	}, {
		en_name : "Bulgaria",
		cn_name : "保加利亚",
		IDN : "BG",
		phone_prefix : "359",
		lag : "-6"
	}, {
		en_name : "Burkina-faso",
		cn_name : "布基纳法索",
		IDN : "BF",
		phone_prefix : "226",
		lag : "-8"
	}, {
		en_name : "Burma",
		cn_name : "缅甸",
		IDN : "MM",
		phone_prefix : "95",
		lag : "-1.3"
	}, {
		en_name : "Burundi",
		cn_name : "布隆迪",
		IDN : "BI",
		phone_prefix : "257",
		lag : "-6"
	}, {
		en_name : "Cameroon",
		cn_name : "喀麦隆",
		IDN : "CM",
		phone_prefix : "237",
		lag : "-7"
	}, {
		en_name : "Canada",
		cn_name : "加拿大",
		IDN : "CA",
		phone_prefix : "1",
		lag : "-13"
	}, {
		en_name : "Cayman Is.",
		cn_name : "开曼群岛",
		IDN : "Cayman Is",
		phone_prefix : "1345",
		lag : "-13"
	}, {
		en_name : "Central African Republic",
		cn_name : "中非共和国",
		IDN : "CF",
		phone_prefix : "236",
		lag : "-7"
	}, {
		en_name : "Chad",
		cn_name : "乍得",
		IDN : "TD",
		phone_prefix : "235",
		lag : "-7"
	}, {
		en_name : "Chile",
		cn_name : "智利",
		IDN : "CL",
		phone_prefix : "56",
		lag : "-13"
	}, {
		en_name : "China",
		cn_name : "中国",
		IDN : "CN",
		phone_prefix : "86",
		lag : "0"
	}, {
		en_name : "Colombia",
		cn_name : "哥伦比亚",
		IDN : "CO",
		phone_prefix : "57",
		lag : "0"
	}, {
		en_name : "Congo",
		cn_name : "刚果",
		IDN : "CG",
		phone_prefix : "242",
		lag : "-7"
	}, {
		en_name : "Cook Is.",
		cn_name : "库克群岛",
		IDN : "CK",
		phone_prefix : "682",
		lag : "-18.3"
	}, {
		en_name : "Costa Rica",
		cn_name : "哥斯达黎加",
		IDN : "CR",
		phone_prefix : "506",
		lag : "-14"
	}, {
		en_name : "Cuba",
		cn_name : "古巴",
		IDN : "CU",
		phone_prefix : "53",
		lag : "-13"
	}, {
		en_name : "Cyprus",
		cn_name : "塞浦路斯",
		IDN : "CY",
		phone_prefix : "357",
		lag : "-6"
	}, {
		en_name : "Czech Republic",
		cn_name : "捷克",
		IDN : "CZ",
		phone_prefix : "420",
		lag : "-7"
	}, {
		en_name : "Denmark",
		cn_name : "丹麦",
		IDN : "DK",
		phone_prefix : "45",
		lag : "-7"
	}, {
		en_name : "Djibouti",
		cn_name : "吉布提",
		IDN : "DJ",
		phone_prefix : "253",
		lag : "-5"
	}, {
		en_name : "Dominica Rep.",
		cn_name : "多米尼加共和国",
		IDN : "DO",
		phone_prefix : "1890",
		lag : "-13"
	}, {
		en_name : "Ecuador",
		cn_name : "厄瓜多尔",
		IDN : "EC",
		phone_prefix : "593",
		lag : "-13"
	}, {
		en_name : "Egypt",
		cn_name : "埃及",
		IDN : "EG",
		phone_prefix : "20",
		lag : "-6"
	}, {
		en_name : "EISalvador",
		cn_name : "萨尔瓦多",
		IDN : "SV",
		phone_prefix : "503",
		lag : "-14"
	}, {
		en_name : "Estonia",
		cn_name : "爱沙尼亚",
		IDN : "EE",
		phone_prefix : "372",
		lag : "-5"
	}, {
		en_name : "Ethiopia",
		cn_name : "埃塞俄比亚",
		IDN : "ET",
		phone_prefix : "251",
		lag : "-5"
	}, {
		en_name : "Fiji",
		cn_name : "斐济",
		IDN : "FJ",
		phone_prefix : "679",
		lag : "4"
	}, {
		en_name : "Finland",
		cn_name : "芬兰",
		IDN : "FI",
		phone_prefix : "358",
		lag : "-6"
	}, {
		en_name : "France",
		cn_name : "法国",
		IDN : "FR",
		phone_prefix : "33",
		lag : "-8"
	}, {
		en_name : "French Guiana",
		cn_name : "法属圭亚那",
		IDN : "GF",
		phone_prefix : "594",
		lag : "-12"
	}, {
		en_name : "Gabon",
		cn_name : "加蓬",
		IDN : "GA",
		phone_prefix : "241",
		lag : "-7"
	}, {
		en_name : "Gambia",
		cn_name : "冈比亚",
		IDN : "GM",
		phone_prefix : "220",
		lag : "-8"
	}, {
		en_name : "Georgia",
		cn_name : "格鲁吉亚",
		IDN : "GE",
		phone_prefix : "995",
		lag : "0"
	}, {
		en_name : "Germany",
		cn_name : "德国",
		IDN : "DE",
		phone_prefix : "49",
		lag : "-7"
	}, {
		en_name : "Ghana",
		cn_name : "加纳",
		IDN : "GH",
		phone_prefix : "233",
		lag : "-8"
	}, {
		en_name : "Gibraltar",
		cn_name : "直布罗陀",
		IDN : "GI",
		phone_prefix : "350",
		lag : "-8"
	}, {
		en_name : "Greece",
		cn_name : "希腊",
		IDN : "GR",
		phone_prefix : "30",
		lag : "-6"
	}, {
		en_name : "Grenada",
		cn_name : "格林纳达",
		IDN : "GD",
		phone_prefix : "1809",
		lag : "-14"
	}, {
		en_name : "Guam",
		cn_name : "关岛",
		IDN : "GU",
		phone_prefix : "1671",
		lag : "2"
	}, {
		en_name : "Guatemala",
		cn_name : "危地马拉",
		IDN : "GT",
		phone_prefix : "502",
		lag : "-14"
	}, {
		en_name : "Guinea",
		cn_name : "几内亚",
		IDN : "GN",
		phone_prefix : "224",
		lag : "-8"
	}, {
		en_name : "Guyana",
		cn_name : "圭亚那",
		IDN : "GY",
		phone_prefix : "592",
		lag : "-11"
	}, {
		en_name : "Haiti",
		cn_name : "海地",
		IDN : "HT",
		phone_prefix : "509",
		lag : "-13"
	}, {
		en_name : "Honduras",
		cn_name : "洪都拉斯",
		IDN : "HN",
		phone_prefix : "504",
		lag : "-14"
	}, {
		en_name : "Hongkong",
		cn_name : "香港",
		IDN : "HK",
		phone_prefix : "852",
		lag : "0"
	}, {
		en_name : "Hungary",
		cn_name : "匈牙利",
		IDN : "HU",
		phone_prefix : "36",
		lag : "-7"
	}, {
		en_name : "Iceland",
		cn_name : "冰岛",
		IDN : "IS",
		phone_prefix : "354",
		lag : "-9"
	}, {
		en_name : "India",
		cn_name : "印度",
		IDN : "IN",
		phone_prefix : "91",
		lag : "-2.3"
	}, {
		en_name : "Indonesia",
		cn_name : "印度尼西亚",
		IDN : "ID",
		phone_prefix : "62",
		lag : "-0.3"
	}, {
		en_name : "Iran",
		cn_name : "伊朗",
		IDN : "IR",
		phone_prefix : "98",
		lag : "-4.3"
	}, {
		en_name : "Iraq",
		cn_name : "伊拉克",
		IDN : "IQ",
		phone_prefix : "964",
		lag : "-5"
	}, {
		en_name : "Ireland",
		cn_name : "爱尔兰",
		IDN : "IE",
		phone_prefix : "353",
		lag : "-4.3"
	}, {
		en_name : "Israel",
		cn_name : "以色列",
		IDN : "IL",
		phone_prefix : "972",
		lag : "-6"
	}, {
		en_name : "Italy",
		cn_name : "意大利",
		IDN : "IT",
		phone_prefix : "39",
		lag : "-7"
	}, {
		en_name : "IvoryCoast",
		cn_name : "科特迪瓦",
		IDN : "IvoryCoast",
		phone_prefix : "225",
		lag : "-6"
	}, {
		en_name : "Jamaica",
		cn_name : "牙买加",
		IDN : "JM",
		phone_prefix : "1876",
		lag : "-12"
	}, {
		en_name : "Japan",
		cn_name : "日本",
		IDN : "JP",
		phone_prefix : "81",
		lag : "1"
	}, {
		en_name : "Jordan",
		cn_name : "约旦",
		IDN : "JO",
		phone_prefix : "962",
		lag : "-6"
	}, {
		en_name : "Kampuchea (Cambodia )",
		cn_name : "柬埔寨",
		IDN : "KH",
		phone_prefix : "855",
		lag : "-1"
	}, {
		en_name : "Kazakstan",
		cn_name : "哈萨克斯坦",
		IDN : "KZ",
		phone_prefix : "327",
		lag : "-5"
	}, {
		en_name : "Kenya",
		cn_name : "肯尼亚",
		IDN : "KE",
		phone_prefix : "254",
		lag : "-5"
	}, {
		en_name : "Korea",
		cn_name : "韩国",
		IDN : "KR",
		phone_prefix : "82",
		lag : "1"
	}, {
		en_name : "Kuwait",
		cn_name : "科威特",
		IDN : "KW",
		phone_prefix : "965",
		lag : "-5"
	}, {
		en_name : "Kyrgyzstan",
		cn_name : "吉尔吉斯坦",
		IDN : "KG",
		phone_prefix : "331",
		lag : "-5"
	}, {
		en_name : "Laos",
		cn_name : "老挝",
		IDN : "LA",
		phone_prefix : "856",
		lag : "-1"
	}, {
		en_name : "Latvia",
		cn_name : "拉脱维亚",
		IDN : "LV",
		phone_prefix : "371",
		lag : "-5"
	}, {
		en_name : "Lebanon",
		cn_name : "黎巴嫩",
		IDN : "LB",
		phone_prefix : "961",
		lag : "-6"
	}, {
		en_name : "Lesotho",
		cn_name : "莱索托",
		IDN : "LS",
		phone_prefix : "266",
		lag : "-6"
	}, {
		en_name : "Liberia",
		cn_name : "利比里亚",
		IDN : "LR",
		phone_prefix : "231",
		lag : "-8"
	}, {
		en_name : "Libya",
		cn_name : "利比亚",
		IDN : "LY",
		phone_prefix : "218",
		lag : "-6"
	}, {
		en_name : "Liechtenstein",
		cn_name : "列支敦士登",
		IDN : "LI",
		phone_prefix : "423",
		lag : "-7"
	}, {
		en_name : "Lithuania",
		cn_name : "立陶宛",
		IDN : "LT",
		phone_prefix : "370",
		lag : "-5"
	}, {
		en_name : "Luxembourg",
		cn_name : "卢森堡",
		IDN : "LU",
		phone_prefix : "352",
		lag : "-7"
	}, {
		en_name : "Macao",
		cn_name : "澳门",
		IDN : "MO",
		phone_prefix : "853",
		lag : "0"
	}, {
		en_name : "Madagascar",
		cn_name : "马达加斯加",
		IDN : "MG",
		phone_prefix : "261",
		lag : "-5"
	}, {
		en_name : "Malawi",
		cn_name : "马拉维",
		IDN : "MW",
		phone_prefix : "265",
		lag : "-6"
	}, {
		en_name : "Malaysia",
		cn_name : "马来西亚",
		IDN : "MY",
		phone_prefix : "60",
		lag : "-0.5"
	}, {
		en_name : "Maldives",
		cn_name : "马尔代夫",
		IDN : "MV",
		phone_prefix : "960",
		lag : "-7"
	}, {
		en_name : "Mali",
		cn_name : "马里",
		IDN : "ML",
		phone_prefix : "223",
		lag : "-8"
	}, {
		en_name : "Malta",
		cn_name : "马耳他",
		IDN : "MT",
		phone_prefix : "356",
		lag : "-7"
	}, {
		en_name : "Mariana Is",
		cn_name : "马里亚那群岛",
		IDN : "Mariana Is",
		phone_prefix : "1670",
		lag : "1"
	}, {
		en_name : "Martinique",
		cn_name : "马提尼克",
		IDN : "Martinique",
		phone_prefix : "596",
		lag : "-12"
	}, {
		en_name : "Mauritius",
		cn_name : "毛里求斯",
		IDN : "MU",
		phone_prefix : "230",
		lag : "-4"
	}, {
		en_name : "Mexico",
		cn_name : "墨西哥",
		IDN : "MX",
		phone_prefix : "52",
		lag : "-15"
	}, {
		en_name : "Moldova, Republic of",
		cn_name : "摩尔多瓦",
		IDN : "MD",
		phone_prefix : "373",
		lag : "-5"
	}, {
		en_name : "Monaco",
		cn_name : "摩纳哥",
		IDN : "MC",
		phone_prefix : "377",
		lag : "-7"
	}, {
		en_name : "Mongolia",
		cn_name : "蒙古",
		IDN : "MN",
		phone_prefix : "976",
		lag : "0"
	}, {
		en_name : "Montserrat Is",
		cn_name : "蒙特塞拉特岛",
		IDN : "MS",
		phone_prefix : "1664",
		lag : "-12"
	}, {
		en_name : "Morocco",
		cn_name : "摩洛哥",
		IDN : "MA",
		phone_prefix : "212",
		lag : "-6"
	}, {
		en_name : "Mozambique",
		cn_name : "莫桑比克",
		IDN : "MZ",
		phone_prefix : "258",
		lag : "-6"
	}, {
		en_name : "Namibia",
		cn_name : "纳米比亚",
		IDN : "NA",
		phone_prefix : "264",
		lag : "-7"
	}, {
		en_name : "Nauru",
		cn_name : "瑙鲁",
		IDN : "NR",
		phone_prefix : "674",
		lag : "4"
	}, {
		en_name : "Nepal",
		cn_name : "尼泊尔",
		IDN : "NP",
		phone_prefix : "977",
		lag : "-2.3"
	}, {
		en_name : "Netheriands Antilles",
		cn_name : "荷属安的列斯",
		IDN : "Netheriands Antilles",
		phone_prefix : "599",
		lag : "-12"
	}, {
		en_name : "Netherlands",
		cn_name : "荷兰",
		IDN : "NL",
		phone_prefix : "31",
		lag : "-7"
	}, {
		en_name : "NewZealand",
		cn_name : "新西兰",
		IDN : "NZ",
		phone_prefix : "64",
		lag : "4"
	}, {
		en_name : "Nicaragua",
		cn_name : "尼加拉瓜",
		IDN : "NI",
		phone_prefix : "505",
		lag : "-14"
	}, {
		en_name : "Niger",
		cn_name : "尼日尔",
		IDN : "NE",
		phone_prefix : "227",
		lag : "-8"
	}, {
		en_name : "Nigeria",
		cn_name : "尼日利亚",
		IDN : "NG",
		phone_prefix : "234",
		lag : "-7"
	}, {
		en_name : "North Korea",
		cn_name : "朝鲜",
		IDN : "KP",
		phone_prefix : "850",
		lag : "1"
	}, {
		en_name : "Norway",
		cn_name : "挪威",
		IDN : "NO",
		phone_prefix : "47",
		lag : "-7"
	}, {
		en_name : "Oman",
		cn_name : "阿曼",
		IDN : "OM",
		phone_prefix : "968",
		lag : "-4"
	}, {
		en_name : "Pakistan",
		cn_name : "巴基斯坦",
		IDN : "PK",
		phone_prefix : "92",
		lag : "-2.3"
	}, {
		en_name : "Panama",
		cn_name : "巴拿马",
		IDN : "PA",
		phone_prefix : "507",
		lag : "-13"
	}, {
		en_name : "Papua New Cuinea",
		cn_name : "巴布亚新几内亚",
		IDN : "PG",
		phone_prefix : "675",
		lag : "2"
	}, {
		en_name : "Paraguay",
		cn_name : "巴拉圭",
		IDN : "PY",
		phone_prefix : "595",
		lag : "-12"
	}, {
		en_name : "Peru",
		cn_name : "秘鲁",
		IDN : "PE",
		phone_prefix : "51",
		lag : "-13"
	}, {
		en_name : "Philippines",
		cn_name : "菲律宾",
		IDN : "PH",
		phone_prefix : "63",
		lag : "0"
	}, {
		en_name : "Poland",
		cn_name : "波兰",
		IDN : "PL",
		phone_prefix : "48",
		lag : "-7"
	}, {
		en_name : "French Polynesia",
		cn_name : "法属玻利尼西亚",
		IDN : "PF",
		phone_prefix : "689",
		lag : "3"
	}, {
		en_name : "Portugal",
		cn_name : "葡萄牙",
		IDN : "PT",
		phone_prefix : "351",
		lag : "-8"
	}, {
		en_name : "PuertoRico",
		cn_name : "波多黎各",
		IDN : "PR",
		phone_prefix : "1787",
		lag : "-12"
	}, {
		en_name : "Qatar",
		cn_name : "卡塔尔",
		IDN : "QA",
		phone_prefix : "974",
		lag : "-5"
	}, {
		en_name : "Reunion",
		cn_name : "留尼旺",
		IDN : "Reunion",
		phone_prefix : "262",
		lag : "-4"
	}, {
		en_name : "Romania",
		cn_name : "罗马尼亚",
		IDN : "RO",
		phone_prefix : "40",
		lag : "-6"
	}, {
		en_name : "Russia",
		cn_name : "俄罗斯",
		IDN : "RU",
		phone_prefix : "7",
		lag : "-5"
	}, {
		en_name : "Saint Lueia",
		cn_name : "圣卢西亚",
		IDN : "LC",
		phone_prefix : "1758",
		lag : "-12"
	}, {
		en_name : "Saint Vincent",
		cn_name : "圣文森特岛",
		IDN : "VC",
		phone_prefix : "1784",
		lag : "-12"
	}, {
		en_name : "Samoa Eastern",
		cn_name : "东萨摩亚(美)",
		IDN : "Samoa Eastern",
		phone_prefix : "684",
		lag : "-19"
	}, {
		en_name : "Samoa Western",
		cn_name : "西萨摩亚",
		IDN : "Samoa Western",
		phone_prefix : "685",
		lag : "-19"
	}, {
		en_name : "San Marino",
		cn_name : "圣马力诺",
		IDN : "SM",
		phone_prefix : "378",
		lag : "-7"
	}, {
		en_name : "Sao Tome and Principe",
		cn_name : "圣多美和普林西比",
		IDN : "ST",
		phone_prefix : "239",
		lag : "-8"
	}, {
		en_name : "Saudi Arabia",
		cn_name : "沙特阿拉伯",
		IDN : "SA",
		phone_prefix : "966",
		lag : "-5"
	}, {
		en_name : "Senegal",
		cn_name : "塞内加尔",
		IDN : "SN",
		phone_prefix : "221",
		lag : "-8"
	}, {
		en_name : "Seychelles",
		cn_name : "塞舌尔",
		IDN : "SC",
		phone_prefix : "248",
		lag : "-4"
	}, {
		en_name : "Sierra Leone",
		cn_name : "塞拉利昂",
		IDN : "SL",
		phone_prefix : "232",
		lag : "-8"
	}, {
		en_name : "Singapore",
		cn_name : "新加坡",
		IDN : "SG",
		phone_prefix : "65",
		lag : "0.3"
	}, {
		en_name : "Slovakia",
		cn_name : "斯洛伐克",
		IDN : "SK",
		phone_prefix : "421",
		lag : "-7"
	}, {
		en_name : "Slovenia",
		cn_name : "斯洛文尼亚",
		IDN : "SI",
		phone_prefix : "386",
		lag : "-7"
	}, {
		en_name : "Solomon Is",
		cn_name : "所罗门群岛",
		IDN : "SB",
		phone_prefix : "677",
		lag : "3"
	}, {
		en_name : "Somali",
		cn_name : "索马里",
		IDN : "SO",
		phone_prefix : "252",
		lag : "-5"
	}, {
		en_name : "South Africa",
		cn_name : "南非",
		IDN : "ZA",
		phone_prefix : "27",
		lag : "-6"
	}, {
		en_name : "Spain",
		cn_name : "西班牙",
		IDN : "ES",
		phone_prefix : "34",
		lag : "-8"
	}, {
		en_name : "Sri Lanka",
		cn_name : "斯里兰卡",
		IDN : "LK",
		phone_prefix : "94",
		lag : "0"
	}, {
		en_name : "St.Lucia",
		cn_name : "圣卢西亚",
		IDN : "LC",
		phone_prefix : "1758",
		lag : "-12"
	}, {
		en_name : "St.Vincent",
		cn_name : "圣文森特",
		IDN : "VC",
		phone_prefix : "1784",
		lag : "-12"
	}, {
		en_name : "Sudan",
		cn_name : "苏丹",
		IDN : "SD",
		phone_prefix : "249",
		lag : "-6"
	}, {
		en_name : "Suriname",
		cn_name : "苏里南",
		IDN : "SR",
		phone_prefix : "597",
		lag : "-11.3"
	}, {
		en_name : "Swaziland",
		cn_name : "斯威士兰",
		IDN : "SZ",
		phone_prefix : "268",
		lag : "-6"
	}, {
		en_name : "Sweden",
		cn_name : "瑞典",
		IDN : "SE",
		phone_prefix : "46",
		lag : "-7"
	}, {
		en_name : "Switzerland",
		cn_name : "瑞士",
		IDN : "CH",
		phone_prefix : "41",
		lag : "-7"
	}, {
		en_name : "Syria",
		cn_name : "叙利亚",
		IDN : "SY",
		phone_prefix : "963",
		lag : "-6"
	}, {
		en_name : "Taiwan",
		cn_name : "台湾省",
		IDN : "TW",
		phone_prefix : "886",
		lag : "0"
	}, {
		en_name : "Tajikstan",
		cn_name : "塔吉克斯坦",
		IDN : "TJ",
		phone_prefix : "992",
		lag : "-5"
	}, {
		en_name : "Tanzania",
		cn_name : "坦桑尼亚",
		IDN : "TZ",
		phone_prefix : "255",
		lag : "-5"
	}, {
		en_name : "Thailand",
		cn_name : "泰国",
		IDN : "TH",
		phone_prefix : "66",
		lag : "-1"
	}, {
		en_name : "Togo",
		cn_name : "多哥",
		IDN : "TG",
		phone_prefix : "228",
		lag : "-8"
	}, {
		en_name : "Tonga",
		cn_name : "汤加",
		IDN : "TO",
		phone_prefix : "676",
		lag : "4"
	}, {
		en_name : "Trinidad and Tobago",
		cn_name : "特立尼达和多巴哥",
		IDN : "TT",
		phone_prefix : "1809",
		lag : "-12"
	}, {
		en_name : "Tunisia",
		cn_name : "突尼斯",
		IDN : "TN",
		phone_prefix : "216",
		lag : "-7"
	}, {
		en_name : "Turkey",
		cn_name : "土耳其",
		IDN : "TR",
		phone_prefix : "90",
		lag : "-6"
	}, {
		en_name : "Turkmenistan",
		cn_name : "土库曼斯坦",
		IDN : "TM",
		phone_prefix : "993",
		lag : "-5"
	}, {
		en_name : "Uganda",
		cn_name : "乌干达",
		IDN : "UG",
		phone_prefix : "256",
		lag : "-5"
	}, {
		en_name : "Ukraine",
		cn_name : "乌克兰",
		IDN : "UA",
		phone_prefix : "380",
		lag : "-5"
	}, {
		en_name : "United Arab Emirates",
		cn_name : "阿拉伯联合酋长国",
		IDN : "AE",
		phone_prefix : "971",
		lag : "-4"
	}, {
		en_name : "United Kiongdom",
		cn_name : "英国",
		IDN : "GB",
		phone_prefix : "44",
		lag : "-8"
	}, {
		en_name : "United States of America",
		cn_name : "美国",
		IDN : "US",
		phone_prefix : "1",
		lag : "-13"
	}, {
		en_name : "Uruguay",
		cn_name : "乌拉圭",
		IDN : "UY",
		phone_prefix : "598",
		lag : "-10.3"
	}, {
		en_name : "Uzbekistan",
		cn_name : "乌兹别克斯坦",
		IDN : "UZ",
		phone_prefix : "233",
		lag : "-5"
	}, {
		en_name : "Venezuela",
		cn_name : "委内瑞拉",
		IDN : "VE",
		phone_prefix : "58",
		lag : "-12.3"
	}, {
		en_name : "Vietnam",
		cn_name : "越南",
		IDN : "VN",
		phone_prefix : "84",
		lag : "-1"
	}, {
		en_name : "Yemen",
		cn_name : "也门",
		IDN : "YE",
		phone_prefix : "967",
		lag : "-5"
	}, {
		en_name : "Yugoslavia",
		cn_name : "南斯拉夫",
		IDN : "YU",
		phone_prefix : "381",
		lag : "-7"
	}, {
		en_name : "South Africa",
		cn_name : "南非",
		IDN : "ZA",
		phone_prefix : "27",
		lag : "2"
	}, {
		en_name : "Zimbabwe",
		cn_name : "津巴布韦",
		IDN : "ZW",
		phone_prefix : "263",
		lag : "-6"
	}, {
		en_name : "Zaire",
		cn_name : "扎伊尔",
		IDN : "ZR",
		phone_prefix : "243",
		lag : "-7"
	}, {
		en_name : "Zambia",
		cn_name : "赞比亚",
		IDN : "ZM",
		phone_prefix : "260",
		lag : "-6"
	} ];
	return Countries;
}

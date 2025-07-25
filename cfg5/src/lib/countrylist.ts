export interface countryInterface {
  id: number;
  name: string;
  code: string;
}

export class CountryList {
	list: any[];
constructor() {
  this.list = [
	{id:4, name:"Afghanistan", code:"AF"},
	{id:8, name:"Albania", code:"AL"},
	{id:12, name:"Algeria", code:"DZ"},
	{id:20, name:"Andorra",code:"AD"},
	{id:24, name:"Angola",code:"AO"},
	{id:28, name:"Antigua and Barbuda",code:"AG"},
	{id:32, name:"Argentina",code:"AR"},
	{id:51, name:"Armenia",code:"AM"},
	{id:36, name:"Australia",code:"AU"},
	{id:40, name:"Austria",code:"AT"},
	{id:31, name:"Azerbaijan",code:"AZ"},
	{id:44, name:"Bahamas",code:"BS"},
	{id:48, name:"Bahrain",code:"BH"},
	{id:50, name:"Bangladesh",code:"BD"},
	{id:52, name:"Barbados",code:"BB"},
	{id:112, name:"Belarus",code:"BY"},
	{id:56, name:"Belgium",code:"BE"},
	{id:84, name:"Belize",code:"BZ"},
	{id:204, name:"Benin",code:"BJ"},
	{id:64, name:"Bhutan",code:"BT"},
	{id:68, name:"Bolivia",code:"BO"},
	{id:70, name:"Bosnia and Herzegovina",code:"BA"},
	{id:72, name:"Botswana",code:"BW"},
	{id:76, name:"Brazil",code:"BR"},
	{id:96, name:"Brunei",code:"BN"},
	{id:100, name:"Bulgaria",code:"BG"},
	{id:108, name:"Burundi",code:"BI"},
	{id:116, name:"Cambodia",code:"KH"},
	{id:120, name:"Cameroon",code:"CM"},
	{id:124, name:"Canada",code:"CA"},
	{id:132, name:"Cape Verde",code:"CV"},
	{id:140, name:"Central African Republic",code:"CF"},
	{id:148, name:"Chad",code:"TD"},
	{id:152, name:"Chile",code:"CL"},
	{id:158, name:"China",code:"CN"},
	{id:170, name:"Colombia",code:"CO"},
	{id:174, name:"Comoros",code:"KM"},
	{id:178, name:"Republic of the Congo",code:"CG"},
	{id:180, name:"Democratic Republic of the Congo",code:"CD"},
	{id:188, name:"Costa Rica",code:"CR"},
	{id:191, name:"Croatia",code:"HR"},
	{id:192, name:"Cuba",code:"CU"},
	{id:196, name:"Cyprus",code:"CY"},
	{id:203, name:"Czech Republic",code:"CZ"},
	{id:208, name:"Denmark",code:"DK"},
	{id:262, name:"Djibouti",code:"DJ"},
	{id:212, name:"Dominica",code:"DM"},
	{id:214, name:"Dominican Republic",code:"DO"},
	{id:636, name:"East Timor",code:"TL"},
	{id:218, name:"Ecuador",code:"EC"},
	{id:818, name:"Egypt",code:"EG"},
	{id:222, name:"El Salvador",code:"SV"},
	{id:226, name:"Equatorial Guinea",code:"GQ"},
	{id:232, name:"Eritrea",code:"ER"},
	{id:233, name:"Estonia",code:"EE"},
	{id:231, name:"Ethiopia",code:"ET"},
	{id:242, name:"Fiji",code:"FJ"},
	{id:246, name:"Finland",code:"FI"},
	{id:250, name:"France",code:"FR"},
	{id:266, name:"Gabon",code:"GA"},
	{id:270, name:"Gambia",code:"GM"},
	{id:268, name:"Georgia",code:"GE"},
	{id:276, name:"Germany",code:"DE"},
	{id:288, name:"Ghana",code:"GH"},
	{id:300, name:"Greece",code:"GR"},
	{id:304, name:"Grennland", code:"GL"},
	{id:308, name:"Grenada",code:"GD"},
	{id:320, name:"Guatemala",code:"GT"},
	{id:324, name:"Guinea",code:"GN"},
	{id:624, name:"Guinea-Bissau",code:"GW"},
	{id:328, name:"Guyana",code:"GY"},
	{id:332, name:"Haiti",code:"HT"},
	{id:340, name:"Honduras",code:"HN"},
	{id:348, name:"Hungary",code:"HU"},
	{id:352, name:"Iceland",code:"IS"},
	{id:356, name:"India",code:"IN"},
	{id:360, name:"Indonesia",code:"ID"},
	{id:364, name:"Iran",code:"IR"},
	{id:368, name:"Iraq",code:"IQ"},
	{id:372, name:"Ireland",code:"IE"},
	{id:376, name:"Israel",code:"IL"},
	{id:380, name:"Italy",code:"IT"},
	{id:384, name:"Ivory Coast",code:"CI"},
	{id:388, name:"Jamaica",code:"JM"},
	{id:392, name:"Japan",code:"JP"},
	{id:400, name:"Jordan",code:"JO"},
	{id:398, name:"Kazakhstan",code:"KZ"},
	{id:404, name:"Kenya",code:"KE"},
	{id:296, name:"Kiribati",code:"KI"},
	{id:408, name:"North Korea",code:"KP"},
	{id:410, name:"South Korea",code:"KR"},
	{id:414, name:"Kuwait",code:"KW"},
	{id:417, name:"Kyrgyzstan",code:"KG"},
	{id:418, name:"Laos",code:"LA"},
	{id:428, name:"Latvia",code:"LV"},
	{id:422, name:"Lebanon",code:"LB"},
	{id:426, name:"Lesotho",code:"LS"},
	{id:430, name:"Liberia",code:"LR"},
	{id:434, name:"Libya",code:"LY"},
	{id:438, name:"Liechtenstein",code:"LI"},
	{id:440, name:"Lithuania",code:"LT"},
	{id:442, name:"Luxembourg",code:"LU"},
	{id:446, name:"Macao",code:"MO"},
	{id:450, name:"Madagascar",code:"MG"},
	{id:454, name:"Malawi",code:"MW"},
	{id:458, name:"Malaysia",code:"MY"},
	{id:462, name:"Maldives",code:"MV"},
	{id:466, name:"Mali",code:"ML"},
	{id:470, name:"Malta",code:"MT"},
	{id:584, name:"Marshall Islands",code:"MH"},
	{id:478, name:"Mauritania",code:"MR"},
	{id:480, name:"Mauritius",code:"MU"},
	{id:484, name:"Mexico",code:"MX"},
	{id:593, name:"Micronesia",code:"FM"},
	{id:498, name:"Moldova",code:"MD"},
	{id:492, name:"Monaco",code:"MC"},
	{id:496, name:"Mongolia",code:"MN"},
	{id:499, name:"Montenegro",code:"ME"},
	{id:504, name:"Morocco",code:"MA"},
	{id:508, name:"Mozambique",code:"MZ"},
	{id:104, name:"Myanmar",code:"MM"},
	{id:516, name:"Namibia",code:"NA"},
	{id:520, name:"Nauru",code:"NR"},
	{id:524, name:"Nepal",code:"NP"},
	{id:529, name:"Netherlands",code:"NL"},
	{id:554, name:"New Zealand",code:"NZ"},
	{id:558, name:"Nicaragua",code:"NI"},
	{id:562, name:"Niger",code:"NE"},
	{id:566, name:"Nigeria",code:"NG"},
	{id:578, name:"Norway",code:"NO"},
	{id:512, name:"Oman",code:"OM"},
	{id:586, name:"Pakistan",code:"PK"},
	{id:585, name:"Palau",code:"PW"},
	{id:591, name:"Panama",code:"PA"},
	{id:598, name:"Papua New Guinea",code:"PG"},
	{id:600, name:"Paraguay",code:"PY"},
	{id:604, name:"Peru",code:"PE"},
	{id:608, name:"Philippines",code:"PH"},
	{id:616, name:"Poland",code:"PL"},
	{id:620, name:"Portugal",code:"PT"},
	{id:634, name:"Qatar",code:"QA"},
	{id:642, name:"Romania",code:"RO"},
	{id:643, name:"Russia",code:"RU"},
	{id:646, name:"Rwanda",code:"RW"},
	{id:659, name:"Saint Kitts and Nevis",code:"KN"},
	{id:663, name:"Saint Lucia",code:"LC"},
	{id:670, name:"Saint Vincent and the Grenadines",code:"VC"},
	{id:882, name:"Samoa",code:"WS"},
	{id:674, name:"San Marino",code:"SM"},
	{id:678, name:"Sao Tome and Principe",code:"ST"},
	{id:682, name:"Saudi Arabia",code:"SA"},
	{id:686, name:"Senegal",code:"SN"},
	{id:688, name:"Serbia",code:"RS"},
	{id:690, name:"Seychelles",code:"SC"},
	{id:694, name:"Sierra Leone",code:"SL"},
	{id:702, name:"Singapore",code:"SG"},
	{id:703, name:"Slovakia",code:"SK"},
	{id:705, name:"Slovenia",code:"SI"},
	{id:90, name:"Solomon Islands",code:"SB"},
	{id:706, name:"Somalia",code:"SO"},
	{id:710, name:"South Africa",code:"ZA"},
	{id:728, name:"South Sudan",code:"SS"},
	{id:724, name:"Spain",code:"ES"},
	{id:144, name:"Sri Lanka",code:"LK"},
	{id:729, name:"Sudan",code:"SD"},
	{id:740, name:"Suriname",code:"SR"},
	{id:753, name:"Sweden",code:"SE"},
	{id:756, name:"Switzerland",code:"CH"},
	{id:760, name:"Syria",code:"SY"},
	{id:158, name:"Taiwan",code:"TW"},
	{id:762, name:"Tajikistan",code:"TJ"},
	{id:834, name:"Tanzania",code:"TZ"},
	{id:764, name:"Thailand",code:"TH"},
	{id:768, name:"Togo",code:"TG"},
	{id:776, name:"Tonga",code:"TO"},
	{id:780, name:"Trinidad and Tobago",code:"TT"},
	{id:788, name:"Tunisia",code:"TN"},
	{id:795, name:"Turkmenistan",code:"TM"},
	{id:798, name:"Tuvalu",code:"TV"},
	{id:800, name:"Uganda",code:"UG"},
	{id:804, name:"Ukraine",code:"UA"},
	{id:784, name:"United Arab Emirates",code:"AE"},
	{id:826, name:"United Kingdom",code:"GB"},
	{id:840, name:"United States",code:"US"},
	{id:858, name:"Uruguay",code:"UY"},
	{id:860, name:"Uzbekistan",code:"UZ"},
	{id:548, name:"Vanuatu",code:"VU"},
	{id:862, name:"Venezuela",code:"VE"},
	{id:704, name:"Vietnam",code:"VN"},
	{id:887, name:"Yemen",code:"YE"},
	{id:894, name:"Zambia",code:"ZM"},
	{id:716, name:"Zimbabwe",code:"ZW"}
  ];
}

}

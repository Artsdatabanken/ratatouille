import React from 'react';
import { storiesOf } from '@storybook/react';
import FilterTree from './FilterTree'
import {muiTheme} from 'storybook-addon-material-ui';
import {action} from "@storybook/addon-actions/dist/index";

const dummyNatureAreas = [{"id":"1","name":"Østfold","count":7116,"children":[{"id":"101","name":"Halden","count":194,"children":[]},{"id":"104","name":"Moss","count":877,"children":[]},{"id":"105","name":"Sarpsborg","count":127,"children":[]},{"id":"106","name":"Fredrikstad","count":1691,"children":[]},{"id":"111","name":"Hvaler","count":3450,"children":[]},{"id":"118","name":"Aremark","count":127,"children":[]},{"id":"119","name":"Marker","count":79,"children":[]},{"id":"122","name":"Trøgstad","count":67,"children":[]},{"id":"125","name":"Eidsberg","count":25,"children":[]},{"id":"127","name":"Skiptvet","count":20,"children":[]},{"id":"128","name":"Rakkestad","count":1,"children":[]},{"id":"135","name":"Råde","count":180,"children":[]},{"id":"136","name":"Rygge","count":292,"children":[]}]},{"id":"2","name":"Akershus","count":1791,"children":[{"id":"211","name":"Vestby","count":20,"children":[]},{"id":"213","name":"Ski","count":70,"children":[]},{"id":"214","name":"Ås","count":33,"children":[]},{"id":"215","name":"Frogn","count":114,"children":[]},{"id":"216","name":"Nesodden","count":6,"children":[]},{"id":"219","name":"Bærum","count":351,"children":[]},{"id":"220","name":"Asker","count":595,"children":[]},{"id":"221","name":"Aurskog-Høland","count":1,"children":[]},{"id":"227","name":"Fet","count":155,"children":[]},{"id":"231","name":"Skedsmo","count":230,"children":[]},{"id":"233","name":"Nittedal","count":71,"children":[]},{"id":"234","name":"Gjerdrum","count":30,"children":[]},{"id":"236","name":"Nes","count":10,"children":[]},{"id":"237","name":"Eidsvoll","count":28,"children":[]},{"id":"239","name":"Hurdal","count":130,"children":[]}]},{"id":"3","name":"Oslo","count":208,"children":[{"id":"301","name":"Oslo","count":208,"children":[]}]},{"id":"4","name":"Hedmark","count":2133,"children":[{"id":"403","name":"Hamar","count":313,"children":[]},{"id":"412","name":"Ringsaker","count":327,"children":[]},{"id":"415","name":"Løten","count":75,"children":[]},{"id":"417","name":"Stange","count":114,"children":[]},{"id":"419","name":"Sør-Odal","count":98,"children":[]},{"id":"423","name":"Grue","count":68,"children":[]},{"id":"425","name":"Åsnes","count":57,"children":[]},{"id":"427","name":"Elverum","count":245,"children":[]},{"id":"428","name":"Trysil","count":484,"children":[]},{"id":"430","name":"Stor-Elvdal","count":54,"children":[]},{"id":"434","name":"Engerdal","count":75,"children":[]},{"id":"439","name":"Folldal","count":270,"children":[]}]},{"id":"5","name":"Oppland","count":9436,"children":[{"id":"501","name":"Lillehammer","count":169,"children":[]},{"id":"502","name":"Gjøvik","count":88,"children":[]},{"id":"511","name":"Dovre","count":1422,"children":[]},{"id":"514","name":"Lom","count":97,"children":[]},{"id":"515","name":"Vågå","count":169,"children":[]},{"id":"516","name":"Nord-Fron","count":22,"children":[]},{"id":"517","name":"Sel","count":148,"children":[]},{"id":"519","name":"Sør-Fron","count":100,"children":[]},{"id":"520","name":"Ringebu","count":231,"children":[]},{"id":"521","name":"Øyer","count":13,"children":[]},{"id":"522","name":"Gausdal","count":357,"children":[]},{"id":"528","name":"Østre Toten","count":246,"children":[]},{"id":"529","name":"Vestre Toten","count":42,"children":[]},{"id":"532","name":"Jevnaker","count":8,"children":[]},{"id":"533","name":"Lunner","count":2,"children":[]},{"id":"534","name":"Gran","count":1419,"children":[]},{"id":"536","name":"Søndre Land","count":102,"children":[]},{"id":"538","name":"Nordre Land","count":932,"children":[]},{"id":"541","name":"Etnedal","count":1049,"children":[]},{"id":"542","name":"Nord-Aurdal","count":2449,"children":[]},{"id":"543","name":"Vestre Slidre","count":184,"children":[]},{"id":"545","name":"Vang","count":389,"children":[]}]},{"id":"6","name":"Buskerud","count":1684,"children":[{"id":"602","name":"Drammen","count":2,"children":[]},{"id":"605","name":"Ringerike","count":568,"children":[]},{"id":"612","name":"Hole","count":154,"children":[]},{"id":"616","name":"Nes","count":48,"children":[]},{"id":"624","name":"Øvre Eiker","count":50,"children":[]},{"id":"625","name":"Nedre Eiker","count":46,"children":[]},{"id":"626","name":"Lier","count":160,"children":[]},{"id":"627","name":"Røyken","count":279,"children":[]},{"id":"628","name":"Hurum","count":400,"children":[]}]},{"id":"7","name":"Vestfold","count":1524,"children":[{"id":"702","name":"Holmestrand","count":38,"children":[]},{"id":"704","name":"Tønsberg","count":11,"children":[]},{"id":"706","name":"Sandefjord","count":46,"children":[]},{"id":"709","name":"Larvik","count":1095,"children":[]},{"id":"713","name":"Sande","count":22,"children":[]},{"id":"716","name":"Re","count":12,"children":[]},{"id":"719","name":"Andebu","count":25,"children":[]},{"id":"720","name":"Stokke","count":26,"children":[]},{"id":"723","name":"Tjøme","count":261,"children":[]}]},{"id":"8","name":"Telemark","count":1902,"children":[{"id":"805","name":"Porsgrunn","count":291,"children":[]},{"id":"806","name":"Skien","count":228,"children":[]},{"id":"811","name":"Siljan","count":179,"children":[]},{"id":"814","name":"Bamble","count":429,"children":[]},{"id":"815","name":"Kragerø","count":322,"children":[]},{"id":"819","name":"Nome","count":138,"children":[]},{"id":"822","name":"Sauherad","count":321,"children":[]}]},{"id":"9","name":"Aust-Agder","count":3019,"children":[{"id":"901","name":"Risør","count":4,"children":[]},{"id":"904","name":"Grimstad","count":1010,"children":[]},{"id":"906","name":"Arendal","count":1710,"children":[]},{"id":"914","name":"Tvedestrand","count":244,"children":[]},{"id":"926","name":"Lillesand","count":23,"children":[]},{"id":"928","name":"Birkenes","count":32,"children":[]}]},{"id":"10","name":"Vest-Agder","count":4761,"children":[{"id":"1001","name":"Kristiansand","count":443,"children":[]},{"id":"1002","name":"Mandal","count":611,"children":[]},{"id":"1003","name":"Farsund","count":1749,"children":[]},{"id":"1004","name":"Flekkefjord","count":25,"children":[]},{"id":"1014","name":"Vennesla","count":795,"children":[]},{"id":"1017","name":"Songdalen","count":230,"children":[]},{"id":"1018","name":"Søgne","count":508,"children":[]},{"id":"1029","name":"Lindesnes","count":304,"children":[]},{"id":"1032","name":"Lyngdal","count":56,"children":[]},{"id":"1037","name":"Kvinesdal","count":58,"children":[]}]},{"id":"11","name":"Rogaland","count":5386,"children":[{"id":"1101","name":"Eigersund","count":956,"children":[]},{"id":"1102","name":"Sandnes","count":97,"children":[]},{"id":"1103","name":"Stavanger","count":6,"children":[]},{"id":"1106","name":"Haugesund","count":19,"children":[]},{"id":"1111","name":"Sokndal","count":179,"children":[]},{"id":"1112","name":"Lund","count":66,"children":[]},{"id":"1114","name":"Bjerkreim","count":29,"children":[]},{"id":"1119","name":"Hå","count":494,"children":[]},{"id":"1120","name":"Klepp","count":436,"children":[]},{"id":"1121","name":"Time","count":378,"children":[]},{"id":"1122","name":"Gjesdal","count":114,"children":[]},{"id":"1124","name":"Sola","count":222,"children":[]},{"id":"1130","name":"Strand","count":189,"children":[]},{"id":"1133","name":"Hjelmeland","count":197,"children":[]},{"id":"1134","name":"Suldal","count":66,"children":[]},{"id":"1135","name":"Sauda","count":103,"children":[]},{"id":"1141","name":"Finnøy","count":297,"children":[]},{"id":"1142","name":"Rennesøy","count":377,"children":[]},{"id":"1146","name":"Tysvær","count":182,"children":[]},{"id":"1149","name":"Karmøy","count":984,"children":[]},{"id":"1160","name":"Vindafjord","count":58,"children":[]}]},{"id":"12","name":"Hordaland","count":4355,"children":[{"id":"1201","name":"Bergen","count":247,"children":[]},{"id":"1211","name":"Etne","count":18,"children":[]},{"id":"1216","name":"Sveio","count":343,"children":[]},{"id":"1219","name":"Bømlo","count":469,"children":[]},{"id":"1221","name":"Stord","count":116,"children":[]},{"id":"1222","name":"Fitjar","count":42,"children":[]},{"id":"1224","name":"Kvinnherad","count":1165,"children":[]},{"id":"1233","name":"Ulvik","count":7,"children":[]},{"id":"1234","name":"Granvin","count":41,"children":[]},{"id":"1235","name":"Voss","count":356,"children":[]},{"id":"1238","name":"Kvam","count":373,"children":[]},{"id":"1241","name":"Fusa","count":77,"children":[]},{"id":"1243","name":"Os","count":24,"children":[]},{"id":"1244","name":"Austevoll","count":357,"children":[]},{"id":"1247","name":"Askøy","count":112,"children":[]},{"id":"1251","name":"Vaksdal","count":43,"children":[]},{"id":"1253","name":"Osterøy","count":92,"children":[]},{"id":"1259","name":"Øygarden","count":277,"children":[]},{"id":"1263","name":"Lindås","count":89,"children":[]},{"id":"1265","name":"Fedje","count":148,"children":[]}]},{"id":"14","name":"Sogn og Fjordane","count":1290,"children":[{"id":"1401","name":"Flora","count":299,"children":[]},{"id":"1411","name":"Gulen","count":392,"children":[]},{"id":"1416","name":"Høyanger","count":109,"children":[]},{"id":"1418","name":"Balestrand","count":43,"children":[]},{"id":"1420","name":"Sogndal","count":29,"children":[]},{"id":"1424","name":"Årdal","count":129,"children":[]},{"id":"1428","name":"Askvoll","count":25,"children":[]},{"id":"1430","name":"Gaular","count":110,"children":[]},{"id":"1432","name":"Førde","count":50,"children":[]},{"id":"1433","name":"Naustdal","count":113,"children":[]}]},{"id":"15","name":"Møre og Romsdal","count":5500,"children":[{"id":"1502","name":"Molde","count":171,"children":[]},{"id":"1504","name":"Ålesund","count":39,"children":[]},{"id":"1505","name":"Kristiansund","count":75,"children":[]},{"id":"1514","name":"Sande","count":165,"children":[]},{"id":"1515","name":"Herøy","count":802,"children":[]},{"id":"1517","name":"Hareid","count":244,"children":[]},{"id":"1520","name":"Ørsta","count":143,"children":[]},{"id":"1531","name":"Sula","count":691,"children":[]},{"id":"1532","name":"Giske","count":409,"children":[]},{"id":"1534","name":"Haram","count":345,"children":[]},{"id":"1535","name":"Vestnes","count":21,"children":[]},{"id":"1545","name":"Midsund","count":79,"children":[]},{"id":"1546","name":"Sandøy","count":173,"children":[]},{"id":"1547","name":"Aukra","count":195,"children":[]},{"id":"1548","name":"Fræna","count":504,"children":[]},{"id":"1551","name":"Eide","count":113,"children":[]},{"id":"1554","name":"Averøy","count":49,"children":[]},{"id":"1557","name":"Gjemnes","count":320,"children":[]},{"id":"1560","name":"Tingvoll","count":60,"children":[]},{"id":"1563","name":"Sunndal","count":248,"children":[]},{"id":"1566","name":"Surnadal","count":138,"children":[]},{"id":"1571","name":"Halsa","count":65,"children":[]},{"id":"1573","name":"Smøla","count":358,"children":[]},{"id":"1576","name":"Aure","count":107,"children":[]}]},{"id":"16","name":"Sør-Trøndelag","count":2299,"children":[{"id":"1601","name":"Trondheim","count":932,"children":[]},{"id":"1612","name":"Hemne","count":191,"children":[]},{"id":"1617","name":"Hitra","count":24,"children":[]},{"id":"1620","name":"Frøya","count":44,"children":[]},{"id":"1621","name":"Ørland","count":265,"children":[]},{"id":"1622","name":"Agdenes","count":92,"children":[]},{"id":"1624","name":"Rissa","count":39,"children":[]},{"id":"1627","name":"Bjugn","count":20,"children":[]},{"id":"1638","name":"Orkdal","count":310,"children":[]},{"id":"1640","name":"Røros","count":44,"children":[]},{"id":"1653","name":"Melhus","count":216,"children":[]},{"id":"1662","name":"Klæbu","count":31,"children":[]},{"id":"1663","name":"Malvik","count":109,"children":[]},{"id":"1665","name":"Tydal","count":53,"children":[]}]},{"id":"17","name":"Nord-Trøndelag","count":5201,"children":[{"id":"1702","name":"Steinkjer","count":272,"children":[]},{"id":"1703","name":"Namsos","count":128,"children":[]},{"id":"1714","name":"Stjørdal","count":147,"children":[]},{"id":"1717","name":"Frosta","count":82,"children":[]},{"id":"1718","name":"Leksvik","count":48,"children":[]},{"id":"1719","name":"Levanger","count":908,"children":[]},{"id":"1721","name":"Verdal","count":202,"children":[]},{"id":"1725","name":"Namdalseid","count":196,"children":[]},{"id":"1736","name":"Snåsa","count":142,"children":[]},{"id":"1738","name":"Lierne","count":75,"children":[]},{"id":"1742","name":"Grong","count":400,"children":[]},{"id":"1743","name":"Høylandet","count":148,"children":[]},{"id":"1744","name":"Overhalla","count":74,"children":[]},{"id":"1749","name":"Flatanger","count":236,"children":[]},{"id":"1750","name":"Vikna","count":1838,"children":[]},{"id":"1751","name":"Nærøy","count":168,"children":[]},{"id":"1755","name":"Leka","count":146,"children":[]},{"id":"1756","name":"Inderøy","count":35,"children":[]}]},{"id":"18","name":"Nordland","count":13312,"children":[{"id":"1804","name":"Bodø","count":858,"children":[]},{"id":"1820","name":"Alstahaug","count":15,"children":[]},{"id":"1825","name":"Grane","count":399,"children":[]},{"id":"1827","name":"Dønna","count":212,"children":[]},{"id":"1833","name":"Rana","count":81,"children":[]},{"id":"1838","name":"Gildeskål","count":182,"children":[]},{"id":"1839","name":"Beiarn","count":40,"children":[]},{"id":"1840","name":"Saltdal","count":36,"children":[]},{"id":"1841","name":"Fauske","count":6,"children":[]},{"id":"1849","name":"Hamarøy","count":657,"children":[]},{"id":"1853","name":"Evenes","count":573,"children":[]},{"id":"1859","name":"Flakstad","count":352,"children":[]},{"id":"1860","name":"Vestvågøy","count":231,"children":[]},{"id":"1865","name":"Vågan","count":397,"children":[]},{"id":"1866","name":"Hadsel","count":518,"children":[]},{"id":"1868","name":"Øksnes","count":854,"children":[]},{"id":"1870","name":"Sortland","count":4274,"children":[]},{"id":"1871","name":"Andøy","count":3071,"children":[]},{"id":"1874","name":"Moskenes","count":576,"children":[]}]},{"id":"19","name":"Troms","count":2821,"children":[{"id":"1902","name":"Tromsø","count":765,"children":[]},{"id":"1913","name":"Skånland","count":185,"children":[]},{"id":"1917","name":"Ibestad","count":111,"children":[]},{"id":"1922","name":"Bardu","count":99,"children":[]},{"id":"1924","name":"Målselv","count":90,"children":[]},{"id":"1928","name":"Torsken","count":14,"children":[]},{"id":"1929","name":"Berg","count":472,"children":[]},{"id":"1931","name":"Lenvik","count":56,"children":[]},{"id":"1933","name":"Balsfjord","count":583,"children":[]},{"id":"1938","name":"Lyngen","count":132,"children":[]},{"id":"1939","name":"Storfjord","count":214,"children":[]},{"id":"1942","name":"Nordreisa","count":102,"children":[]}]},{"id":"20","name":"Finnmark","count":5851,"children":[{"id":"2002","name":"Vardø","count":2864,"children":[]},{"id":"2003","name":"Vadsø","count":197,"children":[]},{"id":"2012","name":"Alta","count":386,"children":[]},{"id":"2017","name":"Kvalsund","count":49,"children":[]},{"id":"2020","name":"Porsanger","count":446,"children":[]},{"id":"2022","name":"Lebesby","count":222,"children":[]},{"id":"2023","name":"Gamvik","count":36,"children":[]},{"id":"2025","name":"Tana","count":559,"children":[]},{"id":"2027","name":"Nesseby","count":630,"children":[]},{"id":"2028","name":"Båtsfjord","count":514,"children":[]}]}];

const dummyRedlistTheme = [{"id":"3","code":null,"name":"Fjæresone","count":224,"children":[{"id":"22","code":null,"name":"Sanddynemark","count":224,"children":null}]},{"id":"2","code":null,"name":"Fjell, rasmark og annen grunnlendt mark","count":1012,"children":[{"id":"15","code":null,"name":"Åpen flomfastmark","count":981,"children":null},{"id":"16","code":null,"name":"Fosseberg og fosse-eng","count":9,"children":null},{"id":"13","code":null,"name":"Isinnfrysingsmark","count":22,"children":null}]},{"id":"4","code":null,"name":"Høgarktiske terrestriske områder","count":278,"children":[{"id":"29","code":null,"name":"Arktisk permafrost-våtmark","count":278,"children":null}]},{"id":"5","code":null,"name":"Kulturmark og boreal hei","count":11217,"children":[{"id":"30","code":null,"name":"Boreal hei","count":2803,"children":null},{"id":"31","code":null,"name":"Kulturmarkseng","count":5929,"children":null},{"id":"33","code":null,"name":"Kystlynghei","count":2222,"children":null},{"id":"32","code":null,"name":"Slåtteeng","count":263,"children":null}]},{"id":"7","code":null,"name":"Marine gruntvannsområder","count":1,"children":[{"id":"42","code":null,"name":"Tareskogsbunn","count":1,"children":null}]},{"id":"8","code":null,"name":"Skog","count":3392,"children":[{"id":"49","code":null,"name":"Beiteskog","count":701,"children":null},{"id":"47","code":null,"name":"Fjæresone-skogsmark","count":1725,"children":null},{"id":"51","code":null,"name":"Høgstaude-grankalkskog","count":169,"children":null},{"id":"62","code":null,"name":"Høgstaudegranskog","count":169,"children":null},{"id":"60","code":null,"name":"Kalkrik bøkeskog","count":4,"children":null},{"id":"57","code":null,"name":"Kalkrik lavfuruskog","count":38,"children":null},{"id":"52","code":null,"name":"Lågurt-eikeskog","count":257,"children":null},{"id":"61","code":null,"name":"Lågurt-grankalkskog","count":83,"children":null},{"id":"55","code":null,"name":"Lågurt-lyngfurukalkskog","count":100,"children":null},{"id":"53","code":null,"name":"Lågurt-lyngfuruskog","count":117,"children":null},{"id":"58","code":null,"name":"Lav-furukalkskog","count":29,"children":null}]},{"id":"9","code":null,"name":"Våtmark","count":3900,"children":[{"id":"80","code":null,"name":"Arktisk-alpin grunn våtmark","count":168,"children":null},{"id":"77","code":null,"name":"Flommyr, myrkant og myrskogsmark","count":3608,"children":null},{"id":"69","code":null,"name":"Svak kilde og kildeskogsmark","count":124,"children":null}]}];

const dummyRedlistCategories = [{"id":"3","code":null,"name":"EN","count":2485,"children":null},{"id":"4","code":null,"name":"VU","count":6240,"children":null},{"id":"5","code":null,"name":"NT","count":8474,"children":null},{"id":"6","code":null,"name":"DD","count":2825,"children":null}];

storiesOf('FilterTree', module)
    .addDecorator(muiTheme())
    .add('default', () => <div>
            <span>Dummy-tre, ignorerer checkbox-klikk </span>
            <FilterTree
                natureAreas={dummyNatureAreas}
                redlistTheme={dummyRedlistTheme}
                redlistCategories={dummyRedlistCategories}
                handleCheckChange={action('change')}
                isSelected={action('selection')}
            />
    </div>
    );


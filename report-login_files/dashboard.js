/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "HTTP请求--Richard-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--xiaoli-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--houming-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--houses-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--linedog-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--blibli-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--post123-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--小明-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--jfiaowe-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--resgrgrae-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--susan-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--control-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--jason-12345"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--isee123-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--li-12345"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--normal-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--jfowefwei-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--balloon-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--pigger-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--apple1235-12345"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--jason1-111111"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--xaioewjf-123456"], "isController": false}, {"data": [1.0, 500, 1500, "JDBC Request"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--butterfly-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--jojo-12345"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--myears-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--erfreqqq-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--Ryan-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--blackcat-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--also-12345"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--cwewsfaw-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--q1231231-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--wwwww-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--chenchen-1232"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--pingktree-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--zhang-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--ross123-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--channel-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--flower-111"], "isController": false}, {"data": [1.0, 500, 1500, "调试取样器"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--jenifer-36777"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--aaa111-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--vwavaea-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--june-349590"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--小刚-123456"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP请求--Monica-123456"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 14400, 0, 0.0, 4.903819444444447, 0, 277, 5.0, 6.0, 7.0, 9.0, 24.01817375147195, 10.280834177548511, 12.472911143390164], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP请求--Richard-123456", 276, 0, 0.0, 5.329710144927538, 4, 22, 5.0, 6.0, 7.0, 12.460000000000036, 0.460820260062912, 0.1831580525835988, 0.28796700835821093], "isController": false}, {"data": ["HTTP请求--xiaoli-123456", 282, 0, 0.0, 5.262411347517728, 4, 9, 5.0, 6.0, 7.0, 8.0, 0.47319247187692964, 0.19084813563005074, 0.2951553774465058], "isController": false}, {"data": ["HTTP请求--houming-123456", 255, 0, 0.0, 5.223529411764712, 4, 15, 5.0, 6.0, 6.0, 12.199999999999989, 0.4325619030009618, 0.18713371389592393, 0.2701871895732226], "isController": false}, {"data": ["HTTP请求--houses-123456", 288, 0, 0.0, 5.211805555555557, 4, 8, 5.0, 6.0, 7.0, 8.0, 0.48446922863415004, 0.20769725719764828, 0.30201788583011613], "isController": false}, {"data": ["HTTP请求--linedog-123456", 289, 0, 0.0, 5.335640138408299, 4, 16, 5.0, 6.0, 7.0, 9.70000000000016, 0.48525105445557853, 0.20945406842711495, 0.3030966211037195], "isController": false}, {"data": ["HTTP请求--blibli-123456", 277, 0, 0.0, 5.306859205776172, 4, 12, 5.0, 6.0, 7.0, 9.43999999999994, 0.4623517177951999, 0.19911826908953434, 0.28792987130097764], "isController": false}, {"data": ["HTTP请求--post123-123456", 270, 0, 0.0, 5.251851851851849, 4, 12, 5.0, 6.0, 7.0, 8.0, 0.4526639272116405, 0.19406197660733415, 0.2818769447783539], "isController": false}, {"data": ["HTTP请求--小明-123456", 271, 0, 0.0, 5.295202952029522, 4, 12, 5.0, 6.0, 6.0, 9.0, 0.4581394130067639, 0.1803029135173104, 0.2852045958060802], "isController": false}, {"data": ["HTTP请求--jfiaowe-123456", 254, 0, 0.0, 5.33858267716535, 4, 12, 5.0, 6.0, 6.0, 8.0, 0.42688358178854136, 0.18342653904976386, 0.26643788024571013], "isController": false}, {"data": ["HTTP请求--resgrgrae-123456", 279, 0, 0.0, 5.229390681003588, 4, 8, 5.0, 6.0, 7.0, 7.199999999999989, 0.46735155725224087, 0.20309711228246796, 0.2924660578603004], "isController": false}, {"data": ["HTTP请求--susan-123456", 293, 0, 0.0, 5.194539249146757, 4, 7, 5.0, 6.0, 6.0, 7.0, 0.4949232362236513, 0.2121790045919755, 0.3071842335910988], "isController": false}, {"data": ["HTTP请求--control-123456", 255, 0, 0.0, 5.282352941176473, 4, 9, 5.0, 6.0, 7.0, 8.439999999999998, 0.42827199806521826, 0.18485959291486959, 0.2665825894206739], "isController": false}, {"data": ["HTTP请求--jason-12345", 284, 0, 0.0, 5.235915492957748, 4, 15, 5.0, 6.0, 6.0, 10.149999999999977, 0.4777348638792071, 0.2015443956990405, 0.2963830193011614], "isController": false}, {"data": ["HTTP请求--isee123-123456", 264, 0, 0.0, 5.185606060606064, 4, 9, 5.0, 6.0, 6.0, 7.0, 0.44629800873324055, 0.1926403514258714, 0.2781900481460882], "isController": false}, {"data": ["HTTP请求--li-12345", 271, 0, 0.0, 5.151291512915128, 4, 10, 5.0, 6.0, 6.0, 7.279999999999973, 0.4577470736280256, 0.18283061827525632, 0.2833850665295678], "isController": false}, {"data": ["HTTP请求--normal-123456", 263, 0, 0.0, 5.182509505703423, 4, 8, 5.0, 6.0, 6.0, 7.0, 0.4401975700424632, 0.1895772738171155, 0.2746494686246253], "isController": false}, {"data": ["HTTP请求--jfowefwei-123456", 265, 0, 0.0, 5.260377358490564, 4, 9, 5.0, 6.0, 6.0, 8.0, 0.4472687072246555, 0.19436970187008953, 0.2796566711604513], "isController": false}, {"data": ["HTTP请求--balloon-123456", 260, 0, 0.0, 5.261538461538462, 4, 12, 5.0, 6.0, 6.949999999999989, 9.389999999999986, 0.4347411701560219, 0.18765195039937665, 0.2706420541854706], "isController": false}, {"data": ["HTTP请求--pigger-123456", 279, 0, 0.0, 5.372759856630828, 4, 46, 5.0, 6.0, 6.0, 8.199999999999989, 0.46607196552069763, 0.18752114237746817, 0.29073705460058136], "isController": false}, {"data": ["HTTP请求--apple1235-12345", 276, 0, 0.0, 5.311594202898551, 4, 15, 5.0, 6.0, 7.0, 10.460000000000036, 0.4619123169923483, 0.197575776213524, 0.2889763098394018], "isController": false}, {"data": ["HTTP请求--jason1-111111", 258, 0, 0.0, 5.135658914728675, 4, 8, 5.0, 6.0, 6.0, 8.0, 0.43144606338912583, 0.18454431226995813, 0.268464909053511], "isController": false}, {"data": ["HTTP请求--xaioewjf-123456", 267, 0, 0.0, 5.224719101123598, 4, 14, 5.0, 6.0, 6.0, 7.319999999999993, 0.45372667640961156, 0.1954037737271862, 0.28364555364850624], "isController": false}, {"data": ["JDBC Request", 1200, 0, 0.0, 6.030000000000004, 3, 277, 5.0, 8.0, 9.0, 14.0, 2.0016880902894774, 0.3138095679439661, 0.0], "isController": false}, {"data": ["HTTP请求--butterfly-123456", 253, 0, 0.0, 5.39920948616601, 4, 45, 5.0, 6.0, 7.0, 9.840000000000032, 0.4254582084005294, 0.18447602004866703, 0.2662020565985541], "isController": false}, {"data": ["HTTP请求--jojo-12345", 271, 0, 0.0, 5.184501845018449, 4, 11, 5.0, 6.0, 7.0, 8.0, 0.45424602702344813, 0.1920786422862823, 0.2807101768919515], "isController": false}, {"data": ["HTTP请求--myears-123456", 283, 0, 0.0, 5.187279151943462, 4, 10, 5.0, 6.0, 6.0, 8.160000000000025, 0.4732868854378155, 0.19088621453693141, 0.2954156029557853], "isController": false}, {"data": ["HTTP请求--erfreqqq-123456", 290, 0, 0.0, 5.334482758620693, 4, 13, 5.0, 6.0, 7.0, 8.449999999999875, 0.4858150384882776, 0.21064636434452663, 0.3034249960213424], "isController": false}, {"data": ["HTTP请求--Ryan-123456", 290, 0, 0.0, 5.293103448275866, 4, 13, 5.0, 6.0, 6.449999999999989, 10.0, 0.4870078072389512, 0.19689573456731038, 0.30196583220397905], "isController": false}, {"data": ["HTTP请求--blackcat-123456", 264, 0, 0.0, 5.386363636363635, 4, 42, 5.0, 6.0, 6.0, 10.400000000000091, 0.4459715591773852, 0.1929349616363102, 0.279068761972816], "isController": false}, {"data": ["HTTP请求--also-12345", 266, 0, 0.0, 5.240601503759397, 4, 14, 5.0, 6.0, 6.0, 8.329999999999984, 0.4455089018038086, 0.18925426980923507, 0.27656213362754783], "isController": false}, {"data": ["HTTP请求--cwewsfaw-123456", 281, 0, 0.0, 5.24199288256228, 4, 9, 5.0, 6.0, 6.899999999999977, 8.0, 0.4706733644100587, 0.20408102909967385, 0.29474663200545376], "isController": false}, {"data": ["HTTP请求--q1231231-123456", 251, 0, 0.0, 5.278884462151393, 4, 9, 5.0, 6.0, 7.0, 8.47999999999999, 0.42009563452014537, 0.1817405918871332, 0.2628997394068116], "isController": false}, {"data": ["HTTP请求--wwwww-123456", 273, 0, 0.0, 5.282051282051287, 4, 12, 5.0, 6.0, 6.300000000000011, 9.0, 0.45651486850532347, 0.194821286657057, 0.28416071340481497], "isController": false}, {"data": ["HTTP请求--chenchen-1232", 297, 0, 0.0, 5.286195286195291, 4, 11, 5.0, 6.0, 7.0, 8.0, 0.4979111203503149, 0.19838646201457857, 0.3102678084953361], "isController": false}, {"data": ["HTTP请求--pingktree-123456", 275, 0, 0.0, 5.221818181818181, 4, 12, 5.0, 6.0, 6.199999999999989, 8.240000000000009, 0.46258059415533626, 0.19921683791260086, 0.2894069122787393], "isController": false}, {"data": ["HTTP请求--zhang-123456", 254, 0, 0.0, 5.255905511811024, 4, 9, 5.0, 6.0, 7.0, 8.449999999999989, 0.42801510522599706, 0.16802936748129962, 0.26607776499443075], "isController": false}, {"data": ["HTTP请求--ross123-123456", 257, 0, 0.0, 5.233463035019455, 4, 16, 5.0, 6.0, 6.0, 11.259999999999962, 0.4311972014127161, 0.17180513493787908, 0.26851352052800687], "isController": false}, {"data": ["HTTP请求--channel-123456", 274, 0, 0.0, 5.361313868613139, 4, 32, 5.0, 6.0, 6.0, 8.0, 0.46169374202777913, 0.19793315698261235, 0.2878444325885011], "isController": false}, {"data": ["HTTP请求--flower-111", 286, 0, 0.0, 5.3216783216783226, 4, 10, 5.0, 6.0, 7.0, 9.0, 0.481020705754925, 0.19071719388330036, 0.2979804225834176], "isController": false}, {"data": ["调试取样器", 1200, 0, 0.0, 0.15, 0, 3, 0.0, 1.0, 1.0, 1.0, 2.0030880941451406, 1.5638888599090264, 0.0], "isController": false}, {"data": ["HTTP请求--jenifer-36777", 273, 0, 0.0, 5.135531135531132, 4, 9, 5.0, 6.0, 6.0, 7.259999999999991, 0.46947630176492133, 0.18522307218069162, 0.292928948502061], "isController": false}, {"data": ["HTTP请求--aaa111-123456", 285, 0, 0.0, 5.256140350877197, 4, 10, 5.0, 6.0, 7.0, 8.139999999999986, 0.47570404198213356, 0.20533318999619438, 0.2960664335299577], "isController": false}, {"data": ["HTTP请求--vwavaea-123456", 276, 0, 0.0, 5.253623188405793, 4, 16, 5.0, 6.0, 6.0, 8.230000000000018, 0.46115211169237813, 0.1995023295700425, 0.2878480466198052], "isController": false}, {"data": ["HTTP请求--june-349590", 285, 0, 0.0, 5.305263157894732, 4, 18, 5.0, 6.0, 7.0, 10.419999999999959, 0.47659420762450394, 0.18803130847685506, 0.29585944149847904], "isController": false}, {"data": ["HTTP请求--小刚-123456", 267, 0, 0.0, 5.378277153558055, 4, 29, 5.0, 6.0, 6.599999999999994, 11.639999999999986, 0.44984407090351264, 0.17791684444914319, 0.2802805238998617], "isController": false}, {"data": ["HTTP请求--Monica-123456", 273, 0, 0.0, 5.304029304029303, 4, 9, 5.0, 6.0, 6.0, 8.0, 0.457563116055102, 0.19660915142992663, 0.2849654219301789], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 14400, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

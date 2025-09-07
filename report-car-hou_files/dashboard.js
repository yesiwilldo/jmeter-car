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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.942266380236305, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "/login-1"], "isController": false}, {"data": [1.0, 500, 1500, "/favicon.ico-118"], "isController": false}, {"data": [1.0, 500, 1500, "/ccompany/getByTitle-106"], "isController": false}, {"data": [0.8319838056680162, 500, 1500, "公司"], "isController": true}, {"data": [1.0, 500, 1500, "/ccompany/getByTitle-101"], "isController": false}, {"data": [1.0, 500, 1500, "/corders/getNumsByKind-130"], "isController": false}, {"data": [1.0, 500, 1500, "/main-119"], "isController": false}, {"data": [1.0, 500, 1500, "查询用户名"], "isController": true}, {"data": [1.0, 500, 1500, "/favicon.ico-4"], "isController": false}, {"data": [0.6184738955823293, 500, 1500, "/th/id/OIP-C.jWA9VQ3YZxyTd_kf1tsR_wAAAA-129"], "isController": false}, {"data": [1.0, 500, 1500, "/ccompany/getByTitle-107--易卡租车"], "isController": false}, {"data": [1.0, 500, 1500, "/cuser/login-128"], "isController": false}, {"data": [1.0, 500, 1500, "/cuser/getByUsername-116"], "isController": false}, {"data": [1.0, 500, 1500, "/cuser/login-127"], "isController": false}, {"data": [0.6532258064516129, 500, 1500, "登录后"], "isController": true}, {"data": [1.0, 500, 1500, "/cuser/getByUsername-110"], "isController": false}, {"data": [0.608433734939759, 500, 1500, "登陆"], "isController": true}, {"data": [1.0, 500, 1500, "/user-111"], "isController": false}, {"data": [1.0, 500, 1500, "/favicon.ico-103"], "isController": false}, {"data": [1.0, 500, 1500, "/company-96"], "isController": false}, {"data": [0.8608870967741935, 500, 1500, "/th/id/OIP-C.jWA9VQ3YZxyTd_kf1tsR_wAAAA-124"], "isController": false}, {"data": [0.8603238866396761, 500, 1500, "/th/id/OIP-C.jWA9VQ3YZxyTd_kf1tsR_wAAAA-102"], "isController": false}, {"data": [1.0, 500, 1500, "/corders/getNumsByKind-123"], "isController": false}, {"data": [1.0, 500, 1500, "首次页面"], "isController": true}, {"data": [1.0, 500, 1500, "/ccompany/getByTitle-108--神州租车"], "isController": false}, {"data": [1.0, 500, 1500, "/ccompany/getByAudit-105"], "isController": false}, {"data": [0.8346774193548387, 500, 1500, "/th/id/OIP-C.jWA9VQ3YZxyTd_kf1tsR_wAAAA-117"], "isController": false}, {"data": [1.0, 500, 1500, "/corders/queryorders-108"], "isController": false}, {"data": [1.0, 500, 1500, "/cuser/getByUsername-36"], "isController": false}, {"data": [1.0, 500, 1500, "/cuser/getByUsername-37"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 6208, 0, 0.0, 97.35502577319563, 1, 6507, 14.0, 124.10000000000036, 520.0999999999985, 1792.0999999999985, 9.038574095050624, 20.289150391961524, 6.499942978852969], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/login-1", 249, 0, 0.0, 5.1084337349397595, 2, 50, 5.0, 6.0, 8.0, 33.5, 0.3632199668871757, 0.31852688502410526, 0.18728529542619998], "isController": false}, {"data": ["/favicon.ico-118", 248, 0, 0.0, 4.32258064516129, 1, 22, 3.0, 7.0, 12.0, 16.50999999999999, 0.362655810389504, 0.422862341411199, 0.167869974731079], "isController": false}, {"data": ["/ccompany/getByTitle-106", 249, 0, 0.0, 16.128514056224905, 7, 124, 15.0, 20.0, 25.5, 83.0, 0.36421133618754103, 0.426454484461779, 0.32653262671702243], "isController": false}, {"data": ["公司", 247, 0, 0.0, 412.02834008097136, 60, 3841, 217.0, 965.0000000000007, 1452.4, 2650.2400000000052, 0.36104988042963476, 4.830619517103094, 1.6117072639179613], "isController": true}, {"data": ["/ccompany/getByTitle-101", 248, 0, 0.0, 14.725806451612904, 7, 46, 14.0, 19.0, 21.549999999999983, 43.52999999999997, 0.3626510375767891, 0.4246275332564162, 0.3246782957192555], "isController": false}, {"data": ["/corders/getNumsByKind-130", 249, 0, 0.0, 8.261044176706829, 4, 21, 8.0, 11.0, 12.0, 15.5, 0.36323904192420414, 0.16246433711063035, 0.1716872034094871], "isController": false}, {"data": ["/main-119", 248, 0, 0.0, 3.048387096774194, 1, 18, 3.0, 5.0, 6.0, 11.0, 0.3626563407097828, 0.3180326112865088, 0.18664051909575738], "isController": false}, {"data": ["查询用户名", 247, 0, 0.0, 34.40485829959515, 16, 152, 32.0, 44.0, 51.79999999999998, 103.64000000000007, 0.36127907418946237, 0.9049617434530965, 0.6483077338952905], "isController": true}, {"data": ["/favicon.ico-4", 249, 0, 0.0, 3.5783132530120483, 1, 43, 3.0, 5.0, 6.0, 17.0, 0.36324646053524146, 0.4235510487100374, 0.1684981140178122], "isController": false}, {"data": ["/th/id/OIP-C.jWA9VQ3YZxyTd_kf1tsR_wAAAA-129", 249, 0, 0.0, 1037.2530120481924, 99, 6507, 567.0, 2589.0, 3577.0, 6356.5, 0.36309020385546387, 3.2595852874646387, 0.27976383871285254], "isController": false}, {"data": ["/ccompany/getByTitle-107--易卡租车", 248, 0, 0.0, 21.06854838709679, 9, 98, 18.0, 31.099999999999994, 47.749999999999915, 63.039999999999964, 0.3626038465249978, 0.2163583498308336, 0.32961351026475927], "isController": false}, {"data": ["/cuser/login-128", 249, 0, 0.0, 13.779116465863462, 6, 50, 13.0, 18.0, 21.5, 39.0, 0.3632337431018411, 0.11386526517157324, 0.2905844302372398], "isController": false}, {"data": ["/cuser/getByUsername-116", 249, 0, 0.0, 13.96385542168675, 7, 59, 13.0, 18.0, 21.0, 34.0, 0.36423690904755707, 0.4350212302394163, 0.3265112700421725], "isController": false}, {"data": ["/cuser/login-127", 249, 0, 0.0, 16.13253012048194, 7, 74, 15.0, 21.0, 23.5, 51.0, 0.36322473545861134, 0.11421715314225865, 0.29141343198507424], "isController": false}, {"data": ["登录后", 248, 0, 0.0, 903.362903225806, 114, 8029, 455.5, 2053.0999999999995, 3082.1999999999985, 4598.71, 0.3623760177213562, 10.212447734930711, 2.8609657375667035], "isController": true}, {"data": ["/cuser/getByUsername-110", 249, 0, 0.0, 14.698795180722895, 7, 44, 14.0, 19.0, 24.0, 43.5, 0.3642395730936666, 0.43502441200542413, 0.32664222540505194], "isController": false}, {"data": ["登陆", 249, 0, 0.0, 1075.4257028112445, 120, 6552, 601.0, 2659.0, 3614.0, 6395.0, 0.36305790992372866, 3.6496535366797844, 1.0330638998324684], "isController": true}, {"data": ["/user-111", 249, 0, 0.0, 3.072289156626505, 1, 23, 3.0, 4.0, 5.0, 7.0, 0.3642438356485003, 0.31942476993393876, 0.1874575208855075], "isController": false}, {"data": ["/favicon.ico-103", 247, 0, 0.0, 4.048582995951414, 1, 22, 3.0, 6.0, 9.199999999999989, 18.56000000000003, 0.36129439935171787, 0.4212749148690929, 0.16829827001051703], "isController": false}, {"data": ["/company-96", 248, 0, 0.0, 3.2056451612903225, 1, 12, 3.0, 4.0, 5.0, 8.509999999999991, 0.36265209819098015, 0.3180288907963869, 0.1877007930090034], "isController": false}, {"data": ["/th/id/OIP-C.jWA9VQ3YZxyTd_kf1tsR_wAAAA-124", 248, 0, 0.0, 391.2701612903227, 30, 3498, 176.5, 1029.1999999999994, 1554.3499999999997, 3024.779999999994, 0.3625185096396303, 3.2543956054497643, 0.27932334385319174], "isController": false}, {"data": ["/th/id/OIP-C.jWA9VQ3YZxyTd_kf1tsR_wAAAA-102", 247, 0, 0.0, 350.78947368421063, 29, 3784, 143.0, 905.6000000000006, 1403.8, 2597.040000000005, 0.3611243100990533, 3.241821989564677, 0.2782491022149932], "isController": false}, {"data": ["/corders/getNumsByKind-123", 248, 0, 0.0, 9.346774193548393, 4, 34, 9.0, 12.0, 17.549999999999983, 26.50999999999999, 0.3626536891238989, 0.16220252892455633, 0.17141053274996784], "isController": false}, {"data": ["首次页面", 249, 0, 0.0, 8.686746987951809, 3, 64, 8.0, 11.0, 12.5, 54.5, 0.3631643428038038, 0.7419334034624584, 0.3557166365548976], "isController": true}, {"data": ["/ccompany/getByTitle-108--神州租车", 248, 0, 0.0, 18.18145161290323, 9, 109, 17.0, 23.0, 25.0, 89.29999999999973, 0.3626292963529436, 0.2146028843651209, 0.3284371714585886], "isController": false}, {"data": ["/ccompany/getByAudit-105", 249, 0, 0.0, 19.072289156626503, 8, 125, 16.0, 27.0, 38.0, 76.0, 0.3642022799940324, 0.43320154007102674, 0.3255560666738824], "isController": false}, {"data": ["/th/id/OIP-C.jWA9VQ3YZxyTd_kf1tsR_wAAAA-117", 248, 0, 0.0, 409.18145161290323, 30, 5416, 176.0, 1214.9999999999998, 1581.5999999999995, 2495.8499999999985, 0.36259907507993994, 3.255118856285026, 0.2793854201543678], "isController": false}, {"data": ["/corders/queryorders-108", 249, 0, 0.0, 19.22891566265061, 10, 48, 18.0, 25.0, 30.0, 46.5, 0.3642395730936666, 0.7690292549106517, 0.2934733050060268], "isController": false}, {"data": ["/cuser/getByUsername-36", 247, 0, 0.0, 16.473684210526333, 7, 65, 15.0, 22.0, 27.19999999999999, 59.56000000000003, 0.36128700083520193, 0.43149804884907417, 0.32406670343529814], "isController": false}, {"data": ["/cuser/getByUsername-37", 247, 0, 0.0, 17.92712550607288, 9, 124, 17.0, 23.0, 25.0, 50.04000000000002, 0.36128700083520193, 0.47348354992269626, 0.3242552546597978], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 6208, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.69375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "登陆失败"], "isController": true}, {"data": [0.0, 500, 1500, "登陆成功"], "isController": true}, {"data": [1.0, 500, 1500, "/car02/orders/getOrderByCidandState-16"], "isController": false}, {"data": [1.0, 500, 1500, "订单界面"], "isController": true}, {"data": [0.3, 500, 1500, "首页"], "isController": true}, {"data": [1.0, 500, 1500, "/car02/user/login-10"], "isController": false}, {"data": [1.0, 500, 1500, "/car02/orders/getOrderByCidandState-17"], "isController": false}, {"data": [1.0, 500, 1500, "/car02/user/login-11"], "isController": false}, {"data": [1.0, 500, 1500, "/car02/company/list-4"], "isController": false}, {"data": [1.0, 500, 1500, "/-1"], "isController": false}, {"data": [1.0, 500, 1500, "/car02/user/login-15"], "isController": false}, {"data": [0.1, 500, 1500, "/passwordbreachservice/v1/passwords/breach/query-14"], "isController": false}, {"data": [0.1, 500, 1500, "/passwordbreachservice/v1/passwords/breach/prequery-13"], "isController": false}, {"data": [0.3, 500, 1500, "/th/id/OIP-C.M45IOTERHkYf3WRB_M6aMQHaDj-8"], "isController": false}, {"data": [0.3, 500, 1500, "/th/id/OIP-C.eFh_QVgrySTxSugxN_FshgHaFj-12"], "isController": false}, {"data": [1.0, 500, 1500, "/car02/orders/getOrderByUid-11"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 60, 0, 0.0, 607.6666666666667, 4, 3161, 20.0, 2158.5, 2576.7, 3161.0, 0.8667764583513913, 3.0233484522622867, 42.8449691301176], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["登陆失败", 5, 0, 0.0, 19.6, 7, 38, 18.0, 38.0, 38.0, 38.0, 0.07922423627836227, 0.023674429981619977, 0.06508147222398276], "isController": true}, {"data": ["登陆成功", 5, 0, 0.0, 5606.2, 3448, 6816, 6108.0, 6816.0, 6816.0, 6816.0, 0.0751461592797992, 2.1607309419946796, 44.29760415257676], "isController": true}, {"data": ["/car02/orders/getOrderByCidandState-16", 5, 0, 0.0, 21.0, 10, 30, 21.0, 30.0, 30.0, 30.0, 0.08114775383017399, 0.06957785924110621, 0.042158793982082575], "isController": false}, {"data": ["订单界面", 5, 0, 0.0, 29.2, 16, 42, 30.0, 42.0, 42.0, 42.0, 0.08113853593625757, 0.1400907534524447, 0.08422877314476739], "isController": true}, {"data": ["首页", 5, 0, 0.0, 1637.0, 405, 2629, 1946.0, 2629.0, 2629.0, 2629.0, 0.1001221490218066, 1.109087461703278, 0.181960272782795], "isController": true}, {"data": ["/car02/user/login-10", 5, 0, 0.0, 17.4, 9, 29, 14.0, 29.0, 29.0, 29.0, 0.07922172576607409, 0.038527753351079004, 0.06591495151630383], "isController": false}, {"data": ["/car02/orders/getOrderByCidandState-17", 5, 0, 0.0, 8.2, 4, 12, 9.0, 12.0, 12.0, 12.0, 0.081167513514391, 0.07054598342559375, 0.04208979460560705], "isController": false}, {"data": ["/car02/user/login-11", 5, 0, 0.0, 16.4, 8, 24, 20.0, 24.0, 24.0, 24.0, 0.07920917559090046, 0.03852164984791838, 0.06633768455737912], "isController": false}, {"data": ["/car02/company/list-4", 5, 0, 0.0, 13.4, 8, 18, 13.0, 18.0, 18.0, 18.0, 0.07841907151819322, 0.09442452654485571, 0.03905637351003764], "isController": false}, {"data": ["/-1", 5, 0, 0.0, 11.6, 4, 34, 6.0, 34.0, 34.0, 34.0, 0.1043209747751883, 0.0904658453128586, 0.055318641897389886], "isController": false}, {"data": ["/car02/user/login-15", 5, 0, 0.0, 19.6, 7, 38, 18.0, 38.0, 38.0, 38.0, 0.07922423627836227, 0.023674429981619977, 0.06508147222398276], "isController": false}, {"data": ["/passwordbreachservice/v1/passwords/breach/query-14", 5, 0, 0.0, 1931.0, 1293, 2552, 1986.0, 2552.0, 2552.0, 2552.0, 0.07862500589687543, 1.4664792115484409, 45.90441115767459], "isController": false}, {"data": ["/passwordbreachservice/v1/passwords/breach/prequery-13", 5, 0, 0.0, 2258.2, 878, 3161, 2360.0, 3161.0, 3161.0, 3161.0, 0.07766266445069198, 0.06181159328839254, 0.20841504092822416], "isController": false}, {"data": ["/th/id/OIP-C.M45IOTERHkYf3WRB_M6aMQHaDj-8", 5, 0, 0.0, 1612.0, 379, 2578, 1929.0, 2578.0, 2578.0, 2578.0, 0.0761347890304996, 0.6856740736299545, 0.06007510696937859], "isController": false}, {"data": ["/th/id/OIP-C.eFh_QVgrySTxSugxN_FshgHaFj-12", 5, 0, 0.0, 1375.0, 839, 1848, 1411.0, 1848.0, 1848.0, 1848.0, 0.07771094636390481, 0.6203670919398206, 0.061394683211327156], "isController": false}, {"data": ["/car02/orders/getOrderByUid-11", 5, 0, 0.0, 8.2, 6, 11, 8.0, 11.0, 11.0, 11.0, 0.07920792079207921, 0.027769183168316832, 0.03983601485148515], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 60, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

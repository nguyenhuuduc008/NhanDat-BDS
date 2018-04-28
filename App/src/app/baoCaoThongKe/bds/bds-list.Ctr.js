(function () {
    'use strict';
    angular.module('app.baoCaoThongKe')
    .controller('bdsListCtr', bdsListCtr);
    /** @ngInject */
    function bdsListCtr($rootScope, $scope, $state, $q, baoCaoThongKeService, appUtils, $ngBootbox, toaster) {
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;
        var currentUser = $rootScope.storage.currentUser;
        
        ThongKeBDSTheoLoai();
        ThongKeBDSTheoGia();
        ThongKeBDSTheoThoiGian();
        ThongKeBDSTheoTruyCap();
        ThongKeBDSTheoLinhVuc();

        function ThongKeBDSTheoLoai(){
            var chartData = [];          
            baoCaoThongKeService.getThongKeBDSTheoLoai().$loaded().then(function(res){   
                _.forEach(res, function(item, key){
                    chartData.push({
                        "key": item.text,
                        "value": item.value,
                        "expenses": item.expenses
                    });
                });
                var chart = new AmCharts.AmSerialChart();
                chart.dataProvider = chartData;            
                chart.categoryField = "key";
                chart.startDuration = 1;
                chart.rotate = false;

                // AXES
                // category
                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridPosition = "start";
                categoryAxis.axisColor = "#67b7dc";
                categoryAxis.dashLength = 1;

                // GRAPHS
                var graph1 = new AmCharts.AmGraph();
                graph1.type = "column";
                graph1.title = "Tổng số";
                graph1.valueField = "value";
                graph1.lineAlpha = 0;
                graph1.fillColors = "#67b7dc";
                graph1.fillAlphas = 0.8;
                graph1.balloonText = "<span style='font-size:13px;'>[[title]] [[category]]:<b>[[value]]</b></span>";
                graph1.labelPosition = 'top';
                graph1.labelOffset = 1;
                graph1.labelText = "[[value]]";
                chart.addGraph(graph1);

                // LEGEND
                var legend = new AmCharts.AmLegend();
                legend.useGraphSettings = true;
                chart.addLegend(legend);

                // WRITE
                chart.write("chartdiv1");
            });
        }   

        function ThongKeBDSTheoGia(){
            var chartData = [];
            baoCaoThongKeService.getThongKeBDSTheoPhanKhucGia().$loaded().then(function(res){  
                _.forEach(res, function(item, key){
                    chartData.push({
                        "lineColor": item.lineColor,
                        "key": item.key,
                        "value": item.value
                    });
                });
              
                // SERIAL CHART
                var chart = new AmCharts.AmSerialChart();
                chart.dataProvider = chartData;
                chart.categoryField = "key";
                // chart.dataDateFormat = "YYYY-MM-DD";
        
                var balloon = chart.balloon;
                balloon.cornerRadius = 6;
                balloon.adjustBorderColor = false;
                balloon.horizontalPadding = 10;
                balloon.verticalPadding = 10;
        
                // AXES
                // category axis
                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
        
                // as we have data of different units, we create two different value axes
                // Duration value axis
                var durationAxis = new AmCharts.ValueAxis();
                durationAxis.gridAlpha = 0.05;
                durationAxis.axisAlpha = 0;
                chart.addValueAxis(durationAxis);
        
                // GRAPHS
                // duration graph
                var durationGraph = new AmCharts.AmGraph();
                durationGraph.title = "value";
                durationGraph.valueField = "value";
                durationGraph.type = "smoothedLine";
                durationGraph.valueAxis = durationAxis; // indicate which axis should be used
                durationGraph.lineColorField = "lineColor";
                durationGraph.fillColorsField = "lineColor";
                durationGraph.fillAlphas = 0.3;
                durationGraph.balloonText = "[[value]]";
                durationGraph.lineThickness = 1;
                durationGraph.legendValueText = "[[value]]";
                durationGraph.bullet = "round";
                durationGraph.bulletBorderThickness = 1;
                durationGraph.bulletBorderAlpha = 1;
                durationGraph.labelPosition = 'top';
                durationGraph.labelOffset = 1;
                durationGraph.labelText = "[[value]]";
                chart.addGraph(durationGraph);
        
                // CURSOR
                var chartCursor = new AmCharts.ChartCursor();
                chartCursor.zoomable = true;
                chartCursor.cursorAlpha = 0;
                chart.addChartCursor(chartCursor);
        
                var chartScrollbar = new AmCharts.ChartScrollbar();
                chart.addChartScrollbar(chartScrollbar);
        
                // WRITE
                chart.write("chartdiv2");
            });                 
        }

        function ThongKeBDSTheoThoiGian(){
            var chartData = [];
            baoCaoThongKeService.getThongKeBDSTheoThoiGian().$loaded().then(function(res){
                _.forEach(res, function(item, key){
                    chartData.push({
                        "lineColor": item.lineColor,
                        "key": item.key,
                        "value": item.value
                    });
                });
                
                var chart = new AmCharts.AmSerialChart();
                chart.dataProvider = chartData;
                chart.categoryField = "key";
        
                var balloon = chart.balloon;
                balloon.cornerRadius = 6;
                balloon.adjustBorderColor = false;
                balloon.horizontalPadding = 10;
                balloon.verticalPadding = 10;
        
                // AXES
                // category axis
                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
        
                // as we have data of different units, we create two different value axes
                // Duration value axis
                var durationAxis = new AmCharts.ValueAxis();
                durationAxis.gridAlpha = 0.05;
                durationAxis.axisAlpha = 0;
                chart.addValueAxis(durationAxis);
        
                // GRAPHS
                // duration graph
                var durationGraph1 = new AmCharts.AmGraph();
                durationGraph1.title = "value";
                durationGraph1.valueField = "value";
                durationGraph1.type = "smoothedLine";
                durationGraph1.valueAxis = durationAxis; // indicate which axis should be used
                durationGraph1.lineColorField = "lineColor";
                durationGraph1.fillColorsField = "lineColor";
                durationGraph1.fillAlphas = 0.3;
                durationGraph1.balloonText = "[[value]]";
                durationGraph1.lineThickness = 1;
                durationGraph1.legendValueText = "[[value]]";
                durationGraph1.bullet = "round";
                durationGraph1.bulletBorderThickness = 1;
                durationGraph1.bulletBorderAlpha = 1;
                durationGraph1.labelPosition = 'top';
                durationGraph1.labelOffset = 1;
                durationGraph1.labelText = "[[value]]";
                chart.addGraph(durationGraph1);
        
                // CURSOR
                var chartCursor = new AmCharts.ChartCursor();
                chartCursor.zoomable = true;
                chartCursor.cursorAlpha = 0;
                chart.addChartCursor(chartCursor);
        
                var chartScrollbar = new AmCharts.ChartScrollbar();
                chart.addChartScrollbar(chartScrollbar);
        
                // WRITE
                chart.write("chartdiv3");
            });            
        }

        function ThongKeBDSTheoTruyCap(){
            var chartData = [];
            baoCaoThongKeService.getThongKeBDSTheoTruyCap().$loaded().then(function(res){
                _.forEach(res, function(item, key){
                    chartData.push({
                        "lineColor": item.lineColor,
                        "key": item.key,
                        "value": item.value
                    });
                });
                
                var chart = new AmCharts.AmSerialChart();
                chart.dataProvider = chartData;
                chart.categoryField = "key";
        
                var balloon = chart.balloon;
                balloon.cornerRadius = 6;
                balloon.adjustBorderColor = false;
                balloon.horizontalPadding = 10;
                balloon.verticalPadding = 10;
        
                // AXES
                // category axis
                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
        
                // as we have data of different units, we create two different value axes
                // Duration value axis
                var durationAxis = new AmCharts.ValueAxis();
                durationAxis.gridAlpha = 0.05;
                durationAxis.axisAlpha = 0;
                chart.addValueAxis(durationAxis);
        
                // GRAPHS
                // duration graph
                var durationGraph1 = new AmCharts.AmGraph();
                durationGraph1.title = "value";
                durationGraph1.valueField = "value";
                durationGraph1.type = "smoothedLine";
                durationGraph1.valueAxis = durationAxis; // indicate which axis should be used
                durationGraph1.lineColorField = "lineColor";
                durationGraph1.fillColorsField = "lineColor";
                durationGraph1.fillAlphas = 0.3;
                durationGraph1.balloonText = "[[value]]";
                durationGraph1.lineThickness = 1;
                durationGraph1.legendValueText = "[[value]]";
                durationGraph1.bullet = "round";
                durationGraph1.bulletBorderThickness = 1;
                durationGraph1.bulletBorderAlpha = 1;
                durationGraph1.labelPosition = 'top';
                durationGraph1.labelOffset = 1;
                durationGraph1.labelText = "[[value]]";
                chart.addGraph(durationGraph1);
        
                // CURSOR
                var chartCursor = new AmCharts.ChartCursor();
                chartCursor.zoomable = true;
                chartCursor.cursorAlpha = 0;
                chart.addChartCursor(chartCursor);
        
                var chartScrollbar = new AmCharts.ChartScrollbar();
                chart.addChartScrollbar(chartScrollbar);
        
                // WRITE
                chart.write("chartdiv4");
            });                
        }

        function ThongKeBDSTheoLinhVuc(){
            var chartData = [];
            baoCaoThongKeService.getThongKeBDSTheoLinhVuc().$loaded().then(function(res){
                _.forEach(res, function(item, key){
                    chartData.push({
                        key: item.key,
                        value: item.value
                    });
                });
              
                var chart;            
                chart = new AmCharts.AmPieChart();
                chart.dataProvider = chartData;
                chart.titleField = "key";
                chart.valueField = "value";
                chart.outlineColor = "#FFFFFF";
                chart.outlineAlpha = 0.8;
                chart.outlineThickness = 2;
    
                // WRITE
                chart.write("chartdiv5");
            });                  
        }        
    }    
})();
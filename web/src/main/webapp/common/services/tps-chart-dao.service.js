(function() {
	'use strict';

	pinpointApp.constant( "TPSChartDaoServiceConfig", {
		dateFormat: "YYYY-MM-DD HH:mm:ss"
	});

	pinpointApp.service( "TPSChartDaoService", [ "TPSChartDaoServiceConfig",
		function TPSChartDaoService( cfg ) {

			this.parseData = function( aChartData ) {
				var aX = aChartData.charts.x;
				var aSampledContinuationData = aChartData.charts.y["TPS_SAMPLED_CONTINUATION"];
				var aSampledNewData = aChartData.charts.y["TPS_SAMPLED_NEW"];
				var aUnsampledContinuationData = aChartData.charts.y["TPS_UNSAMPLED_CONTINUATION"];
				var aUnsampledNewData = aChartData.charts.y["TPS_UNSAMPLED_NEW"];
				var aTotalData = aChartData.charts.y["TPS_TOTAL"];
				var xLen = aX.length;
				var scdLen = aSampledContinuationData.length;
				var sndLen = aSampledNewData.length;
				var ucdLen = aUnsampledContinuationData.length;
				var undLen = aUnsampledNewData.length;
				var tdLen = aTotalData.length;

				var refinedChartData = {
					data: [],
					empty: false,
					forceMax: false,
					defaultMax: 10
				};
				if ( scdLen === 0 && sndLen === 0 && ucdLen === 0 && undLen === 0 && tdLen === 0 ) {
					refinedChartData.empty = true;
				}
				for ( var i = 0 ; i < xLen ; i++ ) {
					refinedChartData.data.push({
						"time": moment(aX[i]).format(cfg.dateFormat),
						"sampledContinuationTps": scdLen > i ? getFloatValue(aSampledContinuationData[i][2]) : -1,
						"sampledNewTps": sndLen > i ? getFloatValue(aSampledNewData[i][2]) : -1,
						"unsampledContinuationTps": ucdLen > i ? getFloatValue(aUnsampledContinuationData[i][2]) : -1,
						"unsampledNewTps": undLen > i ? getFloatValue(aUnsampledNewData[i][2]) : -1,
						"totalTps": tdLen > i ? getFloatValue(aTotalData[i][2]) : -1
					});
				}
				return refinedChartData;
			};
			this.getChartOptions = function( oChartData ) {
				return {
					"type": "serial",
					"theme": "light",
					"autoMargins": false,
					"marginTop": 10,
					"marginLeft": 70,
					"marginRight": 70,
					"marginBottom": 40,
					"legend": {
						"useGraphSettings": true,
						"autoMargins": true,
						"align": "right",
						"position": "top",
						"valueWidth": 70,
						"markerSize": 10,
						"valueAlign": "left"
					},
					"usePrefixes": true,
					"dataProvider": oChartData.data,
					"valueAxes": [{
						"stackType": "regular",
						"gridAlpha": 0,
						"axisAlpha": 1,
						"position": "left",
						"title": "Transaction(count)",
						"minimum": 0
					}],
					"graphs": [
						{
							"balloonText": "Sampled Continuation : [[value]]",
							"legendValueText": "[[value]]",
							"lineColor": "rgb(214, 141, 8)",
							"fillColor": "rgb(214, 141, 8)",
							"title": "S.C",
							"valueField": "sampledContinuationTps",
							"fillAlphas": 0.4,
							"connect": false
						}, {
							"balloonText": "Sampled New : [[value]]",
							"legendValueText": "[[value]]",
							"lineColor": "rgb(252, 178, 65)",
							"fillColor": "rgb(252, 178, 65)",
							"title": "S.N",
							"valueField": "sampledNewTps",
							"fillAlphas": 0.4,
							"connect": false
						}, {
							"balloonText": "Unsampled Continuation : [[value]]",
							"legendValueText": "[[value]]",
							"lineColor": "rgb(90, 103, 166)",
							"fillColor": "rgb(90, 103, 166)",
							"title": "U.C",
							"valueField": "unsampledContinuationTps",
							"fillAlphas": 0.4,
							"connect": false
						}, {
							"balloonText": "Unsampled New : [[value]]",
							"legendValueText": "[[value]]",
							"lineColor": "rgb(160, 153, 255)",
							"fillColor": "rgb(160, 153, 255)",
							"title": "U.N",
							"valueField": "unsampledNewTps",
							"fillAlphas": 0.4,
							"connect": false
						}, {
							"balloonText": "Total : [[value]]",
							"legendValueText": "[[value]]",
							"lineColor": "rgba(31, 119, 180, 0)",
							"fillColor": "rgba(31, 119, 180, 0)",
							"title": "Total",
							"valueField": "totalTps",
							"fillAlphas": 0.4,
							"connect": false
						}
					],
					"categoryField": "time",
					"categoryAxis": {
						"axisColor": "#DADADA",
						"startOnAxis": true,
						"gridPosition": "start",
						"labelFunction": function (valueText) {
							return valueText.replace(/\s/, "<br>").replace(/-/g, ".").substring(2);
						}
					},
					"chartCursor": {
						"categoryBalloonAlpha": 0.7,
						"fullWidth": true,
						"cursorAlpha": 0.1
					}
				};
			};
			function getFloatValue( val ) {
				return angular.isNumber( val ) ? val.toFixed(2) : 0.00;
			}
		}
	]);
})();

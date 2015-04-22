// @TODO: has to be adapted as in: https://github.com/don/BluetoothSerial
(function() {
    angular.module('bluetoothSerial', [])
    
    .controller('ConnectCtrl', function($scope, $ionicPlatform) {
		$ionicPlatform.ready(function() {
			$scope.refreshDeviceList();
		});
		
		$scope.status = {
			message:'',
			connected:false
		}
		$scope.strCommand;
        
        $scope.isEnableBluetooth = function() {
            bluetoothSerial.isEnabled(
                function() {
                    $scope.setStatus("Bluetooth is enabled");
                    return true;
                },
                function() {
                    $scope.setStatus("Bluetooth is NOT enabled");
                    return false;
                }
            );
        }
        $scope.enableBluetooth = function() {
            bluetoothSerial.enable(
				function() {
                    $scope.setStatus("Bluetooth enabled");
                },
			   $scope.onError
			);
        }
        $scope.refreshDeviceList = function() {
            if ( !this.isEnableBluetooth() ) {
                this.enableBluetooth()
            }
            bluetoothSerial.list(this.onDeviceList, $scope.onError);
        }
        $scope.onDeviceList = function(devices) {
            $scope.devicesList = devices
            
            if (devices.length === 0) {
                $scope.setStatus("No Bluetooth devices");
                
                if (cordova.platformId === "ios") {
                    $scope.setStatus("No Bluetooth discovered");
                } else {
                    $scope.setStatus("Please pair a Bluetooth device");
                }
            } else {
                $scope.setStatus("Found " + devices.length + " device" + (devices.length === 1 ? "." : "s."));
            }
        }
        $scope.connect = function(device) {
			var onConnect = function() {
            	bluetoothSerial.subscribe('\n', $scope.onData, $scope.onError);

				$scope.bluetoothStream = ""
				$scope.setStatus("Connected to " + device.name);
				$scope.status.connected = true;
				// go to scouts page
			};
			
			bluetoothSerial.connect(device.id, onConnect, $scope.onError);
        }
		$scope.onData = function(data) {
			console.log(data);
			$scope.bluetoothStream = data;
		}
		$scope.sendData = function(
		) {
			var success = function() {
				console.log("sending data: " + $scope.strCommand);
				console.log("success");
			}
			var failure = function() {
				console.log("Failed writing data to Bluetooth peripheral");
			}
			// Grab command to be sent:
			var data = $scope.strCommand;
			// Send command:
			bluetoothSerial.write(data, success, failure);
		}
        $scope.setStatus = function(message) {
            $scope.status.message = message;
			console.log("Status: " + message);
        }
        $scope.onError = function(reason) {
            $scope.status.message = "ERROR: " + reason;
			console.log("ERROR: " + reason);
        }
		$scope.getHvacScouts = function() {
			$scope.strCommand = "getHvacScouts:";
			$scope.sendData();
		}
    })
 
    .service('btService', function() {
        var bluetoothSerial = bluetoothSerial;
        
        var getBtSerial = function () {
            return this.bluetoothSerial
        }
        
        return {
            getBtSerial: getBtSerial,
        };
    })
 
})();
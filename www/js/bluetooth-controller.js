(function() {
    angular.module('bluetoothSerial', [])
    
    .controller('ConnectCtrl', function($scope, $ionicPlatform) {
		$ionicPlatform.ready(function() {
			$scope.refreshDeviceList();
		});
		
		$scope.status = {}
        
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
            bluetoothSerial.enable(this.refreshDeviceList, this.onError)
        }
        $scope.refreshDeviceList = function() {
            if ( !this.isEnableBluetooth() ) {
                this.enableBluetooth()
            }
            bluetoothSerial.list(this.onDeviceList, this.onError);
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
        $scope.connect = function(e) {
            bluetoothSerial.subscribe('\n', this.onData, this.onError);
            
            $scope.bluetoothStream = ""
            $scope.setStatus("Connected");
            // go to scouts page
        }
		$scope.onData = function(data) {
			console.log(data);
			$scope.bluetoothStream += data;
		}
        $scope.setStatus = function(message) {
            $scope.status.message = message;
			console.log("Status: " + message);
        }
        $scope.onError = function(reason) {
            $scope.status.message = "ERROR: " + reason;
			console.log("ERROR: " + reason);
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
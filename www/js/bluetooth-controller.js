(function() {
    angular.module('bluetoothSerial', [])
    
    .controller('ConnectCtrl', function($scope, btService) {
        $scope.status = {}
        
        $scope.isEnableBluetooth = function() {
            bluetoothSerial.isEnabled(
                function() {
                    $scope.status.message = "Bluetooth is enabled";
                    return true;
                },
                function() {
                    $scope.status.message = "Bluetooth is NOT enabled";
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
            $scope.status = {}
            
//            devices.forEach(function(device) {
//                var device = {id: device.id, name: device.name}
//                $scope.devicesList.push(device);
//            });
            
            if (devices.length === 0) {
//                $scope.status.message = "No Bluetooth devices"
                
                if (cordova.platformId === "ios") {
                    $scope.status.message = "No Bluetooth discovered"
                } else {
//                    $scope.status.message = "Please pair a Bluetooth device"
                    $scope.status.message = "No Bluetooth devices"
                }
            } else {
                $scope.status.message = "Found " + devices.length + " device" + (devices.length === 1 ? "." : "s.")
            }
        }
        $scope.connect = function(e) {
            bluetoothSerial.subscribe('\n', this.onData, this.onError);
            
            $scope.bluetoothStream
            $scope.status.message = "Connected"
            // go to scouts page
        }
        $scope.onError = function(reason) {
            $scope.status.message = "ERROR: " + reason
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
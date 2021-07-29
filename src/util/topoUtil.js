const deviceNoteDto = [
{
    id: 'devId',
    name: '设备id',
    value: undefined,
}, {
    id: 'devIniname',
    name: '设备名称',
    value: undefined,
}, {
    id: 'devIp',
    name: '设备IP',
    value: undefined,
}, {
    id: 'devType',
    name: '设备类型',
    value: undefined,
}, {
    id: 'displayName',
    name: '端口名称',
    value: undefined,
}, {
    id: 'facName',
    name: '厂商名称',
    value: undefined,
}, {
    id: 'gdcity',
    name: '城市名称',
    value: undefined,
}, {
    id: 'networkName',
    name: '网络层次',
    value: undefined,
}];

const deviceAverageDto = {
    "板卡": [{
    id: 'boardAvgTemperature',
    name: '板卡平均温度',
    }, {
    id: 'boardMaxTemperature',
    name: '板卡最大温度',
    }, {
    id: 'boardMinTemperature',
    name: '板卡最小温度',
    }], 
    "CPU": [{
    id: 'cpuAvgRate',
    name: 'CPU平均利用率',
    }, {
    id: 'cpuMaxRate',
    name: 'CPU最大利用率',
    }, {
    id: 'cpuMinRate',
    name: 'CPU最小利用率',
    }], 
    "内存": [{
    id: 'memoryAvgRate',
    name: '内存平均利用率',
    }, {
    id: 'memoryMaxRate',
    name: '内存最大利用率',
    }, {
    id: 'memoryMinRate',
    name: '内存最小利用率',
}]};

const relayDto = [
    {id: "aDevel", name: "A端网络层级数"},
    {id: "aDeviceAlarmStatus", name: "A端设备告警"},
    {id: "aDisPlayName", name: "A端设备别名"},
    {id: "circuitADevIp", name: "A端设备ip"},
    {id: "circuitADevice", name: "A端设备名称"},
    {id: "circuitANetwork", name: "A端网络层次"},
    {id: "circuitAPort", name: "A端设备端口"},
    {id: "circuitBandwidth", name: "中继带宽"},
    {id: "circuitCircuitno", name: "中继电路编号"},
    {id: "circuitRouter", name: "中继路由"},
    {id: "circuitZDevIp", name: "Z端设备ip"},
    {id: "circuitZDevice", name: "Z端设备名称"},
    {id: "circuitZNetwork", name: "Z端网络层次"},
    {id: "circuitZPort", name: "Z端设备端口"},
    {id: "cityId", name: "城市id"},
    {id: "cityName", name: "城市名称"},
    {id: "id", name: "主键"},
    {id: "relayId", name: "中继id主键"},
    {id: "relayName", name: "中继名称"},
    {id: "trunkGroup", name: "中继分组"},
    {id: "zDevel", name: "Z端网络层级数"},
    {id: "zDeviceAlarmStatus", name: "Z端设备告警"},
    {id: "zDisPlayName", name: "Z端设备别名"},
];

const deviceDto = [
    {id: "devId", name: "设备id"},
    {id: "devIniname", name: "设备名称"},
    {id: "devIp", name: "设备ip"},
    {id: "devType", name: "设备类型"},
    {id: "displayName", name: "端口名称"},
    {id: "facName", name: "厂商名称"},
    {id: "gdcity", name: "城市名称"},
    {id: "id", name: "id"},
    {id: "networkName", name: "网络层次"},
];

const portDto = [
    {id: "admStatus", name: "端口管理状态"},
    {id: "bandwidth", name: "带宽"},
    {id: "devId", name: "设备id"},
    {id: "devName", name: "设备名称"},
    {id: "displayName", name: "端口名称"},
    {id: "orderStatus", name: "端口操作状态"},
    {id: "portId", name: "端口ID"},
    {id: "portalias", name: "描述"},
    {id: "portusage", name: "用途"},
];

const portPerformanceDto = [
    {id: "acquisitionDate", name: "采集时间"},
    {id: "acquisitionObjectId", name: "采集对象ID"},
    // {id: "createTime", name: "创建时间"},
    // {id: "createUser", name: "创建人"},
    // {id: "createUserName", name: "创建人姓名"},
    {id: "deviceId", name: "设备ID"},
    {id: "id", name: "主键"},
    {id: "inPortAvgRate", name: "入端口平均速率", symbol: "bps"},
    {id: "inPortByte", name: "入端口字节"},
    {id: "inPortDropNumber", name: "入端口丢弃包数"},
    {id: "inPortDropRate", name: "入端口丢包率"},
    {id: "inPortErrorNumber", name: "入端口错误包数"},
    {id: "inPortMaxRate", name: "入端口最大速率", symbol: "bps"},
    {id: "inPortMinRate", name: "入端口最小速率", symbol: "bps"},
    {id: "inPortNonUnicastNumber", name: "入端口非单播包数"},
    {id: "inPortPackRate", name: "入端口包速率"},
    {id: "inPortRate", name: "入端口速率", symbol: "bps"},
    {id: "inPortUnicastNumber", name: "入端口单播包数"},
    {id: "inPortUseAvgRate", name: "入端口平均利用率"},
    {id: "inPortUseMaxRate", name: "入端口最大利用率"},
    {id: "inPortUseMinRate", name: "入端口最小利用率"},
    {id: "inPortUseRate", name: "入端口利用率"},
    {id: "managerStatus", name: "管理状态"},
    {id: "operationStatus", name: "操作状态"},
    {id: "outPortAvgRate", name: "出端口平均速率", symbol: "bps"},
    {id: "outPortByte", name: "出端口字节"},
    {id: "outPortDropNumber", name: "出端口丢弃包数"},
    {id: "outPortDropRate", name: "出端口丢包率"},
    {id: "outPortErrorNumber", name: "出端口错误包数"},
    {id: "outPortMaxRate", name: "出端口最大速率", symbol: "bps"},
    {id: "outPortMinRate", name: "出端口最小速率", symbol: "bps"},
    {id: "outPortNonUnicastNumber", name: "出端口非单播包数"},
    {id: "outPortPackRate", name: "出端口包速率"},
    {id: "outPortRate", name: "出端口速率", symbol: "bps"},
    {id: "outPortUnicastNumber", name: "出端口单播包数"},
    {id: "outPortUseAvgRate", name: "出端口平均利用率"},
    {id: "outPortUseMaxRate", name: "出端口最大利用率"},
    {id: "outPortUseMinRate", name: "出端口最小利用率"},
    {id: "outPortUseRate", name: "出端口利用率"},
    {id: "portDesc", name: "接口描述"},
    // {id: "remark", name: "备注"},
    // {id: "updateTime", name: "修改时间"},
    // {id: "updateUser", name: "修改人"},
    // {id: "updateUserName", name: "修改人姓名"},
];

const expand = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTA1MkM0OTgzOTk4MTFFMzhBM0FBRTgwMjI0RjEwMTEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTA1MkM0OTkzOTk4MTFFMzhBM0FBRTgwMjI0RjEwMTEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMDUyQzQ5NjM5OTgxMUUzOEEzQUFFODAyMjRGMTAxMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMDUyQzQ5NzM5OTgxMUUzOEEzQUFFODAyMjRGMTAxMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlomIpMAAAHcSURBVHjadFO7TgMxEFw/LokoUyAUUfIFiIIGChBQIMRnpEB8CiUVBb+QhgIiOiQQoPATFAghlAJBkst5mbEvJDngpDnL3tnxej02zZNjqXy7wCmwLMZMV1WrvGfgyFdXkXRunG+J82KslSiCZA1BpBiLAqXYCnA+L+CcmKzesllNjK/tYH4DBW6P5EJ0PJKQj0Tz4Sbmlwi0KHBdJm/bWkNMY0FsVsfcv6OCwWwFpqiJ+KGoMVdhNIiiFNgiCTunZIqwApc9iLUjg5iq9k0I+1rkPYt54Emj6FcUANkLy+bOMZmj8xYCDYT7qOFQQuhhvop5z7IH41wCYFP5nmdOo8uioNgY6gN7wD2Tsd5lfJbvY/kks4EcJ0jJO8AjwJ27WG8yRp6WfFtencRuU2x69wdzySLNRDVzfD81iaZuA6XEB7AOXEySE1XX8LMTvp+apEhXFcIrGraIUp9+mYy8EB5m+K/pCHQYTJKclrfhtrdIriRrik/4bxjb8QgM0GE0Ce65g6VOFGDDkg9KgRwupBuHyZHI++kB7LkOh91xX96zuiJ1u/IWmKyDT/LLHoi8AEs40y3taUqT8J55VX+8hRskb3DOjwJt4AxYTI35ig4TN/zvNdrZp/0twAB5txk3Fz8cvwAAAABJRU5ErkJggg==";

const shrink = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTgwQjA3MTQzOTk4MTFFM0E3M0E4NEE2MThGNDUwMTIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTgwQjA3MTUzOTk4MTFFM0E3M0E4NEE2MThGNDUwMTIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxODBCMDcxMjM5OTgxMUUzQTczQTg0QTYxOEY0NTAxMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxODBCMDcxMzM5OTgxMUUzQTczQTg0QTYxOEY0NTAxMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhPH4y4AAAHjSURBVHjadJM9jhNBEIWretqzs0SrlWUBORdA/CSQgExCwhU2QEQchQOsOAUiMhIZEUjmAhuvCJBD1p6fLr7qmdF4B9HSc6t63qsuV73W8w/vZbbegI9gKarTqdmc9xu8jfNTRJdaxKUUUTQEyUkQW0oiXSsGhmRLcHk7QVGILk5WYVGKxvIpMSr9gQJxJ9bWu9TUr6057Il/olh5gq+D+GUoK9HqjoTFCXH8Pqtgp125lnjYmuqzVO9zUk/wwknc3Is9iVdQLERIoHwzs52mtLau2QbVR5T1WXPSm5wAchQv22/OYt858wSsHTWsJaUt8RPiTTA7k7aRBPoeeMNi2e/cfCT2tQZZrBI3JDqzohv4Bwm5fCd7A30fMa0teAg+cV6BPbw08sMwOv/Jux7P/naSe+CU76eQHo/8MJnE+m5PhnkFqjn4XkE6H/lxMkmXd7p9zf+8T6mbf+pwHjjiX/cVuMPaenBac4HbriAyaJlAzDloMBF7W1+xX+QpuD1xmGASYc5fOHqQb5t80N/cNWLwUnPIfNfFsQfYU3CYIJPgsY+KBDZ7Cy62/Z/M73sg8gvc5T+Z29Md5ibxORujyt2e3oLf/A3xc499eYJ3w/Nd9Y25yQ5zk/znNYbjp/1XgAEAh/wiCt81srkAAAAASUVORK5CYII=';

const cloud = 'data:image/png;base64,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';

export {
    deviceNoteDto,
    relayDto,
    deviceDto,
    portDto,
    portPerformanceDto,
    deviceAverageDto,
    expand,
    shrink,
    cloud
}

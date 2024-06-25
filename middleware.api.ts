import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const middleware = ({ headers, ip }: NextRequest) => {
  const blockedIps = [
    // facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
    "31.13.24.0/21",
    "31.13.64.0/18",
    "31.13.64.0/19",
    "31.13.64.0/24",
    "31.13.65.0/24",
    "31.13.66.0/24",
    "31.13.67.0/24",
    "31.13.68.0/24",
    "31.13.69.0/24",
    "31.13.70.0/24",
    "31.13.71.0/24",
    "31.13.72.0/24",
    "31.13.73.0/24",
    "31.13.74.0/24",
    "31.13.75.0/24",
    "31.13.76.0/24",
    "31.13.77.0/24",
    "31.13.78.0/24",
    "31.13.79.0/24",
    "31.13.80.0/24",
    "31.13.81.0/24",
    "31.13.82.0/24",
    "31.13.83.0/24",
    "31.13.84.0/24",
    "31.13.85.0/24",
    "31.13.86.0/24",
    "31.13.87.0/24",
    "31.13.88.0/24",
    "31.13.89.0/24",
    "31.13.90.0/24",
    "31.13.91.0/24",
    "31.13.92.0/24",
    "31.13.93.0/24",
    "31.13.94.0/24",
    "31.13.95.0/24",
    "31.13.96.0/19",
    "45.64.40.0/22",
    "57.141.0.0/24",
    "57.141.1.0/24",
    "57.141.2.0/24",
    "57.141.3.0/24",
    "57.141.4.0/24",
    "57.141.4.0/24",
    "57.141.5.0/24",
    "57.141.5.0/24",
    "57.141.6.0/24",
    "57.141.7.0/24",
    "57.141.8.0/24",
    "57.141.8.0/24",
    "57.141.9.0/24",
    "57.141.9.0/24",
    "57.141.10.0/24",
    "57.141.10.0/24",
    "57.141.11.0/24",
    "57.141.11.0/24",
    "57.141.12.0/24",
    "57.141.13.0/24",
    "57.141.13.0/24",
    "57.144.0.0/14",
    "57.144.0.0/23",
    "57.144.2.0/23",
    "57.144.4.0/23",
    "57.144.6.0/23",
    "57.144.8.0/23",
    "57.144.10.0/23",
    "57.144.12.0/23",
    "57.144.14.0/23",
    "57.144.16.0/23",
    "57.144.18.0/23",
    "57.144.20.0/23",
    "57.144.22.0/23",
    "57.144.24.0/23",
    "57.144.26.0/23",
    "57.144.28.0/23",
    "57.144.30.0/23",
    "57.144.32.0/23",
    "57.144.34.0/23",
    "57.144.36.0/23",
    "57.144.38.0/23",
    "57.144.40.0/23",
    "57.144.42.0/23",
    "57.144.44.0/23",
    "57.144.46.0/23",
    "57.144.48.0/23",
    "57.144.50.0/23",
    "57.144.52.0/23",
    "57.144.54.0/23",
    "57.144.56.0/23",
    "57.144.58.0/23",
    "57.144.60.0/23",
    "57.144.62.0/23",
    "57.144.64.0/23",
    "57.144.66.0/23",
    "57.144.68.0/23",
    "57.144.70.0/23",
    "57.144.72.0/23",
    "57.144.74.0/23",
    "57.144.76.0/23",
    "57.144.78.0/23",
    "57.144.80.0/23",
    "57.144.82.0/23",
    "57.144.84.0/23",
    "57.144.86.0/23",
    "57.144.88.0/23",
    "57.144.90.0/23",
    "57.144.92.0/23",
    "57.144.94.0/23",
    "57.144.96.0/23",
    "57.144.98.0/23",
    "57.144.100.0/23",
    "57.144.102.0/23",
    "57.144.104.0/23",
    "57.144.106.0/23",
    "57.144.108.0/23",
    "57.144.110.0/23",
    "57.144.112.0/23",
    "57.144.114.0/23",
    "57.144.116.0/23",
    "57.144.118.0/23",
    "57.144.120.0/23",
    "57.144.122.0/23",
    "57.144.124.0/23",
    "57.144.126.0/23",
    "57.144.128.0/23",
    "57.144.130.0/23",
    "57.144.132.0/23",
    "57.144.134.0/23",
    "57.144.136.0/23",
    "66.220.144.0/20",
    "66.220.144.0/21",
    "66.220.152.0/21",
    "69.63.176.0/20",
    "69.63.176.0/20",
    "69.63.176.0/21",
    "69.63.184.0/21",
    "69.171.224.0/19",
    "69.171.224.0/20",
    "69.171.239.0/24",
    "69.171.240.0/20",
    "69.171.250.0/24",
    "69.171.255.0/24",
    "74.119.76.0/22",
    "102.132.96.0/20",
    "102.132.96.0/24",
    "102.132.97.0/24",
    "102.132.99.0/24",
    "102.132.100.0/24",
    "102.132.101.0/24",
    "102.132.103.0/24",
    "102.132.104.0/24",
    "103.4.96.0/22",
    "129.134.0.0/16",
    "129.134.0.0/17",
    "129.134.25.0/24",
    "129.134.26.0/24",
    "129.134.27.0/24",
    "129.134.28.0/24",
    "129.134.29.0/24",
    "129.134.30.0/23",
    "129.134.30.0/24",
    "129.134.31.0/24",
    "129.134.64.0/24",
    "129.134.65.0/24",
    "129.134.66.0/24",
    "129.134.67.0/24",
    "129.134.68.0/24",
    "129.134.69.0/24",
    "129.134.70.0/24",
    "129.134.71.0/24",
    "129.134.72.0/24",
    "129.134.73.0/24",
    "129.134.74.0/24",
    "129.134.75.0/24",
    "129.134.76.0/24",
    "129.134.77.0/24",
    "129.134.78.0/24",
    "129.134.79.0/24",
    "129.134.112.0/24",
    "129.134.113.0/24",
    "129.134.114.0/24",
    "129.134.115.0/24",
    "129.134.127.0/24",
    "147.75.208.0/20",
    "147.75.208.0/20",
    "157.240.0.0/16",
    "157.240.0.0/17",
    "157.240.0.0/24",
    "157.240.1.0/24",
    "157.240.2.0/24",
    "157.240.3.0/24",
    "157.240.5.0/24",
    "157.240.6.0/24",
    "157.240.7.0/24",
    "157.240.8.0/24",
    "157.240.9.0/24",
    "157.240.10.0/24",
    "157.240.11.0/24",
    "157.240.12.0/24",
    "157.240.13.0/24",
    "157.240.14.0/24",
    "157.240.15.0/24",
    "157.240.16.0/24",
    "157.240.17.0/24",
    "157.240.18.0/24",
    "157.240.19.0/24",
    "157.240.20.0/24",
    "157.240.21.0/24",
    "157.240.22.0/24",
    "157.240.23.0/24",
    "157.240.24.0/24",
    "157.240.25.0/24",
    "157.240.26.0/24",
    "157.240.27.0/24",
    "157.240.28.0/24",
    "157.240.29.0/24",
    "157.240.30.0/24",
    "157.240.31.0/24",
    "157.240.96.0/24",
    "157.240.97.0/24",
    "157.240.98.0/24",
    "157.240.99.0/24",
    "157.240.100.0/24",
    "157.240.101.0/24",
    "157.240.192.0/18",
    "157.240.192.0/24",
    "157.240.193.0/24",
    "157.240.194.0/24",
    "157.240.195.0/24",
    "157.240.196.0/24",
    "157.240.197.0/24",
    "157.240.198.0/24",
    "157.240.199.0/24",
    "157.240.200.0/24",
    "157.240.201.0/24",
    "157.240.202.0/24",
    "157.240.203.0/24",
    "157.240.204.0/24",
    "157.240.205.0/24",
    "157.240.206.0/24",
    "157.240.207.0/24",
    "157.240.208.0/24",
    "157.240.209.0/24",
    "157.240.210.0/24",
    "157.240.211.0/24",
    "157.240.212.0/24",
    "157.240.213.0/24",
    "157.240.214.0/24",
    "157.240.215.0/24",
    "157.240.216.0/24",
    "157.240.217.0/24",
    "157.240.218.0/24",
    "157.240.219.0/24",
    "157.240.220.0/24",
    "157.240.221.0/24",
    "157.240.222.0/24",
    "157.240.223.0/24",
    "157.240.224.0/24",
    "157.240.225.0/24",
    "157.240.226.0/24",
    "157.240.227.0/24",
    "157.240.228.0/24",
    "157.240.229.0/24",
    "157.240.231.0/24",
    "157.240.232.0/24",
    "157.240.233.0/24",
    "157.240.234.0/24",
    "157.240.235.0/24",
    "157.240.236.0/24",
    "157.240.237.0/24",
    "157.240.238.0/24",
    "157.240.239.0/24",
    "157.240.240.0/24",
    "157.240.241.0/24",
    "157.240.242.0/24",
    "157.240.243.0/24",
    "157.240.244.0/24",
    "157.240.245.0/24",
    "157.240.246.0/24",
    "157.240.247.0/24",
    "157.240.248.0/24",
    "157.240.249.0/24",
    "157.240.250.0/24",
    "157.240.251.0/24",
    "157.240.252.0/24",
    "157.240.253.0/24",
    "157.240.254.0/24",
    "163.70.128.0/17",
    "163.70.128.0/24",
    "163.70.129.0/24",
    "163.70.130.0/24",
    "163.70.131.0/24",
    "163.70.132.0/24",
    "163.70.133.0/24",
    "163.70.134.0/24",
    "163.70.135.0/24",
    "163.70.136.0/24",
    "163.70.137.0/24",
    "163.70.138.0/24",
    "163.70.139.0/24",
    "163.70.140.0/24",
    "163.70.141.0/24",
    "163.70.142.0/24",
    "163.70.143.0/24",
    "163.70.144.0/24",
    "163.70.145.0/24",
    "163.70.146.0/24",
    "163.70.147.0/24",
    "163.70.148.0/24",
    "163.70.149.0/24",
    "163.70.150.0/24",
    "163.70.151.0/24",
    "163.70.152.0/24",
    "163.70.153.0/24",
    "163.70.158.0/24",
    "163.70.159.0/24",
    "163.77.128.0/17",
    "173.252.64.0/18",
    "173.252.64.0/19",
    "173.252.88.0/21",
    "173.252.96.0/19",
    "179.60.192.0/22",
    "179.60.192.0/24",
    "179.60.193.0/24",
    "179.60.194.0/24",
    "179.60.195.0/24",
    "185.60.216.0/22",
    "185.60.216.0/24",
    "185.60.217.0/24",
    "185.60.218.0/24",
    "185.60.219.0/24",
    "185.89.216.0/22",
    "185.89.216.0/22",
    "185.89.218.0/23",
    "185.89.218.0/23",
    "185.89.218.0/24",
    "185.89.218.0/24",
    "185.89.219.0/24",
    "185.89.219.0/24",
    "204.15.20.0/22",
    "2401:db00::/32",
    "2620:0:1c00::/40",
    "2620:0:1cfa::/48",
    "2620:0:1cff::/48",
    "2a03:2880::/32",
    "2a03:2880::/36",
    "2a03:2880:1000::/36",
    "2a03:2880:2000::/36",
    "2a03:2880:3000::/36",
    "2a03:2880:4000::/36",
    "2a03:2880:5000::/36",
    "2a03:2880:6000::/36",
    "2a03:2880:7000::/36",
    "2a03:2880:f000::/36",
    "2a03:2880:f001::/48",
    "2a03:2880:f003::/48",
    "2a03:2880:f004::/48",
    "2a03:2880:f005::/48",
    "2a03:2880:f006::/48",
    "2a03:2880:f007::/48",
    "2a03:2880:f008::/48",
    "2a03:2880:f00a::/48",
    "2a03:2880:f00c::/48",
    "2a03:2880:f00d::/48",
    "2a03:2880:f00e::/48",
    "2a03:2880:f00f::/48",
    "2a03:2880:f010::/48",
    "2a03:2880:f011::/48",
    "2a03:2880:f012::/48",
    "2a03:2880:f013::/48",
    "2a03:2880:f016::/48",
    "2a03:2880:f017::/48",
    "2a03:2880:f019::/48",
    "2a03:2880:f01b::/48",
    "2a03:2880:f01c::/48",
    "2a03:2880:f01d::/48",
    "2a03:2880:f01e::/48",
    "2a03:2880:f01f::/48",
    "2a03:2880:f021::/48",
    "2a03:2880:f023::/48",
    "2a03:2880:f024::/48",
    "2a03:2880:f027::/48",
    "2a03:2880:f028::/48",
    "2a03:2880:f029::/48",
    "2a03:2880:f02a::/48",
    "2a03:2880:f02b::/48",
    "2a03:2880:f02c::/48",
    "2a03:2880:f02d::/48",
    "2a03:2880:f02e::/48",
    "2a03:2880:f02f::/48",
    "2a03:2880:f030::/48",
    "2a03:2880:f031::/48",
    "2a03:2880:f032::/48",
    "2a03:2880:f033::/48",
    "2a03:2880:f034::/48",
    "2a03:2880:f035::/48",
    "2a03:2880:f036::/48",
    "2a03:2880:f037::/48",
    "2a03:2880:f038::/48",
    "2a03:2880:f03a::/48",
    "2a03:2880:f03b::/48",
    "2a03:2880:f03d::/48",
    "2a03:2880:f03e::/48",
    "2a03:2880:f03f::/48",
    "2a03:2880:f040::/48",
    "2a03:2880:f041::/48",
    "2a03:2880:f042::/48",
    "2a03:2880:f043::/48",
    "2a03:2880:f044::/48",
    "2a03:2880:f045::/48",
    "2a03:2880:f046::/48",
    "2a03:2880:f047::/48",
    "2a03:2880:f048::/48",
    "2a03:2880:f04a::/48",
    "2a03:2880:f04b::/48",
    "2a03:2880:f04c::/48",
    "2a03:2880:f04d::/48",
    "2a03:2880:f04e::/48",
    "2a03:2880:f04f::/48",
    "2a03:2880:f050::/48",
    "2a03:2880:f052::/48",
    "2a03:2880:f053::/48",
    "2a03:2880:f054::/48",
    "2a03:2880:f055::/48",
    "2a03:2880:f056::/48",
    "2a03:2880:f057::/48",
    "2a03:2880:f058::/48",
    "2a03:2880:f059::/48",
    "2a03:2880:f05a::/48",
    "2a03:2880:f05b::/48",
    "2a03:2880:f05c::/48",
    "2a03:2880:f05d::/48",
    "2a03:2880:f05e::/48",
    "2a03:2880:f060::/48",
    "2a03:2880:f061::/48",
    "2a03:2880:f065::/48",
    "2a03:2880:f066::/48",
    "2a03:2880:f067::/48",
    "2a03:2880:f068::/48",
    "2a03:2880:f06a::/48",
    "2a03:2880:f06b::/48",
    "2a03:2880:f06d::/48",
    "2a03:2880:f06f::/48",
    "2a03:2880:f070::/48",
    "2a03:2880:f071::/48",
    "2a03:2880:f073::/48",
    "2a03:2880:f074::/48",
    "2a03:2880:f076::/48",
    "2a03:2880:f077::/48",
    "2a03:2880:f078::/48",
    "2a03:2880:f07d::/48",
    "2a03:2880:f07e::/48",
    "2a03:2880:f080::/48",
    "2a03:2880:f081::/48",
    "2a03:2880:f082::/48",
    "2a03:2880:f083::/48",
    "2a03:2880:f084::/48",
    "2a03:2880:f085::/48",
    "2a03:2880:f086::/48",
    "2a03:2880:f08a::/48",
    "2a03:2880:f08e::/48",
    "2a03:2880:f091::/48",
    "2a03:2880:f096::/48",
    "2a03:2880:f097::/48",
    "2a03:2880:f098::/48",
    "2a03:2880:f099::/48",
    "2a03:2880:f09a::/48",
    "2a03:2880:f09b::/48",
    "2a03:2880:f09c::/48",
    "2a03:2880:f09d::/48",
    "2a03:2880:f09e::/48",
    "2a03:2880:f0a2::/48",
    "2a03:2880:f0a3::/48",
    "2a03:2880:f0a4::/48",
    "2a03:2880:f0a5::/48",
    "2a03:2880:f0a6::/48",
    "2a03:2880:f0a7::/48",
    "2a03:2880:f0a8::/48",
    "2a03:2880:f0aa::/48",
    "2a03:2880:f0fc::/47",
    "2a03:2880:f0fc::/48",
    "2a03:2880:f0fd::/48",
    "2a03:2880:f0ff::/48",
    "2a03:2880:f101::/48",
    "2a03:2880:f102::/48",
    "2a03:2880:f103::/48",
    "2a03:2880:f104::/48",
    "2a03:2880:f105::/48",
    "2a03:2880:f106::/48",
    "2a03:2880:f107::/48",
    "2a03:2880:f108::/48",
    "2a03:2880:f10a::/48",
    "2a03:2880:f10c::/48",
    "2a03:2880:f10d::/48",
    "2a03:2880:f10e::/48",
    "2a03:2880:f10f::/48",
    "2a03:2880:f110::/48",
    "2a03:2880:f111::/48",
    "2a03:2880:f112::/48",
    "2a03:2880:f113::/48",
    "2a03:2880:f114::/48",
    "2a03:2880:f115::/48",
    "2a03:2880:f116::/48",
    "2a03:2880:f117::/48",
    "2a03:2880:f119::/48",
    "2a03:2880:f11b::/48",
    "2a03:2880:f11c::/48",
    "2a03:2880:f11f::/48",
    "2a03:2880:f121::/48",
    "2a03:2880:f123::/48",
    "2a03:2880:f124::/48",
    "2a03:2880:f127::/48",
    "2a03:2880:f128::/48",
    "2a03:2880:f129::/48",
    "2a03:2880:f12a::/48",
    "2a03:2880:f12b::/48",
    "2a03:2880:f12c::/48",
    "2a03:2880:f12d::/48",
    "2a03:2880:f12e::/48",
    "2a03:2880:f12f::/48",
    "2a03:2880:f130::/48",
    "2a03:2880:f131::/48",
    "2a03:2880:f132::/48",
    "2a03:2880:f133::/48",
    "2a03:2880:f134::/48",
    "2a03:2880:f135::/48",
    "2a03:2880:f136::/48",
    "2a03:2880:f137::/48",
    "2a03:2880:f138::/48",
    "2a03:2880:f13a::/48",
    "2a03:2880:f13b::/48",
    "2a03:2880:f13d::/48",
    "2a03:2880:f13e::/48",
    "2a03:2880:f13f::/48",
    "2a03:2880:f140::/48",
    "2a03:2880:f141::/48",
    "2a03:2880:f142::/48",
    "2a03:2880:f143::/48",
    "2a03:2880:f144::/48",
    "2a03:2880:f145::/48",
    "2a03:2880:f146::/48",
    "2a03:2880:f147::/48",
    "2a03:2880:f148::/48",
    "2a03:2880:f14a::/48",
    "2a03:2880:f14b::/48",
    "2a03:2880:f14c::/48",
    "2a03:2880:f14d::/48",
    "2a03:2880:f14e::/48",
    "2a03:2880:f14f::/48",
    "2a03:2880:f150::/48",
    "2a03:2880:f152::/48",
    "2a03:2880:f153::/48",
    "2a03:2880:f154::/48",
    "2a03:2880:f155::/48",
    "2a03:2880:f156::/48",
    "2a03:2880:f157::/48",
    "2a03:2880:f158::/48",
    "2a03:2880:f159::/48",
    "2a03:2880:f15a::/48",
    "2a03:2880:f15b::/48",
    "2a03:2880:f15c::/48",
    "2a03:2880:f15d::/48",
    "2a03:2880:f15e::/48",
    "2a03:2880:f160::/48",
    "2a03:2880:f161::/48",
    "2a03:2880:f162::/48",
    "2a03:2880:f163::/48",
    "2a03:2880:f164::/48",
    "2a03:2880:f165::/48",
    "2a03:2880:f166::/48",
    "2a03:2880:f167::/48",
    "2a03:2880:f168::/48",
    "2a03:2880:f169::/48",
    "2a03:2880:f16a::/48",
    "2a03:2880:f16b::/48",
    "2a03:2880:f16c::/48",
    "2a03:2880:f16d::/48",
    "2a03:2880:f16e::/48",
    "2a03:2880:f16f::/48",
    "2a03:2880:f170::/48",
    "2a03:2880:f171::/48",
    "2a03:2880:f172::/48",
    "2a03:2880:f173::/48",
    "2a03:2880:f174::/48",
    "2a03:2880:f175::/48",
    "2a03:2880:f176::/48",
    "2a03:2880:f177::/48",
    "2a03:2880:f178::/48",
    "2a03:2880:f179::/48",
    "2a03:2880:f17a::/48",
    "2a03:2880:f17b::/48",
    "2a03:2880:f17c::/48",
    "2a03:2880:f17d::/48",
    "2a03:2880:f17e::/48",
    "2a03:2880:f17f::/48",
    "2a03:2880:f180::/48",
    "2a03:2880:f181::/48",
    "2a03:2880:f182::/48",
    "2a03:2880:f183::/48",
    "2a03:2880:f184::/48",
    "2a03:2880:f185::/48",
    "2a03:2880:f186::/48",
    "2a03:2880:f187::/48",
    "2a03:2880:f188::/48",
    "2a03:2880:f189::/48",
    "2a03:2880:f18a::/48",
    "2a03:2880:f18b::/48",
    "2a03:2880:f18c::/48",
    "2a03:2880:f1fc::/47",
    "2a03:2880:f1fc::/48",
    "2a03:2880:f1fd::/48",
    "2a03:2880:f1ff::/48",
    "2a03:2880:f201::/48",
    "2a03:2880:f202::/48",
    "2a03:2880:f203::/48",
    "2a03:2880:f204::/48",
    "2a03:2880:f205::/48",
    "2a03:2880:f206::/48",
    "2a03:2880:f207::/48",
    "2a03:2880:f208::/48",
    "2a03:2880:f20a::/48",
    "2a03:2880:f20c::/48",
    "2a03:2880:f20d::/48",
    "2a03:2880:f20e::/48",
    "2a03:2880:f20f::/48",
    "2a03:2880:f210::/48",
    "2a03:2880:f211::/48",
    "2a03:2880:f212::/48",
    "2a03:2880:f213::/48",
    "2a03:2880:f214::/48",
    "2a03:2880:f215::/48",
    "2a03:2880:f216::/48",
    "2a03:2880:f217::/48",
    "2a03:2880:f219::/48",
    "2a03:2880:f21b::/48",
    "2a03:2880:f21c::/48",
    "2a03:2880:f21f::/48",
    "2a03:2880:f221::/48",
    "2a03:2880:f223::/48",
    "2a03:2880:f224::/48",
    "2a03:2880:f227::/48",
    "2a03:2880:f228::/48",
    "2a03:2880:f229::/48",
    "2a03:2880:f22a::/48",
    "2a03:2880:f22b::/48",
    "2a03:2880:f22c::/48",
    "2a03:2880:f22d::/48",
    "2a03:2880:f22e::/48",
    "2a03:2880:f22f::/48",
    "2a03:2880:f230::/48",
    "2a03:2880:f231::/48",
    "2a03:2880:f232::/48",
    "2a03:2880:f233::/48",
    "2a03:2880:f234::/48",
    "2a03:2880:f235::/48",
    "2a03:2880:f236::/48",
    "2a03:2880:f237::/48",
    "2a03:2880:f238::/48",
    "2a03:2880:f23a::/48",
    "2a03:2880:f23b::/48",
    "2a03:2880:f23d::/48",
    "2a03:2880:f23e::/48",
    "2a03:2880:f23f::/48",
    "2a03:2880:f240::/48",
    "2a03:2880:f241::/48",
    "2a03:2880:f242::/48",
    "2a03:2880:f243::/48",
    "2a03:2880:f244::/48",
    "2a03:2880:f245::/48",
    "2a03:2880:f246::/48",
    "2a03:2880:f247::/48",
    "2a03:2880:f248::/48",
    "2a03:2880:f24a::/48",
    "2a03:2880:f24b::/48",
    "2a03:2880:f24c::/48",
    "2a03:2880:f24d::/48",
    "2a03:2880:f24e::/48",
    "2a03:2880:f24f::/48",
    "2a03:2880:f250::/48",
    "2a03:2880:f252::/48",
    "2a03:2880:f253::/48",
    "2a03:2880:f254::/48",
    "2a03:2880:f255::/48",
    "2a03:2880:f256::/48",
    "2a03:2880:f257::/48",
    "2a03:2880:f258::/48",
    "2a03:2880:f259::/48",
    "2a03:2880:f25a::/48",
    "2a03:2880:f25b::/48",
    "2a03:2880:f25c::/48",
    "2a03:2880:f25d::/48",
    "2a03:2880:f25e::/48",
    "2a03:2880:f260::/48",
    "2a03:2880:f261::/48",
    "2a03:2880:f262::/48",
    "2a03:2880:f263::/48",
    "2a03:2880:f264::/48",
    "2a03:2880:f265::/48",
    "2a03:2880:f266::/48",
    "2a03:2880:f267::/48",
    "2a03:2880:f268::/48",
    "2a03:2880:f269::/48",
    "2a03:2880:f26a::/48",
    "2a03:2880:f26b::/48",
    "2a03:2880:f26c::/48",
    "2a03:2880:f26d::/48",
    "2a03:2880:f26e::/48",
    "2a03:2880:f26f::/48",
    "2a03:2880:f270::/48",
    "2a03:2880:f271::/48",
    "2a03:2880:f272::/48",
    "2a03:2880:f273::/48",
    "2a03:2880:f274::/48",
    "2a03:2880:f275::/48",
    "2a03:2880:f276::/48",
    "2a03:2880:f277::/48",
    "2a03:2880:f278::/48",
    "2a03:2880:f279::/48",
    "2a03:2880:f27a::/48",
    "2a03:2880:f27b::/48",
    "2a03:2880:f27c::/48",
    "2a03:2880:f27d::/48",
    "2a03:2880:f27e::/48",
    "2a03:2880:f27f::/48",
    "2a03:2880:f280::/48",
    "2a03:2880:f281::/48",
    "2a03:2880:f282::/48",
    "2a03:2880:f283::/48",
    "2a03:2880:f284::/48",
    "2a03:2880:f285::/48",
    "2a03:2880:f286::/48",
    "2a03:2880:f287::/48",
    "2a03:2880:f288::/48",
    "2a03:2880:f289::/48",
    "2a03:2880:f28a::/48",
    "2a03:2880:f28b::/48",
    "2a03:2880:f28c::/48",
    "2a03:2880:f2ff::/48",
    "2a03:2880:f300::/48",
    "2a03:2880:f301::/48",
    "2a03:2880:f302::/48",
    "2a03:2880:f303::/48",
    "2a03:2880:f304::/48",
    "2a03:2880:f305::/48",
    "2a03:2880:f306::/48",
    "2a03:2880:f307::/48",
    "2a03:2880:f308::/48",
    "2a03:2880:f309::/48",
    "2a03:2880:f30a::/48",
    "2a03:2880:f30b::/48",
    "2a03:2880:f30c::/48",
    "2a03:2880:f30d::/48",
    "2a03:2880:f30e::/48",
    "2a03:2880:f30f::/48",
    "2a03:2880:f310::/48",
    "2a03:2880:f311::/48",
    "2a03:2880:f312::/48",
    "2a03:2880:f313::/48",
    "2a03:2880:f314::/48",
    "2a03:2880:f315::/48",
    "2a03:2880:f316::/48",
    "2a03:2880:f317::/48",
    "2a03:2880:f318::/48",
    "2a03:2880:f319::/48",
    "2a03:2880:f31a::/48",
    "2a03:2880:f31b::/48",
    "2a03:2880:f31c::/48",
    "2a03:2880:f31d::/48",
    "2a03:2880:f31e::/48",
    "2a03:2880:f31f::/48",
    "2a03:2880:f320::/48",
    "2a03:2880:f321::/48",
    "2a03:2880:f322::/48",
    "2a03:2880:f323::/48",
    "2a03:2880:f324::/48",
    "2a03:2880:f325::/48",
    "2a03:2880:f326::/48",
    "2a03:2880:f327::/48",
    "2a03:2880:f328::/48",
    "2a03:2880:f329::/48",
    "2a03:2880:f32a::/48",
    "2a03:2880:f32b::/48",
    "2a03:2880:f32c::/48",
    "2a03:2880:f32d::/48",
    "2a03:2880:f32e::/48",
    "2a03:2880:f32f::/48",
    "2a03:2880:f330::/48",
    "2a03:2880:f331::/48",
    "2a03:2880:f332::/48",
    "2a03:2880:f333::/48",
    "2a03:2880:f334::/48",
    "2a03:2880:f335::/48",
    "2a03:2880:f336::/48",
    "2a03:2880:f337::/48",
    "2a03:2880:f338::/48",
    "2a03:2880:f339::/48",
    "2a03:2880:f33a::/48",
    "2a03:2880:f33b::/48",
    "2a03:2880:f33c::/48",
    "2a03:2880:f33d::/48",
    "2a03:2880:f33e::/48",
    "2a03:2880:f33f::/48",
    "2a03:2880:f340::/48",
    "2a03:2880:f341::/48",
    "2a03:2880:f342::/48",
    "2a03:2880:f343::/48",
    "2a03:2880:f344::/48",
    "2a03:2880:f804::/48",
    "2a03:2880:f805::/48",
    "2a03:2880:f808::/48",
    "2a03:2880:f809::/48",
    "2a03:2880:f80a::/48",
    "2a03:2880:f80b::/48",
    "2a03:2880:f80c::/48",
    "2a03:2880:f80d::/48",
    "2a03:2880:ff08::/48",
    "2a03:2880:ff09::/48",
    "2a03:2880:ff0a::/48",
    "2a03:2880:ff0b::/48",
    "2a03:2880:ff0c::/48",
    "2a03:2880:fffe::/48",
    "2a03:2880:ffff::/48",
    "2a03:2881::/32",
    "2a03:2881::/48",
    "2a03:2881:1::/48",
    "2a03:2881:2::/48",
    "2a03:2881:3::/48",
    "2a03:2881:4::/48",
    "2a03:2881:5::/48",
    "2a03:2881:6::/48",
    "2a03:2881:7::/48",
    "2a03:2881:8::/48",
    "2a03:2881:9::/48",
    "2a03:2881:a::/48",
    "2a03:2881:b::/48",
    "2a03:2881:c::/48",
    "2a03:2881:d::/48",
    "2a03:2881:e::/48",
    "2a03:2881:f::/48",
    "2a03:2881:10::/48",
    "2a03:2881:11::/48",
    "2a03:2881:12::/48",
    "2a03:2881:13::/48",
    "2a03:2881:14::/48",
    "2a03:2881:15::/48",
    "2a03:2881:16::/48",
    "2a03:2881:17::/48",
    "2a03:2881:18::/48",
    "2a03:2881:19::/48",
    "2a03:2881:1a::/48",
    "2a03:2881:1b::/48",
    "2a03:2881:1c::/48",
    "2a03:2881:1e::/48",
    "2a03:2881:48::/45",
    "2a03:2881:98::/45",
    "2a03:2881:4000::/48",
    "2a03:2881:4001::/48",
    "2a03:2881:4002::/48",
    "2a03:2881:4003::/48",
    "2a03:2881:4004::/48",
    "2a03:2881:4005::/48",
    "2a03:2881:4006::/48",
    "2a03:2881:4007::/48",
    "2a03:2881:4008::/48",
    "2a03:2881:4009::/48",
    "2a03:2881:400a::/48",
    "2a03:2881:400b::/48",
    "2a03:2881:400c::/48",
    "2a03:2881:400d::/48",
    "2a03:2887:ff2c::/48",
    "2a03:2887:ff2d::/48",
    "2a03:83e0::/32",
    "2a10:f781:10:cee0::/64",
    // Mozilla/5.0 (compatible; DataForSeoBot/1.0; +https://dataforseo.com/dataforseo-bot)
    "136.243.220.208/29",
    "136.243.228.176/29",
    "136.243.228.192/29",
    "2a01:4f8:2b03:38b::2/64",
    "2a01:4f8:2b03:38c::2/64",
    "2a01:4f8:2b03:38d::2/64",
  ]

  ip = headers.get("x-forwarded-for") || ip

  console.log("ip", ip)

  if (ip && blockedIps.includes(ip))
    return new NextResponse("Access Denied", { status: 403 })

  return NextResponse.next()
}